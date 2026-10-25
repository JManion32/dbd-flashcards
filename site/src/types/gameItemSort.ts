export interface GameItemSort {
    alphaAsc: boolean;
    rarityAsc: boolean;
    rarityDesc: boolean;
    groupByOwner: boolean;
}

export const GameItemSortDefault: GameItemSort = {
    alphaAsc: true,
    rarityAsc: false,
    rarityDesc: true,
    groupByOwner: false,
};
