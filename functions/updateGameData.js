import Game from "../classes/Game.js"
import { SPORTS } from "../config.js"

export default function updateGameData(gameEl, currentGame, sportId, params = {}) {
    console.log(currentGame);
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
            if (homeTeamScored === awayTeamScored && !overtime) {
                const overtimeGame = new Game(sportId, homeTeamData, awayTeamData, currentGame.overtime.length+1)
    
                currentGame.overtime.push(overtimeGame)
                gameEl.parentElement.classList.remove('played')
            } else {
                currentGame.overtime = []
                gameEl.parentElement.classList.add('played')
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