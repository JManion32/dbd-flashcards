import type { GameItem } from '@/types/gameItem';
import type { StudyConfig } from '@/types/studyConfig';

// The cards a study session draws from. Shared by StartStudyModal (for its count) and StudyPage,
// so the summary always matches the session.
export function filterStudyPool(gameItems: GameItem[], config: StudyConfig): GameItem[] {
    // Survivor perks belong to survivors, survivor add-ons to items. A list for a side that
    // isn't being studied is ignored, so a leftover selection there can't empty the pool.
    const survivorOwners = config.side === 'Killer' ? [] : config.type === 'Perk' ? config.survivors : config.items;
    const killerOwners = config.side === 'Survivor' ? [] : config.killers;
    const filteringByOwner = survivorOwners.length > 0 || killerOwners.length > 0;

    return gameItems.filter((gameItem) => {
        if (config.side !== 'All' && gameItem.side !== config.side) {
            return false;
        }

        if (gameItem.type !== config.type) {
            return false;
        }

        // Picking only Trapper means only Trapper's cards, so the other side drops out too.
        if (filteringByOwner) {
            const owners = gameItem.side === 'Survivor' ? survivorOwners : killerOwners;
            if (!owners.includes(gameItem.owner)) {
                return false;
            }
        }

        return true;
    });
}
