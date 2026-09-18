import randomIcon from '@/assets/random.webp';

const imageModules = import.meta.glob('@/assets/game-items/**/*.{png,webp}', {
    eager: true,
    import: 'default',
});

const gameItemImages = new Map<string, string>();

for (const [path, image] of Object.entries(imageModules)) {
    const id = path
        .split('/')
        .pop()
        ?.replace(/\.(png|webp)$/, '');

    if (id) {
        gameItemImages.set(id, image as string);
    }
}

export function getGameItemImage(id: string): string {
    return gameItemImages.get(id) ?? randomIcon;
}
