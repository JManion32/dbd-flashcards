import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { useRoute } from 'vue-router';
import type { ListConfig, ListState } from '@/types/listConfig';

// Everything back to its default
export function defaultListState<T>(config: ListConfig<T>): ListState {
    return {
        search: '',
        quick: config.quickSelect?.default ?? '',
        filters: Object.fromEntries(
            (config.filters ?? []).map((group) => [group.key, group.kind === 'single' ? group.default : []])
        ),
    };
}

// Filters and quick select back to default; search is kept
export function clearListFilters<T>(config: ListConfig<T>, state: ListState): ListState {
    return { ...defaultListState(config), search: state.search };
}

// Number shown on the popup button: selected items plus single choices off their default
export function activeFilterCount<T>(config: ListConfig<T>, state: ListState): number {
    return (config.filters ?? []).reduce((count, group) => {
        const value = state.filters[group.key];
        if (group.kind === 'many') return count + (value as string[]).length;
        return count + (value !== group.default ? 1 : 0);
    }, 0);
}

export function useListControls<T>(items: MaybeRefOrGetter<T[]>, config: ListConfig<T>) {
    const route = useRoute();
    const queryKey = config.quickSelect?.queryKey;

    // Defaults, with the quick select taken from the URL when it names a valid option
    function initialState(): ListState {
        const state = defaultListState(config);
        const fromQuery = queryKey ? route.query[queryKey] : undefined;
        if (config.quickSelect?.options.some((option) => option.value === fromQuery)) {
            state.quick = fromQuery as string;
        }
        return state;
    }

    const state = ref<ListState>(initialState());

    // The router reuses the page when only the query changes (/perks?side=Killer -> /perks)
    if (queryKey) {
        watch(
            () => route.query[queryKey],
            () => {
                state.value = initialState();
            }
        );
    }

    const filtered = computed(() => {
        const { search, quick, filters } = state.value;
        const needle = search.trim().toLowerCase();

        return toValue(items).filter((item) => {
            if (config.quickSelect && !config.quickSelect.match(item, quick)) return false;

            for (const group of config.filters ?? []) {
                const value = filters[group.key];
                if (group.kind === 'many') {
                    if (group.match && (value as string[]).length && !group.match(item, value as string[])) {
                        return false;
                    }
                } else if (group.match && value !== group.default && !group.match(item, value as string)) {
                    return false;
                }
            }

            if (config.match && !config.match(item, state.value)) return false;

            if (needle) {
                return config.search(item).some((text) => text?.toLowerCase().includes(needle));
            }
            return true;
        });
    });

    const results = computed(() => [...filtered.value].sort(config.order));

    return { state, results };
}
