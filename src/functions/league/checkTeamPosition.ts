import BasketballGame from "../../classes/BasketballGame.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballGame from "../../classes/FootballGame.js";
import FootballTeam from "../../classes/FootballTeam.js";
import getInbetweenTeamsGames from "../getInbetweenTeamsGames.js";


function checkTeamPosition(teams: (FootballTeam | BasketballTeam)[], games: FootballGame[] | BasketballGame[]) {
    const roundsAmount = localStorage.getItem('rounds-amount')

    if (!roundsAmount) {
        return
    }
    
    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        
        for (let j = i+1; j < teams.length; j++) {
            const otherTeam = teams[j];

            const canSucceed = otherTeam.maxPotentialPoints > team.points
            const equalPoints = otherTeam.maxPotentialPoints === team.points

            if (team.gamesLeft === 0) {
                team.minPlace = team.currentPlace
                team.maxPlace = team.currentPlace
            } else if (canSucceed ) {
                team.minPlace += 1
                otherTeam.maxPlace -= 1
            } else if (equalPoints) {
                const inbetweenGames = getInbetweenTeamsGames([otherTeam, team], games)

                let otherTeamGamesWon = 0
            
                inbetweenGames.forEach(game => {
                    const teamGameData = game.teams.find(gameTeam => gameTeam.id === team.id)!
                    const otherTeamGameData = game.teams.find(gameTeam => gameTeam.id !== team.id)!

                    if (otherTeamGameData.goals && teamGameData.goals && otherTeamGameData.goals > teamGameData?.goals) {
                        otherTeamGamesWon++
                    }
                })

                if (otherTeamGamesWon > +roundsAmount/2) {
                    team.minPlace += 1
                    otherTeam.maxPlace -=1
                } else {
                    // team.minPlace
                }
            }
        }   
    }
}

export default checkTeamPosition