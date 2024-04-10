import { useState } from "react";
import { useGameStore } from "../store";

export const NewGame = () => {
  const [playerCount, setPlayerCount] = useState(0);
  const startNewGame = useGameStore((store) => store.startNewGame);
  return (
    <div className="p-2 flex flex-col gap-2 w-96">
      <h1 className="text-2xl text-black">Blackjack</h1>
      <div className="flex flex-col gap-1">
        <input
          type="number"
          id="new-game"
          className="input input-bordered w-full"
          placeholder="Enter player count"
          onChange={(e) => setPlayerCount(Number(e.target.value))}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          if (playerCount < 2) return;
          startNewGame(playerCount);
        }}
      >
        Start Game
      </button>
    </div>
  );
};
