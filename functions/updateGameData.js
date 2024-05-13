import Game from "../classes/Game.js"
import { SPORTS } from "../config.js"

export default function updateGameData(gameEl, currentGame, sportId, params = {}) {
    const {overtime} = params

    const homeTeamInput = gameEl.querySelector(`.home-team ${overtime ? `[data-overtime="${currentGame.id}"]` : '.result-input'}`)
    const awayTeamInput = gameEl.querySelector(`.away-team ${overtime ? `[data-overtime="${currentGame.id}"]` : '.result-input'}`)
    const homeTeamScored = Number(homeTeamInput.value)
    const awayTeamScored = Number(awayTeamInput.value)
    
    const homeTeamData = currentGame.homeTeam
    const awayTeamData = currentGame.awayTeam
    
    homeTeamData.goals = homeTeamInput.value ? homeTeamScored : null
    awayTeamData.goals = awayTeamInput.value ?  awayTeamScored : null

    if (homeTeamInput.value && awayTeamInput.value) {
        if (sportId === SPORTS.basketball.id) {
            if (currentGame.overtime.length > 0 && !overtime) {
                if (currentGame.overtime.every(overtimeGame => overtimeGame.played)) {
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

        if (homeTeamScored > awayTeamScored) {
            currentGame.winner = homeTeamData.team
        } else if (homeTeamScored < awayTeamScored) {
            currentGame.winner = awayTeamData.team
        } else {
            currentGame.winner = null
        }
        currentGame.played = true

    } else {
        currentGame.played = false
        currentGame.winner = null
        gameEl.parentElement.classList.remove('played')
    }
}