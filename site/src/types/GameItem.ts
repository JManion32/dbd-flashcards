type TextBlock = {
    type: 'text';
    content: string;
};

type ListBlock = {
    type: 'list';
    items: string[];
};

export type DescriptionBlock = TextBlock | ListBlock;

export interface GameItem {
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
