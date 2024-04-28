import Game from "../classes/Game.js"
import PlayoffsPair from "../classes/PlayoffsPair.js"
import accordion, { createGameWrappers } from "../components/accordion.js"
import updateGameData from "../functions/updateGameData.js"


// playoffs table komandos toliau numeruotus o ne is naujo

// Kai vienas zaidimas suzaistas atvaizduotu ta komanda ir kitos kuri laimes

// ANTRO zaidimo tarp komandu neleisti zaisti KOL pirmas nesuzaistas

// JEI DOUBLE ELIMINATION sukeisti awayTeam ir homeTeam antram zaidime IR ATSKIRTI KVADRATELIUS  


// JEIGU LYGIOSIOS (Prie antro zaidimo):
// extra time du inputai
// JEI VEL LYGIOS:
// penalty shootout


// prie zaidimo prideti: rato nr, roundo nr, poros numberis, zaidimo numeri.

// table atvaizduoti extra time; Penalty; BENDRas rezultatas

// class playoffPair, joje rungtynes ideti

// krepsinio tipai ETAPU:
    // vienos rungtynes (kaip futbole, kas laimi tas praena, jei lygios, tai overtime)
    // dvi rungtynes (kaip futbole, kas laimi tas praena, jei lygios PO DVIEJU, tai overtime)
    // Iki 2 pergaliu/3 pergaliu/4 pergaliu (kuri pirmiau iskovojo tiek pergaliu praeina, JEI PO ZAIDIMO LYGIOSIOS, TAI OVERTIME)
    

