import { CalendarArrowDown } from 'lucide-vue-next';
import { killersByRelease, survivorsByRelease } from '@/utils/loadData';
import { alphaSort } from '@/utils/listConfigs/shared';
import type { ListConfig, SortControl } from '@/types/listConfig';

// Owners (killers, survivors, items) are only names until there's owner data. `byRelease` is the
// same list in release order (the validation lists are kept that way); without it there's no
// release sort.
function ownerListConfig(noun: ListConfig<string>['noun'], byRelease?: string[]): ListConfig<string> {
    const releaseSort: SortControl<string>[] = byRelease
        ? [
              {
                  key: 'release',
                  title: 'Release Order',
                  icon: () => CalendarArrowDown,
                  mode: 'toggle',
                  default: 'off',
                  compare: (a, b) => byRelease.indexOf(a) - byRelease.indexOf(b),
              },
          ]
        : [];

    return {
        noun,
        search: (name) => [name],
        sorts: [...releaseSort, alphaSort((name) => name)],
    };
}

export const killerListConfig = ownerListConfig(['killer', 'killers'], killersByRelease);
export const survivorListConfig = ownerListConfig(['survivor', 'survivors'], survivorsByRelease);
export const itemListConfig = ownerListConfig(['item', 'items']);
