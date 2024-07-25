import BasketballGame from "../../classes/Basketball/BasketballGame.js"
import FootballGame from "../../classes/Football/FootballGame.js"
import { SPORTS } from "../../config.js"
import { GamesType, PlayoffsTeam } from "../../types.js"

function setPlayoffPairTeams(sportId: number, pairGames: GamesType) {
    const pairTeams = pairGames[0].teams

    const teamsData: PlayoffsTeam[] = []

    pairTeams.forEach((team, i) => {
        const scores: { playedIn: string, score: number | null }[] = []
        let teamScoresSum = 0
        let oppTeamScoresSum = 0
        let wins = 0

        pairGames.forEach(game => {
            const gameTeam = game.teams.find(gameT => gameT.id === team.id)
            const gameOppTeam = game.teams.find(gameT => gameT.id !== team.id)
            
            let gameScores = (gameTeam && gameTeam.goals) ? gameTeam.goals: 0
            let gameOppScores =  (gameOppTeam && gameOppTeam.goals) ? gameOppTeam.goals: 0

            const teamScoreData: {score: number | null, playedIn: string} = {score: 0, playedIn: ''}
            
            if (gameTeam && gameOppTeam) {
                let teamOvertimeScore = 0
                let oppTeamOvertimeScore = 0

                teamScoreData.score = gameTeam.goals ? gameTeam.goals : null
                teamScoreData.playedIn = gameTeam.home ? 'H' : 'A'
                scores.push(teamScoreData)

                if (sportId === SPORTS.basketball.id) {
                    (game as BasketballGame).overtime.forEach(overtimeGame => {
                        const overtimeTeam = overtimeGame.teams.find(oTeam => oTeam.id === gameTeam.id)!
                        const overtimeOppTeam = overtimeGame.teams.find(oTeam => oTeam.id == gameOppTeam.id)!

                        scores.push({score: overtimeTeam.goals, playedIn: 'OT'})

                        
                        if (overtimeTeam.goals !== null && overtimeOppTeam.goals !== null) {
                            teamOvertimeScore += overtimeTeam.goals
                            oppTeamOvertimeScore += overtimeOppTeam.goals
                            
                            gameScores += teamOvertimeScore
                            gameOppScores += oppTeamOvertimeScore
                        }
                    })
                } else if (sportId === SPORTS.football.id) {
                    const footballGame = game as FootballGame

                    if (footballGame.extraTime) {
                        const extraTimeTeam = footballGame.extraTime.teams.find(oTeam => oTeam.id === gameTeam.id)!
    
                        const extraTimeOppTeam = footballGame.extraTime.teams.find(oTeam => oTeam.id == gameOppTeam.id)!

                        scores.push({score: extraTimeTeam.goals, playedIn: 'OT'})
                        
                        if (extraTimeTeam.goals !== null && extraTimeOppTeam.goals !== null) {
                            gameScores += extraTimeTeam.goals

                            gameOppScores += extraTimeOppTeam.goals
                        }
                    }

                    if (footballGame.shootout) {
                        const shootoutTeam = footballGame.shootout.teams.find(oTeam => oTeam.id === gameTeam.id)!
    
                        const shootoutOppTeam = footballGame.shootout.teams.find(oTeam => oTeam.id == gameOppTeam.id)!

                        scores.push({score: shootoutTeam.goals, playedIn: 'p'})
                        
                        if (shootoutTeam.goals !== null && shootoutOppTeam.goals !== null) {
                            gameScores += shootoutTeam.goals

                            gameOppScores += shootoutOppTeam.goals ? shootoutOppTeam.goals : 0
                        }
                    }
                }
            } else {
                let playedIn: string = 'H'
                if (i === 1) {
                    playedIn = 'A'
                }
                scores.push({playedIn, score: null})
            }

            teamScoresSum += gameScores
            oppTeamScoresSum += gameOppScores

            if (gameScores > gameOppScores && game.playedAll) {
                wins++
            }
        })

        teamsData.push({
            team: team.team,
            id: team.id,
            scores,
            totalScore: teamScoresSum,
            wins
        })

    })

    return teamsData
}


export default setPlayoffPairTeams