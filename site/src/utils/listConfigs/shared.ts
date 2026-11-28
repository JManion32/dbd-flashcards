import type { DescriptionBlock } from '@/types/gameItem';
import type { QuickSelectControl } from '@/types/listConfig';

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

// A–Z by name; also the tiebreak for lists with a primary order
export function byName<T>(name: (item: T) => string) {
    return (a: T, b: T) => name(a).localeCompare(name(b));
}
