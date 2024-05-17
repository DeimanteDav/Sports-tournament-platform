import BasketballGame from "../functions/classes/BasketballGame"
import FootballGame from "../functions/classes/FootballGame"
import Game from "../functions/classes/Game"

function accordion(form: HTMLFormElement, btnText: string, legs: number[], games: FootballGame[] | BasketballGame[]) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.classList.add('accordion')
    accordionBtn.textContent = btnText
    accordionBtn.type = 'button'

    const panel = document.createElement('div')
    panel.classList.add('panel')

    accordionBtn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        target.classList.toggle('active')

        const innerButtons = [...panel.querySelectorAll('button.accordion')]

        const innerPanels = [...panel.querySelectorAll('.panel')]
        
        if (panel.style.display === 'block') {
            innerButtons.forEach((btn, i) => {
                btn.classList.remove('active')
                const element = innerPanels[i] as HTMLElement
                element.style.display = 'none'
            })
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    })

    legs.forEach(leg => {
        const innerBtnText = `Leg ${leg}`

        generateAccordion(panel, innerBtnText, leg, games)
    })

    accordionWrapper.append(accordionBtn, panel)
    form.append(accordionWrapper)
}
export default accordion

function generateAccordion(wrapper: HTMLDivElement, btnText: string, leg: number, games: FootballGame[] | BasketballGame[]) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.dataset.leg = leg.toString()
    accordionBtn.classList.add('accordion')
    accordionBtn.textContent = btnText
    accordionBtn.type = 'button'

    const panel = document.createElement('div')
    panel.classList.add('panel', 'games')

    games.forEach(game => {
        if (`${leg}` === `${game.leg}`) {
            console.log(game);
            panel.append(game.gameElement())
            // panel.append(createGameWrappers(game, game.round))
        }
    })

    accordionBtn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        target.classList.toggle('active')

        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'flex';
        }
    })

    accordionWrapper.append(accordionBtn, panel)
    wrapper.append(accordionWrapper)
}


function createGameWrappers(game: FootballGame | BasketballGame, round: number) {
    const gameWrapper = document.createElement('div')
    gameWrapper.classList.add('game-wrapper')

    const idsWrapper = document.createElement('div')
    
    const gameIdElement = document.createElement('p')

    gameIdElement.textContent = `${game.id}.`
    idsWrapper.append(gameIdElement)

    if (game.playedAll) {
        gameWrapper.classList.add('played')
    }


    if (game.pairId) {
        const pairIdElement = document.createElement('p')
        pairIdElement.textContent = `Pair ${game.pairId}`

        idsWrapper.append(pairIdElement)
    }
    gameWrapper.append(idsWrapper)

    const gameEl = createGameElement(game, round)
    gameWrapper.append(gameEl)

    return gameWrapper
}

function createGameElement(game: FootballGame | BasketballGame, round: number) {
    const gameEl = document.createElement('div')
    gameEl.dataset.gameId = game.id.toString()
    gameEl.dataset.roundNr = game.leg.toString()
    gameEl.dataset.round = round.toString()
    gameEl.classList.add('game')

    game.hasOwnProperty('extraTime') && (gameEl.dataset.extraTime = 'true')
    game.pairId && (gameEl.dataset.pairId = game.pairId.toString())

    const homeTeam = game.homeTeam
    const awayTeam = game.awayTeam
    const teams = [homeTeam, awayTeam]

    for (const team of teams) {
        const teamWrapper = document.createElement('div')
        teamWrapper.classList.add('team')
        const label = document.createElement('label')
        const input = document.createElement('input')               
        input.type = 'number'
        input.classList.add('result-input')

        // if (team === 'homeTeam') {
        //     teamWrapper.classList.add('home-team')
        // } else {
        //     teamWrapper.classList.add('away-team')
        // }
        label.htmlFor = input.id

        label.textContent = team.team
        input.dataset.team = team.team
        
        input.value = team.goals !== null ? team.goals.toString() : ''

        // TODO: playoffsPairs class
        // if (game.pairId) {
        //     const playoffPairs = JSON.parse(localStorage.getItem('playoffs-pairs-data') || '')

        //     const pairGames = playoffPairs[round].find(pairData => pairData.id === game.pairId).games

        //     if (pairGames.length > 1) {
        //         pairGames.forEach((pairGame, j) => {
        //             if (j !== 0 && (!pairGames[j-1].played || (pairGames[j-1].overtime.length > 0 ? pairGames[j-1].overtime.some(overtimeGame => !overtimeGame.played) : false)) && pairGame.id === game.id) {
        //                 input.setAttribute('disabled', true)
        //             }
        //         })

        //     }
        // }


        if (!game.homeTeam.team || !game.awayTeam.team) {
            input.setAttribute('disabled', 'true')
        }
    
        teamWrapper.append(label, input)
        
        if (game.extraTime ) {
            const extraTimeInput = document.createElement('input')               
            extraTimeInput.type = 'number'
            extraTimeInput.classList.add('result-input', 'extra-time')

            // FIXME: KODEL
            extraTimeInput.value = game.extraTime[team].goals ? game.extraTime[team].goals : ''

            teamWrapper.append(extraTimeInput)
        }

        if (game.hasOwnProperty('shootout')) {
            const shootoutInput = document.createElement('input')               
            shootoutInput.type = 'number'
            shootoutInput.classList.add('result-input', 'shootout')
            // FIXME: KODEL
            shootoutInput.value = game.shootout[team].goals ? game.shootout[team].goals : ''

            teamWrapper.append(shootoutInput)
        }
        if (game.overtime) {
            game.overtime.forEach((overtime, i) => {
                const overtimeInput = document.createElement('input')
                overtimeInput.dataset.overtime = i+1
                overtimeInput.type = 'number'
                overtimeInput.classList.add('result-input', 'overtime')
                overtimeInput.value = overtime[team].goals ? overtime[team].goals : ''

                teamWrapper.append(overtimeInput)
            })
        }

        gameEl.append(teamWrapper) 
    }

    return gameEl
}