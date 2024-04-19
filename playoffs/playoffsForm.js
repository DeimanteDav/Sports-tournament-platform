import Game from "../classes/Game.js"
import updateGameData from "../functions/updateGameData.js"

export default function playoffsForm(container, gamesData, playoffTeams, params = {}) {
    const {leagueTableUpdated} = params
    const {roundsData, teamsAmount} = gamesData
    console.log(playoffTeams);
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
        const roundWrapper = document.createElement('div')
        roundWrapper.dataset.round = round
        roundWrapper.classList.add('round-wrapper')

        if (index === 0 && !playoffsGames[round]) {
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

            for (let i = 0; i < gamesAmount; i++) {
                let teams = round1TeamPairs[i]
                let games = []
                for (let j = 0; j < knockouts; j++) {
                    if (!playoffsGames[round]) {
                        playoffsGames[round] = {}
                    }
                    games.push(new Game(teams[0], teams[1]))
                    playoffsGames[round][i+1] = games
                }
            }

            localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
        }

        for (let i = 0; i < gamesAmount; i++) {
            const gameId = i+1
            const roundGames = playoffsGames[round]
            const gameData = roundGames && roundGames[gameId]

            if (gameData) {
                const gameWrapper = document.createElement('div')
                gameWrapper.classList.add('game-wrapper')
                gameWrapper.dataset.round = round
                gameWrapper.dataset.gameId = gameId

                roundWrapper.append(gameWrapper)
                createGameElement(gameWrapper, gameData)
            }
        }

        form.append(roundWrapper)
    })

    changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)

    form.addEventListener('change', (e) => {
        const gameEl = e.target.parentElement.parentElement
        const gameWrapper = gameEl.parentElement

        const currentKnockout = gameEl.dataset.knockoutIndex

        const currentRound = gameWrapper.dataset.round
        const currentGameId = +gameWrapper.dataset.gameId

        const currentRoundInfo = roundsData[currentRound]
        const {gamesAmount, knockouts} = currentRoundInfo

        const currentRoundData = playoffsGames[currentRound]
        const currentGamesData = currentRoundData[currentGameId]
        const currentGameData = currentGamesData[currentKnockout-1]

        updateGameData(gameEl, currentGameData)

        if (gamesAmount > 1) {
            const nextRound =  gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
            const nextGameId = currentGameId % 2 === 0 ? currentGameId/2 : (currentGameId+1)/2
            const nextGames = playoffsGames[nextRound] && playoffsGames[nextRound][nextGameId]

            const nextRoundInfo = nextRound && roundsData[nextRound]
            const nextRoundGamesAmount = nextRoundInfo && nextRoundInfo.gamesAmount

            const nextRoundWrapper = document.querySelector(`.round-wrapper[data-round="${nextRound}"]`)
            const nextGameWrapper = document.querySelector(`[data-round="${nextRound}"][data-game-id="${nextGameId}"]`)

            const anotherGamesData = currentGameId % 2 === 0 ? currentRoundData[currentGameId-1] : currentRoundData[currentGameId+1]
            console.log(anotherGamesData);
            const allPairGamesPlayed = anotherGamesData && [...currentGamesData, ...anotherGamesData].every(game => game.played)

            if (allPairGamesPlayed) {
                const winner1 = getGamesWinner(playoffTeams, currentGamesData)
                const winner2 = getGamesWinner(playoffTeams, anotherGamesData)

                const {knockouts} = nextRoundInfo

                const teamsChanged = nextGames && !nextGames.every(team => (
                    (team.homeTeam.team === winner1.team || team.awayTeam.team === winner1.team)
                    &&
                    (team.homeTeam.team === winner2.team || team.awayTeam.team === winner2.team)
                ))

                if (!nextGames || teamsChanged) {
                    let games = []
                    for (let j = 0; j < knockouts; j++) {
                        if (!playoffsGames[nextRound]) {
                            playoffsGames[nextRound] = {}
                        }
                        games.push(new Game(winner1, winner2))
                        playoffsGames[nextRound][nextGameId] = games
                    }

                    let newGameWrapper
                    if (teamsChanged) {
                        nextGameWrapper.innerHTML = ''
                        newGameWrapper = nextGameWrapper
                        
                        for (let i = 0; i < nextRoundGamesAmount; i++) {
                            const otherRound =  nextRoundGamesAmount === 2 ? 'final' : `1/${nextRoundGamesAmount/2}`
                            const otherGameId = nextGameId % 2 === 0 ? nextGameId/2 : (nextGameId+1)/2
                            
                            if (playoffsGames[otherRound] && playoffsGames[otherGameId]) {
                                const otherGameWrapper = document.querySelector(`[data-round="${otherRound}"][data-game-id="${otherGameId}"]`)

                                delete playoffsGames[otherRound][otherGameId]

                                otherGameWrapper && otherGameWrapper.remove()
                            } 
                        }
                    } else {
                        newGameWrapper = document.createElement('div')
                        newGameWrapper.classList.add('game-wrapper')
                        newGameWrapper.dataset.round = nextRound
                        newGameWrapper.dataset.gameId = nextGameId
                        nextRoundWrapper.append(newGameWrapper)
                    }
                    
                    createGameElement(newGameWrapper, games)
                }
            } else if (nextGames) {
                delete playoffsGames[nextRound][nextGameId]
                nextGameWrapper.remove()

                for (let i = 0; i < nextRoundGamesAmount; i++) {
                    const otherRound =  nextRoundGamesAmount === 2 ? 'final' : `1/${nextRoundGamesAmount/2}`
                    const otherGameId = nextGameId % 2 === 0 ? nextGameId/2 : (nextGameId+1)/2

                    if (playoffsGames[otherRound] && playoffsGames[otherRound][otherGameId]) {
                        const otherGameWrapper = document.querySelector(`[data-round="${otherRound}"][data-game-id="${otherGameId}"]`)

                        delete playoffsGames[otherRound][otherGameId]
                        otherGameWrapper && otherGameWrapper.remove()
                    } 
                }
            }

            localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

        }


        changePlayoffsTable(container, sortedData, playoffsGames, playoffTeams)

        localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))        
    })
    // const playoffsHeaderEl = document.createElement('ul')
    // playoffsHeaderEl.classList.add('playoffs-header')
    // const playoffsGamesForm = document.createElement('form')
    // playoffsGamesForm.classList.add('playoffs-games')

    // form.append(playoffsHeaderEl,playoffsGamesForm)


    // const {roundsData, teamsAmount} = gamesData

    // const sortedData = Object.fromEntries(
    //     Object.entries(roundsData)
    //         .sort(([key1], [key2]) => {
    //             const a = +key1.slice(-1)
    //             const b = +key2.slice(-1)

    //             if (a && b) {
    //                 return Number(b[0]) - Number(a[0])
    //             } else if (!Number(a)) {
    //                 return 1
    //             } else {
    //                 return -1
    //             }
    //         })
    // );

    // const rowsAmount = Object.keys(roundsData).length
    // playoffsGamesForm.style.gridTemplateColumns = `repeat(${rowsAmount}, 1fr)`

    // const playoffsGames = localStorage.getItem('playoffs-games-data') ? JSON.parse(localStorage.getItem('playoffs-games-data')) : {}
    // console.log(playoffsGames);
    

    // Object.entries(sortedData).forEach(([round, data], index) => {
    //     const {gamesAmount, knockouts} = data
        // const headerItem = document.createElement('li')
        // headerItem.textContent = round
    //     playoffsHeaderEl.append(headerItem)

    //     let gameIndex = 0
    //     const roundWrapper = document.createElement('div')
    //     roundWrapper.classList.add('round-wrapper')

    //     playoffsGamesForm.append(roundWrapper)

    //     if (gamesAmount > 1) {
    //         const pairsAmount = gamesAmount/2
    //         for (let i = 0; i < pairsAmount; i++) {
    //             const pairWrapper = document.createElement('div')
    //             pairWrapper.classList.add('pair-wrapper')
    //             roundWrapper.append(pairWrapper)

    //             for (let j = 0; j < 2; j++) {
    //                 const gameWrapper = document.createElement('div')                    
    //                 gameWrapper.classList.add('game-wrapper')
    //                 pairWrapper.append(gameWrapper)


    //                 gameWrapper.dataset.gameIndex = gameIndex+1
    //                 gameWrapper.dataset.knockouts = knockouts
    //                 gameWrapper.dataset.round = round

    //                 if (gameIndex < pairsAmount*2 ) {
    //                     createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundsData[round], playoffTeams, {teamsChanged: leagueTableUpdated})

    //                     gameIndex+=1
    //                 }
    //             }
    //         }
    //     } else {
    //         const gameWrapper = document.createElement('div')                    
    //         gameWrapper.classList.add('game-wrapper', 'final')
    //         gameWrapper.dataset.knockouts = knockouts

    //         gameWrapper.dataset.gameIndex = 1
    //         gameWrapper.dataset.knockouts = knockouts
    //         gameWrapper.dataset.round = round

    //         roundWrapper.append(gameWrapper)

    //         createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundsData[round], playoffTeams, {teamsChanged: leagueTableUpdated})
    //     }
    // })


    // playoffsGamesForm.addEventListener('change', (e) => {
    //     console.log(e);
    //     const gameEl = e.target.parentElement.parentElement
    //     const gameWrapper = gameEl.parentElement

    //     const gameIndex = +gameWrapper.dataset.gameIndex
    //     const knockoutIndex = +gameEl.dataset.knockoutIndex

    //     const currentRound = gameWrapper.dataset.round
    //     const teamsGames = playoffsGames[currentRound][gameIndex]

    //     const currentGame = teamsGames[knockoutIndex-1]

        // updateGameData(gameEl, currentGame)

        // localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

    //     const allGamesPlayed = teamsGames.every(game => game.played)

    //     const teams = JSON.parse(localStorage.getItem('playoffs-teams-data'))


    //     if (allGamesPlayed) {
    //         createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundsData[currentRound], teams, {update: true})
    //     }
    // })
}


function createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundData, allTeams, params = {}) {
    console.log(allTeams);
    const {teamsChanged, update} = params
    const {gamesAmount, knockouts} = roundData

    const round = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`
    const prevRound = `1/${gamesAmount*2}`
    const gameIndex = +gameWrapper.dataset.gameIndex

    let currentRoundGames = playoffsGames[round]
    const currentGames = currentRoundGames && currentRoundGames[gameIndex]

    if (!roundsData[prevRound] && (!currentGames || teamsChanged)) {
        const round1TeamPairs = []

        for (let i = 0; i < allTeams.length; i++) {
            let modifiedTeams
            let pair
            if (i === 0) {
                modifiedTeams = allTeams
                    pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                } else {
                    modifiedTeams = allTeams.slice(i, -i)
                    if (modifiedTeams.length > 0) {
                        pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                    }
                }
            pair && round1TeamPairs.push(pair)
        }

        let  teams = round1TeamPairs[gameIndex-1]
        let games = []
        for (let i = 0; i < knockouts; i++) {
            if (!playoffsGames[round]) {
                playoffsGames[round] = {}
            }
            games.push(new Game(teams[0], teams[1]))
            playoffsGames[round][gameIndex] = games
        }

        localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

        playoffsGames[round][gameIndex].forEach((game, i) => {
            createGameElement(gameWrapper, game, i)
        })
    } 

    if (!update && !teamsChanged && currentGames) {
        currentGames.forEach((game, i) => {
            createGameElement(gameWrapper, game, i)
        })
    }


    if (currentGames && (update || teamsChanged)) {
        const currentRoundGames = playoffsGames[round]

        console.log(gameIndex, gameIndex-1 % 2 === 0);
        const games1 = gameIndex-1 % 2 === 0 ? currentRoundGames[gameIndex] : currentRoundGames[gameIndex - 1]
        const games2 = gameIndex-1 % 2 === 0 ? currentRoundGames[gameIndex+1] : currentRoundGames[gameIndex]

        const allGamesPlayed = [...games1, ...games2].every(game => game.played)

        if (allGamesPlayed) {
            const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
            const nextRoundGameIndex = Math.round(gameIndex/2)

            const winnerGame1 = getRoundWinner(allTeams, games1)
            const winnerGame2 = getRoundWinner(allTeams, games2)

            const nextRoundGames = playoffsGames[nextRound] && playoffsGames[nextRound][nextRoundGameIndex]


            console.log(nextRoundGames, winnerGame1, winnerGame2);
            const changedTeams = nextRoundGames && !nextRoundGames.some(game => (
                (game.homeTeam.team === winnerGame1.team || game.awayTeam.team === winnerGame1.team)
                &&
                (game.homeTeam.team === winnerGame2.team || game.awayTeam.team === winnerGame2.team)
            ))

            const nextRoundWrapper = document.querySelector(
              `.game-wrapper[data-round="${nextRound}"][data-game-index="${nextRoundGameIndex}"]`
            );

            if (allGamesPlayed) {
                if (!(playoffsGames[nextRound] && playoffsGames[nextRound][nextRoundGameIndex]) || changedTeams) {
                    let games = []
                    console.log(roundsData[nextRound].knockoutss);
                    
                    for (let i = 0; i < roundsData[nextRound].knockouts; i++) {
                        if (!playoffsGames[nextRound]) {
                            playoffsGames[nextRound] = {}
                        }
                        games.push(new Game(winnerGame1, winnerGame2))
                
                        playoffsGames[nextRound][nextRoundGameIndex] = games
                
                    }

                    localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

                    nextRoundWrapper.innerHTML = ''
                    playoffsGames[nextRound][nextRoundGameIndex].forEach((game, i) => {
                        createGameElement(nextRoundWrapper,game, i)
                    })
                }
            }
        }
        
    }


}

function getGamesWinner(allTeams, games) {
    const alwaysWon = games.every(game => game.winner === games[0].winner)
    let winner

    if (alwaysWon) {
        winner = allTeams.find(team => team.team === games[0].winner)
    } else {
        let homeTeamGoalsSum = 0
        let awayTeamGoalsSum = 0

        games.forEach(game => {
            const homeTeamGoals = +game.homeTeam.goals
            const awayTeamGoals = +game.awayTeam.goals

            homeTeamGoalsSum+=homeTeamGoals
            awayTeamGoalsSum+=awayTeamGoals
        })

        if (homeTeamGoalsSum > awayTeamGoalsSum) {
            winner = allTeams.find(team => team.team ===  games[0].homeTeam.team)
        } else {
            winner = allTeams.find(team => team.team ===  games[0].awayTeam.team)
        }
    }

    return winner
}

function createGameElement(gameWrapper, games) {
    for (let i = 0; i < games.length; i++) {
        const gameEl = document.createElement('div')
        gameEl.classList.add('game')
        gameEl.dataset.knockoutIndex = i+1
        gameWrapper.append(gameEl)

        const game = games[i]
        for (let team in game) {
            if (team === 'homeTeam' || team === 'awayTeam') {
                const teamWrapper = document.createElement('div')
                teamWrapper.classList.add('team')
                const label = document.createElement('label')
                const input = document.createElement('input')               
                input.type = 'number'
                input.classList.add('result-input')
    
                if (team === 'homeTeam') {
                    teamWrapper.classList.add('home-team')
                } else {
                    teamWrapper.classList.add('away-team')
                }
                input.dataset.team = game[team].team
                label.htmlFor = input.id
                label.textContent = game[team].team
    
                if (i > 0) {
                    label.style.display = 'none'
                }

                input.value = game.played ? game[team].goals : '' 
                teamWrapper.append(label, input)
                gameEl.append(teamWrapper) 
            }
        }
    }
}

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
    const table = document.createElement('form')
    table.classList.add('playoffs-games')


    const colsAmount = Object.keys(roundsData).length
    const rowsAmount = Object.values(roundsData)[0].gamesAmount

    table.style.gridTemplateColumns = `repeat(${colsAmount}, 1fr)`
    table.style.gridTemplateRows = `repeat(${rowsAmount}, 1fr)`
    

    Object.entries(roundsData).forEach(([round, data], index) => {
        const {gamesAmount} = data
        const headerItem = document.createElement('li')
        headerItem.textContent = round
        headerEl.append(headerItem)

        let rowIndex = 1
        let rowSpan = rowsAmount/gamesAmount

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

            gridWrapper.style.gridColumn = index+1
            gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
            rowIndex+=rowSpan

            if (gamesAmount > 1) {
                const gameNumberEl = document.createElement('span')
                gameNumberEl.textContent = `${gameId}.`
                gameResultWrapper.append(gameNumberEl)
            }

            const games = playoffsGames[round] && playoffsGames[round][gameId]

            if (games) {
                const teamsWrapper = document.createElement('div')
                teamsWrapper.classList.add('teams-wrapper')
    
                for (let j = 0; j < 2; j++) {
                    const teamWrapper = document.createElement('div')
                    const teamEl = document.createElement('p')             
                    const goalsEl = document.createElement('span')

                    let goals = 0;
                    if (j === 0) {
                        teamEl.textContent = games[0].homeTeam.team
                        games.forEach(game => goals += game.homeTeam.goals);
                    } else {
                        teamEl.textContent = games[0].awayTeam.team
                        games.forEach(game => goals += game.awayTeam.goals);
                    }
                    goalsEl.textContent = goals

                    teamWrapper.append(teamEl, goalsEl)
                    teamsWrapper.append(teamWrapper)
                }

                gameResultWrapper.append(teamsWrapper)
            } else {
                const prevGame1Id = gameId*2-1
                const prevGame2Id = gameId*2

                const infoEl = document.createElement('p')
                infoEl.textContent = `${prevGame1Id} & ${prevGame2Id} winners`

                gameResultWrapper.append(infoEl)
            }

            gridWrapper.append(gameResultWrapper)
            table.append(gridWrapper)
        }
    })

    tableWrapper.append(headerEl, table)
}