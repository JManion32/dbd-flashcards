import { statusEffects } from '@/utils/loadData';
import type { GameItem } from '@/types/gameItem';
import type { StatusEffect } from '@/types/statusEffect';

const byName = new Map(statusEffects.map((statusEffect) => [statusEffect.name.toLowerCase(), statusEffect]));

// Tags that name a status effect differently. ("Blind" is blinding the Killer, not Blindness, so it isn't here.)
const TAG_ALIASES: Record<string, string> = {
    Exhaustion: 'Exhausted',
    Hinder: 'Hindered',
};

// "[Madness III]" and "[Bloodlust II]" are tiers of one status effect
function findStatusEffect(term: string) {
    return byName.get(term.replace(/\s+[IVX]+$/, '').toLowerCase());
}

// Status effects named in an item's description (as [Exposed], [Deep Wound], ...) or its tags,
// in the order they first appear: description first, then tags.
export function mentionedStatusEffects(gameItem: GameItem): StatusEffect[] {
    const descriptionTerms = gameItem.description
        .flatMap((block) => (block.type === 'text' ? [block.content] : block.items))
        .flatMap((line) => [...line.matchAll(/\[([^\]]+)\]/g)].map((match) => match[1]));
    const tagTerms = gameItem.tags.map((tag) => TAG_ALIASES[tag] ?? tag);

    const found = new Set<StatusEffect>();
    for (const term of [...descriptionTerms, ...tagTerms]) {
        const statusEffect = findStatusEffect(term);
        if (statusEffect) found.add(statusEffect);
    }
    return [...found];
}
