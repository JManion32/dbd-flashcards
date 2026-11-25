import { CalendarArrowDown } from 'lucide-vue-next';
import { killersByRelease, survivorsByRelease } from '@/utils/loadData';
import { alphaSort } from '@/utils/listConfigs/shared';
import type { ListConfig } from '@/types/listConfig';

// Characters are only names until there's character data. The validation lists are kept in release order.
function characterListConfig(noun: ListConfig<string>['noun'], byRelease: string[]): ListConfig<string> {
    return {
        noun,
        search: (name) => [name],
        sorts: [
            {
                key: 'release',
                title: 'Release Order',
                icon: () => CalendarArrowDown,
                mode: 'toggle',
                default: 'off',
                compare: (a, b) => byRelease.indexOf(a) - byRelease.indexOf(b),
            },
            alphaSort((name) => name),
        ],
    };
}

export const killerListConfig = characterListConfig(['killer', 'killers'], killersByRelease);
export const survivorListConfig = characterListConfig(['survivor', 'survivors'], survivorsByRelease);
