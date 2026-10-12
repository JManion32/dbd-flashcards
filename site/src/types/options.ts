export interface Option<T extends string | number = string> {
    value: T;
    label: string;
}

export type Side = 'Killer' | 'Survivor' | 'All';

export type Type = 'Perk' | 'Add-On';
