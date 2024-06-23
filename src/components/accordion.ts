import BasketballGame from "../classes/Basketball/BasketballGame"
import FootballGame from "../classes/Football/FootballGame"
import { GamesType } from "../types"

function accordion(form: HTMLElement, round: string | number, legsData?: {leg: number, games: GamesType, extraData?: string}[]) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.classList.add('accordion')
    accordionBtn.textContent = `Round ${round}`
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

    legsData?.forEach((legData, i) => {
        console.log(legData);
        const innerBtnText = `Leg ${legData.leg}` + ` ${legData.extraData || ''}`

        const prevLegGames = legsData[i-1] && legsData[i-1].games
        generateAccordion(panel, innerBtnText, legData.leg, legData.games, prevLegGames)
    })


    accordionWrapper.append(accordionBtn, panel)
    form.append(accordionWrapper)
}
export default accordion

function generateAccordion(wrapper: HTMLDivElement, btnText: string, leg: number, games: GamesType, prevGames: GamesType | null) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.dataset.leg = leg.toString()
    accordionBtn.classList.add('accordion')
    accordionBtn.textContent = btnText
    accordionBtn.type = 'button'

    const panel = document.createElement('div')
    panel.classList.add('panel', 'games')

    games.forEach((game, i) => {
        if (`${leg}` === `${game.leg}`) {
            const prevGame = prevGames ? prevGames.find(prevGame => prevGame.pairId === game.pairId)! : null

            panel.append(createGameWrappers(prevGame, game, game.round))
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


function createGameWrappers(prevGame: FootballGame | BasketballGame | null, game: FootballGame | BasketballGame, round: number | string): HTMLDivElement {
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

    const gameEl = createGameElement(prevGame, game, round)
    gameWrapper.append(gameEl)

    return gameWrapper
}

function createGameElement(prevGame: FootballGame | BasketballGame | null, game: FootballGame | BasketballGame, round: number | string): HTMLDivElement {
    const gameEl = document.createElement('div')
    gameEl.dataset.gameId = game.id.toString()
    gameEl.dataset.leg = game.leg.toString()
    gameEl.dataset.round = round.toString()
    gameEl.classList.add('game')

    game.hasOwnProperty('extraTime') && (gameEl.dataset.extraTime = 'true')

    if (game.pairId) {
        gameEl.dataset.pairId = game.pairId.toString()
    }


    for (const team of game.teams) {
        const teamWrapper = document.createElement('div')
        teamWrapper.classList.add('team')
        const label = document.createElement('label')
        const input = document.createElement('input')               
        input.type = 'number'
        input.classList.add('result-input')

        if (team.home) {
            teamWrapper.classList.add('home-team')
        } else {
            teamWrapper.classList.add('away-team')
        }
        label.htmlFor = input.id

        label.textContent = team.team
        input.dataset.teamId = team.id?.toString()
        
        input.value = team.goals !== null ? team.goals.toString() : ''

        if (game.teams.some(team => !team.team || !team.id) || (prevGame && !prevGame.playedAll)) {
            console.log(prevGame, game, 'disabled');
            input.setAttribute('disabled', 'true')
        }

    
        teamWrapper.append(label, input)
        
        if ((game as FootballGame).extraTime) {
            const extraTimeTeam = (game as FootballGame).extraTime?.teams.find(extraGameTeam => extraGameTeam.id === team.id)

            if (extraTimeTeam) {
                const extraTimeInput = document.createElement('input')
                extraTimeInput.dataset.extraTime = 'true'
                extraTimeInput.type = 'number'
                extraTimeInput.classList.add('result-input')
                extraTimeInput.dataset.teamId = team.id?.toString()

                extraTimeInput.value = extraTimeTeam.goals !== null ? extraTimeTeam.goals.toString() : ''
    
                teamWrapper.append(extraTimeInput)
            }
        }

        if ((game as FootballGame).shootout) {
            const shootoutTeam = (game as FootballGame).shootout?.teams.find(shootoutTeam => shootoutTeam.id === team.id)

            if (shootoutTeam) {
                const shootoutInput = document.createElement('input')
                shootoutInput.dataset.shootout = 'true'         
                shootoutInput.type = 'number'
                shootoutInput.classList.add('result-input')
                shootoutInput.dataset.teamId = team.id?.toString()

                shootoutInput.value = shootoutTeam.goals !== null ? shootoutTeam.goals.toString() : ''
    
                teamWrapper.append(shootoutInput)
            }
        }
        if ((game as BasketballGame).overtime) {
            (game as BasketballGame).overtime.forEach((overtime, i) => {
                const overtimeTeam = overtime.teams.find(overtimeTeam => overtimeTeam.id === team.id)
                if (overtimeTeam) {
                    const overtimeInput = document.createElement('input')
                    overtimeInput.dataset.overtime = `${i+1}`
                    overtimeInput.type = 'number'
                    overtimeInput.classList.add('result-input')
                    overtimeInput.dataset.teamId = team.id?.toString()

                    overtimeInput.value = overtimeTeam.goals !== null ? overtimeTeam.goals.toString() : ''
    
                    teamWrapper.append(overtimeInput)
                }
            })
        }

        gameEl.append(teamWrapper) 
    }

    return gameEl
}