import { computed } from 'vue';
import { survivorPerks, survivorAddOns, killerPerks, killerAddOns } from './loadData.ts';

export function useData() {
    const combinedPerks = computed(() => {
        return [...survivorPerks, ...killerPerks].sort((a, b) => a.name.localeCompare(b.name));
    });

    return {
        combinedPerks,
        survivorAddOns,
        killerAddOns,
    };
}
