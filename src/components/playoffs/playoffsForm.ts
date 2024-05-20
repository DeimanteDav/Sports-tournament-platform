import { Container, SPORTS } from "../../config.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import PlayoffsPair from "../../classes/PlayoffsPair.js";
import FootballTeam from "../../classes/FootballTeam.js";
import accordion from "../accordion.js";
import FootballGame from "../../classes/FootballGame.js";
import BasketballGame from "../../classes/BasketballGame.js";
import setPlayoffPairTeams from "../../functions/playoffs/setPlayoffPairTeams.js";
import playoffsTable from "./playoffsTable.js";

function playoffsForm(container: Container, gamesData: { teamsAmount: number, roundsData: { [k: string]: {gamesAmount: number, knockouts: number, bestOutOf?: number }}}, playoffTeams: FootballTeam[] | BasketballTeam[], params: { leagueTableUpdated: boolean } = { leagueTableUpdated: false } ) {
    const {roundsData} = gamesData
    const {leagueTableUpdated} = params
    const sportId = localStorage.getItem('sport') && JSON.parse(localStorage.getItem('sport') || '').id

    const ClassGame = sportId === SPORTS.football.id ? FootballGame : BasketballGame

    const oldForm = document.querySelector('.playoffs-form')
    if (oldForm) {
        oldForm.remove()
    }

    const form = document.createElement('div')
    form.classList.add('playoffs-form')
    container.append(form)

    const sortedData = Object.fromEntries(
        Object.entries(roundsData)
            .sort(([key1], [key2]) => {
                const a = +key1.slice(-1)
                const b = +key2.slice(-1)

                if (a && b) {
                    return b - a
                } else if (!Number(a)) {
                    return 1
                } else {
                    return -1
                }
            })
    )

    const playoffsPairs: {
        [k: string]: PlayoffsPair[]
    } = localStorage.getItem('playoffs-pairs-data') ? JSON.parse(localStorage.getItem('playoffs-pairs-data') || '') : {}

    let pairId = 0
    let gameId = 0


    const roundsDataConverted = Object.entries(sortedData)
    roundsDataConverted.forEach(([round, data], index) => {
        const {gamesAmount, knockouts, bestOutOf} = data
        if (!playoffsPairs[round] || leagueTableUpdated) {
            playoffsPairs[round] = []

            const prevRoundGamesAmount = index > 0 && roundsDataConverted[index-1][1].gamesAmount
            
            const round1TeamPairs = []
            if (index === 0) {
                for (let i = 0; i < playoffTeams.length; i++) {
                    let modifiedTeams
                    let pair
                    if (i === 0) {
                        modifiedTeams = playoffTeams
                            pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                        } else {
                            modifiedTeams = playoffTeams.slice(i, -i)
                            if (modifiedTeams.length > 0) {
                                pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                            }
                        }
                    pair && round1TeamPairs.push(pair)
                }
            }
            for (let i = 0; i < gamesAmount; i++) {
                pairId+=1

                let prevId  =prevRoundGamesAmount && (pairId - prevRoundGamesAmount + i)

                const prevGamesIds = prevId ? [prevId, prevId + 1] : []

                const nextGameId = pairId + gamesAmount-(i+1) + Math.round((i+1)/2)
                const pairData = new PlayoffsPair(pairId, [], prevGamesIds, nextGameId)

                const teams = index === 0 && round1TeamPairs[i]

                if (!teams) {
                    return
                }

                if (knockouts) {
                    for (let leg = 1; leg <= knockouts; leg++) {
                        gameId +=1
                        let game
                        
                        if (index === 0) {
                            if (leg % 2 === 0) {
                                game = new ClassGame(gameId, leg, round, teams[1], teams[0], pairId)
                            } else {
                                game = new ClassGame(gameId, leg, round, teams[0], teams[1], pairId)
                            }
                        } else {
                            game = new ClassGame(gameId, leg, round, null, null, pairId)
                        }

                        pairData.games.push(game)
                    }
                } else if (bestOutOf) {
                    for (let leg = 1; leg <= bestOutOf*2-1; leg++) {
                        gameId +=1
                        let game

                        if (index === 0) {
                            if (leg % 2 === 0) {
                                game = new ClassGame(gameId, leg, round, teams[1], teams[0], pairId)
                            } else {
                                game = new ClassGame(gameId, leg, round, teams[0], teams[1], pairId)
                            }
                        } else {
                            game = new ClassGame(gameId, leg, round, null, null, pairId)
                        }
                        pairData.games.push(game)
                    }
                }
                playoffsPairs[round].push(pairData)

                pairData.teams = setPlayoffPairTeams(sportId, pairData.games)
            }
        }
        
        localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))

        
        let roundGames: FootballGame[] | BasketballGame[] = []
        playoffsPairs[round].forEach(round => {
            roundGames.push(...round.games)
        })
        
        const innerRounds = roundGames && [...new Set(roundGames.map(game => game.leg))] 
        console.log(roundGames);
        console.log(innerRounds);
        console.log(round);
        accordion(form, round, innerRounds, roundGames)

        // if (bestOutOf) {
        //     playoffsPairs[round].forEach((round, i) => {
        //         round.games.forEach((game, j) => {
        //             const roundAccordion = document.querySelector(`.panel button[data-round-nr="${game.roundNr}"]`)
        //             console.log(j+1, bestOutOf);
        //             if (j+1 > bestOutOf) {
        //                 console.log(roundAccordion.textContent, roundAccordion);
        //                 roundAccordion.textContent = 'If needed'
        //             } 
        //         })
        //     })
        // }
    })
    playoffsTable({container, sportId, roundsData: sortedData, playoffsPairs})

    
    // form.addEventListener('change', (e) => {

    //     const gameEl = e.target.parentElement.parentElement
    //     const pairId = +gameEl.dataset.pairId

    //     const currentRound = gameEl.dataset.round
    //     const roundNr = +gameEl.dataset.roundNr
    //     const overtimeId = +e.target.dataset.overtime

    //     const currentRoundInfo = roundsData[currentRound]
    //     const {gamesAmount, knockouts, bestOutOf} = currentRoundInfo
        
    //     const pairData = playoffsPairs[currentRound].find(pair => pair.id === pairId)
    //     const pairGames = pairData.games
    //     // const firstGame = [...pairGames].shift()
    //     const lastGame = [...pairGames].pop()

    //     const currentGame = pairGames.find(game => game.roundNr === roundNr)
    //     const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
       
    //     const nextPair = gamesAmount >= 2 && playoffsPairs[nextRound].find(pair => pair.id === pairData.nextId)
        
    //     const lastGameEl = document.querySelector(`.game[data-game-id="${lastGame.id}"][data-round="${currentRound}"]`)
    //     // const curretnGameEl = document.querySelector(`.game[data-game-id="${currentGame.id}"][data-round="${currentRound}"]`)

    //     const lastGameInputs = [...lastGameEl.querySelectorAll('.result-input')]

    //     // const currentGameGameInputs = [...curretnGameEl.querySelectorAll('.result-input')]
    //     const currentGameGameInputs = [...gameEl.querySelectorAll('.result-input')]
        
    //     const teamWrapper = e.target.parentElement
    //     const value = e.target.value ? +e.target.value : null

    //     if ([...e.target.classList].includes('extra-time')) {
    //         if ([...teamWrapper.classList].includes('home-team')) {
    //             lastGame.extraTime.homeTeam.goals = value
    //         } else {
    //             lastGame.extraTime.awayTeam.goals = value
    //         }
             
    //         if (lastGame.extraTime.awayTeam.goals && lastGame.extraTime.homeTeam.goals) {
    //             lastGame.extraTime.played = true
    //         } else {
    //             lastGame.extraTime.played = false
    //         }


    //         const extraTime = lastGame.extraTime
       
    //         if (extraTime.played && extraTime.homeTeam.goals === extraTime.awayTeam.goals && extraTime.homeTeam.goals !== null) {
    //             lastGame.shootout = new Game(sportId, extraTime.homeTeam, extraTime.awayTeam)

    //             lastGameInputs.forEach(input => {
    //                 const shootoutInput = document.createElement('input')
    //                 shootoutInput.classList.add('result-input', 'shootout')
    //                 const inputClasses = [...input.classList]
    //                 if (inputClasses.includes('extra-time')) {
    //                     input.after(shootoutInput)
    //                 }
    //             })
    //         } else {
    //             currentGame.shootout = null
    //             lastGameInputs.forEach(input => {
    //                 const inputClasses = [...input.classList]
    //                 if (inputClasses.includes('shootout')) {
    //                     input.remove()
    //                 }
    //             })
    //         }
    //     } else if ([...e.target.classList].includes('shootout')) {
    //         if ([...teamWrapper.classList].includes('home-team')) {
    //             lastGame.shootout.homeTeam.goals = value
    //         } else {
    //             lastGame.shootout.awayTeam.goals = value
    //         }
            
    //         if (lastGame.shootout.awayTeam.goals && lastGame.shootout.homeTeam.goals) {
    //             lastGame.shootout.played = true
    //         } else {
    //             lastGame.shootout.played = false
    //         }
    //     } else if (overtimeId) {
    //         const overtimeGame = currentGame.overtime.find(overtime => overtime.id === overtimeId)
    //         updateGameData(gameEl, overtimeGame, sportId, {overtime: true})
    
    //         const currentInputs = [...gameEl.querySelectorAll(`.result-input[data-overtime="${overtimeId}"]`)]

    //         if (overtimeGame.homeTeam.goals === overtimeGame.awayTeam.goals && overtimeGame.played) {
    //             const overtimeGame = new Game(sportId, currentGame.homeTeam, currentGame.awayTeam, currentGame.overtime.length+1)
    //             currentGame.overtime.push(overtimeGame)

    //             currentInputs.forEach(input => {
    //                 const overtimeInput = document.createElement('input')
    //                 overtimeInput.dataset.overtime = overtimeId+1
    //                 overtimeInput.classList.add('result-input', 'overtime')
    //                 input.after(overtimeInput)
    //             })
    //         } else {
    //             currentGame.overtime = currentGame.overtime.filter(overtime => {
    //                 return overtime.id <= overtimeId
    //             })

    //             currentGameGameInputs.forEach(input => {
    //                 if (+input.dataset.overtime > overtimeId) {
    //                     input.remove()
    //                 }
    //             })
    //         }
    //     }

    //     updateGameData(gameEl, currentGame, sportId)

    //     const playedOvertimes = sportId === SPORTS.basketball.id ? (
    //         pairGames.every(game => (
    //             game.overtime.length > 0 ? game.overtime.every(overtime => overtime.played) : true
    //         ))
    //     ) : true

    //     if (pairGames.every(game => game.played)
    //         &&
    //         (lastGame.extraTime ? lastGame.extraTime.played : true)
    //         &&
    //         (lastGame.shootout ? lastGame.shootout.played : true)
    //         && playedOvertimes) {
    //         pairData.playedAll = true
    //     } else {
    //         pairData.playedAll = false
    //     }



    //     pairData.teams = setTeams(pairGames, lastGame.extraTime, lastGame.shootout, {bestOutOf})

    //     if (sportId === SPORTS.football.id) {
    //         if (pairData.playedAll &&  pairData.teams[0].totalScore === pairData.teams[1].totalScore) {
    //             if (!currentGame.extraTime) {
    //                 currentGame.extraTime = new Game(sportId, currentGame.homeTeam, currentGame.awayTeam)

    //                 lastGameInputs.forEach(input => {
    //                     const extraTimeInput = document.createElement('input')
    //                     extraTimeInput.classList.add('result-input', 'extra-time')

    //                     input.after(extraTimeInput)
    //                 })
    //             }
    //         } else {
    //             currentGame.extraTime = null
    //             currentGame.shootout = null

    //             lastGameInputs.forEach(input => {
    //                 const inputClasses = [...input.classList]
    //                 if (inputClasses.includes('extra-time') || inputClasses.includes('shootout')) {
    //                     input.remove()
    //                 }
    //             })
    //         }
    //     } else if (sportId === SPORTS.basketball.id) {
    //         if (!overtimeId && bestOutOf) {
    //             if (currentGame.homeTeam.goals !== null && currentGame.homeTeam.goals === currentGame.awayTeam.goals && (currentGame.overtime?.length > 0 ? currentGame.overtime.every(overtimeGame => overtimeGame.homeTeam.goals === overtimeGame.awayTeam.goals) : true)) {
    //                 const overtimeGame = new Game(sportId, currentGame.homeTeam, currentGame.awayTeam, currentGame.overtime.length+1)
                    
    //                 currentGame.overtime.push(overtimeGame)
    //                 currentGameGameInputs.forEach(input => {
    //                     const overtimeInput = document.createElement('input')
    //                     overtimeInput.dataset.overtime = overtimeGame.id
    //                     overtimeInput.classList.add('result-input', 'overtime')
    //                     input.after(overtimeInput)
    //                 })
    //             } else {
    //                 currentGame.overtime = []
    //                 currentGameGameInputs.forEach(input => {
    //                     if (input.dataset.overtime) {
    //                         input.remove()
    //                     }
    //                 })
    //             }
    //         } else if (!bestOutOf && pairData.playedAll &&  pairData.teams[0].totalScore === pairData.teams[1].totalScore) {
    //             const overtimeGame = new Game(sportId, lastGame.homeTeam, lastGame.awayTeam, lastGame.overtime.length+1)
    //             lastGame.overtime.push(overtimeGame)

    //             lastGameInputs.forEach(input => {
    //                 const overtimeInput = document.createElement('input')
    //                 overtimeInput.dataset.overtime = overtimeGame.id
    //                 overtimeInput.classList.add('result-input', 'overtime')
    //                 input.after(overtimeInput)
    //             })
    //         }
    //     } else {
    //         lastGame.overtime = []
    //         lastGameInputs.forEach(input => {
    //             if (input.dataset.overtime) {
    //                 input.remove()
    //             }
    //         })
    //     }   

        
    //     if (pairGames.length > 0) {
    //         const otherGame = pairGames.find(game => game.roundNr === roundNr+1)

    //         const otherGameElement = document.querySelector(`.game[data-round-nr="${roundNr+1}"][data-pair-id="${pairId}"]`)

    //         const otherGameInputs = otherGameElement && [...otherGameElement.querySelectorAll('.result-input')]

    //         if (otherGameInputs) {
    //             if (!currentGame.played || (currentGame?.overtime.length > 0 ? currentGame.overtime.some(overtimeGame => !overtimeGame.played) : false)) {
    //                 otherGameInputs.forEach(input => {
    //                     input.value = ''
    //                     input.setAttribute('disabled', true)
    //                     otherGame.played = false
    //                     otherGame.homeTeam.goals = null
    //                     otherGame.awayTeam.goals = null
    //                     otherGame.overtime = []

    //                     const inputClasses = [...input.classList]
    //                     if (inputClasses.includes('extra-time') || inputClasses.includes('shootout') || input.dataset.overtime) {
    //                         input.remove()
    //                     }
    //                 })
    //                 pairGames.teams = setTeams(pairGames)
    
    //                 lastGame.extraTime = null
    //                 lastGame.shootout = null
    //                 lastGame.overtime = []
                    
    //                 updateGameData(lastGameEl, lastGame, sportId)
    //             } else if (currentGame.played && (currentGame.overtime.length > 0 ? currentGame.overtime.every(overtimeGame => overtimeGame.played) : true)) {
    //                 otherGameInputs.forEach(input => {
    //                     input.removeAttribute('disabled')
    //                 })
    //             }
    //         }
    //     }


    //     const team1 = pairData.teams[0]
    //     const team2 = pairData.teams[1]
        
    //     const otherPairData = playoffsPairs[currentRound].find(pair => pair.id === (pairId % 2 === 0 ? pairId - 1 : pairId + 1))

    //     const otherPairPlayed = otherPairData && otherPairData.playedAll
    //     const pairGamesPlayed = pairData.playedAll

    //     const nextPairElements = getNextGameElements(nextPair.id, nextRound)

    //     const playingAs = pairId % 2 !== 0 ? 'homeTeam' : 'awayTeam'
    //     const otherPlayer = pairId % 2 !== 0 ? 'awayTeam' : 'homeTeam'
    //     const teamClass = playingAs === 'homeTeam' ? 'home-team' : 'away-team'
    //     const otherClass = playingAs === 'homeTeam' ? 'away-team' : 'home-team'

        
    //     if (bestOutOf && (team1.wins >= bestOutOf || team2.wins >= bestOutOf)) {
    //         pairData.winner = team1.wins >= bestOutOf ? team1.team : team2.team
    //     } else if (knockouts && pairGamesPlayed) {
    //         if (team1.totalScore > team2.totalScore) {
    //             pairData.winner = team1.team
    //         } else if (team2.totalScore > team1.totalScore) {
    //             pairData.winner = team2.team
    //         }
    //     } else {
    //         pairData.winner = null
    //     }

    //     if (gamesAmount >= 2) {
    //         if (pairData.winner) {
    //             if (nextPair.games[0][playingAs].team !== pairData.winner) {
    //                 console.log('cia suveikiia');
    //                 nextPair.games.forEach((game, i) => {
    //                     const nextPairElement = nextPairElements[i]
    //                     const nextPairLabel1 = nextPairElement.querySelector(`.${teamClass} label`)
                        
    //                     const nextPairLabel2 = nextPairElement.querySelector(`.${otherClass} label`)
    
    //                     const inputs = [...nextPairElement.querySelectorAll('.result-input')]
    
    //                     inputs.forEach((input, i) => {
    //                         input.value = null
    
    //                         const inputClasses = [...input.classList]
    //                         if (inputClasses.includes('shootout') || inputClasses.includes('extra-time')) {
    //                             input.remove()
    //                         } 
    //                     })
    
    //                     if (i % 2 === 0) {
    //                         game[playingAs].team = pairData.winner
    //                         game[playingAs].goals = null
    //                         nextPairLabel1.textContent = pairData.winner
    //                     } else {
    //                         game[otherPlayer].team = pairData.winner
    //                         game[otherPlayer].goals = null
    //                         nextPairLabel2.textContent = pairData.winner
    //                     }
    //                     console.log(game, playingAs, otherPlayer, pairData.winner);
    //                     game.played = false
                        
    //                     if (sportId === SPORTS.football.id) {
    //                         game.extraTime = null
    //                         game.shootout = null
    //                     } else {
    //                         game.overtime = []
    //                     }
    //                 })
    //                 nextPair.teams = setTeams(nextPair.games)
    //             }
    //         } else if (!pairGamesPlayed || !otherPairPlayed) {
    //             console.log(!pairGamesPlayed, !otherPairPlayed);
    //             nextPair.games.forEach((game, i) => {
    //                 const nextPairElement = nextPairElements[i]
    //                 const nextPairLabel1 = nextPairElement.querySelector(`.${teamClass} label`)
                    
    //                 const nextPairLabel2 = nextPairElement.querySelector(`.${otherClass} label`)
    
    //                 const inputs = [...nextPairElement.querySelectorAll('.result-input')]
    
    //                 inputs.forEach(input => {
    //                     const inputClasses = [...input.classList]
    //                     input.value = null
    //                     input.setAttribute('disabled', true)
    //                     if (inputClasses.includes('shootout') || inputClasses.includes('extra-time') || input.dataset.overtime) {
    //                         input.remove()
    //                     } 
    //                 })

    //                 if (!pairGamesPlayed && !otherPairPlayed) {
    //                     game[playingAs].team = ''
    //                     game[playingAs].goals = null
    //                     nextPairLabel1.textContent = ''

    //                     game[otherPlayer].team = ''
    //                     game[otherPlayer].goals = null
    //                     nextPairLabel2.textContent = ''
    //                 } else if (!pairGamesPlayed) {
    //                     if (i % 2 === 0) {
    //                         game[playingAs].team = ''
    //                         game[playingAs].goals = null
    //                         nextPairLabel1.textContent = ''
    //                     } else {
    //                         game[otherPlayer].team = ''
    //                         game[otherPlayer].goals = null
    //                         nextPairLabel2.textContent = ''
    //                     }
    //                 }
    
    //                 if (sportId === SPORTS.football.id) {
    //                     game.extraTime = null
    //                     game.shootout = null
    //                 } else {
    //                     game.overtime = []
    //                 }
    //             })
    //             nextPair.teams = setTeams(nextPair.games)
    //         }
    //     }


    //     const nextPairInputs = nextPairElements?.length > 0 && nextPairElements[0].querySelectorAll('.result-input')
    //     if (nextPairInputs) {
    //         nextPairInputs.forEach(input => {
    //             if (nextPair.teams.every(team => team.team)) {
    //                 input.removeAttribute('disabled')
    //             } else {
    //                 input.setAttribute('disabled', true)
    //             }
    //         })
    //     }

        
    //     changePlayoffsTable(container, sortedData, playoffsPairs)
    //     localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))
    // })
}

export default playoffsForm

