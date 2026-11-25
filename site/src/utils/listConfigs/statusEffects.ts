import { Layers } from 'lucide-vue-next';
import { alphaSort, descriptionText, sideSelect } from '@/utils/listConfigs/shared';
import type { ListConfig } from '@/types/listConfig';
import type { StatusEffect } from '@/types/statusEffect';

export const statusEffectListConfig: ListConfig<StatusEffect> = {
    noun: ['status effect', 'status effects'],
    search: (statusEffect) => [statusEffect.name, statusEffect.type, ...descriptionText(statusEffect.description)],
    // Effects that apply to everyone show under both sides
    quickSelect: sideSelect((statusEffect, side) => statusEffect.side === side || statusEffect.side === 'All'),
    filters: [
        {
            kind: 'single',
            key: 'type',
            label: 'Type',
            options: [
                { value: 'Buff', label: 'Buff' },
                { value: 'Debuff', label: 'Debuff' },
                { value: 'All', label: 'All' },
            ],
            default: 'All',
            match: (statusEffect, type) => statusEffect.type === type,
        },
    ],
    sorts: [
        {
            key: 'type',
            title: 'Group by Type',
            icon: () => Layers,
            mode: 'toggle',
            default: 'off',
            // Buffs first
            compare: (a, b) => a.type.localeCompare(b.type),
        },
        alphaSort((statusEffect) => statusEffect.name),
    ],
};
