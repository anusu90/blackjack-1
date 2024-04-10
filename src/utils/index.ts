import { Player } from "../types";

export const getCardPointFromValue = (value: string): number => {
  switch (value) {
    case "ACE":
      return 11;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    case "10":
      return 10;
    case "QUEEN":
    case "KING":
    case "JACK":
      return 10;
    default:
      return 0;
  }
};

export const findHighestScorePlayer = (players: Player[]): Player[] => {
  const filteredPlayers = players.filter((player) => player.score <= 21);
  const highestScore = Math.max(
    ...filteredPlayers.map((player) => player.score)
  );
  return filteredPlayers.filter((player) => player.score === highestScore);
};
