import { SPORTS } from "../../config.js";
import BasketballGame from "../classes/BasketballGame.js";
import BasketballTeam from "../classes/BasketballTeam.js";
import FootballGame from "../classes/FootballGame.js";
import FootballTeam from "../classes/FootballTeam.js";

function generateGames(sportId: number, teams: FootballTeam[] | BasketballTeam[], roundsAmount: number) {
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
                    game = new ClassGame(homeTeam, awayTeam, gameId, leg, round)
                } else {
                    game = new ClassGame(awayTeam, homeTeam, gameId, leg, round)
                }
                games.push(game)
            }
        }
    }

    localStorage.setItem('league-games-data', JSON.stringify(games))

    return games
}

export default generateGames