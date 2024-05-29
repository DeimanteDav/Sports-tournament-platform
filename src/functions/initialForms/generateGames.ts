import BasketballGame from "../../classes/BasketballGame.js";
import FootballGame from "../../classes/FootballGame.js";
import RegularSeason from "../../classes/RegularSeason.js";
import { SPORTS } from "../../config.js";

// FIXME: teams
function generateGames(regularSeasonData: RegularSeason) {
    let games = []
    let gameId = 0

    let ClassGame = regularSeasonData.sportType.id === SPORTS.football.id ? FootballGame :  BasketballGame

    for (let i = 0; i < regularSeasonData.roundsAmount; i++) {
        console.log(regularSeasonData, regularSeasonData.leagueTeams)
        for (let j = 0; j < regularSeasonData.leagueTeams.length; j++) {
            const homeTeam = regularSeasonData.leagueTeams[j];

            for (let m = j + 1; m < regularSeasonData.leagueTeams.length; m++) {
                const awayTeam = regularSeasonData.leagueTeams[m];
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

    // RegularSeason.setGames(games)
    console.log(games);
    return games
}

export default generateGames