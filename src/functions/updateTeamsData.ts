import leagueTable from "../components/league/leagueTable.js";
import { SPORTS } from "../config.js";
import BasketballGame from "../classes/BasketballGame.js";
import BasketballTeam from "../classes/BasketballTeam.js";
import FootballGame from "../classes/FootballGame.js";
import FootballTeam from "../classes/FootballTeam.js";
import { Container, TeamsType } from "../types.js";
import RegularSeason from "../classes/RegularSeason.js";
import Playoffs from "../classes/Playoffs.js";

function updateTeamsData(regularSeasonData: RegularSeason, container: Container, updatedGame: BasketballGame | FootballGame, oldGame: BasketballGame | FootballGame, playoffsData?: Playoffs) { 
    const playingTeams = regularSeasonData.leagueTeams.filter(team => oldGame.teams.some(oldTeam => oldTeam.id === team.id))

    changeTeamData(oldGame, playingTeams, {old: true})
    changeTeamData(updatedGame, playingTeams)

    leagueTable(container, regularSeasonData)
    
    
    if (playoffsData) {
        const teamsToPlayoffs = regularSeasonData.leagueTeams.slice(0, playoffsData.teamsAmount)

        let leagueTableUpdated = !teamsToPlayoffs.every((team, i) => {
            // TODO: teamId
            return team.id === playoffsData.playoffsTeams[i].id
        });
 
        if (leagueTableUpdated) {
            playoffsData.playoffsTeams = teamsToPlayoffs
            playoffsData.renderHtml(container, {leagueTableUpdated: true})
        }
    }

    regularSeasonData.leagueTeams = regularSeasonData.leagueTeams
}

export default updateTeamsData


function changeTeamData(game: FootballGame | BasketballGame, teams: TeamsType, params: {old: boolean} = {old: false}) {
    teams.forEach(team => {
        const gameTeam = game.teams.find(gTeam => gTeam.id === team.id)
        const gameOppTeam = game.teams.find(gTeam => gTeam.id !== team.id)
        
        const sportData = JSON.parse(localStorage.getItem('sport') || '')

        const {id: sportId, points} = sportData
        const {winPoints, lossPoints, drawPoints} = points

        const calcData = (a: number, b: number) => params.old ? a - b : a + b
        const calcWinningPerc = (wins: number, played: number) => Math.round((wins/played)*1000)/10 

        if (game.played) {
            team.playedGames = calcData(team.playedGames, 1)
            team.gamesLeft = team.totalGames - team.playedGames

            if (gameTeam && gameOppTeam) {
                let teamTotalScore: number = gameTeam.goals ? gameTeam.goals : 0
                let oppTeamTotalScore: number = gameOppTeam.goals ? gameOppTeam.goals : 0

                const basketballTeam = team as BasketballTeam
                const footballTeam = team as FootballTeam

                const basketballGame = game as BasketballGame
            
                if (sportId === SPORTS.basketball.id) {
                    basketballGame.overtime.forEach(overtime => {
                        const overtimeTeam = overtime.teams.find(oTeam => oTeam.id === gameTeam.id)!
                        const overtimeOppTeam = overtime.teams.find(oTeam => oTeam.id === gameOppTeam.id)!
                        
                        if (overtimeTeam?.goals && overtimeOppTeam?.goals) {
                            if (overtimeTeam.goals > overtimeOppTeam.goals) {
                                basketballTeam.overtime.won = calcData(basketballTeam.overtime.won, 1)
                            } else if (overtimeTeam.goals < overtimeOppTeam.goals) {
                                basketballTeam.overtime.lost = calcData(basketballTeam.overtime.lost, 1)
                            }
                        }
                        
                        teamTotalScore += overtimeTeam.goals ? overtimeTeam.goals : 0
                        oppTeamTotalScore += overtimeOppTeam.goals ? overtimeOppTeam.goals : 0
                    })
                }
                    
                if (teamTotalScore !== 0) {
                    if (teamTotalScore > oppTeamTotalScore) {
                        team.wins = calcData(team.wins, 1)
                        team.points = calcData(team.points, winPoints)
        
                        if (sportId === SPORTS.basketball.id) {
                            if (gameTeam.home) {
                                basketballTeam.homeGames.won = calcData(basketballTeam.homeGames.won, 1)
                            } else if (gameTeam.away) {
                                basketballTeam.awayGames.won = calcData(basketballTeam.awayGames.won, 1)
                            }
                        } else if (sportId === SPORTS.football.id && gameTeam.away) {
                            footballTeam.awayWins = calcData(footballTeam.awayWins, 1)
                        }
                    } else if (teamTotalScore < oppTeamTotalScore) {
                        team.losses = calcData(team.losses, 1)
                        team.points = calcData(team.points, lossPoints)
        
                        if (sportId === SPORTS.basketball.id) {
                            if (gameTeam.home) {
                                basketballTeam.homeGames.lost = calcData(basketballTeam.homeGames.lost, 1)
                            } else if (gameTeam.away) {
                                basketballTeam.awayGames.lost = calcData(basketballTeam.awayGames.lost, 1)
                            }
                        }
                    } else if (teamTotalScore === oppTeamTotalScore && sportId === SPORTS.football.id) {
                        team.points = calcData(team.points, drawPoints)
        
                        footballTeam.draws = calcData(footballTeam.draws, 1)
                    }
                }

                team.goals = gameTeam.goals ? calcData(team.goals, gameTeam.goals) : team.goals
                
                team.goalsMissed = gameOppTeam.goals ? calcData(team.goalsMissed, gameOppTeam.goals) : team.goalsMissed
                team.goalDifference = team.goals - team.goalsMissed

                if (gameTeam.away && sportId === SPORTS.football.id && gameTeam.goals) {
                    footballTeam.awayGoals = calcData(footballTeam.awayGoals, gameTeam.goals)
            
                    if (gameOppTeam.goals && gameTeam.goals > gameOppTeam.goals) {
                        footballTeam.awayWins = calcData(footballTeam.awayWins, 1)
                    }
                }

                if (sportId === SPORTS.basketball.id && !params.old) {
                    basketballTeam.winPerc = calcWinningPerc(team.wins, team.playedGames)
                }
            }
        }

        team.potentialPoints = team.gamesLeft*winPoints
        team.maxPotentialPoints = team.potentialPoints + team.points
    })
}