import { DRAW_POINTS, WIN_POINTS } from "../config.js";
import getInbetweenTeamsGames from "./getInbetweenTeamsGames.js";

export default function compareGamesData(teams, games) {
    const teamsData = {}

    const teamsGamesData = getInbetweenTeamsGames(teams, games, {allGames: true})

    if (teamsGamesData.length === 0) {
        return []
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
        // nesaugoju awaygoals awaywins


        teamGames.forEach(game => {
            if (game.homeTeam.team === team.team) {
                goals += game.homeTeam.goals
                goalsMissed += game.awayTeam.goals

                if (game.homeTeam.goals > game.awayTeam.goals) {
                    points += WIN_POINTS
                    wins++
                } else if (game.played && game.homeTeam.goals === game.awayTeam.goals) {
                    points += DRAW_POINTS
                    draws++
                } else if (game.played) {
                    losses++
                }
            } else  if (game.awayTeam.team === team.team) {
                goals += game.awayTeam.goals
                goalsMissed += game.homeTeam.goals

                if (game.awayTeam.goals > game.homeTeam.goals) {
                    points += WIN_POINTS
                    wins++
                } else if (game.played && game.awayTeam.goals === game.homeTeam.goals) {
                    points += DRAW_POINTS
                    draws++
                } else if (game.played) {
                    losses++
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
                // points,
                // goalDifference: goals - goalsMissed,
                // goals
            }
        })

    })

    return teamsData
}