import Game from "../classes/Game.js"
import accordion from "../components/accordion.js"
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

                    if ((j % 2) === 0) {
                        game = new Game(teams[0], teams[1])
                    } else {
                        game = new Game(teams[1], teams[0])
                    }
           
                    game.id = gameId
                    game.pairId = i+1

                    const roundIndex = Math.floor(gameId / 5)
                    game.roundNr = roundIndex + 1

                    playoffsGames[round].push(game)
                }

            }

            localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
        }

        // if (index !== 0 && leagueTableUpdated) {
        //     delete playoffsGames[round]
        //     localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
        // }

        const roundGames = playoffsGames[round]
        accordion(form, round, 'flex', roundGames, 'round')
        
    })

    changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)

    form.addEventListener('change', (e) => {
    //     const gameEl = e.target.parentElement.parentElement
    //     const gameWrapper = gameEl.parentElement

    //     const currentKnockout = gameEl.dataset.knockoutIndex

    //     const currentRound = gameWrapper.dataset.round
    //     const currentGameId = +gameWrapper.dataset.gameId

    //     const currentRoundInfo = roundsData[currentRound]
    //     const {gamesAmount, knockouts} = currentRoundInfo

    //     const currentRoundData = playoffsGames[currentRound]
    //     const currentGamesData = currentRoundData[currentGameId]
    //     const currentGameData = currentGamesData[currentKnockout-1]

    //     updateGameData(gameEl, currentGameData)

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
    //         const nextRound =  gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
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

    //         localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

    //     }


    //     changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)

    //     localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))        
    })
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

function changePlayoffsTable(container, roundsData, playoffsGames, teams) {
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


    Object.entries(roundsData).forEach(([round, data], index) => {
        const {gamesAmount} = data

        let rowIndex = 1
        let rowSpan

        wideScreen.addEventListener('change', (e) => {
            rowIndex = 1
        })
     

        for (let i = 0; i < gamesAmount; i++) {
            const gameId = i+1

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
                if (gamesAmount/2 < gameId) {
                    gridWrapper.classList.add('right')
                }
                const gameNumberEl = document.createElement('span')
                gameNumberEl.textContent = `${gameId}.`
                gameResultWrapper.append(gameNumberEl)
            } else {
                gridWrapper.classList.add('final')
            }

            const games = playoffsGames[round] && playoffsGames[round][gameId]

            const teamsWrapper = document.createElement('div')
            teamsWrapper.classList.add('teams-wrapper')
            
            for (let j = 0; j < 2; j++) {
                const teamWrapper = document.createElement('div')
                const teamEl = document.createElement('p')             

                if (games) {
                    for (let m = 0; m < games.length; m++) {
                        const game = games[m];
                        const goalsEl = document.createElement('div')

                        if (j === 0) {
                            teamEl.textContent = game.homeTeam.team
                            goalsEl.textContent = game.played ? game.homeTeam.goals : '-'
                        } else {
                            teamEl.textContent = game.awayTeam.team
                            goalsEl.textContent =  game.played ? game.awayTeam.goals : '-'
                        }
    
                        teamWrapper.append(goalsEl)
    
                    }
                } else {
                    if (j === 0) {
                        teamEl.textContent = `${gameId*2-1}. game winner`
                    } else {
                        teamEl.textContent = `${gameId*2}. game winner`
                    }
                }
 
                teamWrapper.prepend(teamEl)
                teamsWrapper.append(teamWrapper)
            }

            gameResultWrapper.append(teamsWrapper)
            gridWrapper.append(gameResultWrapper)
            table.append(gridWrapper)
        }
    })

    tableWrapper.append(headerEl, table)
}