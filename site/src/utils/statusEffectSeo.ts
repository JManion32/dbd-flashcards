/* Per-status-effect URLs and search metadata. Shared by the router (client-side head updates) and
   vite.config.ts (a static HTML page per status effect at build), so keep it free of Vite/Vue imports. */

import { descriptionLines, escapeHtml, plainText, truncate } from './gameItemSeo.ts';
import type { PageMeta } from '../routeMeta.ts';
import type { StatusEffect } from '../types/statusEffect.ts';

export const STATUS_EFFECTS_PATH = '/status-effects';

export function statusEffectPath(statusEffect: Pick<StatusEffect, 'id'>) {
    return `${STATUS_EFFECTS_PATH}/${statusEffect.id}`;
}

// "Survivor Debuff", "Killer Buff", or just "Buff" when it applies to both sides
function statusEffectKind(statusEffect: StatusEffect) {
    return statusEffect.side === 'All' ? statusEffect.type : `${statusEffect.side} ${statusEffect.type}`;
}

export function statusEffectMeta(statusEffect: StatusEffect): PageMeta {
    const kind = statusEffectKind(statusEffect);
    return {
        title: `${statusEffect.name} - Dead by Daylight Status Effect | DBD Flashcards`,
        description: truncate(`${kind} status effect. ${descriptionLines(statusEffect.description).join(' ')}`),
    };
}

/* The status effect written into the page's HTML, so crawlers that don't run JavaScript still read it.
   Vue replaces it as soon as the app mounts. */
export function statusEffectHtml(statusEffect: StatusEffect) {
    const line = (text: string) => escapeHtml(plainText(text));
    const description = statusEffect.description
        .map((block) =>
            block.type === 'text'
                ? `<p>${line(block.content)}</p>`
                : `<ul>${block.items.map((item) => `<li>${line(item)}</li>`).join('')}</ul>`
        )
        .join('');

    return `<article><h1>${escapeHtml(statusEffect.name)}</h1><p>${escapeHtml(statusEffectKind(statusEffect))} status effect</p>${description}<p><a href="${STATUS_EFFECTS_PATH}">Browse all Dead by Daylight status effects</a></p></article>`;
}
