import { create } from "zustand";
import { persist } from "zustand/middleware";
import { drawCardService, startNewGameService } from "../services";
import { Card, Player } from "../types";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";
import { getCardPointFromValue } from "../utils";

interface GameStoreStateInterface {
  canContinue: boolean;
  deckId: string | null;
  drawnCard: Card | null;
  isGameOver: boolean;
  loading: boolean;
  playerCount: number;
  players: Player[];
  turn: number;
}

interface GameStoreActionsInterface {
  addCardToPlayer: (playerId: string) => void;
  drawCard: (playerId: string) => Promise<void>;
  endGame: () => void;
  goToNextPlayer: () => void;
  markPlayerSkipped: (playerId: string) => void;
  restartGame: () => void;
  setDeckId: (deckId: string) => void;
  startNewGame: (playerCount: number) => void;
}

type GameStoreInterface = GameStoreStateInterface & GameStoreActionsInterface;

export const useGameStore = create(
  persist<GameStoreInterface>(
    (set, get) => ({
      canContinue: false,
      deckId: null,
      drawnCard: null,
      isGameOver: false,
      loading: false,
      playerCount: 0,
      players: [],
      turn: 0,

      setDeckId: (deckId: string) => set({ deckId }),
      drawCard: async () => {
        set({ loading: true });
        const deckId = get().deckId;
        if (!deckId) {
          set({ loading: false });
          return;
        }
        const { card, continueGame } = (await drawCardService(deckId)) || {};
        if (!card) {
          set({ loading: false });
          return;
        }
        set({ drawnCard: card, canContinue: continueGame, loading: false });
      },

      startNewGame: async (playerCount: number) => {
        set({ loading: true });
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
          loading: false,
        });
      },
      goToNextPlayer: () => {
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
