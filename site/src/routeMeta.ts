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
    '/killers': {
        title: 'All Dead by Daylight Killers | DBD Flashcards',
        description:
            'Browse every Killer in Dead by Daylight, with their perks and add-ons. Study each Killer as flashcards.',
        // Remove once the page has content, so search engines don't index an empty page
        noindex: true,
    },
    '/survivors': {
        title: 'All Dead by Daylight Survivors | DBD Flashcards',
        description: 'Browse every Survivor in Dead by Daylight, with their perks. Study each Survivor as flashcards.',
        // Remove once the page has content, so search engines don't index an empty page
        noindex: true,
    },
    '/items': {
        title: 'All Dead by Daylight Items | DBD Flashcards',
        description:
            'Browse every Survivor item in Dead by Daylight, with their add-ons. Study each item as flashcards.',
        // Remove once the page has content, so search engines don't index an empty page
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
    '/status-effects': {
        title: 'All Dead by Daylight Status Effects | DBD Flashcards',
        description:
            'Browse every Dead by Daylight status effect, from Exposed and Haste to Deep Wound and Blindness, with what each one does to Survivors and Killers.',
    },
} satisfies Record<string, PageMeta>;
