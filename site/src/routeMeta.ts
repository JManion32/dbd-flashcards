/* Per-route head metadata. Shared by the router (client-side updates) and vite.config.ts (per-route HTML at build). */

export interface PageMeta {
    title: string;
    description: string;
    noindex?: boolean;
}

export const SITE_URL = 'https://dbdflashcards.com';

export const routeMeta = {
    '/': {
        title: 'DBD Flashcards | Dead by Daylight Perk & Add-On Study Tool',
        description:
            'Learn every Dead by Daylight perk and add-on with free flashcards. Browse Killer and Survivor perks and add-ons, then quiz yourself to test your knowledge.',
    },
    '/study': {
        title: 'Study | DBD Flashcards',
        description: 'Quiz yourself on Dead by Daylight perks and add-ons with flashcards.',
        noindex: true,
    },
    '/perks': {
        title: 'All Dead by Daylight Perks | DBD Flashcards',
        description:
            'Browse every Killer and Survivor perk in Dead by Daylight, with descriptions and tags. Filter by character and study them as flashcards.',
    },
    '/add-ons': {
        title: 'All Dead by Daylight Add-Ons | DBD Flashcards',
        description:
            'Browse every Killer and Survivor add-on in Dead by Daylight, with rarities and effects. Filter by killer or item and study them as flashcards.',
    },
} satisfies Record<string, PageMeta>;
