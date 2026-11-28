import vue from '@vitejs/plugin-vue';
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { routeMeta, SITE_URL, type PageMeta } from './src/routeMeta.ts';
import { escapeHtml, gameItemHtml, gameItemMeta, gameItemPath } from './src/utils/gameItemSeo.ts';
import { statusEffectHtml, statusEffectMeta, statusEffectPath } from './src/utils/statusEffectSeo.ts';
import type { GameItem } from './src/types/gameItem.ts';
import type { StatusEffect } from './src/types/statusEffect.ts';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

// Repo-relative data file path -> YYYY-MM-DD of the last commit that touched it.
// Uncommitted files are absent from the map.
function gitDates() {
    const log = execSync('git log --format=%x00%cs --name-only -- data', {
        cwd: repoRoot,
        maxBuffer: 64 * 1024 * 1024,
    }).toString();

    // Log is newest first, so the first date seen for a path is its latest
    const dates: Record<string, string> = {};
    let date = '';
    for (const line of log.split('\n')) {
        if (line.startsWith('\0')) date = line.slice(1);
        else if (line && !(line in dates)) dates[line] = date;
    }
    return dates;
}

// Every perk and add-on JSON under data/<side>-<perks|add-ons>/, with its repo-relative path
function readGameItems() {
    const files: string[] = [];
    const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.json')) files.push(full);
        }
    };
    for (const side of ['survivor', 'killer']) {
        for (const kind of ['perks', 'add-ons']) {
            walk(join(repoRoot, 'data', `${side}-${kind}`));
        }
    }
    return files.map((file) => ({
        path: relative(repoRoot, file),
        gameItem: JSON.parse(readFileSync(file, 'utf8')) as GameItem,
    }));
}

// Every status effect JSON under data/status-effects/, with its repo-relative path
function readStatusEffects() {
    const dir = join(repoRoot, 'data', 'status-effects');
    return readdirSync(dir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => {
            const file = join(dir, name);
            return {
                path: relative(repoRoot, file),
                statusEffect: JSON.parse(readFileSync(file, 'utf8')) as StatusEffect,
            };
        });
}

// Exposes `virtual:last-updated`: a map of repo-relative data file path -> last commit date (see gitDates)
function lastUpdated(): Plugin {
    const id = 'virtual:last-updated';
    return {
        name: 'last-updated',
        resolveId: (source) => (source === id ? '\0' + id : undefined),
        load(resolved) {
            if (resolved !== '\0' + id) return;
            return `export default ${JSON.stringify(gitDates())};`;
        },
    };
}

// Fills index.html's head with one page's title, description, and canonical, and optionally its
// content, which goes inside #app for crawlers that don't run JavaScript (Vue replaces it on mount).
function renderPage(html: string, path: string, meta: PageMeta, body = '') {
    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const url = SITE_URL + path;
    const setContent = (attr: string, key: string, value: string) => (source: string) =>
        source.replace(new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*"`), `$1${value}"`);

    let page = [
        setContent('name', 'description', description),
        setContent('property', 'og:title', title),
        setContent('property', 'og:description', description),
        setContent('property', 'og:url', url),
        setContent('name', 'twitter:title', title),
        setContent('name', 'twitter:description', description),
    ].reduce((source, apply) => apply(source), html);
    page = page
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/(<link\s+rel="canonical"\s+href=")[^"]*"/, `$1${url}"`);
    if (meta.noindex) {
        page = page.replace('</head>', '    <meta name="robots" content="noindex" />\n    </head>');
    }
    if (body) {
        page = page.replace('<div id="app"></div>', () => `<div id="app">${body}</div>`);
    }
    return page;
}

// Writes `<route>.html` next to index.html for every non-root route, every perk and add-on
// (`perks/<id>.html`, `add-ons/<id>.html`), and every status effect (`status-effects/<id>.html`), with
// that page's title, description, and canonical baked in. Crawlers read the raw HTML, so without this
// every route would claim to be the home page. nginx serves them via `try_files $uri $uri.html`. Also writes sitemap.xml listing all of them, so
// new perks, add-ons, and status effects are picked up by search engines with no extra steps.
function routeHtml(): Plugin {
    return {
        name: 'route-html',
        apply: 'build',
        generateBundle: {
            order: 'post',
            handler(_, bundle) {
                const index = bundle['index.html'];
                if (index?.type !== 'asset') return;
                const html = String(index.source);
                const sitemap: { path: string; lastmod?: string }[] = [];

                for (const [path, meta] of Object.entries(routeMeta) as [string, PageMeta][]) {
                    if (!meta.noindex) sitemap.push({ path });
                    if (path === '/') continue;
                    this.emitFile({
                        type: 'asset',
                        fileName: `${path.slice(1)}.html`,
                        source: renderPage(html, path, meta),
                    });
                }

                const dates = gitDates();
                for (const { path: file, gameItem } of readGameItems()) {
                    const path = gameItemPath(gameItem);
                    sitemap.push({ path, lastmod: dates[file] });
                    this.emitFile({
                        type: 'asset',
                        fileName: `${path.slice(1)}.html`,
                        source: renderPage(html, path, gameItemMeta(gameItem), gameItemHtml(gameItem)),
                    });
                }

                for (const { path: file, statusEffect } of readStatusEffects()) {
                    const path = statusEffectPath(statusEffect);
                    sitemap.push({ path, lastmod: dates[file] });
                    this.emitFile({
                        type: 'asset',
                        fileName: `${path.slice(1)}.html`,
                        source: renderPage(html, path, statusEffectMeta(statusEffect), statusEffectHtml(statusEffect)),
                    });
                }

                const urls = sitemap
                    .map(({ path, lastmod }) => {
                        const date = lastmod ? `\n        <lastmod>${lastmod}</lastmod>` : '';
                        return `    <url>\n        <loc>${SITE_URL}${path}</loc>${date}\n    </url>`;
                    })
                    .join('\n');
                this.emitFile({
                    type: 'asset',
                    fileName: 'sitemap.xml',
                    source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
                });
            },
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        lastUpdated(),
        routeHtml(),
        // Installable, offline-capable app. There's no backend, so caching the build is the whole
        // site: the service worker downloads every script, style, font, and image on the first
        // visit, and after that the app opens with no connection at all.
        VitePWA({
            // A new version waits until the user taps Reload (see UpdatePrompt.vue), so an update
            // never reloads the page in the middle of a study session
            registerType: 'prompt',
            manifest: {
                name: 'DBD Flashcards',
                short_name: 'DBD Flashcards',
                description: 'Learn every Dead by Daylight perk and add-on with flashcards, even offline.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                theme_color: '#111111',
                background_color: '#111111',
                icons: [
                    { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
                ],
            },
            workbox: {
                globPatterns: ['index.html', '**/*.{js,css,woff2,webp,png,ico}'],
                // The per-route .html pages are only for crawlers; offline, every page is the app
                // shell (index.html) and the router takes it from there
                navigateFallback: 'index.html',
                // Real files (sitemap.xml, robots.txt) still come from the server
                navigateFallbackDenylist: [/\.[a-z0-9]+$/i],
                // The main bundle holds all the game data, so it's over Workbox's 2 MB default
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                // A new version's caches replace the old ones instead of piling up
                cleanupOutdatedCaches: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
