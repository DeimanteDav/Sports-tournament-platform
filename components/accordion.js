export default function accordion(container, games, innerRounds, btnText) {
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
                panel.append(createGameWrappers(games, game, outerRound))
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


function createGameWrappers(games, game, round) {
    const gameWrapper = document.createElement('div')
    gameWrapper.classList.add('game-wrapper')

    const idsWrapper = document.createElement('div')
    
    const gameIdElement = document.createElement('p')
    const gameEl = document.createElement('div')
    
    if (game.id) {
        gameEl.dataset.gameId = game.id
        gameIdElement.textContent = `${game.id}.`
        idsWrapper.append(gameIdElement)
    }
    gameEl.dataset.roundNr = game.roundNr
    gameEl.dataset.round = round

    gameEl.classList.add('game')

    if (game.pairId) {
        const pairIdElement = document.createElement('p')
        pairIdElement.textContent = `Pair ${game.pairId}`

        idsWrapper.append(pairIdElement)

        gameEl.dataset.pairId = game.pairId
    }

    gameWrapper.append(idsWrapper, gameEl)

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
            
            input.value = game.played ? game[team].goals : ''

            const pairGames = games.filter(otherGame => otherGame.pairId === game.pairId)
            const firstGame = pairGames.reduce((acc, curr) => acc.id < curr.id ? acc : curr)
            const secondGameId = firstGame.id+1
    
            if (!firstGame.played && secondGameId === game.id) {
                input.setAttribute('disabled', true)
            }

            teamWrapper.append(label, input)
            gameEl.append(teamWrapper) 
        }
    }
    return gameWrapper
}