export default function playoffsForm(container, gamesData, playoffTeams, params = {}) {
    const {roundsData, teamsAmount} = gamesData
    const {leagueTableUpdated} = params
    const oldForm = document.querySelector('.playoffs-form')
    let form

    if (oldForm) {
        oldForm.innerHTML = ''
        form = oldForm
    } else {
        form = document.createElement('div')
        form.classList.add('playoffs-form')
        container.append(form)
    }

    const sortedData = Object.fromEntries(
        Object.entries(roundsData)
            .sort(([key1], [key2]) => {
                const a = +key1.slice(-1)
                const b = +key2.slice(-1)

                if (a && b) {
                    return Number(b[0]) - Number(a[0])
                } else if (!Number(a)) {
                    return 1
                } else {
                    return -1
                }
            })
    );

    const playoffsGames = localStorage.getItem('playoffs-games-data') ? JSON.parse(localStorage.getItem('playoffs-games-data')) : {}
    const playoffsPairs = localStorage.getItem('playoffs-pairs-data') ? JSON.parse(localStorage.getItem('playoffs-pairs-data')) : {}

    Object.entries(sortedData).forEach(([round, data], index) => {
        const {gamesAmount, knockouts} = data

        if (index === 0 && (!playoffsGames[round] || leagueTableUpdated)) {
            const round1TeamPairs = []
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

            let gameId = 0
            for (let i = 0; i < gamesAmount; i++) {
                let teams = round1TeamPairs[i]
                let game

                for (let j = 1; j <= knockouts; j++) {
                    if (!playoffsGames[round]) {
                        playoffsGames[round] = []
                    }

                    gameId+=1
                    const roundNr = j
                    const pairId = i+1

                    if ((j % 2) === 0) {
                        game = new Game(teams[0], teams[1], gameId, pairId, roundNr, round)
                    } else {
                        game = new Game(teams[1], teams[0], gameId, pairId, roundNr, round)
                    }
                    
                    playoffsGames[round].push(game)
                }

            }

            for (let i = 1; i <= gamesAmount; i++) {
                const games = playoffsGames[round].filter(game => game.pairId === i)
                if (!playoffsPairs[round]) {
                    playoffsPairs[round] = []
                }

                const playoffsPair = new PlayoffsPair(i, games)
                playoffsPair.teams = setTeams(games)
                playoffsPairs[round].push(playoffsPair)

            }

            localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))
            localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
        }
        console.log(playoffsPairs);

        // if (index !== 0 && leagueTableUpdated) {
        //     delete playoffsGames[round]
        //     localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
        // }

        const roundGames = playoffsGames[round]
        const innerRounds = roundGames && [...new Set(roundGames.map(game => game.roundNr))] 

        accordion(form, roundGames, innerRounds, round)
    })

    changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)

    form.addEventListener('change', (e) => {
        const gameEl = e.target.parentElement.parentElement
        const pairId = +gameEl.dataset.pairId
        const gameId = +gameEl.dataset.gameId
        const gameExtra = gameEl.dataset.extraTime ? true : null

        const currentRound = gameEl.dataset.round
        const roundGames = playoffsGames[currentRound]
        const roundNr = +gameEl.dataset.roundNr

        const currentRoundInfo = roundsData[currentRound]
        const {gamesAmount, knockouts} = currentRoundInfo


        const pairData = playoffsPairs[currentRound].find(games => games.id === pairId)
        const pairGames = pairData.games
        
        const totalGames = gamesAmount*knockouts
        

        const currentGame = !gameExtra ? pairGames.find(game => {
            if (game.id === gameId && game.extraTime === gameExtra) {
                return game
            }
        }) : pairData.extraTime

        playoffsGames[currentRound] = roundGames.map(game => {
            if (game.id === gameId && game.extraTime === gameExtra) {
                game = currentGame
            }
            return game
        })

        updateGameData(gameEl, currentGame)


        const firstGame = [...pairGames].shift()
        const lastGame = [...pairGames].pop()
        const lastGameId = lastGame.id
        const secondGameChanged = knockouts > 1 ? lastGameId === gameId : true

        const pairGamesPlayed = pairGames.every(game => game.played)

        const lastGameElement = form.querySelector(`[data-game-id="${lastGameId}"][data-round="${currentRound}"]`)
        const lastGameWrapper = lastGameElement && lastGameElement.parentElement

        const lastGameInputs = lastGameElement && lastGameElement.querySelectorAll('.result-input')

        if (secondGameChanged && !pairData.extraTime && pairGamesPlayed && !currentGame.extraTime) {
            if (!lastGame.winner) {
                const extraTimeGame = new Game(lastGame.awayTeam, lastGame.homeTeam, gameId, pairId, roundNr, currentRound)
                extraTimeGame.extraTime = true
                playoffsGames[currentRound].push(extraTimeGame)

                pairData.extraTime = extraTimeGame
                pairData.teams = setTeams(pairGames, extraTimeGame)

                lastGameWrapper.innerHTML = ''
                const newLastGameWrapper = [...createGameWrappers(lastGame, currentRound, extraTimeGame).children]

                newLastGameWrapper.forEach(child => {
                    lastGameWrapper.append(child)
                })
            }
        }
        if ((!firstGame.played || !lastGame.played || lastGame.winner) && pairData.extraTime && !currentGame.extraTime) {
            pairData.extraTime = null
            playoffsGames[currentRound] = roundGames.filter(game => {
                if (game.extraTime) {
                    if (game.id !== lastGameId) {
                        return game
                    }
                } else {
                    return game
                }
            })

            const extraTimeGameEl = lastGameWrapper.querySelector(`.game[data-extra-time="${true}"]`)
            extraTimeGameEl.remove()
        }

        if (!firstGame.played && knockouts > 1 && !currentGame.extraTime) {
            lastGameInputs.forEach(input => input.setAttribute('disabled', true))
        } else if (firstGame.played) {
            lastGameInputs.forEach(input => input.removeAttribute('disabled'))
        }

        pairData.teams = setTeams(pairGames, pairData.extraTime)

        const allGames = pairData.extraTime ? [...pairGames, pairData.extraTime] : pairGames

        const nextRound =  gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
        const nextRoundGamesAmount = roundsData[nextRound].gamesAmount
        const nextRoundKnockouts = roundsData[nextRound].knockouts
        const nextRoundTotalGames = nextRoundGamesAmount*nextRoundKnockouts

        const nextGameId = totalGames+Math.round(pairId/2)
        const nextPairId = Math.ceil(nextGameId/2)
      
        let nextGames = playoffsGames[nextRound] && playoffsGames[nextRound].filter(game => game.pairId === nextPairId)

        const nextGameWrapper = document.querySelector(`[dataset]`)

        if (allGames.every(game => game.played)) {
            const winner = pairData.teams[0].score > pairData.teams[1].score ? pairData.teams[0] : pairData.teams[1]
            
            if (!playoffsGames[nextRound]) {
                playoffsGames[nextRound] = []
            }
            if (!nextGames || nextGames.length === 0) {
                nextGames = []
                for (let i = 0; i < nextRoundKnockouts; i++) {

                    const nextGamesData = [nextGameId, nextPairId-i, i+1, nextRound]
                    if (pairId % 2 === 0) {
                        if (i === 0) {
                            nextGames.push(new Game(null, winner, ...nextGamesData))
                        } else {
                            nextGames.push(new Game(winner, null, ...nextGamesData))
                        }
                    } else {
                        if (i === 0) {
                            nextGames.push(new Game(winner, null, ...nextGamesData))
                        } else {
                            nextGames.push(new Game(null, winner, ...nextGamesData))
                        }
                    }
                }


                playoffsGames[nextRound].push(...nextGames)
                const nextPlayoffsPair = new PlayoffsPair(nextPairId, nextGames)
                nextPlayoffsPair.teams = setTeams(nextGames)

                if (!playoffsPairs[nextRound]) {
                    playoffsPairs[nextRound] = []
                }
                playoffsPairs[nextRound].push(nextPlayoffsPair)
            } else {
                playoffsGames[nextRound].map((game, i) => {
                    if (game.pairId === nextPairId && !game.extraTime) {
                        if (pairId % 2 === 0) {
                            if (i === 0 && game.awayTeam.team !== winner.team) {
                                game.awayTeam.team = winner.team
                                game.awayTeam.goals = 0
                                game.played = false
                                game.winner = null
                            } else if (i === 1 && game.homeTeam.team !== winner.team) {
                                game.homeTeam.team = winner.team
                                game.homeTeam.goals = 0
                                game.played = false
                                game.winner = null
                            }
                        } else if (pairId % 2 !== 0 && i === 0 && game.homeTeam.team !== winner.team) {
                            if (i === 0 && game.homeTeam.team !== winner.team) {
                                game.homeTeam.team = winner.team
                                game.homeTeam.goals = 0
                                game.played = false
                                game.winner = null
                            } else if (i === 1 && game.awayTeam.team !== winner.team) {
                                game.awayTeam.team = winner.team
                                game.awayTeam.goals = 0
                                game.played = false
                                game.winner = null
                            }
                        }

                        return game
                    }
                    return game
                })

                const nextGameWrapper = form.querySelector(`[data-pair-id="${nextPairId}"][data-round="${nextRound}"]`)
                nextGameWrapper.innerHTML = ''
                const nextPairData = playoffsPairs[nextRound].find(pair => pair.id === nextPairId)

                const nextGameWrapperUpdated = [...createGameWrappers(nextPairData.games, nextRound, nextPairData.extraTime).children]

                nextGameWrapperUpdated.forEach(child => {
                    lastGameWrapper.append(child)
                })
            }
        }

        // let currentGame
        // if (roundNr === 'extra-time') {
        //     currentGame = roundGames.find(game => game.pairId === pairId && game.roundNr === 'extra-time')
        // } else {
        //     const gameId = +gameEl.dataset.gameId
        //     currentGame = roundGames.find(game => game.id === gameId)
        // }


        // const pairGames = pairId && roundGames.filter(game => game.pairId === pairId && game.roundNr !== 'extra-time')

        // const pairGamesPlayed = pairGames && pairGames.every(game => game.played)
        
        // let changed = false
        // let game = currentGame

        // const extraTimeGame = roundGames.find(game => game.pairId === pairId && game.roundNr === 'extra-time')


        // if (pairGames.length > 1 && roundNr !== 'extra-time') {
        //     const secondGame = pairGames.reduce((acc, curr) => acc.id > curr.id ? acc : curr)

        //     if (pairGamesPlayed) {
        //         game = secondGame 
        //     }

        //     const firstGame = pairGames.reduce((acc, curr) => acc.id < curr.id ? acc : curr)

        //     const secondGameElement = document.querySelector(`.game[data-pair-id="${pairId}"][data-game-id="${firstGame.id+1}"]`)

        //     const inputs = [...secondGameElement.querySelectorAll('.result-input')]

        //     inputs.forEach(input => {
        //         if (firstGame.played) {
        //             input.removeAttribute('disabled')
        //         } else {
        //             input.setAttribute('disabled', true)
        //             input.value = ''
        //             playoffsGames[currentRound][secondGame.id-1].homeTeam.goals = 0
        //             playoffsGames[currentRound][secondGame.id-1].awayTeam.goals = 0
        //             playoffsGames[currentRound][secondGame.id-1].played = false
        //             playoffsGames[currentRound][secondGame.id-1].winner = null
        //         }
        //     })
        // }
    
        // if ((pairGamesPlayed || (!pairId && currentGame.played)) && !extraTimeGame) {
        //     if (!game.winner) {
        //         const extraTimeGame = new Game(game.homeTeam, game.awayTeam, null, game.pairId, 'extra-time', currentRound)
        //         roundGames.push(extraTimeGame)
        //         game = extraTimeGame

        //         changed = true

        //         if (!playoffsPairs)
        //         console.log(playoffsPairs[currentRound], currentRound);
        //         const pairData = playoffsPairs[currentRound].find(pairData => pairData.id === game.pairId)
        //         pairData.games.push(extraTimeGame)
        //     }
        // } 

        // if ((currentGame.winner || !currentGame.played) && game.roundNr !== 'extra-time') {
        //     const filteredRoundGames = roundGames.filter(game => {
        //         if (game.roundNr === 'extra-time') {
        //             return game.pairId !== pairId
        //         }

        //         return game
        //     })

        //     if (filteredRoundGames.length !== roundGames.length) {
        //         playoffsGames[currentRound] = filteredRoundGames
        //         changed = true
        //     }
        // }


        // const nextRound =  gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
        // const nextRoundTotalGames = roundsData[nextRound].gamesAmount*roundsData[nextRound].knockouts

        // let nextGameId
        // if (game.id) {
        //     nextGameId = game.id+nextRoundTotalGames+(totalGames-game.id)-1
        //     if (game.id % 2 == 0) {
        //         nextGameId-=1
        //     }
        // } else {
        //     nextGameId = (pairId*2)+nextRoundTotalGames+(totalGames-(pairId*2))

        // }

        // const pairGames1 = playoffsGames[currentRound].filter(game => {
        //     if (pairId % 2 === 0) {
        //         if (game.pairId === pairId -1) {
        //             return game
        //         }
        //     } else {
        //         if (game.pairId === pairId) {
        //             return game
        //         } 
        //     }
        // })

        // const pairgames1Played = pairGames1.every(game => game.played)

        // const pairGames2 = playoffsGames[currentRound].filter(game => {
        //     if (pairId % 2 === 0) {
        //         if (game.pairId === pairId) {
        //             return game
        //         }
        //     } else {
        //         if (game.pairId === pairId+1) {
        //             return game
        //         } 
        //     }
        // })

        // const pairgames2Played = pairGames2.every(game => game.played)

        // if (extraTimeGame?.winner || (!extraTimeGame && pairGamesPlayed)) {
        //     if (!playoffsGames[nextRound]) {
        //         playoffsGames[nextRound] = []
        //     }
        //     const nextRoundNr = Math.ceil(nextGameId / 5)
        //     const winner = playoffTeams.find(team => team.team === game.winner)
            
        //     if (!playoffsGames[nextRound].some(game => game.id === nextGameId)) {
        //         const nextPairId = Math.ceil(nextGameId/2)

        //         let nextGame
        //         if (pairId % 2 === 0) {
        //             nextGame = new Game(null, winner, nextGameId, nextPairId, nextRoundNr)
        //         } else {
        //             nextGame = new Game(winner, null, nextGameId, nextPairId, nextRoundNr)
        //         }
        //         console.log(winner);
        //         if (!playoffsPairs[nextRound]) {
        //             playoffsPairs[nextRound] = []
        //         }
        //         const nextPairData = playoffsPairs[nextRound].find(pairData => pairData.id === nextPairId)

        //         playoffsGames[nextRound].push(nextGame)

        //         // if (!nextPairData) {
        //         //     playoffsPairs[nextRound].push(new PlayoffsPair(nextPairId, [nextGame]))
        //         // } else {
        //         //     nextPairData.games.push(nextGame)
        //         // }
                
        //     } else {
        //         const nextGameIndex = playoffsGames[nextRound].findIndex(game => game.id === nextGameId)
        //         if (pairId % 2 === 0) {
        //             if (playoffsGames[nextRound][nextGameIndex].awayTeam.team !== winner.team) {
        //                 playoffsGames[nextRound][nextGameIndex].awayTeam.team = winner.team
        //                 playoffsGames[nextRound][nextGameIndex].winner = null
        //                 playoffsGames[nextRound][nextGameIndex].played = false
        //             }
        //         } else {
        //             if (playoffsGames[nextRound][nextGameIndex].homeTeam.team !== winner.team) {
        //                 playoffsGames[nextRound][nextGameIndex].homeTeam.team = winner.team
        //                 playoffsGames[nextRound][nextGameIndex].winner = null
        //                 playoffsGames[nextRound][nextGameIndex].played = false
        //             }
        //         }
        //     }


        // } else if ((!pairgames1Played && !pairgames2Played)) {
        //     if (playoffsGames[nextRound]) {
        //         if (playoffsGames[nextRound].some(game => game.id === nextGameId)) {
        //             playoffsGames[nextRound] = playoffsGames[nextRound].filter(game => game.id !== nextGameId) 
        //         }
        //     }
        // } else if (!currentGame.played) {
        //     const nextGameIndex = playoffsGames[nextRound].findIndex(game => game.id === nextGameId)
            
        //     if (pairId % 2 === 0) {
        //             playoffsGames[nextRound][nextGameIndex].awayTeam.team = ''
        //     } else {
        //         playoffsGames[nextRound][nextGameIndex].homeTeam.team = ''
        //     }
        //     playoffsGames[nextRound][nextGameIndex].winner = null
        //     playoffsGames[nextRound][nextGameIndex].played = false
        // }


        // if (changed) {
        //     form.innerHTML = ''
        //     Object.entries(sortedData).forEach(([round]) => {
        //         const roundGames = playoffsGames[round]
        //         const innerRounds = roundGames && [...new Set(roundGames.map(game => game.roundNr))] 
        
    
        //         accordion(form, roundGames, innerRounds, round)
        //     })
        // }
        localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))
        localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

        changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)


    //     const currentKnockout = gameEl.dataset.knockoutIndex

    //     const currentRound = gameWrapper.dataset.round
    //     const currentGameId = +gameWrapper.dataset.gameId

    //     const currentRoundInfo = roundsData[currentRound]
    //     const {gamesAmount, knockouts} = currentRoundInfo

    //     const currentRoundData = playoffsGames[currentRound]
    //     const currentGamesData = currentRoundData[currentGameId]
    //     const currentGameData = currentGamesData[currentKnockout-1]


    //     if (currentGamesData.length > 1) {
    //         const secondGame = [...gameWrapper.children][1]
    //         const inputs = [...secondGame.querySelectorAll('input.result-input')]

    //         inputs.forEach(input => {
    //             if (currentGamesData[0].played) {
    //                 input.removeAttribute('disabled')
    //             } else {
    //                 input.setAttribute('disabled', true)
    //                 input.value = ''
    //                 currentGamesData[1].homeTeam.goals = 0
    //                 currentGamesData[1].awayTeam.goals = 0
    //                 currentGamesData[1].played = false
    //             }
    //         })
    //     }
    //     if (gamesAmount > 1) {
            // const nextRound =  gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
    //         const nextGameId = currentGameId % 2 === 0 ? currentGameId/2 : (currentGameId+1)/2
    //         const nextGames = playoffsGames[nextRound] && playoffsGames[nextRound][nextGameId]

    //         const nextRoundInfo = nextRound && roundsData[nextRound]
    //         const nextRoundGamesAmount = nextRoundInfo && nextRoundInfo.gamesAmount

    //         const nextRoundWrapper = document.querySelector(`.round[data-round="${nextRound}"]`)
    //         const nextGameWrapper = document.querySelector(`[data-round="${nextRound}"][data-game-id="${nextGameId}"]`)

    //         const game1 = currentGameId % 2 === 0 ? currentRoundData[currentGameId-1] : currentRoundData[currentGameId]

    //         const game2 = currentGameId % 2 === 0 ? currentRoundData[currentGameId] : currentRoundData[currentGameId-1]

            
            
    //         const allPairGamesPlayed = (game1 && game2) && [...game1, ...game2].every(game => game.played)
    //         if (allPairGamesPlayed) {
    //             const winner1 = getGamesWinner(playoffTeams, game1)
    //             const winner2 = getGamesWinner(playoffTeams, game2)
    //             const {gamesAmount, knockouts} = nextRoundInfo

    //             const teamsChanged = nextGames && !nextGames.every(team => (
    //                 (team.homeTeam.team === winner1.team || team.awayTeam.team === winner1.team)
    //                 &&
    //                 (team.homeTeam.team === winner2.team || team.awayTeam.team === winner2.team)
    //             ))

    //             if (!nextGames || teamsChanged) {
    //                 let games = []
    //                 for (let j = 0; j < knockouts; j++) {
    //                     if (!playoffsGames[nextRound]) {
    //                         playoffsGames[nextRound] = {}
    //                     }
    //                     let game
    //                     if ((j % 2) === 0) {
    //                         game = new Game(winner1, winner2)
    //                     } else {
    //                         game = new Game(winner2, winner1)
    //                     }
    //                     games.push(game)
    //                     playoffsGames[nextRound][nextGameId] = games
    //                 }

    //                 let newGameWrapper
    //                 if (teamsChanged) {
    //                     nextGameWrapper.innerHTML = ''
    //                     newGameWrapper = nextGameWrapper
                        
    //                     for (let i = 0; i < nextRoundGamesAmount; i++) {
    //                         const otherRound =  nextRoundGamesAmount === 2 ? 'final' : `1/${nextRoundGamesAmount/2}`
    //                         const otherGameId = nextGameId % 2 === 0 ? nextGameId/2 : (nextGameId+1)/2
                            
    //                         if (playoffsGames[otherRound] && playoffsGames[otherGameId]) {
    //                             const otherGameWrapper = document.querySelector(`[data-round="${otherRound}"][data-game-id="${otherGameId}"]`)

    //                             delete playoffsGames[otherRound][otherGameId]

    //                             otherGameWrapper && otherGameWrapper.remove()
    //                         } 
    //                     }
    //                 } else {
    //                     newGameWrapper = document.createElement('div')
    //                     newGameWrapper.classList.add('game-wrapper')
    //                     newGameWrapper.dataset.round = nextRound
    //                     newGameWrapper.dataset.gameId = nextGameId
    //                     nextRoundWrapper.append(newGameWrapper)
    //                 }
    //                 createGameElement(newGameWrapper, games)
    //             }
    //         } else if (nextGames) {
    //             delete playoffsGames[nextRound][nextGameId]
    //             nextGameWrapper.remove()

    //             for (let i = 0; i < nextRoundGamesAmount; i++) {
    //                 const otherRound =  nextRoundGamesAmount === 2 ? 'final' : `1/${nextRoundGamesAmount/2}`
    //                 const otherGameId = nextGameId % 2 === 0 ? nextGameId/2 : (nextGameId+1)/2

    //                 if (playoffsGames[otherRound] && playoffsGames[otherRound][otherGameId]) {
    //                     const otherGameWrapper = document.querySelector(`[data-round="${otherRound}"][data-game-id="${otherGameId}"]`)

    //                     delete playoffsGames[otherRound][otherGameId]
    //                     otherGameWrapper && otherGameWrapper.remove()
    //                 } 
    //             }
    //         }

            // localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

    //     }


        // changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)

    //     localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))        
    })
}

