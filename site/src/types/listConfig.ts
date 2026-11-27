import type { Component } from 'vue';
import type { Option } from '@/types/options';

// 'asc' doubles as "on" for toggle sorts
export type SortValue = 'asc' | 'desc' | 'off';

export interface ListState {
    search: string;
    // The segmented buttons on the left of the toolbar (e.g. Killer / Survivor / All)
    quick: string;
    // Popup filters by key: a string for 'single' groups, a string[] for 'many' groups
    filters: Record<string, string | string[]>;
    sorts: Record<string, SortValue>;
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

export interface SortControl<T> {
    key: string;
    title: string;
    label?: string;
    icon: (value: SortValue) => Component;
    // direction: always on, flips asc/desc · toggle: on/off
    mode: 'direction' | 'toggle';
    default: SortValue;
    compare: (a: T, b: T) => number;
}

export interface ListConfig<T> {
    noun: [singular: string, plural: string];
    search: (item: T) => (string | undefined)[];
    quickSelect?: QuickSelectControl<T>;
    filters?: FilterControl<T>[];
    // Applied in order: the first sort that doesn't tie decides
    sorts: SortControl<T>[];
    // For rules that span several filters (e.g. the owner rule on perks and add-ons)
    match?: (item: T, state: ListState) => boolean;
}
