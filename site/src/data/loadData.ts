import type GameItem from '../types/GameItem.ts';

// Survivor Perks
const survivorPerkModules = import.meta.glob('../../../data/survivor/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const survivorPerks = Object.values(survivorPerkModules) as GameItem[];

// Survivor Add-Ons
const survivorAddOnModules = import.meta.glob('../../../data/survivor/add-ons/**/*.json', {
    eager: true,
    import: 'default',
});
export const survivorAddOns = Object.values(survivorAddOnModules) as GameItem[];

// Killer Perks
const killerPerkModules = import.meta.glob('../../../data/killer/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const killerPerks = Object.values(killerPerkModules) as GameItem[];

// Killer Add-Ons
const killerAddOnModules = import.meta.glob('../../../data/killer/add-ons/**/*.json', {
    eager: true,
    import: 'default',
});
export const killerAddOns = Object.values(killerAddOnModules) as GameItem[];
