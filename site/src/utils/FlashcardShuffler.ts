// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

import type { GameItem } from '@/types/GameItem.ts';

export function shuffle(arr: GameItem[]): GameItem[] {
    let currentIndex = arr.length;

    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
}
