import axios from "axios";
import { Card } from "../types";

type CardDrawResponse = {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
};

const getDeckId = async () => {
  const response = await axios.get(
    "https://www.deckofcardsapi.com/api/deck/new/"
  );

  return response.data.deck_id;
};

const shuffleDeck = async (deckId: string) => {
  await axios.get(
    `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`
  );
};

export const drawCardService = async (deckId: string) => {
  await shuffleDeck(deckId);
  const { data } = await axios.get<CardDrawResponse>(
    `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  );

  const { cards, remaining } = data ?? {};
  const [card] = cards;
  return { card, continueGame: remaining > 0 };
};

export const startNewGameService = async () => {
  const newGameDeckId = await getDeckId();
  return newGameDeckId;
};
