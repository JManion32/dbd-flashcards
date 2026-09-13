import type { Perk } from '../types/Perk.ts';
import type { SurvivorAddOn } from '../types/SurvivorAddOn.ts';
import type { KillerAddOn } from '../types/KillerAddOn.ts';

// Survivor Perks
const survivorPerkModules = import.meta.glob('../../../data/survivor/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const survivorPerks = Object.values(survivorPerkModules) as Perk[];

// Survivor Add-Ons
const survivorAddOnModules = import.meta.glob('../../../data/survivor/add-ons/**/*.json', {
    eager: true,
    import: 'default',
});
export const survivorAddOns = Object.values(survivorAddOnModules) as SurvivorAddOn[];

// Killer Perks
const killerPerkModules = import.meta.glob('../../../data/killer/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const killerPerks = Object.values(killerPerkModules) as Perk[];

// Killer Add-Ons
const killerAddOnModules = import.meta.glob('../../../data/killer/perks/**/*.json', {
    eager: true,
    import: 'default',
});
export const killerAddOns = Object.values(killerAddOnModules) as KillerAddOn[];
