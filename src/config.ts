import BasketballGame from "./classes/BasketballGame";
import BasketballTeam from "./classes/BasketballTeam";
import FootballGame from "./classes/FootballGame";
import FootballTeam from "./classes/FootballTeam";

export const SPORTS = {
  football: {
    id: 1,
    name: 'Football',
    points: {
      winPoints: 3,
      drawPoints: 1,
      lossPoints: 0
    }
  },
  basketball: {
    id: 2,
    name: 'Basketball',
    points: {
      winPoints: 2,
      lossPoints: 1,
      tecnhicalLossPoints: 0,
    }
  }
}

export const ANIMAL_NAMES = [
  "Bears",
  "Lions",
  "Eagles",
  "Jaguars",
  "Hawks",
  "Falcons",
  "Ravens",
  "Wolves",
  "Sharks",
  "Cobras",
];

export type Container = HTMLDivElement

// export const SPORT_TYPES = {
//   [SPORTS.football.id]: {
//     teamClass: FootballTeam,
//     gameClass: FootballGame,
//   },
//   [SPORTS.basketball.id]: {
//     teamClass: BasketballTeam,
//     gameClass: BasketballGame,
//   },
// }