function setTeams(games, extraTime) {
    const team1  = games[0].homeTeam.team
    const team2  = games[0].awayTeam.team
    let goals1Sum = 0
    let goals2Sum = 0
    games.forEach(game => {
        if (game.homeTeam.team === team1) {
            goals1Sum+=game.homeTeam.goals
            goals2Sum+=game.awayTeam.goals
        }
        if (game.awayTeam.team === team1) {
            goals1Sum+=game.awayTeam.goals
            goals2Sum+=game.homeTeam.goals
        }
    })

    if (extraTime) {
        const homeTeam = extraTime.homeTeam
        const awayTeam = extraTime.homeTeam
        const team1Goals = homeTeam.team === team1 ? homeTeam.goals : awayTeam.goals
        const team2Goals = homeTeam.team === team2 ? homeTeam.goals : awayTeam.goals

        goals1Sum+=team1Goals
        goals2Sum+=team2Goals
    }

    return (
        [
           {
               team: team1,
               score: goals1Sum,
           },
           {
               team: team2,
               score: goals2Sum
           }
       ]
    )
}


// function createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundData, allTeams, params = {}) {
//     const {teamsChanged, update} = params
//     const {gamesAmount, knockouts} = roundData

//     const round = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`
//     const prevRound = `1/${gamesAmount*2}`
//     const gameIndex = +gameWrapper.dataset.gameIndex

