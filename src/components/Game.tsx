import { useEffect } from "react";
import { useGameStore } from "../store";
import { PlayerComponent } from "./Player";

export const Game = () => {
  const players = useGameStore((store) => store.players);
  const turn = useGameStore((store) => store.turn);
  const drawnCard = useGameStore((store) => store.drawnCard);
  const endGame = useGameStore((store) => store.endGame);
  const restartGame = useGameStore((store) => store.restartGame);

  const isAllPlayersSkipped = players.every((player) => player.skipped);

  useEffect(() => {
    if (isAllPlayersSkipped) {
      endGame();
    }
  }, [endGame, isAllPlayersSkipped]);

  return (
    <div className="flex grid-cols-12 gap-1 w-full">
      <div className="">
        <div className="card w-96 bg-primary text-primary-content h-full">
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
      <div className="col-span-10 flex gap-2">
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
