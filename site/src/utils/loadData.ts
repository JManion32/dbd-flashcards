import type { GameItem } from '@/types/gameItem';
import lastUpdatedDates from 'virtual:last-updated';
import tagList from '../../../data/validation/tags.json';
import killerList from '../../../data/validation/killers.json';
import survivorList from '../../../data/validation/survivors.json';
import itemList from '../../../data/validation/items.json';

// Glob keys are relative to this file ('../../../data/...'); git dates are keyed from the repo root ('data/...')
function withLastUpdated(modules: Record<string, unknown>): GameItem[] {
    return Object.entries(modules).map(([path, item]) => ({
        ...(item as GameItem),
        lastUpdated: lastUpdatedDates[path.replace(/^(\.\.\/)+/, '')],
    }));
}

// Survivor Perks
const survivorPerkModules = import.meta.glob('../../../data/survivor/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const survivorPerks = withLastUpdated(survivorPerkModules);

// Survivor Add-Ons
const survivorAddOnModules = import.meta.glob('../../../data/survivor/add-ons/**/*.json', {
    eager: true,
    import: 'default',
});
export const survivorAddOns = withLastUpdated(survivorAddOnModules);

// Killer Perks
const killerPerkModules = import.meta.glob('../../../data/killer/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const killerPerks = withLastUpdated(killerPerkModules);

// Killer Add-Ons
const killerAddOnModules = import.meta.glob('../../../data/killer/add-ons/**/*.json', {
    eager: true,
    import: 'default',
});
export const killerAddOns = withLastUpdated(killerAddOnModules);

const alphabetical = (list: string[]) => [...list].sort((a, b) => a.localeCompare(b));

// Universal isn't a character, so it stays at the front rather than sorting in among the U's
const alphabeticalOwners = (list: string[]) => [
    ...list.filter((owner) => owner === 'Universal'),
    ...alphabetical(list.filter((owner) => owner !== 'Universal')),
];

export const tags = alphabetical(tagList);
export const killers = alphabeticalOwners(killerList);
export const survivors = alphabeticalOwners(survivorList);
export const items = alphabetical(itemList);

// The validation lists are kept in release order (Universal first), so these are used as-is
export const killersByRelease = [...killerList];
export const survivorsByRelease = [...survivorList];
