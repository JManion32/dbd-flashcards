export default interface GameItemFilter {
    search: string;
    side: 'Killer' | 'Survivor' | 'All';
    tags: string[];
}
