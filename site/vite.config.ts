import vue from '@vitejs/plugin-vue';
import { execSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { routeMeta, SITE_URL } from './src/routeMeta.ts';

// Exposes `virtual:last-updated`: a map of repo-relative data file path -> YYYY-MM-DD date of
// the last commit that touched it. Uncommitted files are absent from the map.
function lastUpdated(): Plugin {
    const id = 'virtual:last-updated';
    return {
        name: 'last-updated',
        resolveId: (source) => (source === id ? '\0' + id : undefined),
        load(resolved) {
            if (resolved !== '\0' + id) return;
            const repoRoot = fileURLToPath(new URL('..', import.meta.url));
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
            return `export default ${JSON.stringify(dates)};`;
        },
    };
}

function escapeAttr(value: string) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Writes `<route>.html` next to index.html for every non-root route, with that route's title,
// description, and canonical baked in. Crawlers read the raw HTML, so without this every route
// would claim to be the home page. nginx serves them via `try_files $uri $uri.html`.
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

                for (const [path, meta] of Object.entries(routeMeta)) {
                    if (path === '/') continue;

                    const title = escapeAttr(meta.title);
                    const description = escapeAttr(meta.description);
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
                    if ('noindex' in meta && meta.noindex) {
                        page = page.replace('</head>', '    <meta name="robots" content="noindex" />\n    </head>');
                    }

                    this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: page });
                }
            },
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), lastUpdated(), routeHtml()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
