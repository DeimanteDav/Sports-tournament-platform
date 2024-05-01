export default function accordion(container, games, innerRounds, btnText) {
    console.log(games);
    const accordionWrapper = generateAccordion(btnText, 'block')
    const panel = accordionWrapper.querySelector('.panel')

    innerRounds && innerRounds.forEach(round => {
        const innerBtnText = `Round ${round}`

        const innerAccordionWrapper = generateAccordion(innerBtnText, 'flex', games, round, 'inner', btnText)
        panel.append(innerAccordionWrapper)
    })

    container.append(accordionWrapper)
}

function generateAccordion(btnText, panelDisplay, games, round, panelClassName, outerRound) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.classList.add('accordion')
    accordionBtn.type = 'button'
    accordionBtn.textContent = btnText

    const panel = document.createElement('div')
    panel.classList.add('panel')
    // roundNumber && (panel.dataset.roundNr = roundNumber)
    panelClassName && panel.classList.add(panelClassName)

    if (round) {
        games.forEach(game => {
            if (`${round}` === `${game.roundNr}`) {
                panel.append(createGameWrappers(game, outerRound))
            }
        })
    }

    accordionBtn.addEventListener('click', (e) => {
        e.target.classList.toggle('active')

        if (panel.style.display === panelDisplay) {
            panel.style.display = "none";
        } else {
            panel.style.display = panelDisplay;
        }
    })

    accordionWrapper.append(accordionBtn, panel)
    return accordionWrapper
}


export function createGameWrappers(game, round, extraTimeGame) {
    const gameWrapper = document.createElement('div')
    gameWrapper.classList.add('game-wrapper')

    const idsWrapper = document.createElement('div')
    
    const gameIdElement = document.createElement('p')

    gameIdElement.textContent = `${game.id}.`
    idsWrapper.append(gameIdElement)



    if (game.pairId) {
        const pairIdElement = document.createElement('p')
        pairIdElement.textContent = `Pair ${game.pairId}`

        idsWrapper.append(pairIdElement)

        
    }
    gameWrapper.append(idsWrapper)

    const games = extraTimeGame ? [game, extraTimeGame] : [game]
    for (const game of games) {
        const gameEl = createGameElement(game, round)

        gameWrapper.append(gameEl)
    }

    return gameWrapper
}

function createGameElement(game, round) {
    const gameEl = document.createElement('div')
    gameEl.dataset.gameId = game.id
    gameEl.dataset.roundNr = game.roundNr
    gameEl.dataset.round = round
    gameEl.classList.add('game')

    game.extraTime && (gameEl.dataset.extraTime = true)
    game.pairId && (gameEl.dataset.pairId = game.pairId)

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
            label.htmlFor = input.id

            label.textContent = game[team].team
            input.dataset.team = game[team].team
            
            input.value = game[team].goals ? game[team].goals : ''

            
            if (game.pairId) {
                const playoffPairs = JSON.parse(localStorage.getItem('playoffs-pairs-data'))

                const pairGames = playoffPairs[round].find(pairData => pairData.id === game.pairId).games

                if (pairGames.length > 1) {
                    const firstGame = pairGames[0]
                    const secondGame = pairGames[1]

                    if (!firstGame.played && secondGame.id === game.id) {
                        input.setAttribute('disabled', true)
                    }
                }
            }

            if (!game.homeTeam.team || !game.awayTeam.team) {
                input.setAttribute('disabled', true)
            }
        
            teamWrapper.append(label, input)

            if (game.extraTime) {
                const extraTimeInput = document.createElement('input')               
                extraTimeInput.type = 'number'
                extraTimeInput.classList.add('result-input', 'extra-time')
                extraTimeInput.value = game.extraTime.played ? game.extraTime[team].goals : ''

                teamWrapper.append(extraTimeInput)
            }

            gameEl.append(teamWrapper) 
        }
    }
    return gameEl
}   