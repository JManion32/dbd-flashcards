import type { DescriptionBlock } from './gameItem.ts';

export interface StatusEffect {
    name: string;
    id: string;
    side: 'Survivor' | 'Killer' | 'All';
    type: 'Buff' | 'Debuff';
    description: DescriptionBlock[];
    version: string;
}
