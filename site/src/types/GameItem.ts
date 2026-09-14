export default interface Perk {
    name: string;
    id: string;
    side: string;
    type: string;
    rarity?: string;
    owner: string;
    description: string | Array<string>;
    quote: string;
    tags: Array<string>;
}
