import type { GameItem } from '@/types/GameItem.ts';
import lastUpdatedDates from 'virtual:last-updated';

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