//     let currentRoundGames = playoffsGames[round]
//     const currentGames = currentRoundGames && currentRoundGames[gameIndex]

//     if (!roundsData[prevRound] && (!currentGames || teamsChanged)) {
//         const round1TeamPairs = []

//         for (let i = 0; i < allTeams.length; i++) {
//             let modifiedTeams
//             let pair
//             if (i === 0) {
//                 modifiedTeams = allTeams
//                     pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
//                 } else {
//                     modifiedTeams = allTeams.slice(i, -i)
//                     if (modifiedTeams.length > 0) {
//                         pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
//                     }
//                 }
//             pair && round1TeamPairs.push(pair)
//         }

//         let  teams = round1TeamPairs[gameIndex-1]
//         let games = []
//         for (let i = 0; i < knockouts; i++) {
//             if (!playoffsGames[round]) {
//                 playoffsGames[round] = {}
//             }
//             games.push(new Game(teams[0], teams[1]))
//             playoffsGames[round][gameIndex] = games
//         }

//         localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

//         playoffsGames[round][gameIndex].forEach((game, i) => {
//             createGameElement(gameWrapper, game, i)
//         })
//     } 

//     if (!update && !teamsChanged && currentGames) {
//         currentGames.forEach((game, i) => {
//             createGameElement(gameWrapper, game, i)
//         })
//     }


