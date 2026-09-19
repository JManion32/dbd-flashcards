export type DescriptionBlock =
    | {
          type: 'text';
          content: string;
      }
    | {
          type: 'list';
          items: string[];
      };

export interface GameItem {
    name: string;
    id: string;
    side: 'Killer' | 'Survivor';
    type: 'Perks' | 'Add-Ons';
    rarity?: string;
    owner: string;
    description: DescriptionBlock[];
    quote: string;
    tags: Array<string>;
}
