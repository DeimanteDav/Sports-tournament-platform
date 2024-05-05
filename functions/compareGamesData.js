import { SPORTS } from "../config.js";
import getInbetweenTeamsGames from "./getInbetweenTeamsGames.js";

export default function compareGamesData(teams, games) {
    const teamsData = {}
    const sportId = JSON.parse(localStorage.getItem('sport')).id

    if (!games) {
        return
    }

    const teamsGamesData = getInbetweenTeamsGames(teams, games, {allGames: true})

    if (teamsGamesData.length === 0) {
        return []
    } 

    let winPoints = 0
    let lossPoints = 0
    let drawPoints = null

    if (sportId === SPORTS.basketball.id) {
        winPoints = SPORTS.basketball.points.winPoints
        lossPoints = SPORTS.basketball.points.lossPoints
    } else if (sportId === SPORTS.football.id) {
        winPoints = SPORTS.football.points.winPoints
        drawPoints = SPORTS.football.points.drawPoints
    }
    
    teams.forEach(team => {
        const teamGames = teamsGamesData.filter(game => game.homeTeam.team === team.team || game.awayTeam.team === team.team);
        
        let points = 0
        let goals = 0
        let goalsMissed = 0

        let wins = 0
        let draws = 0
        let losses = 0
        let playedGames = 0

        let homeGames = {won: 0, lost: 0}
        let awayGames = {won: 0, lost: 0}
        let overtime = {scored: 0, missed: 0}

        teamGames.forEach(game => {
            if (game.homeTeam.team === team.team) {
                goals += game.homeTeam.goals
                goalsMissed += game.awayTeam.goals

                if (game.homeTeam.goals > game.awayTeam.goals) {
                    points += winPoints
                    wins++
                    homeGames.won++
                } else if (game.homeTeam.goals < game.awayTeam.goals) {
                    points += lossPoints
                    losses++
                    homeGames.lost++
                } else if (game.played && game.homeTeam.goals === game.awayTeam.goals && drawPoints) {
                    points += drawPoints
                    draws++
                }

                if (game?.overtime) {
                    game.overtime.forEach(overtimeGame => {
                        overtime.scored+=overtimeGame.homeTeam.goals
                        overtime.missed+=overtimeGame.awayTeam.goals
                    })
                }
            } else  if (game.awayTeam.team === team.team) {
                goals += game.awayTeam.goals
                goalsMissed += game.homeTeam.goals

                if (game.awayTeam.goals > game.homeTeam.goals) {
                    points += winPoints
                    wins++
                    awayGames.won++
                } else if (game.awayTeam.goals < game.homeTeam.goals) {
                    points += lossPoints
                    losses++
                    awayGames.lost++
                }  else if (game.played && game.awayTeam.goals === game.homeTeam.goals && drawPoints) {
                    points += drawPoints
                    draws++
                } 

                if (game?.overtime) {
                    game.overtime.forEach(overtimeGame => {
                        overtime.scored+=overtimeGame.awayTeam.goals
                        overtime.missed+=overtimeGame.homeTeam.goals
                    })
                }
            } 

            if (game.played) {
                playedGames++
            }

            teamsData[team.team] = {
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
                teamsData[team.team] = {...teamsData[team.team], homeGames, awayGames, overtime}
            }
        })

    })

    return teamsData
}