import BasketballGame from "../classes/BasketballGame.js"
import FootballGame from "../classes/FootballGame.js"
import Game from "../classes/Game.js"
import { SPORTS } from "../config.js"

function updateGameData(gameEl: HTMLElement, currentGame: BasketballGame | FootballGame | Game, sportId: number, params: {overtime: boolean} = {overtime: false}): void {
    const {overtime} = params
    
    // FIXME: <HTMLInputElement>
    const homeTeamInput = gameEl.querySelector<HTMLInputElement>(`.home-team ${overtime ? `[data-overtime="${currentGame.id}"]` : '.result-input'}`)
    const awayTeamInput = gameEl.querySelector<HTMLInputElement>(`.away-team ${overtime ? `[data-overtime="${currentGame.id}"]` : '.result-input'}`)

    if (!homeTeamInput || !awayTeamInput || !gameEl.parentElement) {
        return
    }
    const homeTeamScored = Number(homeTeamInput.value)
    const awayTeamScored = Number(awayTeamInput.value)
    
    const homeTeamData = currentGame.teams[0]
    const awayTeamData = currentGame.teams[1]
    
    homeTeamData.goals = homeTeamInput.value ? homeTeamScored : null
    awayTeamData.goals = awayTeamInput.value ?  awayTeamScored : null
    if (homeTeamInput.value && awayTeamInput.value) {
        currentGame.played = true

        if (sportId === SPORTS.basketball.id) {
            // FIXME: ?? as
            const basketballGame = currentGame as BasketballGame

            if (basketballGame.overtime.length > 0 && !overtime) {
                if (basketballGame.overtime.every(overtimeGame => overtimeGame.played)) {
                    gameEl.parentElement.classList.add('played')
                    currentGame.playedAll = true
                } else {
                    gameEl.parentElement.classList.remove('played')
                    currentGame.playedAll = false
                }
            } else {
                gameEl.parentElement.classList.add('played')
                currentGame.playedAll = true
            }
        } else if (sportId === SPORTS.football.id) {
            gameEl.parentElement.classList.add('played')
        }
    } else {
        currentGame.played = false
        gameEl.parentElement.classList.remove('played')
    }
}

export default updateGameData