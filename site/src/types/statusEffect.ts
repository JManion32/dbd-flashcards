import type { DescriptionBlock } from '@/types/gameItem';

export interface StatusEffect {
    name: string;
    id: string;
    side: 'Survivor' | 'Killer' | 'All';
    type: 'Buff' | 'Debuff';
    description: DescriptionBlock[];
    version: string;
}
