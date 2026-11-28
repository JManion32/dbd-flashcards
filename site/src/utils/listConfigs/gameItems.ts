import { items, killers, survivors, tags } from '@/utils/loadData';
import { byName, descriptionText, sideSelect } from '@/utils/listConfigs/shared';
import type { GameItem } from '@/types/gameItem';
import type { FilterControl, ListConfig, ListState } from '@/types/listConfig';

const showsSide = (side: string) => (state: ListState) => state.quick === 'All' || state.quick === side;

const killerFilter: FilterControl<GameItem> = {
    kind: 'many',
    key: 'killers',
    label: 'Killers',
    items: killers,
    visible: showsSide('Killer'),
};

const tagFilter: FilterControl<GameItem> = {
    kind: 'many',
    key: 'tags',
    label: 'Tags',
    items: tags,
    // Items that have every selected tag
    match: (gameItem, selected) => selected.every((tag) => gameItem.tags.includes(tag)),
};

// Survivor items only check the survivor-side list and killer items the killer list, so
// 'Universal' in one doesn't pull in the other. Picking from either list narrows both sides.
function ownerMatch(survivorKey: string) {
    return (gameItem: GameItem, state: ListState) => {
        const survivorOwners = state.filters[survivorKey] as string[];
        const killerOwners = state.filters.killers as string[];
        if (!survivorOwners.length && !killerOwners.length) return true;
        const owners = gameItem.side === 'Survivor' ? survivorOwners : killerOwners;
        return owners.includes(gameItem.owner);
    };
}

// Rarest first, then A–Z
const RARITY_ORDER = ['Visceral', 'Very Rare', 'Rare', 'Uncommon', 'Common'];
const rarityRank = (gameItem: GameItem) => RARITY_ORDER.indexOf(gameItem.rarity ?? '');

const search = (gameItem: GameItem) => [
    gameItem.name,
    gameItem.rarity,
    gameItem.owner,
    ...descriptionText(gameItem.description),
];

const side = sideSelect<GameItem>((gameItem, value) => gameItem.side === value);
const alpha = byName<GameItem>((gameItem) => gameItem.name);

export const perkListConfig: ListConfig<GameItem> = {
    noun: ['perk', 'perks'],
    search,
    quickSelect: side,
    filters: [
        {
            kind: 'many',
            key: 'survivors',
            label: 'Survivors',
            items: survivors,
            visible: showsSide('Survivor'),
        },
        killerFilter,
        tagFilter,
    ],
    order: alpha,
    match: ownerMatch('survivors'),
};

export const addOnListConfig: ListConfig<GameItem> = {
    noun: ['add-on', 'add-ons'],
    search,
    quickSelect: side,
    filters: [
        {
            kind: 'many',
            key: 'items',
            label: 'Items',
            items,
            visible: showsSide('Survivor'),
        },
        killerFilter,
        tagFilter,
    ],
    order: (a, b) => rarityRank(a) - rarityRank(b) || alpha(a, b),
    match: ownerMatch('items'),
};
