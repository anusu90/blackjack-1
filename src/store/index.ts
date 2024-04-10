import { create } from "zustand";
import { persist } from "zustand/middleware";
import { drawCardService, startNewGameService } from "../services";
import { Card, Player } from "../types";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";
import { getCardPointFromValue } from "../utils";

interface GameStoreStateInterface {
  deckId: string | null;
  playerCount: number;
  players: Player[];
  turn: number;
  canContinue: boolean;
  drawnCard: Card | null;
  isGameOver: boolean;
}

interface GameStoreActionsInterface {
  setDeckId: (deckId: string) => void;
  drawCard: (playerId: string) => Promise<void>;
  startNewGame: (playerCount: number) => void;
  goToNextPlayer: () => void;
  addCardToPlayer: (playerId: string) => void;
  markPlayerSkipped: (playerId: string) => void;
  endGame: () => void;
  restartGame: () => void;
}

type GameStoreInterface = GameStoreStateInterface & GameStoreActionsInterface;

export const useGameStore = create(
  persist<GameStoreInterface>(
    (set, get) => ({
      deckId: null,
      playerCount: 0,
      players: [],
      turn: 0,
      canContinue: false,
      drawnCard: null,
      isGameOver: false,

      setDeckId: (deckId: string) => set({ deckId }),
      drawCard: async () => {
        const deckId = get().deckId;
        if (!deckId) return;
        const { card, continueGame } = await drawCardService(deckId);
        if (!card) return;
        set({ drawnCard: card, canContinue: continueGame });
      },

      startNewGame: async (playerCount: number) => {
        const newGameID = await startNewGameService();

        const playerArray: Player[] = [];
        for (let i = 0; i < playerCount; i++) {
          const newPlayer: Player = {
            id: uuidv4(),
            name: `Player ${i + 1}`,
            score: 0,
            cards: [],
            skipped: false,
          };
          playerArray.push(newPlayer);
        }
        set({
          players: playerArray,
          turn: 0,
          playerCount: playerCount,
          deckId: newGameID,
        });
      },
      goToNextPlayer: () => {
        console.log("I am getting called");
        const { turn, playerCount } = get();
        const nextTurn = turn + 1;
        if (nextTurn >= playerCount) {
          set({ turn: 0, drawnCard: null });
          return;
        }
        set({ turn: nextTurn, drawnCard: null });
      },

      addCardToPlayer: (playerId: string) => {
        const drawnCard = get().drawnCard;
        if (!drawnCard) return;
        const playerArray = get().players;
        const updatedPlayers = produce(playerArray, (draft) => {
          const player = draft.find((p) => p.id === playerId);
          if (!player) return;
          player.cards.push(drawnCard);
          player.score += getCardPointFromValue(drawnCard.value);
        });
        set({ players: updatedPlayers, drawnCard: null });
        get().goToNextPlayer();
      },

      markPlayerSkipped: (playerId) => {
        const playerArray = get().players;
        const updatedPlayers = produce(playerArray, (draft) => {
          const player = draft.find((p) => p.id === playerId);
          if (!player) return;
          player.skipped = true;
        });
        set({ players: updatedPlayers });
        get().goToNextPlayer();
      },

      endGame: () => {
        set({ isGameOver: true });
      },

      restartGame: () => {
        set({
          deckId: null,
          playerCount: 0,
          players: [],
          turn: 0,
          canContinue: false,
          drawnCard: null,
          isGameOver: false,
        });
      },
    }),
    { name: "game-storage" }
  )
);
