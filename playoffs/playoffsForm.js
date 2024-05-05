import Game from "../classes/Game.js"
import PlayoffsPair from "../classes/PlayoffsPair.js"
import accordion, { createGameWrappers } from "../components/accordion.js"
import updateGameData from "../functions/updateGameData.js"

// TABLE PLAYOFFS LAUKELIUOSE
// BENDRAS REZ. JEI LYGUS TAD EXTRA TIME

// prie zaidimo prideti: rato nr, roundo nr, poros numberis, zaidimo numeri.


// JEIGU LYGIOSIOS (Prie antro zaidimo):
// extra time du inputai

// JEI VEL LYGIOS:
// penalty shootout


// table atvaizduoti extra time; Penalty; BENDRas rezultatas

// krepsinio tipai ETAPU:
    // vienos rungtynes (kaip futbole, kas laimi tas praena, jei lygios, tai overtime)
    // dvi rungtynes (kaip futbole, kas laimi tas praena, jei lygios PO DVIEJU, tai overtime)
    // Iki 2 pergaliu/3 pergaliu/4 pergaliu (kuri pirmiau iskovojo tiek pergaliu praeina, JEI PO ZAIDIMO LYGIOSIOS, TAI OVERTIME)
    

export default function playoffsForm(container, gamesData, playoffTeams, params = {}) {
    const {roundsData, teamsAmount} = gamesData
    const {leagueTableUpdated} = params
    const sportId = JSON.parse(localStorage.getItem('sport')).id

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

    let pairId = 0
    let gameId = 0
    const roundsDataConverted = Object.entries(sortedData)
    roundsDataConverted.forEach(([round, data], index) => {
        const {gamesAmount, knockouts} = data

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

                let prevId = pairId - prevRoundGamesAmount + i

                const prevGamesIds = [prevId, prevId + 1]

                const nextGameId = pairId + gamesAmount-(i+1) + Math.round((i+1)/2)
                const pairData = new PlayoffsPair(pairId, [], prevGamesIds, nextGameId)

                const teams = index === 0 && round1TeamPairs[i]
                for (let roundNr = 1; roundNr <= knockouts; roundNr++) {
                    gameId +=1
                    const game = new Game(sportId, '', '', gameId, pairId, roundNr, round, null)

                    if (index === 0) {
                        if (roundNr % 2 === 0) {
                            game.homeTeam.team = teams[1].team
                            game.awayTeam.team = teams[0].team
                        } else {
                            game.homeTeam.team = teams[0].team
                            game.awayTeam.team = teams[1].team
                        }
                    }
                    pairData.games.push(game)
                }
                playoffsPairs[round].push(pairData)
                pairData.teams = setTeams(pairData.games)
            }
        }
        
        localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))

        console.log(playoffsPairs);
        
        let roundGames = []
         playoffsPairs[round].forEach(round => {
            roundGames.push(...round.games)
        })

        const innerRounds = roundGames && [...new Set(roundGames.map(game => game.roundNr))] 
        accordion(form, roundGames, innerRounds, round)
    })

    changePlayoffsTable(container, sortedData, playoffsPairs)

    form.addEventListener('change', (e) => {
        const gameEl = e.target.parentElement.parentElement
        const pairId = +gameEl.dataset.pairId

        const currentRound = gameEl.dataset.round
        const roundNr = +gameEl.dataset.roundNr

        const currentRoundInfo = roundsData[currentRound]
        const {gamesAmount, knockouts} = currentRoundInfo
        
        const pairData = playoffsPairs[currentRound].find(pair => pair.id === pairId)
        const pairGames = pairData.games
        const firstGame = [...pairGames].shift()
        const lastGame = [...pairGames].pop()


        const currentGame = pairGames.find(game => game.roundNr === roundNr)
        const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
        const nextPair = playoffsPairs[nextRound].find(pair => pair.id === pairData.nextId)
        
        const lastGameEl = document.querySelector(`.game[data-game-id="${lastGame.id}"][data-round="${currentRound}"]`)

        const lastGameInputs = lastGameEl.querySelectorAll('.result-input')
        
        const teamWrapper = e.target.parentElement
        const value = e.target.value ? +e.target.value : null

        if ([...e.target.classList].includes('extra-time')) {
            if ([...teamWrapper.classList].includes('home-team')) {
                lastGame.extraTime.homeTeam.goals = value
            } else {
                lastGame.extraTime.awayTeam.goals = value
            }
             
            if (lastGame.extraTime.awayTeam.goals && lastGame.extraTime.homeTeam.goals) {
                lastGame.extraTime.played = true
            } else {
                lastGame.extraTime.played = false
            }


            const extraTime = lastGame.extraTime
       
            if (extraTime.played && extraTime.homeTeam.goals === extraTime.awayTeam.goals && extraTime.homeTeam.goals !== null) {
                lastGame.shootout = new Game(sportId, extraTime.homeTeam, extraTime.awayTeam)

                lastGameInputs.forEach(input => {
                    const shootoutInput = document.createElement('input')
                    shootoutInput.classList.add('result-input', 'shootout')
                    const inputClasses = [...input.classList]
                    if (inputClasses.includes('extra-time')) {
                        input.after(shootoutInput)
                    }
                })
            } else {
                currentGame.shootout = null
                lastGameInputs.forEach(input => {
                    const inputClasses = [...input.classList]
                    if (inputClasses.includes('shootout')) {
                        input.remove()
                    }
                })
            }
        } else if ([...e.target.classList].includes('shootout')) {
            if ([...teamWrapper.classList].includes('home-team')) {
                lastGame.shootout.homeTeam.goals = value
            } else {
                lastGame.shootout.awayTeam.goals = value
            }
            
            if (lastGame.shootout.awayTeam.goals && lastGame.shootout.homeTeam.goals) {
                lastGame.shootout.played = true
            } else {
                lastGame.shootout.played = false
            }
        }
        if (pairGames.every(game => game.played) && (lastGame.extraTime ? lastGame.extraTime.played : true) && (lastGame.shootout ? lastGame.shootout.played : true)) {
            pairData.playedAll = true
        } else {
            pairData.playedAll = false
        }
        updateGameData(gameEl, currentGame)

        if (currentGame.id === lastGame.id) {
            if (currentGame.homeTeam.goals === currentGame.awayTeam.goals && currentGame.homeTeam.goals !== null) {
                if (!currentGame.extraTime) {
                    currentGame.extraTime = new Game(sportId, currentGame.homeTeam, currentGame.awayTeam)

                    lastGameInputs.forEach(input => {
                        const extraTimeInput = document.createElement('input')
                        extraTimeInput.classList.add('result-input', 'extra-time')

                        input.after(extraTimeInput)
                    })
                }
            } else {
                currentGame.extraTime = null
                currentGame.shootout = null

                lastGameInputs.forEach(input => {
                    const inputClasses = [...input.classList]
                    if (inputClasses.includes('extra-time') || inputClasses.includes('shootout')) {
                        input.remove()
                    }
                })

            }
        }

        if (pairGames.length > 1) {
            if (firstGame.id === currentGame.id && !currentGame.played) {
                lastGameInputs.forEach(input => {
                    input.value = ''
                    input.setAttribute('disabled', true)

                    const inputClasses = [...input.classList]
                    if (inputClasses.includes('extra-time') || inputClasses.includes('shootout')) {
                        input.remove()
                    }
                })

                lastGame.extraTime = null
                lastGame.shootout = null

                updateGameData(lastGameEl, lastGame)
            } else {
                lastGameInputs.forEach(input => {
                    input.removeAttribute('disabled')
                })
            }
        }

        pairData.teams = setTeams(pairGames, lastGame.extraTime, lastGame.shootout)
        const team1 = pairData.teams[0]
        const team2 = pairData.teams[1]
        
        const otherPairData = playoffsPairs[currentRound].find(pair => pair.id === pairId % 2 === 0 ? pairId - 1 : pairId + 1)

        const otherPairPlayed = otherPairData.playedAll
        const pairGamesPlayed = pairData.playedAll

        const nextPairElements = getNextGameElements(nextPair.id, nextRound)

        let playingAs = pairId % 2 !== 0 ? 'homeTeam' : 'awayTeam'
        let otherPlayer = pairId % 2 !== 0 ? 'awayTeam' : 'homeTeam'
        const teamClass = playingAs === 'homeTeam' ? 'home-team' : 'away-team'
        const otherClass = playingAs === 'homeTeam' ? 'away-team' : 'home-team'

        let winner = null

        if (pairGamesPlayed && team1.totalScore !== team2.totalScore) {
            if (team1.totalScore > team2.totalScore) {
                winner = team1.team
            } else if (team2.totalScore > team1.totalScore) {
                winner = team2.team
            }

            if (nextPair.games[0][playingAs].team !== winner) {
                nextPair.games.forEach((game, i) => {
                    const nextPairElement = nextPairElements[i]
                    const nextPairLabel1 = nextPairElement.querySelector(`.${teamClass} label`)
                    
                    const nextPairLabel2 = nextPairElement.querySelector(`.${otherClass} label`)

                    const inputs = [...nextPairElement.querySelectorAll('.result-input')]

                    inputs.forEach((input, i) => {
                        input.value = null

                        const inputClasses = [...input.classList]
                        if (inputClasses.includes('shootout') || inputClasses.includes('extra-time')) {
                            input.remove()
                        } 
                    })

                    if (i % 2 === 0) {
                            game[playingAs].team = winner
                            game[playingAs].goals = null
                            nextPairLabel1.textContent = winner
                        } else {
                            game[otherPlayer].team = winner
                            game[otherPlayer].goals = null
                            nextPairLabel2.textContent = winner
                        }
                        game.played = false
                        game.extraTime = null
                        game.shootOut = null
                })
                nextPair.teams = setTeams(nextPair.games)


            }
        } else if (nextPair.teams.some(team => team.team) && !otherPairPlayed) {
            clearNextPair(nextPair, gamesAmount/2, playoffsPairs)

        } else if (!pairGamesPlayed) {
            nextPair.games.forEach((game, i) => {
                const nextPairElement = nextPairElements[i]
                const nextPairLabel1 = nextPairElement.querySelector(`.${teamClass} label`)
                
                const nextPairLabel2 = nextPairElement.querySelector(`.${otherClass} label`)

                const inputs = [...nextPairElement.querySelectorAll('.result-input')]

                inputs.forEach(input => {
                    const inputClasses = [...input.classList]
                    input.value = null
                    input.setAttribute('disabled', true)
                    if (inputClasses.includes('shootout') || inputClasses.includes('extra-time')) {
                        input.remove()
                    } 
                })

                if (i % 2 === 0) {
                    game[playingAs].team = ''
                    game[playingAs].goals = null
                    nextPairLabel1.textContent = ''
                } else {
                    game[otherPlayer].team = ''
                    game[otherPlayer].goals = null
                    nextPairLabel2.textContent = ''
                }

                game.played = false
                game.extraTime = null
                game.shootout = null
            })
            nextPair.teams = setTeams(nextPair.games)
        }
    


        changePlayoffsTable(container, sortedData, playoffsPairs)

        localStorage.setItem('playoffs-pairs-data', JSON.stringify(playoffsPairs))
    })
}

