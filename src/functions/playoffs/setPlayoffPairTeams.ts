import BasketballGame from "../../classes/BasketballGame.js"
import FootballGame from "../../classes/FootballGame.js"
import { SPORTS } from "../../config.js"

function setPlayoffPairTeams(sportId: number, pairGames: FootballGame[] | BasketballGame[]) {
    const pairTeams = pairGames[0].teams

    type TeamsData = {
            team: string,
            id: number,
            scores: { playedIn: string, score: number }[],
            totalScore: number,
            wins: number
    }[]
    
    const teamsData: TeamsData = []

    pairTeams.forEach(team => {
        const scores: { playedIn: string, score: number }[] = []
        let teamScoresSum = 0
        let oppTeamScoresSum = 0
        let wins = 0

        pairGames.forEach(game => {

            const gameTeam = game.teams.find(gameT => gameT.id === team.id)
            const gameOppTeam = game.teams.find(gameT => gameT.id !== team.id)
            
            let gameScores = (gameTeam && gameTeam.goals) ? gameTeam.goals: 0
            let gameOppScores =  (gameOppTeam && gameOppTeam.goals) ? gameOppTeam.goals: 0

            const teamScoreData = {score: 0, playedIn: ''}
            
            if (gameTeam && gameOppTeam) {
                let teamOvertimeScore = 0
                let oppTeamOvertimeScore = 0

                teamScoreData.score = gameTeam.goals ? gameTeam.goals : 0
                teamScoreData.playedIn = gameTeam.home ? 'H' : 'A'


                if (sportId === SPORTS.basketball.id) {
                    (game as BasketballGame).overtime.forEach(overtimeGame => {
                        const overtimeTeam = overtimeGame.teams.find(oTeam => oTeam.id === gameTeam.id)
                        const overtimeOppTeam = overtimeGame.teams.find(oTeam => oTeam.id == gameOppTeam.id)
    
                        
                        if (overtimeTeam && overtimeTeam.goals && overtimeOppTeam && overtimeOppTeam.goals) {
                            teamOvertimeScore += overtimeTeam.goals
                            oppTeamOvertimeScore += overtimeOppTeam.goals
                            
                            gameScores += teamOvertimeScore
                            gameOppScores += oppTeamOvertimeScore
                        }
                    })
                } else if (sportId === SPORTS.football.id) {
                    const footballGame = game as FootballGame

                    if (footballGame.extraTime) {
                        const extraTimeTeam = footballGame.extraTime.teams.find(oTeam => oTeam.id === gameTeam.id)
    
                        const extraTimeOppTeam = footballGame.extraTime.teams.find(oTeam => oTeam.id == gameOppTeam.id)

                        if (extraTimeTeam) {
                            scores.push({score: extraTimeTeam.goals, playedIn: 'extra'})

                            gameScores += extraTimeTeam.goals ? extraTimeTeam.goals : 0

                            gameOppScores += extraTimeOppTeam?.goals ? extraTimeOppTeam.goals : 0
                        }
                    }

                    if (footballGame.shootout) {
                        const shootoutTeam = footballGame.shootout.teams.find(oTeam => oTeam.id === gameTeam.id)
    
                        const shootoutOppTeam = footballGame.shootout.teams.find(oTeam => oTeam.id == gameOppTeam.id)

                        if (shootoutTeam) {
                            scores.push({score: shootoutTeam.goals, playedIn: 'p'})

                            gameScores += shootoutTeam.goals ? shootoutTeam.goals : 0

                            gameOppScores += shootoutOppTeam?.goals ? shootoutOppTeam.goals : 0
                        }
                    }
                }
            }



            teamScoresSum += gameScores
            oppTeamScoresSum += gameOppScores

            if (teamScoresSum > oppTeamScoresSum) {
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
    //     if (game.homeTeam.team === team1) {
    //         team1Data.score = game.homeTeam.goals
    //         team1Data.playedIn = 'H'

    //         team2Data.score = game.awayTeam.goals
    //         team2Data.playedIn = 'A'

    //         goals1Sum+=game.homeTeam.goals
    //         goals2Sum+=game.awayTeam.goals

    //         if ((game.overtime?.length > 0 ? game.overtime.every(overtimeGame => overtimeGame.played) : true) && game.played) {
    //             if ((game.homeTeam.goals + homeOvertimeGoals) > (game.awayTeam.goals + awayOvertimeGoals)) {
    //                 team1Won++
    //             } else if ((game.homeTeam.goals + homeOvertimeGoals) < (game.awayTeam.goals + awayOvertimeGoals)) {
    //                 team2Won++
    //             }
    //         }
    //     }
    //     if (game.awayTeam.team === team1) {
    //         team1Data.score = game.awayTeam.goals
    //         team1Data.playedIn = 'A'

    //         team2Data.score = game.homeTeam.goals
    //         team2Data.playedIn = 'H'

    //         goals1Sum+=game.awayTeam.goals
    //         goals2Sum+=game.homeTeam.goals

    //         if ((game.homeTeam.goals + homeOvertimeGoals) > (game.awayTeam.goals + awayOvertimeGoals)) {
    //             team2Won++
    //         } else if ((game.homeTeam.goals + homeOvertimeGoals) < (game.awayTeam.goals + awayOvertimeGoals)) {
    //             team1Won++
    //         }
    //     }

    //     scores1.push(team1Data)
    //     scores2.push(team2Data)

    //     if (game.overtime) {
    //         game.overtime.forEach(overtime => {
    //             const homeTeam = overtime.homeTeam
    //             const awayTeam = overtime.awayTeam
    //             const team1Goals = homeTeam.team === team1 ? homeTeam.goals : awayTeam.goals
    //             const team2Goals = awayTeam.team === team2 ? awayTeam.goals : homeTeam.goals
                
    //             goals1Sum+=team1Goals
    //             goals2Sum+=team2Goals
    //             scores1.push({score: team1Goals, playedIn: 'OT'})
    //             scores2.push({score: team2Goals, playedIn: 'OT'})
    //         })
    //     }
    // })

    // if (extraTime) {
    //     const homeTeam = extraTime.homeTeam
    //     const awayTeam = extraTime.awayTeam

    //     const team1Goals = homeTeam.team === team1 ? homeTeam.goals : awayTeam.goals
    //     const team2Goals = awayTeam.team === team2 ? awayTeam.goals : homeTeam.goals
        
    //     goals1Sum+=team1Goals
    //     goals2Sum+=team2Goals

    //     scores1.push({score: team1Goals, playedIn: 'extra'})
    //     scores2.push({score: team2Goals, playedIn: 'extra'})
    // }

    // if (shootout) {
    //     const homeTeam = shootout.homeTeam
    //     const awayTeam = shootout.awayTeam

    //     const team1Goals = homeTeam.team === team1 ? homeTeam.goals : awayTeam.goals
    //     const team2Goals = awayTeam.team === team2 ? awayTeam.goals : homeTeam.goals
        
    //     goals1Sum+=team1Goals
    //     goals2Sum+=team2Goals

    //     scores1.push({score: team1Goals, playedIn: 'p'})
    //     scores2.push({score: team2Goals, playedIn: 'p'})
    // }

    // const total1Score = bestOutOf ? team1Won : goals1Sum 
    // const total2Score = bestOutOf ? team2Won : goals2Sum 

    // const result = [
    //     {
    //         team: team1,
    //         scores: scores1,
    //         totalScore: total1Score,
    //         wins: team1Won
    //     },
    //     {
    //         team: team2,
    //         scores: scores2,
    //         totalScore: total2Score,
    //         wins: team2Won
    //     }
    // ]

    return teamsData
}


export default setPlayoffPairTeams