//     if (currentGames && (update || teamsChanged)) {
//         const currentRoundGames = playoffsGames[round]

//         const games1 = gameIndex-1 % 2 === 0 ? currentRoundGames[gameIndex] : currentRoundGames[gameIndex - 1]
//         const games2 = gameIndex-1 % 2 === 0 ? currentRoundGames[gameIndex+1] : currentRoundGames[gameIndex]

//         const allGamesPlayed = [...games1, ...games2].every(game => game.played)

//         if (allGamesPlayed) {
//             const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
//             const nextRoundGameIndex = Math.round(gameIndex/2)

//             const winnerGame1 = getRoundWinner(allTeams, games1)
//             const winnerGame2 = getRoundWinner(allTeams, games2)

//             const nextRoundGames = playoffsGames[nextRound] && playoffsGames[nextRound][nextRoundGameIndex]


//             const changedTeams = nextRoundGames && !nextRoundGames.some(game => (
//                 (game.homeTeam.team === winnerGame1.team || game.awayTeam.team === winnerGame1.team)
//                 &&
//                 (game.homeTeam.team === winnerGame2.team || game.awayTeam.team === winnerGame2.team)
//             ))

//             const nextRoundWrapper = document.querySelector(
//               `.game-wrapper[data-round="${nextRound}"][data-game-index="${nextRoundGameIndex}"]`
//             );

