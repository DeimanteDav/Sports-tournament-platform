import { SPORTS } from "../config.js";
import BasketballGame from "./classes/BasketballGame.js";
import BasketballTeam from "./classes/BasketballTeam.js";
import FootballGame from "./classes/FootballGame.js";
import FootballTeam from "./classes/FootballTeam.js";
import Team from "./classes/Team.js";

function updateTeamsData(updatedGame: BasketballGame | FootballGame, oldGame: BasketballGame | FootballGame, allTeams: BasketballTeam[] | FootballTeam[], sportId: number) { 
    const teams = allTeams.filter(team => {
        if (team.id === updatedGame.homeTeam.id || team.id === updatedGame.awayTeam.id) {
            return team
        }
    })

    const oldGameTeams = [oldGame.homeTeam, oldGame.awayTeam]
    const newGameTeams = [updatedGame.homeTeam, updatedGame.awayTeam]

    teams.forEach(team => {
        const oldGameTeam = oldGameTeams.find(oldTeam => oldTeam.id === team.id)
        const oldGameOtherTeam = oldGameTeams.find(oldTeam => oldTeam.id !== team.id)

        const newGameTeam = newGameTeams.find(newTeam => newTeam.id === team.id)
        const newGameOtherTeam = newGameTeams.find(newTeam => newTeam.id !== team.id)

        let awayTeam = oldGameTeams.findIndex(oldTeam => oldTeam.id === team.id) === 1 ? true : false

        if (oldGame.played && oldGameTeam?.goals && oldGameOtherTeam?.goals) {
            team.playedGames--
            team.gamesLeft++

            team.goals-= oldGameTeam.goals
            team.goalsMissed+=oldGameOtherTeam.goals
            team.goalDifference+=oldGameOtherTeam.goals

            if (awayTeam && sportId === SPORTS.football.id && team instanceof FootballTeam) {
                team.awayGoals-=oldGameTeam.goals

                if (oldGameTeam.goals > oldGameOtherTeam.goals) {
                    team.awayWins--
                }
            }

        } 

        if (updatedGame.playedAll) {

            team.playedGames++
            team.gamesLeft--
        }
    })
}

export default updateTeamsData