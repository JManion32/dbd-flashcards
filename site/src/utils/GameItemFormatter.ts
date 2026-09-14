/* For translating the JSON into a clean GameItem display */

export function getRarityColor(rarity: string) {
    if (rarity === 'Common') {
        return 'var(--common-rarity)';
    }
    if (rarity === 'Uncommon') {
        return 'var(--uncommon-rarity)';
    }
    if (rarity === 'Rare') {
        return 'var(--rare-rarity)';
    }
    if (rarity === 'Very Rare') {
        return 'var(--very-rare-rarity)';
    }
    if (rarity === 'Visceral') {
        return 'var(--visceral-rarity)';
    }
    return 'var(--standard-white)';
}
