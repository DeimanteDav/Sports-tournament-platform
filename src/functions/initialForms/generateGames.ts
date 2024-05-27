import BasketballGame from "../../classes/BasketballGame.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballGame from "../../classes/FootballGame.js";
import FootballTeam from "../../classes/FootballTeam.js";
import RegularSeason from "../../classes/RegularSeason.js";
import { SPORTS } from "../../config.js";
import { TeamsType } from "../../types.js";

// FIXME: teams
function generateGames(sportId: number, teams: TeamsType | (FootballTeam | BasketballTeam)[], roundsAmount: number) {
    let games = []
    let gameId = 0

    let ClassGame = sportId === SPORTS.football.id ? FootballGame :  BasketballGame

    for (let i = 0; i < roundsAmount; i++) {
        for (let j = 0; j < teams.length; j++) {
            const homeTeam = teams[j];

            for (let m = j + 1; m < teams.length; m++) {
                const awayTeam = teams[m];
                gameId+=1

                let round = i+1
                let leg = Math.ceil(gameId/5)

                let game
                if ((i % 2) === 0) {
                    game = new ClassGame(gameId, leg, round, homeTeam, awayTeam)
                } else {
                    game = new ClassGame(gameId, leg, round, awayTeam, homeTeam)
                }
                games.push(game)
            }
        }
    }

    RegularSeason.setGames(games)

    return games
}

export default generateGames