import axios from "axios";
import { Card } from "../types";

type CardDrawResponse = {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
};

const getDeckId = async () => {
  try {
    const response = await axios.get(
      "https://www.deckofcardsapi.com/api/deck/new/"
    );

    return response.data.deck_id;
  } catch (error) {
    // Handle error via a toast or something
    console.log("Error getting deck id", error);
    return null;
  }
};

const shuffleDeck = async (deckId: string) => {
  try {
    await axios.get(
      `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`
    );
  } catch (error) {
    console.log("Error shuffling deck", error);
    return null;
  }
};

export const drawCardService = async (deckId: string) => {
  try {
    await shuffleDeck(deckId);
    const { data } = await axios.get<CardDrawResponse>(
      `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );

    const { cards, remaining } = data ?? {};
    const [card] = cards;
    return { card, continueGame: remaining > 0 };
  } catch (error) {
    console.log("Error drawing card", error);
    return null;
  }
};

export const startNewGameService = async () => {
  try {
    const newGameDeckId = await getDeckId();
    return newGameDeckId;
  } catch (error) {
    console.log("Error starting a new game", error);
    return null;
  }
};