//             if (allGamesPlayed) {
//                 if (!(playoffsGames[nextRound] && playoffsGames[nextRound][nextRoundGameIndex]) || changedTeams) {
//                     let games = []
                    
//                     for (let i = 0; i < roundsData[nextRound].knockouts; i++) {
//                         if (!playoffsGames[nextRound]) {
//                             playoffsGames[nextRound] = {}
//                         }
//                         games.push(new Game(winnerGame1, winnerGame2))
                
//                         playoffsGames[nextRound][nextRoundGameIndex] = games
                
//                     }

//                     localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

//                     nextRoundWrapper.innerHTML = ''
//                     playoffsGames[nextRound][nextRoundGameIndex].forEach((game, i) => {
//                         createGameElement(nextRoundWrapper,game, i)
//                     })
//                 }
//             }
//         }
        
//     }


// }

function getGamesWinner(allTeams, games) {
    console.log(allTeams, games);
    const alwaysWon = games.every(game => game.winner === games[0].winner)

    if (alwaysWon) {
        return allTeams.find(team => team.team === games[0].winner)
    } 

    let team1GoalsSum = 0
    let team2GoalsSum = 0
    
    let team1 = games[0].homeTeam.team
    let team2 = games[0].awayTeam.team
    games.forEach(game => {
        let team1Goals
        let team2Goals

        if (game.awayTeam.team === team1) {
            team1Goals = +game.awayTeam.goals
            team2Goals = +game.awayTeam.goals
        } else {
            team1Goals = +game.homeTeam.goals
            team2Goals = +game.homeTeam.goals
        } 
        
        team1GoalsSum+=team1Goals
        team2GoalsSum+=team2Goals
    })
    let winner

    if (team1GoalsSum > team2GoalsSum) {
        winner = allTeams.find(team => team.team === team1)
    } else {
        winner = allTeams.find(team => team.team ===  team2)
    }

    return winner
}



