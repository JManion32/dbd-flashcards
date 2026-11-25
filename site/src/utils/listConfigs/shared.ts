import { ArrowDownAZ, ArrowUpAZ } from 'lucide-vue-next';
import type { DescriptionBlock } from '@/types/gameItem';
import type { QuickSelectControl, SortControl } from '@/types/listConfig';

// Every line of a description, for search
export function descriptionText(description: DescriptionBlock[]): string[] {
    return description.flatMap((block) => (block.type === 'text' ? [block.content] : block.items));
}

// Killer / Survivor / All, preselectable with ?side=. `matchesSide` decides what "on this side" means.
export function sideSelect<T>(matchesSide: (item: T, side: string) => boolean): QuickSelectControl<T> {
    return {
        label: 'Side',
        options: [
            { value: 'Killer', label: 'Killer' },
            { value: 'Survivor', label: 'Survivor' },
            { value: 'All', label: 'All' },
        ],
        default: 'All',
        queryKey: 'side',
        match: (item, side) => side === 'All' || matchesSide(item, side),
    };
}

// A–Z / Z–A; always on, so it settles every tie left by the sorts before it
export function alphaSort<T>(name: (item: T) => string): SortControl<T> {
    return {
        key: 'alpha',
        title: 'Alphabetical Ordering',
        icon: (value) => (value === 'desc' ? ArrowUpAZ : ArrowDownAZ),
        mode: 'direction',
        default: 'asc',
        compare: (a, b) => name(a).localeCompare(name(b)),
    };
}
