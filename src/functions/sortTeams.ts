import { SPORTS } from "../config.js";
import BasketballTeam from "../classes/BasketballTeam.js"
import FootballTeam from "../classes/FootballTeam.js"
import compareGamesData from "./league/compareGamesData.js";
import { GamesType, TeamsType } from "../types.js";

function sortTeams(sportId: number, teams: TeamsType, games: GamesType, params: {compareBetweenGames: boolean} = {compareBetweenGames: false}) {
    const {compareBetweenGames} = params

    const samePointsTeams: (BasketballTeam | FootballTeam)[] = []

    const result = teams.sort((a, b) => {
        if (a.points > b.points) {
            return -1
        } else if (a.points < b.points) {
            return 1
        } else {
            !samePointsTeams.includes(a) && samePointsTeams.push(a)
            !samePointsTeams.includes(b) && samePointsTeams.push(b)
            const teamsGameData = compareGamesData(sportId, samePointsTeams, games);

            if (sportId === SPORTS.football.id) {
                const teamA = a as FootballTeam
                const teamB = b as FootballTeam
          
                if (compareBetweenGames && teamsGameData) {
                    if (Object.keys(teamsGameData).length === 0) {
                        return 0
                    }
        
                    if (teamsGameData[teamA.id].points > teamsGameData[teamB.id].points) {
                        return -1
                    } else if (teamsGameData[teamA.id].points < teamsGameData[teamB.id].points) {
                        return 1
                    }
            
                    if (teamsGameData[teamA.id].goalDifference > teamsGameData[teamB.id].goalDifference) {
                        return -1
                    } else if (teamsGameData[teamA.id].goalDifference < teamsGameData[teamB.id].goalDifference) {
                        return 1
                    }
            
                    if (teamsGameData[teamA.id].goals > teamsGameData[teamB.id].goals) {
                        return -1
            
                    } else if (teamsGameData[teamA.id].goals < teamsGameData[teamB.id].goals) {
                        return 1
                    }
                }
                
                if (teamA.goalDifference > teamB.goalDifference) {
                    return -1
                } else if (teamA.goalDifference < teamB.goalDifference) {
                    return 1
                } 
        
                if (teamA.goals > teamB.goals) {
                    return -1
                } else if (teamA.goals < teamB.goals) {
                    return 1
                } 
        
                if (teamA.awayGoals > teamB.awayGoals) {
                    return -1
                } else if (teamA.awayGoals < teamB.awayGoals) {
                    return 1
                } 
        
                if (teamA.wins > teamB.wins) {
                    return -1
                } else if (teamA.wins < teamB.wins) {
                    return 1
                }
    
                if (teamA.awayWins > teamB.awayWins) {
                    return -1
                } else if (teamA.awayWins < teamB.awayWins) {
                    return 1
                }

                if (teamA.playedGames > teamB.playedGames) {
                    return -1
                } else if (teamA.playedGames < teamB.playedGames) {
                    return 1
                }
            } else if (sportId === SPORTS.basketball.id) {
                const teamA = a as BasketballTeam
                const teamB = b as BasketballTeam

                if (teamA.winPerc > teamB.winPerc) {
                    return -1
                } else if (teamA.winPerc < teamB.winPerc) {
                    return 1
                }

                if (compareBetweenGames && teamsGameData) {
                    if (Object.keys(teamsGameData).length === 0) {
                        return 0
                    }

                    if (teamsGameData[teamA.id].wins > teamsGameData[teamB.id].wins) {
                        return -1
                    } else if (teamsGameData[teamA.id].wins < teamsGameData[teamB.id].wins) {
                        return 1
                    }
                    if (teamsGameData[teamA.id].goalDifference > teamsGameData[teamB.id].goalDifference) {
                        return -1
                    } else if (teamsGameData[teamA.id].goalDifference < teamsGameData[teamB.id].goalDifference) {
                        return 1
                    }
                }

                if (teamA.goalDifference > teamB.goalDifference) {
                    return -1
                } else if (teamA.goalDifference < teamB.goalDifference) {
                    return 1
                }

                if (teamA.goals > teamB.goals) {
                    return -1
                } else if (teamA.goals < teamB.goals) {
                    return 1
                }
            }
        }
    
        return 0
    })

    return result
}

export default sortTeams