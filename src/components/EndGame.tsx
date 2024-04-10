import { useGameStore } from "../store";
import { findHighestScorePlayer } from "../utils";

export const EndGameComponent = () => {
  const players = useGameStore((store) => store.players);
  const winners = findHighestScorePlayer(players);

  const winnersNames = winners.map((winner) => winner.name).join(", ");

  return (
    <div>
      <h1 className="text-3xl text-black">{winnersNames} wins!</h1>
    </div>
  );
};
