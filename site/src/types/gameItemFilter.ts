export interface GameItemFilter {
    search: string;
    side: 'Killer' | 'Survivor' | 'All';
    survivors: string[];
    killers: string[];
    items: string[];
    tags: string[];
}

export const GameItemFilterDefault: GameItemFilter = {
    search: '',
    side: 'All',
    survivors: [],
    killers: [],
    items: [],
    tags: [],
};
