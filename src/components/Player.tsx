import { useEffect } from "react";
import { useGameStore } from "../store";
import { Player } from "../types";
import { useCountdown } from "../hooks/useCountdown";

type Props = {
  player: Player;
  isCurrentPlayersTurn: boolean;
};
export const PlayerComponent = ({ player, isCurrentPlayersTurn }: Props) => {
  const { id, score, skipped, cards } = player;
  const drawCard = useGameStore((store) => store.drawCard);
  const drawnCard = useGameStore((store) => store.drawnCard);
  const addCardToPlayer = useGameStore((store) => store.addCardToPlayer);
  const skipPlayer = useGameStore((store) => store.markPlayerSkipped);
  const endGame = useGameStore((store) => store.endGame);
  const isGameOver = useGameStore((store) => store.isGameOver);
  const goToNextPlayer = useGameStore((store) => store.goToNextPlayer);

  const MAX_TIME = 10;

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({ startingNumber: MAX_TIME });

  const handleCardDraw = () => {
    drawCard(id);
  };

  const handleAcceptDrawnCard = () => {
    addCardToPlayer(id);
  };
  const handleSkip = () => {
    skipPlayer(id);
  };

  useEffect(() => {
    if (isCurrentPlayersTurn && !isGameOver && !skipped) {
      startCountdown();
    } else {
      resetCountdown();
      stopCountdown();
    }
  }, [
    isCurrentPlayersTurn,
    isGameOver,
    resetCountdown,
    skipped,
    startCountdown,
    stopCountdown,
  ]);

  useEffect(() => {
    if (count === 0) {
      skipPlayer(id);
      resetCountdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (score === 21) {
      endGame();
    }
  }, [endGame, score]);

  useEffect(() => {
    if (score > 21) {
      skipPlayer(id);
      goToNextPlayer();
    }
  }, [goToNextPlayer, id, score, skipPlayer]);

  return (
    <div
      className="w-80 bg-base-100 shadow-xl h-[500px] rounded-xl flex flex-col p-2 justify-between"
      key={id}
    >
      <div className="flex">
        <div className="grow relative">
          {cards.map((card, index) => (
            <div>
              <div
                className="bg-base-100 rounded-lg absolute w-32"
                style={{
                  top: `${index * 30}px`,
                }}
              >
                <img src={card.image} alt={card.code} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end">
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Score</div>
              <div className="stat-value">{score}</div>
            </div>
          </div>
          <div className="pr-4">
            {!isGameOver && isCurrentPlayersTurn && !skipped && (
              <div
                className="radial-progress text-primary"
                key={player.id}
                style={{
                  //@ts-expect-error This comes from daisyUI directly.
                  "--value": (count * 100) / MAX_TIME || 0,
                  "--size": "50px",
                }}
                role="progressbar"
              >
                {count}s
              </div>
            )}
          </div>
        </div>
      </div>

      {!isGameOver && (
        <div className="flex flex-col items-end gap-2">
          {isCurrentPlayersTurn && !skipped && <div>Its your turn</div>}
          {isCurrentPlayersTurn && skipped && <div>You have skipped</div>}
          <div className="flex gap-2 justify-end h-24">
            <button
              className="btn btn-primary"
              disabled={!!skipped || !!drawnCard || !isCurrentPlayersTurn}
              onClick={handleCardDraw}
            >
              Draw A card
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleSkip}
              disabled={!isCurrentPlayersTurn}
            >
              {skipped ? "Let turn pass" : "Skip"}
            </button>
          </div>
          <div>
            {drawnCard && isCurrentPlayersTurn && (
              <button className="btn btn-info" onClick={handleAcceptDrawnCard}>
                Accept the drawn card
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
