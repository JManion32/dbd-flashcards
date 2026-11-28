import { byName } from '@/utils/listConfigs/shared';
import type { ListConfig } from '@/types/listConfig';

// Owners (killers, survivors, items) are only names until there's owner data
function ownerListConfig(noun: ListConfig<string>['noun']): ListConfig<string> {
    return {
        noun,
        search: (name) => [name],
        order: byName((name) => name),
    };
}

export const killerListConfig = ownerListConfig(['killer', 'killers']);
export const survivorListConfig = ownerListConfig(['survivor', 'survivors']);
export const itemListConfig = ownerListConfig(['item', 'items']);
