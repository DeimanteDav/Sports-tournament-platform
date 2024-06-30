import BasketballGame from "../classes/Basketball/BasketballGame";
import FootballGame from "../classes/Football/FootballGame";
import { GameType, GamesType } from "../types";

interface legDataInt {
    leg: number, games: GamesType, extraData?: string
}

export function accordionNew(wrapper: HTMLElement, round: string | number, text: string, legsData: legDataInt[], params: {inner: boolean} = {inner: false}) {
    const {inner} = params

    const itemWrapper = document.createElement('div')
    itemWrapper.classList.add('accordion-item')

    const tabWrapper = document.createElement('div')
    tabWrapper.classList.add('accordion-tab-wrapper')

    const markWrapper = document.createElement('div')
    markWrapper.classList.add('accordion-mark-wrapper')

    const mark = document.createElement('span')
    mark.classList.add('accordion-mark')
    mark.textContent = '>'

    const title = document.createElement('span')
    title.classList.add('accordion-title')
    title.textContent = text

    const item = document.createElement('div')
    item.classList.add('accordion-item')
    item.classList.add('display')

    if (inner) {
        itemWrapper.classList.add('inner')
    }
    const data = document.createElement('div')
    

    markWrapper.append(mark)
    tabWrapper.append(markWrapper, title)
    item.append(data)
    itemWrapper.append(tabWrapper, item)
    wrapper.append(itemWrapper)

    if (!inner) {
        legsData.forEach((legData, i) => {
            const legTitle = legData.leg + (legData.extraData ? ' ' + legData.extraData : '')

            accordionNew(data, round, legTitle, [legData, legsData[i-1]], {inner: true})
        })
    } else {
        const legData = legsData[0]
        const prevLegData = legsData[1]
        const legGames = legData.games
        data.classList.add('games')

        legGames?.forEach((game, i) => {
            const prevGame = prevLegData?.games[i] || null
            data.append(createGameWrappers(prevGame, game, round))
        })
    }

    tabWrapper.addEventListener('click', (e) => {
        accordionHandler(itemWrapper)

    })
}

function accordionHandler(item: HTMLDivElement) {
    const isActive = item.classList.contains('active');

    const allAccordions = item.parentElement && item.parentElement.querySelectorAll(':scope > .accordion-item');

    allAccordions?.forEach(acc => {
        if (item.classList.contains('inner')) {
            acc.classList.remove('active')
        } else {
            const childrenAcc = acc.querySelectorAll('.inner')
            childrenAcc.forEach(acc => acc.classList.remove('active'))
            acc.classList.remove('active')
        }
    })

    if (!isActive) {
        item.classList.add('active');
    }
}


function createGameWrappers(prevGame: GameType | null, game: GameType, round: number | string): HTMLDivElement {
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

function createGameElement(prevGame: GameType | null, game: GameType, round: number | string): HTMLDivElement {
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