export interface StudyConfig {
    side: 'Killer' | 'Survivor' | 'All';
    type: 'Perk' | 'Add-On';
    preset: 'Names / Icons' | 'Icons' | 'Descriptions';
    length: number | 'All';
    // Owner picks; empty means everyone. Survivor perks use `survivors`, survivor add-ons use `items`.
    survivors: string[];
    killers: string[];
    items: string[];
}

export const StudyConfigDefault: StudyConfig = {
    side: 'All',
    type: 'Perk',
    preset: 'Names / Icons',
    length: 25,
    survivors: [],
    killers: [],
    items: [],
};
