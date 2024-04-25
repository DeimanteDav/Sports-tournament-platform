export default function accordion(container, btnText, panelDisplay, data, panelClassName) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.classList.add('accordion')
    accordionBtn.type = 'button'
    accordionBtn.textContent = btnText

    const panel = document.createElement('div')
    panel.classList.add('panel')
    panelClassName && panel.classList.add(panelClassName)

    if (data) {
        data.forEach(item => {
            panel.append(createGameWrappers(item))
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

    container.append(accordionWrapper)
}

function createGameWrappers(game) {
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

    const gameEl = document.createElement('div')
    gameEl.classList.add('game')
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
            input.dataset.team = game[team].team
            label.htmlFor = input.id
            label.textContent = game[team].team
            

            input.value = game.played ? game[team].goals : ''
            teamWrapper.append(label, input)
            gameEl.append(teamWrapper) 
        }
    }
    return gameWrapper
}