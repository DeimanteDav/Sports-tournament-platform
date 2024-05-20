import BasketballGame from "../../classes/BasketballGame.js";
import FootballGame from "../../classes/FootballGame.js";
import PlayoffsPair from "../../classes/PlayoffsPair.js";
import { Container, SPORTS } from "../../config.js";

type PlayoffsTable = {
    container: Container,
    sportId: number,
    roundsData: {
        [k: string]: { gamesAmount: number, knockouts: number, bestOutOf?: number }
    },
    playoffsPairs: {
        [k: string]: PlayoffsPair[]
    }
}


function playoffsTable(tableData: PlayoffsTable) {
    const {container, sportId, roundsData, playoffsPairs} = tableData

    const oldTableWrapper = document.querySelector('.playoffs-table')

    if (oldTableWrapper) {
        oldTableWrapper.remove()
    }
    const tableWrapper = document.createElement('div')
    tableWrapper.classList.add('playoffs-table')
    container.append(tableWrapper)

    const headerEl = document.createElement('ul')
    headerEl.classList.add('playoffs-header')
    const table = document.createElement('div')
    table.classList.add('playoffs-games')

    let colsAmount = Object.keys(playoffsPairs).length
    let rowsAmount = Object.values(playoffsPairs)[0].length

    const wideScreen  = window.matchMedia( '(min-width: 1000px)' );

    wideScreen.addEventListener('change', resizeHandler)
    resizeHandler(wideScreen)

    function resizeHandler(e: MediaQueryList | MediaQueryListEvent) {
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
                headCell.textContent = `${i+1}`
                headCell.setAttribute('scope', 'col')
                headRow.append(headCell)

                if (sportId === SPORTS.football.id) {
                    const footballGame = game as FootballGame
                    if (footballGame.extraTime) {
                        const extraTimeEl = document.createElement('th')
                        extraTimeEl.textContent = 'Extra'
                        extraTimeEl.setAttribute('scope', 'col')
                        headRow.append(extraTimeEl)
                    }
                    
                    if (footballGame) {
                        const shootOutEl = document.createElement('th')
                        shootOutEl.textContent = 'P'
                        shootOutEl.setAttribute('scope', 'col')
                        headRow.append(shootOutEl)
                    }
                } else if (sportId === SPORTS.basketball.id) {
                    const basketballGame = game as BasketballGame
                    if (basketballGame) {
                        basketballGame.overtime.forEach(_ => {
                            const overtimeEl = document.createElement('th')
                            overtimeEl.textContent = 'OT'
                            overtimeEl.setAttribute('scope', 'col')
                            headRow.append(overtimeEl)
                        })
                    }
                }

            })

            const pairIdEl = document.createElement('th')
            pairIdEl.textContent = pair.id + '.'
            pairIdEl.setAttribute('rowSpan', 3)

            for (let i = 0; i < pair.teams.length; i++) {
                const teamData = pair.teams[i];
                const bodyRow = document.createElement('tr')

                const teamEl = document.createElement('th')
                teamEl.style.padding = '0 10px'
                teamEl.setAttribute('scope', 'row')
                teamEl.textContent = teamData.team ? teamData.team : `${pair.prevIds[i]} winner`
             
                const totalScoreEl = document.createElement('th')
                totalScoreEl.textContent = teamData.totalScore.toString()
                totalScoreEl.style.padding = '0 10px'
                totalScoreEl.style.fontWeight = 'bold'

                for (let j = 0; j < teamData.scores.length; j++) {
                    const gameData = teamData.scores[j];
                    const gameResultEl = document.createElement('td')  

                    if ((gameData.playedIn === 'extra' || gameData.playedIn === 'p' || gameData.playedIn === 'OT') && teamData.team) {
                        gameResultEl.textContent = gameData.score !== null ? gameData.score.toString() : '-'
                    } else {
                        gameResultEl.textContent = gameData.playedIn + ' ' + (gameData.score !== null ? gameData.score : '-')
                    }


                    bodyRow.append(gameResultEl)
                }
                
                bodyRow.prepend(teamEl)
                bodyRow.append(totalScoreEl)

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
                        gridWrapper.style.gridColumn = (colsAmount - (index)).toString()

                        gridWrapper.style.gridRow = `${leftRowIndex} / span ${rowSpan}`

                        leftRowIndex+=rowSpan
                    } else {
                        gridWrapper.style.gridColumn = (index+1).toString()

                        if (gamesAmount > 1) {
                            gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
                        } else {
                            gridWrapper.style.gridRow = `${rowIndex} / span ${rowsAmount}`
                        }
                    }
                } else {
                    rowSpan = rowsAmount/gamesAmount
                    gridWrapper.style.gridColumn = (index+1).toString()
                    gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
                }

                rowIndex+=rowSpan
            }
        }
    })

    tableWrapper.append(headerEl, table)
}

export default playoffsTable