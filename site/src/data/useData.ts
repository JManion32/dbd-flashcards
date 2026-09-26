import { computed } from 'vue';
import { survivorPerks, survivorAddOns, killerPerks, killerAddOns } from '@/data/loadData.ts';

export function useData() {
    const combinedPerks = computed(() => {
        return [...survivorPerks, ...killerPerks].sort((a, b) => a.name.localeCompare(b.name));
    });

    const combinedAddOns = computed(() => {
        return [...survivorAddOns, ...killerAddOns].sort((a, b) => a.name.localeCompare(b.name));
    });
    const combinedGameItems = computed(() => {
        return [...survivorPerks, ...survivorAddOns, ...killerPerks, ...killerAddOns].sort((a, b) =>
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
    };
}
