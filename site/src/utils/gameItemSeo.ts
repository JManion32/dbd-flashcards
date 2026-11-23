/* Per-item URLs and search metadata. Shared by the router (client-side head updates) and
   vite.config.ts (a static HTML page per item at build), so keep it free of Vite/Vue imports. */

import type { DescriptionBlock, GameItem } from '../types/gameItem.ts';
import type { PageMeta } from '../routeMeta.ts';

// The list page each type lives under; an item's own page is `<base>/<id>`
export function gameItemBasePath(type: GameItem['type']) {
    return type === 'Perk' ? '/perks' : '/add-ons';
}

export function gameItemPath(gameItem: Pick<GameItem, 'type' | 'id'>) {
    return `${gameItemBasePath(gameItem.type)}/${gameItem.id}`;
}

// Killers are "The Trapper" in game; survivors, items, and Universal are used as-is
export function gameItemOwnerLabel(gameItem: Pick<GameItem, 'side' | 'owner'>) {
    return gameItem.side === 'Killer' && gameItem.owner !== 'Universal' ? `The ${gameItem.owner}` : gameItem.owner;
}

// Description text marks values as [40s] and inputs as <Activate Ability>; search snippets want it bare
export function plainText(text: string) {
    return text.replace(/[[\]<>]/g, '');
}

function descriptionLines(description: DescriptionBlock[]) {
    return description.flatMap((block) => (block.type === 'text' ? [block.content] : block.items)).map(plainText);
}

// Search results cut descriptions off around 155-160 characters, so end on a whole word before that
function truncate(text: string, max = 155) {
    if (text.length <= max) {
        return text;
    }
    const cut = text.slice(0, max - 1);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function gameItemMeta(gameItem: GameItem): PageMeta {
    const kind = `${gameItem.side} ${gameItem.type}`;
    const owner = gameItem.owner === 'Universal' ? `Universal ${kind}` : `${kind} for ${gameItemOwnerLabel(gameItem)}`;
    const rarity = gameItem.rarity ? `${gameItem.rarity} ` : '';

    return {
        title: `${gameItem.name} - Dead by Daylight ${kind} | DBD Flashcards`,
        description: truncate(`${rarity}${owner}. ${descriptionLines(gameItem.description).join(' ')}`),
    };
}

export function escapeHtml(value: string) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* The item written into the page's HTML, so crawlers that don't run JavaScript still read it.
   Vue replaces it as soon as the app mounts. */
export function gameItemHtml(gameItem: GameItem) {
    const line = (text: string) => escapeHtml(plainText(text));
    const details = [gameItemOwnerLabel(gameItem), `${gameItem.side} ${gameItem.type}`, gameItem.rarity]
        .filter(Boolean)
        .map((part) => escapeHtml(part as string))
        .join(' · ');
    const description = gameItem.description
        .map((block) =>
            block.type === 'text'
                ? `<p>${line(block.content)}</p>`
                : `<ul>${block.items.map((item) => `<li>${line(item)}</li>`).join('')}</ul>`
        )
        .join('');
    const quote = gameItem.quote ? `<blockquote>${escapeHtml(gameItem.quote)}</blockquote>` : '';
    const listPath = gameItemBasePath(gameItem.type);
    const listName = gameItem.type === 'Perk' ? 'perks' : 'add-ons';

    return `<article><h1>${escapeHtml(gameItem.name)}</h1><p>${details}</p>${description}${quote}<p><a href="${listPath}">Browse all Dead by Daylight ${listName}</a></p></article>`;
}
