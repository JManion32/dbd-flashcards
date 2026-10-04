export interface StudyConfig {
    side: 'Killer' | 'Survivor' | 'All';
    type: 'Perk' | 'Add-On';
    preset: 'Names / Icons' | 'Icons' | 'Descriptions';
    length: number | 'All';
}

export const StudyConfigDefault: StudyConfig = {
    side: 'All',
    type: 'Perk',
    preset: 'Names / Icons',
    length: 25,
};
