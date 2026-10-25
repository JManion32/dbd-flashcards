import { computed } from 'vue';
import {
    survivorPerks,
    survivorAddOns as rawSurvivorAddOns,
    killerPerks,
    killerAddOns as rawKillerAddOns,
    tags,
    killers,
    survivors,
    items,
} from '@/utils/loadData';

export function useData() {
    const combinedPerks = computed(() => {
        return [...survivorPerks, ...killerPerks].sort((a, b) => a.name.localeCompare(b.name));
    });

    const combinedAddOns = computed(() => {
        return [...rawSurvivorAddOns, ...rawKillerAddOns].sort((a, b) => a.name.localeCompare(b.name));
    });

    const survivorAddOns = computed(() => {
        return [...rawSurvivorAddOns].sort((a, b) => a.name.localeCompare(b.name));
    });

    const killerAddOns = computed(() => {
        return [...rawKillerAddOns].sort((a, b) => a.name.localeCompare(b.name));
    });

    const combinedGameItems = computed(() => {
        return [...survivorPerks, ...rawSurvivorAddOns, ...killerPerks, ...rawKillerAddOns].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    });

    return {
        combinedPerks,
        combinedAddOns,
        combinedGameItems,
        survivorPerks,
        survivorAddOns,
        killerPerks,
        killerAddOns,
        tags,
        killers,
        survivors,
        items,
    };
}
