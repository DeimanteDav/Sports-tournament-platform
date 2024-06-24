
import BasketballGame from "../../classes/Basketball/BasketballGame.js"
import { SPORTS } from "../../config.js"
import { GamesType, TeamsType } from "../../types.js"
import getInbetweenTeamsGames from "../getInbetweenTeamsGames.js"

function compareGamesData(sportId: number, teams: TeamsType, games: GamesType) {
    const teamsData: {
        [key: number]: {
            team: string,
            playedGames: number,
            wins: number,
            draws: number,
            losses: number,
            goals: number,
            goalsMissed: number,
            goalDifference: number,
            points: number,
            currentPlace: number,
            homeGames?: { won: number, lost: number },
            awayGames?: { won: number, lost: number }, 
            overtime?: { won: number, lost: number },
            winPerc?: number
        }
    } = {}

    if (!games) {
        return
    }

    const teamsGamesData = getInbetweenTeamsGames(teams, games, {allGames: true})

    if (teamsGamesData.length === 0) {
        return []
    } 

    let winPoints = 0
    let lossPoints = 0
    let drawPoints: null | number = null

    if (sportId === SPORTS.basketball.id) {
        winPoints = SPORTS.basketball.points.winPoints
        lossPoints = SPORTS.basketball.points.lossPoints
    } else if (sportId === SPORTS.football.id) {
        winPoints = SPORTS.football.points.winPoints
        drawPoints = SPORTS.football.points.drawPoints
    }
    
    teams.forEach(team => {
        const teamGames = teamsGamesData.filter(game => game.teams.some(gameTeam => gameTeam.id === team.id));
        
        let points = 0
        let goals = 0
        let goalsMissed = 0

        let wins = 0
        let draws = 0
        let losses = 0
        let playedGames = 0

        let homeGames = {won: 0, lost: 0}
        let awayGames = {won: 0, lost: 0}
        let overtime = {won: 0, lost: 0}
        let winPerc = 0

        teamGames.forEach(game => {
            const gameTeam = game.teams.find(gameTeam => gameTeam.id === team.id)
            const oppGameTeam = game.teams.find(gameTeam => gameTeam.id !== team.id)

            if (gameTeam && oppGameTeam) {
                goals += gameTeam.goals ? gameTeam.goals : 0
                goalsMissed += oppGameTeam.goals ? oppGameTeam.goals : 0
    
                if (gameTeam.goals && oppGameTeam.goals) {
                    if (gameTeam.goals > oppGameTeam.goals) {
                        points += winPoints
                        wins++
                        homeGames.won++
                    } else if (gameTeam.goals < oppGameTeam?.goals) {
                        points += lossPoints
                        losses++
                        homeGames.lost++
                    } else if (gameTeam.goals === oppGameTeam.goals && drawPoints) {
                        points += drawPoints
                        draws++
                    }
                }
    

                if ((game as BasketballGame).overtime?.length > 0) {
                    (game as BasketballGame).overtime.forEach(overtimeGame => {
                        const overtimeTeam = overtimeGame.teams.find(oTeam => oTeam.id === gameTeam.id)
                        const oppOvertimeTeam = overtimeGame.teams.find(oTeam => oTeam.id === oppGameTeam.id)

                        if (overtimeTeam && oppOvertimeTeam && overtimeTeam.goals && oppOvertimeTeam.goals) {
                            if (overtimeTeam.goals > oppOvertimeTeam.goals) {
                                overtime.won++
                            } else if (overtimeTeam.goals < oppOvertimeTeam.goals) {
                                overtime.lost++
                            }
                        }
                    })
                }
            }


            if (game.played) {
                playedGames++
            }
            
            winPerc = playedGames !== 0 ? Math.round((wins/playedGames)*1000)/10 : 0

            teamsData[team.id] = {
                team: team.team,
                playedGames,
                wins,
                draws,
                losses,
                goals,
                goalsMissed,
                goalDifference: goals - goalsMissed,
                points,
                currentPlace: team.currentPlace
            }

            if (sportId === SPORTS.basketball.id) {
                teamsData[team.id] = {...teamsData[team.id], homeGames, awayGames, overtime, winPerc}
            }
        })

    })

    return teamsData
}

export default compareGamesData