import vue from '@vitejs/plugin-vue';
import { execSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

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

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), lastUpdated()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
