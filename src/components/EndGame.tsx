import { useGameStore } from "../store";
import { findHighestScorePlayer } from "../utils";

export const EndGameComponent = () => {
  const players = useGameStore((store) => store.players);
  const winners = findHighestScorePlayer(players);

  const winnersNames = winners.map((winner) => winner.name).join(", ");
  const isTie = winners.length > 1;

  return (
    <div>
      <h1 className="text-3xl text-black">
        {isTie
          ? `It's a tie between ${winnersNames}`
          : `${winnersNames} won the game!`}
      </h1>
    </div>
  );
};
