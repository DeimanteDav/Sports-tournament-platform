import { Container, SPORTS } from "../../config.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import PlayoffsPair from "../../classes/PlayoffsPair.js";
import FootballTeam from "../../classes/FootballTeam.js";
import accordion from "../accordion.js";
import FootballGame from "../../classes/FootballGame.js";
import BasketballGame from "../../classes/BasketballGame.js";
import setPlayoffPairTeams from "../../functions/playoffs/setPlayoffPairTeams.js";
import playoffsTable from "./playoffsTable.js";
import updateGameData from "../../functions/updateGameData.js";
import Game from "../../classes/Game.js";
import overtimeGameHandler from "../../functions/overtimeGameHandler.js";

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
                    let modifiedTeams: any[]
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

                let prevId = prevRoundGamesAmount && (pairId - prevRoundGamesAmount + i)

                const prevGamesIds = prevId ? [prevId, prevId + 1] : []

                const nextGameId = pairId + gamesAmount-(i+1) + Math.round((i+1)/2)
                const pairData = new PlayoffsPair(pairId, [], prevGamesIds, nextGameId)

                const teams = index === 0 && round1TeamPairs[i]


                if (knockouts) {
                    for (let leg = 1; leg <= knockouts; leg++) {
                        gameId +=1
                        let game
                        
                        if (index === 0 && teams) {
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

                        if (index === 0 && teams) {
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

        accordion(form, round, innerRounds, roundGames)

        // if (bestOutOf) {
        //     playoffsPairs[round].forEach((round, i) => {
        //         round.games.forEach((game, j) => {
        //             const roundAccordion = document.querySelector(`.panel button[data-round-nr="${game.roundNr}"]`)
        
        //             if (j+1 > bestOutOf) {
        
        //                 roundAccordion.textContent = 'If needed'
        //             } 
        //         })
        //     })
        // }
    })
    playoffsTable({container, sportId, roundsData: sortedData, playoffsPairs})

    
    form.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        const gameEl = target.parentElement && target.parentElement.parentElement
        const gameWrapper = gameEl?.parentElement && gameEl.parentElement

        if (!gameEl || !gameWrapper) {
            console.error('171 error')
            return
        }

        const pairId = gameEl.dataset.pairId && +gameEl.dataset.pairId
        const currentRound = gameEl.dataset.round
        const gameId = gameEl.dataset.gameId && +gameEl.dataset.gameId
        const overtimeId = target.dataset.overtime && +target.dataset.overtime
        const extraTime = target.dataset.extraTime && JSON.parse(target.dataset.extraTime || '')
        const shootout = target.dataset.shootout && JSON.parse(target.dataset.shootout || '')
        

        const currentGameAllInputs = gameEl && [...gameEl.querySelectorAll<HTMLInputElement>('.result-input')]

    
        if (!pairId || !currentRound || !gameId || !currentGameAllInputs) {
            console.error('185 error', pairId, currentRound, gameId)
            return
        }

        const currentGameInputs = currentGameAllInputs?.filter(input => {
            if (!input.dataset.overtime && !input.dataset.extraTime && !input.dataset.shootout) {
                return input
            }
        })

        const currentRoundInfo = roundsData[currentRound]
        const {gamesAmount, knockouts, bestOutOf} = currentRoundInfo
        
        const pairData = playoffsPairs[currentRound].find(pair => pair.id === pairId)!
        const pairGames = pairData.games
        const currentGame = pairGames.find(game => game.id === gameId)

        const lastGame = pairGames.slice(-1)[0]

        
        const lastGameEl = document.querySelector(`.game[data-game-id="${lastGame.id}"][data-round="${currentRound}"]`)
        const lastGameInputs = lastGameEl && [...lastGameEl.querySelectorAll<HTMLInputElement>('.result-input')]
        
        if (!currentGame || !lastGameInputs) {
            throw new Error('new currentGame arba lastGAmeInputs')
        }

        const gameTeams = playoffTeams.filter(team => team.id === currentGame.teams[0].id || team.id === currentGame.teams[1].id)

        if (sportId === SPORTS.football.id) {
            const footballLastGame = lastGame as FootballGame

            if (extraTime) {
                const extraTimeInputs = currentGameAllInputs.filter(input => input.dataset.extraTime)

                const extraTimeGame = footballLastGame.extraTime!

                updateGameData(gameWrapper, extraTimeInputs, extraTimeGame, sportId)

                if (extraTimeGame.teams.every(team => extraTimeGame.teams[0].goals === team.goals) && extraTimeGame.played) {
                    const newGame = new Game(lastGame.id, lastGame.leg, lastGame.round, null, gameTeams[0], gameTeams[1])
                    
                    footballLastGame.shootout = newGame

                    const extraTimeInputs = lastGameInputs.filter(input => input.dataset.extraTime)

                    extraTimeInputs && extraTimeInputs.forEach((input, i) => {
                        const shootoutInput = document.createElement('input')
                        shootoutInput.classList.add('result-input')
                        shootoutInput.dataset.shootout = 'true'
                        shootoutInput.dataset.teamId = gameTeams[i].id.toString()

                        input.after(shootoutInput)
                    })
                } else {
                    lastGameInputs.forEach(input => {
                        if (input.dataset.shootout) {
                            input.remove()
                        }
                    })
                }
            } else if (shootout) {
                const shootoutInputs = currentGameAllInputs.filter(input => input.dataset.shootout)
                const shootoutGame = footballLastGame.shootout!

                updateGameData(gameWrapper, shootoutInputs, shootoutGame, sportId)
            }
        } 

        if (overtimeId && sportId === SPORTS.basketball.id) {
            overtimeGameHandler(currentGame, gameWrapper, gameEl, gameTeams, overtimeId, sportId)
        }

        updateGameData(gameWrapper, currentGameInputs, currentGame, sportId)

        pairData.teams = setPlayoffPairTeams(sportId, pairData.games)

        if (sportId === SPORTS.football.id && !extraTime && !shootout) {
            const footballLastGame = currentGame as FootballGame

            if (pairGames.every(game => game.playedAll) && pairData.teams[0].totalScore === pairData.teams[1].totalScore) {
                const newGame = new Game(lastGame.id, lastGame.leg, lastGame.round, null, gameTeams[0], gameTeams[1])
            
                footballLastGame.extraTime = newGame

                lastGameInputs.forEach((input, i) => {
                    const extraTimeInput = document.createElement('input')
                    extraTimeInput.classList.add('result-input')
                    extraTimeInput.dataset.extraTime = 'true'
                    extraTimeInput.dataset.teamId = gameTeams[i].id.toString()

                    input.after(extraTimeInput)
                })
            } else {
                footballLastGame.extraTime = null
                footballLastGame.shootout = null

                lastGameInputs.forEach(input => {
                    if (input.dataset.shootout || input.dataset.extraTime) {
                        input.remove()
                    }
                })
            }
        } 

        if (sportId === SPORTS.basketball.id && !overtimeId) {
            const basketballGame = currentGame as BasketballGame

            if (bestOutOf) {
                const equalGameGoals = basketballGame.teams.every(team => basketballGame.teams[0].goals === team.goals)

                if (equalGameGoals && basketballGame.playedAll) {
                    const overtimeGame = new Game(basketballGame.overtime.length+1, currentGame.leg, currentGame.round, null, gameTeams[0], gameTeams[1])

                    basketballGame.overtime.push(overtimeGame)
                    basketballGame.playedAll = false
                    gameWrapper.classList.remove('played')

                    currentGameAllInputs.forEach((input, i) => {
                        const overtimeInput = document.createElement('input')
                        overtimeInput.dataset.overtime = overtimeGame.id.toString()
                        overtimeInput.classList.add('result-input')
                        overtimeInput.dataset.teamId = pairData.teams[i].id?.toString()

                        input.after(overtimeInput)
                    })
                } else {
                    if (basketballGame.teams.every(team => team.goals)) {
                        basketballGame.playedAll = true
                        gameWrapper.classList.add('played')
                    }
                    basketballGame.overtime = []
                    currentGameAllInputs.forEach(input => {
                        if (input.dataset.overtime) {
                            input.remove()
                        }
                    })
                }
            } else if (knockouts) {
                const lastBasketballGame = lastGame as BasketballGame
                if (pairGames.every(game => game.playedAll) && pairData.teams[0].totalScore === pairData.teams[1].totalScore) {
                    const overtimeGame = new Game(lastBasketballGame.overtime.length+1, currentGame.leg, currentGame.round, null, gameTeams[0], gameTeams[1])

                    lastBasketballGame.overtime.push(overtimeGame)

                    lastGameInputs.forEach((input, i) => {
                        const overtimeInput = document.createElement('input')
                        overtimeInput.dataset.overtime = overtimeGame.id.toString()
                        overtimeInput.classList.add('result-input')
                        overtimeInput.dataset.teamId = pairData.teams[i].id?.toString()

                        input.after(overtimeInput)
                    })
                } else {
                    lastBasketballGame.overtime = []
                    lastGameInputs.forEach(input => {
                        if (input.dataset.overtime) {
                            input.remove()
                        }
                    })
                }
            }
        } 

        if (pairGames.length > 0) {
            for (let leg = 1; leg <= pairGames.length; leg++) {
                if (leg > currentGame.leg) {
                    const followingGame = pairGames.find(game => game.leg === leg)
                    const followingGameElement = document.querySelector(`.game[data-leg="${leg}"][data-pair-id="${pairId}"]`)
    
                    const followingGameInputs = followingGameElement && [...followingGameElement.querySelectorAll<HTMLInputElement>('.result-input')]

                    if (followingGameInputs && followingGame) {
                        if (!currentGame.playedAll) {
                            followingGameInputs.forEach(input => {
                                input.value = ''
                                input.setAttribute('disabled', 'true')

                                followingGame.played = false
                                followingGame.playedAll = false
        
                                followingGame.teams.forEach(team => {
                                    team.goals = null
                                });
        
                                if (sportId === SPORTS.football.id) {
                                    const followingFootballGame = followingGame as FootballGame
        
                                    followingFootballGame.shootout = null
                                    followingFootballGame.extraTime = null
                                } else if (sportId === SPORTS.basketball.id) {
                                    (followingGame as BasketballGame).overtime = []
                                }
        
                                if (input.dataset.extraTime || input.dataset.shootout || input.dataset.overtime) {
                                    input.remove()
                                }
                            })
        
                            pairData.teams = setPlayoffPairTeams(sportId, pairGames)
                        } else if (currentGame.playedAll) {
                            followingGameInputs.forEach(input => {
                                input.removeAttribute('disabled')
                            })
                        }
                    }
                }
            }
        }

        if (bestOutOf && pairData.teams.some(team => team.wins >= bestOutOf)) {
            pairData.winnerId = pairData.teams.reduce((prev, current) => {
                return (prev && prev.wins > current.wins) ? prev : current
            }).id

        } else if (knockouts && pairGames.every(game => game.playedAll)) {
            pairData.winnerId = pairData.teams.reduce((prev, current) => {
                return (prev && prev.totalScore > current.totalScore) ? prev : current
            }).id
        } else {
            pairData.winnerId = null
        }

        const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
        const nextPair = gamesAmount >= 2 && playoffsPairs[nextRound].find(pair => pair.id === pairData.nextId)

        const nextPairGameElements = [...document.querySelectorAll(`.game[data-pair-id="${pairData.nextId}"] `)]

        if (!nextPairGameElements) throw new Error('no next pair game els')
            
        if (gamesAmount >= 2 && nextPair) {
            
            nextPair.games.forEach((game, i) => {
                const nextPairElement = nextPairGameElements[i]
                const nextPairGameWraper = nextPairElement?.parentElement?.parentElement

                const nextPairInputs = [...nextPairElement.querySelectorAll<HTMLInputElement>('.result-input')]
                const nextPairLabel = [...nextPairElement.querySelectorAll<HTMLLabelElement>('label')]
                
                nextPairInputs.forEach((input, index) => {

                    if (pairData.winnerId) {
                        game.played = false
                        const winnningTeam = playoffTeams.find(team => team.id === pairData.winnerId)!
                        
                        const winnerData = {team: winnningTeam.team, id: winnningTeam.id}

                        const nextPairTeamExists = nextPair.teams.find(team => team.id === winnningTeam.id)

                        if (!nextPairTeamExists) {
                            if (input.dataset.overtime || input.dataset.extraTime || input.dataset.shootout) {
                                input.remove()
                            }

                            nextPairGameWraper?.classList.remove('played')
                            input.value = ''
                            game.played = false
                            game.playedAll = false

                            setNextPairElements(game.teams, pairId, i, nextPairLabel, winnerData)
                            
                        }
                    } else {
                        if (input.dataset.overtime || input.dataset.extraTime || input.dataset.shootout) {
                            input.remove()
                        }

                        nextPairGameWraper?.classList.remove('played')
                        input.value = ''
                        game.played = false
                        game.playedAll = false

                        setNextPairElements(game.teams, pairId, i, nextPairLabel)
                    }

                })
            })

            nextPair.teams = setPlayoffPairTeams(sportId, nextPair.games)

            nextPairGameElements.forEach((gameEl, i) => {
                const inputs = gameEl.querySelectorAll<HTMLInputElement>('.result-input')

                inputs.forEach(input => {
                    if (nextPair.teams.some(team => !team.id)) {
                        input.setAttribute('disabled', 'true')
                    } else if (i === 0) {
                        input.removeAttribute('disabled')
                    }
                })
            })
        }
        
        playoffsTable({container, sportId, roundsData: sortedData, playoffsPairs})
        localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))
    })
}

export default playoffsForm


function setNextPairElements(teams: {team: string, id: number | null, goals: number | null, home: boolean, away: boolean}[], pairId: number, index: number, label: HTMLLabelElement[], winnerData?: { team: string, id: number }) {
    const team1Index = pairId % 2 === 0 ? 1 : 0
    const team2Index = pairId % 2 === 0 ? 0 : 1


    if (index % 2 === 0) {
        label[team2Index].textContent = winnerData ? winnerData.team : ''
        teams[team2Index].team = winnerData ? winnerData.team : ''
        teams[team2Index].id = winnerData ? winnerData.id : null
        teams[team2Index].goals = null
    } else if (index % 2 !== 0) {

        label[team1Index].textContent = winnerData ? winnerData.team : ''
        teams[team1Index].team = winnerData ? winnerData.team : ''
        teams[team1Index].id = winnerData ? winnerData.id : null
        teams[team1Index].goals = null
    }

}