import { useEffect } from "react";
import { useGameStore } from "../store";
import { PlayerComponent } from "./Player";
import { findHighestScorePlayer } from "../utils";

export const Game = () => {
  const players = useGameStore((store) => store.players);
  const turn = useGameStore((store) => store.turn);
  const drawnCard = useGameStore((store) => store.drawnCard);
  const endGame = useGameStore((store) => store.endGame);
  const restartGame = useGameStore((store) => store.restartGame);
  const loading = useGameStore((store) => store.loading);

  // No remaining player.
  const isAllPlayersSkipped = players.every((player) => player.skipped);

  const activePlayers = players.filter((player) => !player.skipped);
  const highestScorePlayers = findHighestScorePlayer(players);

  useEffect(() => {
    if (activePlayers.length === 1 && highestScorePlayers.length === 1) {
      const [highestPlayer] = highestScorePlayers;
      const [onlyPlayer] = activePlayers;
      if (highestPlayer.id === onlyPlayer.id) {
        endGame();
      }
    }
  }, [highestScorePlayers, activePlayers, endGame]);

  useEffect(() => {
    if (isAllPlayersSkipped) {
      endGame();
    }
  }, [endGame, isAllPlayersSkipped]);

  return (
    <div className="flex grid-cols-12 gap-1 w-full">
      <div>
        <div className="card w-96 bg-primary text-primary-content h-[400px]">
          <div className="card-body flex flex-col justify-between">
            <h2 className="card-title">Blackjack</h2>
            <div>
              {drawnCard ? (
                <>
                  <p>And the drawn card is</p>
                  <div className="bg-base-100 rounded-lg w-32">
                    <img src={drawnCard.image} alt={drawnCard.code} />
                  </div>
                </>
              ) : (
                <h1 className="text-4xl text-center">
                  Drawn Card will appear here
                  {loading && (
                    <span className="ml-1 loading loading-spinner loading-sm"></span>
                  )}
                </h1>
              )}
            </div>
            <div className="card-actions justify-end">
              <button className="btn" onClick={restartGame}>
                Restart Game
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-10 flex gap-2 flex-wrap">
        {players.map((player, idx) => (
          <PlayerComponent
            player={player}
            isCurrentPlayersTurn={idx === turn}
          />
        ))}
      </div>
    </div>
  );
};
