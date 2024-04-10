export type Card = {
  code: string;
  image: string;
  value: string;
  suit: string;
};

export interface Player {
  id: string;
  name: string;
  score: number;
  cards: Card[];
  skipped: boolean;
}