function clearNextPair(pair, gamesAmount, playoffsPairs) {
    const round = gamesAmount === 1 ? 'final' : `1/${gamesAmount}` 
    console.log(pair, gamesAmount);
    const gameElements = getNextGameElements(pair.id, round)
    
    pair.games.forEach((game, i) => {
        const gameEl = gameElements[i]

        const labels = [...gameEl.querySelectorAll('label')]
        const inputs = [...gameEl.querySelectorAll('.result-input')]
        console.log(gameEl, inputs, labels);
        inputs.forEach((input, i) => {
            input.setAttribute('disabled', true)
            input.value = null
            labels[i].textContent = ''

            const inputClasses = [...input.classList]
            if (inputClasses.includes('extra-time') || inputClasses.includes('shootout')) {
                input.remove()
            }
        })

        game.homeTeam.team = ''
        game.homeTeam.goals = null
        game.awayTeam.team = ''
        game.awayTeam.goals = null
        game.played = false
        game.winner = null

        game.extraTime = null
        game.shootout = null
    })

    pair.teams = setTeams(pair.games)

    if (gamesAmount >= 2) {
        const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}` 
        const nextPair = playoffsPairs[nextRound].find(nextPair => nextPair.id === pair.nextId)
        console.log(nextPair, nextRound);
    
        clearNextPair(nextPair, gamesAmount/2, playoffsPairs)
    }
}

function getNextGameElements(pairId, round) {
    const nextGameElements = [...document.querySelectorAll(`[data-round="${round}"][data-pair-id="${pairId}"]`)]
    console.log(nextGameElements);

    return nextGameElements
}


function setTeams(games, extraTime, shootout) {
    const team1  = games[0].homeTeam.team
    const team2  = games[0].awayTeam.team
    const scores1 = []
    const scores2 = []

    let goals1Sum = 0
    let goals2Sum = 0

    games.forEach(game => {
        const team1Data = {score: 0, playedIn: ''}
        const team2Data = {score: 0, playedIn: ''}
        
        if (game.homeTeam.team === team1) {
            team1Data.score = game.homeTeam.goals
            team1Data.playedIn = 'H'

            team2Data.score = game.awayTeam.goals
            team2Data.playedIn = 'A'

            goals1Sum+=game.homeTeam.goals
            goals2Sum+=game.awayTeam.goals
        }
        if (game.awayTeam.team === team1) {
            team1Data.score = game.awayTeam.goals
            team1Data.playedIn = 'A'

            team2Data.score = game.homeTeam.goals
            team2Data.playedIn = 'H'

            goals1Sum+=game.awayTeam.goals
            goals2Sum+=game.homeTeam.goals
        }

        scores1.push(team1Data)
        scores2.push(team2Data)
    })
    if (extraTime) {
        const homeTeam = extraTime.homeTeam
        const awayTeam = extraTime.awayTeam

        const team1Goals = homeTeam.team === team1 ? homeTeam.goals : awayTeam.goals
        const team2Goals = awayTeam.team === team2 ? awayTeam.goals : homeTeam.goals
        
        goals1Sum+=team1Goals
        goals2Sum+=team2Goals

        scores1.push({score: team1Goals, playedIn: 'extra'})
        scores2.push({score: team2Goals, playedIn: 'extra'})
    }

    if (shootout) {
        const homeTeam = shootout.homeTeam
        const awayTeam = shootout.awayTeam

        const team1Goals = homeTeam.team === team1 ? homeTeam.goals : awayTeam.goals
        const team2Goals = awayTeam.team === team2 ? awayTeam.goals : homeTeam.goals
        
        goals1Sum+=team1Goals
        goals2Sum+=team2Goals

        scores1.push({score: team1Goals, playedIn: 's'})
        scores2.push({score: team2Goals, playedIn: 's'})
    }

    const result = [
        {
            team: team1,
            scores: scores1,
            totalScore: goals1Sum,
        },
        {
            team: team2,
            scores: scores2,
            totalScore: goals2Sum
        }
    ]

    return result
}

function changePlayoffsTable(container, roundsData, playoffsPairs) {
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

    let colsAmount = Object.keys(playoffsPairs).length
    let rowsAmount = Object.values(playoffsPairs)[0].length

    const wideScreen  = window.matchMedia( '(min-width: 1000px)' );

    wideScreen.addEventListener('change', resizeHandler)


    function resizeHandler(e) {
        if (e.matches) {
            colsAmount = Object.keys(playoffsPairs).length*2-1
            rowsAmount = Object.values(playoffsPairs)[0].length/2
        } else {
            colsAmount = Object.keys(playoffsPairs).length
            rowsAmount = Object.values(playoffsPairs)[0].length
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


    Object.entries(playoffsPairs).forEach(([round, roundPairs], index) => {
        const gamesAmount = roundPairs.length

        let rowIndex = 1
        let leftRowIndex = 1
        let rowSpan

        wideScreen.addEventListener('change', (e) => {
            rowIndex = 1
            leftRowIndex = 1
        })

        for (let i = 0; i < roundPairs.length; i++) {
            const pair = roundPairs[i];
            const pairId = pair.id
            const positionInRound = i+1

            const gridWrapper = document.createElement('div')
            gridWrapper.classList.add('grid-wrapper')
            const gameResultWrapper = document.createElement('div')
            gameResultWrapper.classList.add('game-result-wrapper')
            gameResultWrapper.style.border = '1px solid black'

            const gameNumberEl = document.createElement('span')
            gameNumberEl.textContent = `${pairId}.`

            const resultTable = document.createElement('table')
            const tHead = document.createElement('thead')
            const headRow = document.createElement('tr')
            const emptyHeadCell = document.createElement('th')
            emptyHeadCell.setAttribute('colspan', 2)

            const tBody = document.createElement('tbody')

            pair.games.forEach((game, i) => {
                const headCell = document.createElement('th')
                headCell.textContent = i+1
                headCell.setAttribute('scope', 'col')
                headRow.append(headCell)

                if (game.extraTime) {
                    const extraTimeEl = document.createElement('th')
                    extraTimeEl.textContent = 'extra'
                    extraTimeEl.setAttribute('scope', 'col')
                    headRow.append(extraTimeEl)
                }
                
                if (game.shootout) {
                    const shootOutEl = document.createElement('th')
                    shootOutEl.textContent = 's'
                    shootOutEl.setAttribute('scope', 'col')
                    headRow.append(shootOutEl)
                }
            })

            const pairIdEl = document.createElement('th')
            pairIdEl.textContent = pair.id
            pairIdEl.setAttribute('rowSpan', 3)

            for (let i = 0; i < pair.teams.length; i++) {
                const teamData = pair.teams[i];
                const bodyRow = document.createElement('tr')

                const teamEl = document.createElement('th')
                teamEl.setAttribute('scope', 'row')
                teamEl.textContent = teamData.team

           

                for (let j = 0; j < teamData.scores.length; j++) {
                    const gameData = teamData.scores[j];
                    const gameResultEl = document.createElement('td')  

                    if (gameData.playedIn === 'extra' || gameData.playedIn === 's') {
                        gameResultEl.textContent = gameData.score ? gameData.score : '-'
                    } else {
                        gameResultEl.textContent = gameData.playedIn + ' ' + (gameData.score ? gameData.score : '-')
                    }


                    bodyRow.append(gameResultEl)
                }
                bodyRow.prepend(teamEl)

                if (i === 0) {
                    bodyRow.prepend(pairIdEl)
                }
                tBody.append(bodyRow)
            }   
            
            if (index === 0) {
                gridWrapper.classList.add('first-row')
            }


            if (gamesAmount > 1) {
                if (gamesAmount/2 < positionInRound) {
                    gridWrapper.classList.add('right')
                }
            } else {
                gridWrapper.classList.add('final')
            }

            headRow.prepend(emptyHeadCell)
            tHead.append(headRow)
            resultTable.append(tHead, tBody)
            gameResultWrapper.append(resultTable)
            gridWrapper.append(gameResultWrapper)
            table.append(gridWrapper)


            wideScreen.addEventListener('change', repositionResultWrapper)

            repositionResultWrapper(wideScreen)

            function repositionResultWrapper(e) {
                if (e.matches) {
                    rowSpan = rowsAmount*2/gamesAmount

                    if (gamesAmount > 1 && gamesAmount/2 < positionInRound) {
                        gridWrapper.style.gridColumn = colsAmount - (index)

                        gridWrapper.style.gridRow = `${leftRowIndex} / span ${rowSpan}`

                        leftRowIndex+=rowSpan
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
        }
    })

    tableWrapper.append(headerEl, table)
}
