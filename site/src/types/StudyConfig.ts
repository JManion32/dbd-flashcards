export interface StudyConfig {
    side: 'Killer' | 'Survivor' | 'All';
    type: 'Perks' | 'Add-Ons';
    preset: 'name-and-icon' | 'icon-only' | 'desc-only';
    length: number | 'All';
}
