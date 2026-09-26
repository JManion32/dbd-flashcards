export interface StudyConfig {
    side: 'Killer' | 'Survivor' | 'All';
    type: 'Perk' | 'Add-On';
    preset: 'name-and-icon' | 'icon-only' | 'desc-only';
    length: number | 'All';
}

export const StudyConfigDefault: StudyConfig = {
    side: 'All',
    type: 'Perk',
    preset: 'name-and-icon',
    length: 50,
};