// function createGameElement(gameWrapper, games) {
//     for (let i = 0; i < games.length; i++) {
        // const gameEl = document.createElement('div')
        // gameEl.classList.add('game')
        // gameWrapper.append(gameEl)
        
//         const game = games[i]

//         for (let team in game) {
//             if (team === 'homeTeam' || team === 'awayTeam') {
//                 const teamWrapper = document.createElement('div')
//                 teamWrapper.classList.add('team')
//                 const label = document.createElement('label')
//                 const input = document.createElement('input')               
//                 input.type = 'number'
//                 input.classList.add('result-input')
    
//                 if (team === 'homeTeam') {
//                     teamWrapper.classList.add('home-team')
//                 } else {
//                     teamWrapper.classList.add('away-team')
//                 }
//                 input.dataset.team = game[team].team
//                 label.htmlFor = input.id
//                 label.textContent = game[team].team
                
                
//                 if (i === 1 && !games[0].played) {
//                     input.setAttribute('disabled', true)
//                 }

//                 input.value = game.played ? game[team].goals : ''
//                 teamWrapper.append(label, input)
//                 gameEl.append(teamWrapper) 
//             }
//         }
//     }
// }

function changePlayoffsTable(container, roundsData, playoffsGames) {
    const oldTableWrapper = document.querySelector('.playoffs-table')
    let tableWrapper

    if (oldTableWrapper) {
        oldTableWrapper.innerHTML = ''
        tableWrapper = oldTableWrapper
    } else {
        tableWrapper = document.createElement('div')
        tableWrapper.classList.add('playoffs-table')
        container.append(tableWrapper)
    }

    const headerEl = document.createElement('ul')
    headerEl.classList.add('playoffs-header')
    const table = document.createElement('div')
    table.classList.add('playoffs-games')

    let colsAmount = Object.keys(roundsData).length
    let rowsAmount = Object.values(roundsData)[0].gamesAmount

    const wideScreen  = window.matchMedia( '(min-width: 1200px)' );

    wideScreen.addEventListener('change', resizeHandler)


    function resizeHandler(e) {
        if (e.matches) {
            colsAmount = colsAmount*2-1
            rowsAmount = rowsAmount/2
        } else {
            colsAmount = Object.keys(roundsData).length
            rowsAmount = Object.values(roundsData)[0].gamesAmount
        }

        table.style.gridTemplateColumns = `repeat(${colsAmount}, 1fr)`
        table.style.gridTemplateRows = `repeat(${rowsAmount}, 1fr)`

        headerEl.innerHTML = ''  

        Object.entries(roundsData).forEach(([round]) => {
            const headerItem = document.createElement('li')
            headerItem.textContent = round
            headerEl.append(headerItem)
        }) 
        if (e.matches) {
            Object.entries(roundsData).reverse().forEach(([round]) => {
                if (round !== 'final') {
                    const anotherHeader = document.createElement('li')
                    anotherHeader.textContent = round
                    headerEl.append(anotherHeader)
                }
            }) 
        }
    }

    resizeHandler(wideScreen)


    let pairId = 0
    let gameId = 0
    Object.entries(roundsData).forEach(([round, data], index) => {
        const {gamesAmount, knockouts} = data
        let rowIndex = 1
        let rowSpan
        const roundGames = playoffsGames[round]

        wideScreen.addEventListener('change', (e) => {
            rowIndex = 1
        })

     
        
        for (let i = 0; i < gamesAmount; i++) {
            pairId+=1

            const gridWrapper = document.createElement('div')
            gridWrapper.classList.add('grid-wrapper')
            const gameResultWrapper = document.createElement('div')
            gameResultWrapper.classList.add('game-result-wrapper')
            gameResultWrapper.style.border = '1px solid black'

            if (index === 0) {
                gridWrapper.classList.add('first-row')
            }


            wideScreen.addEventListener('change', repositionResultWrapper)
            repositionResultWrapper(wideScreen)

            function repositionResultWrapper(e) {
                if (e.matches) {     
                    rowSpan = rowsAmount*2/gamesAmount
                    if (gamesAmount > 1 && gamesAmount/2 < gameId) {
                        gridWrapper.style.gridColumn = colsAmount - (index)
                        gridWrapper.style.gridRow = `${Math.round(i/2)} / span ${rowSpan}`
                    } else {
                        gridWrapper.style.gridColumn = index+1
                        if (gamesAmount > 1) {
                            gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
                        } else {
                            gridWrapper.style.gridRow = `${rowIndex} / span ${rowsAmount}`
                        }
                    }
                } else {
                    rowSpan = rowsAmount/gamesAmount
                    gridWrapper.style.gridColumn = index+1
                    gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
                }
                rowIndex+=rowSpan
            }
            
            if (gamesAmount > 1) {
                if (gamesAmount/2 < pairId) {
                    gridWrapper.classList.add('right')
                }
            } else {
                gridWrapper.classList.add('final')
            }

            const gameNumberEl = document.createElement('span')
            gameNumberEl.textContent = `${pairId}.`
            gameResultWrapper.append(gameNumberEl)

            const pairGames = playoffsGames[round] && playoffsGames[round].filter(game => game.pairId === pairId)

            const teamsWrapper = document.createElement('div')
            teamsWrapper.classList.add('teams-wrapper')
            for (let j = 0; j < 2; j++) {
                const teamWrapper = document.createElement('div')
                const teamEl = document.createElement('p')

                if (pairGames?.length > 0) {
                    let team1 = pairGames[0].homeTeam
                    let team2 = pairGames[0].awayTeam

                    for (let m = 0; m < pairGames.length; m++) {
                        const game = pairGames[m];
                        const goalsEl = document.createElement('div')

                        team1 = team1.team === game.homeTeam.team ? game.homeTeam : game.awayTeam
                        team2 = team2.team === game.awayTeam.team ? game.awayTeam : game.homeTeam

                        if (j === 0) {
                            teamEl.textContent = team1.team
                            goalsEl.textContent = game.played ? team1.goals : '-'
                        } else {
                            teamEl.textContent = team2.team
                            goalsEl.textContent = game.played ? team2.goals : '-'
                        }
                      
                        teamWrapper.append(goalsEl)
                    }
                } else {
                    if (j === 0) {
                        teamEl.textContent = `${pairId-gamesAmount-1}. game winner`
                    } else {
                        teamEl.textContent = `${pairId-gamesAmount}. game winner`
                    }
                }

                teamWrapper.prepend(teamEl)
                teamsWrapper.append(teamWrapper)
                gameResultWrapper.append(teamsWrapper)
            }

            gridWrapper.append(gameResultWrapper)
            table.append(gridWrapper)
        }
            // for (let j = 0; j < 2; j++) {
                // const teamWrapper = document.createElement('div')
                // const teamEl = document.createElement('p')             
                
            //     if (games) {
            //         for (let m = 0; m < games.length; m++) {
            //             const game = games[m];
            //             const goalsEl = document.createElement('div')

            //             if (j === 0) {
            //                 teamEl.textContent = game.homeTeam.team
            //                 goalsEl.textContent = game.played ? game.homeTeam.goals : '-'
            //             } else {
            //                 teamEl.textContent = game.awayTeam.team
            //                 goalsEl.textContent =  game.played ? game.awayTeam.goals : '-'
            //             }
    
            //             teamWrapper.append(goalsEl)
    
            //         }
            //     } else {
            //         if (j === 0) {
            //             teamEl.textContent = `${pairId*2-1}. game winner`
            //         } else {
            //             teamEl.textContent = `${pairId*2}. game winner`
            //         }
            //     }
 
            //     teamWrapper.prepend(teamEl)
            //     teamsWrapper.append(teamWrapper)
            // }

            // gameResultWrapper.append(teamsWrapper)

    })

    tableWrapper.append(headerEl, table)
}