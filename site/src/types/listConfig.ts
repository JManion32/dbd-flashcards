import type { Option } from '@/types/options';

export interface ListState {
    search: string;
    // The segmented buttons on the left of the toolbar (e.g. Killer / Survivor / All)
    quick: string;
    // Popup filters by key: a string for 'single' groups, a string[] for 'many' groups
    filters: Record<string, string | string[]>;
}

export interface QuickSelectControl<T> {
    label: string;
    options: Option[];
    default: string;
    // Preselects from the URL, e.g. ?side=Killer
    queryKey?: string;
    match: (item: T, value: string) => boolean;
}

interface FilterBase {
    key: string;
    label: string;
    // Hidden groups keep their selections but don't show in the popup (e.g. Survivors while side is Killer)
    visible?: (state: ListState) => boolean;
}

export type FilterControl<T> =
    | (FilterBase & {
          kind: 'single';
          options: Option[];
          default: string;
          match?: (item: T, value: string) => boolean;
      })
    | (FilterBase & {
          kind: 'many';
          items: string[];
          // Omit when the config-level `match` handles this group
          match?: (item: T, values: string[]) => boolean;
      });

export interface ListConfig<T> {
    noun: [singular: string, plural: string];
    search: (item: T) => (string | undefined)[];
    quickSelect?: QuickSelectControl<T>;
    filters?: FilterControl<T>[];
    // The list's fixed order (there are no sort controls; search and filters do the narrowing)
    order: (a: T, b: T) => number;
    // For rules that span several filters (e.g. the owner rule on perks and add-ons)
    match?: (item: T, state: ListState) => boolean;
}
