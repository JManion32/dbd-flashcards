export default interface GameItemFilter {
    searchQuery: string;
    type: 'killer' | 'survivor' | 'all';
    tags: string[];
}
