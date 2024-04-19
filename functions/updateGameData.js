export default function updateGameData(gameEl, currentGame) {
    const homeTeamInput = gameEl.querySelector('.home-team .result-input')
    const awayTeamInput = gameEl.querySelector('.away-team .result-input')

    const homeTeamScored = Number(homeTeamInput.value)
    const awayTeamScored = Number(awayTeamInput.value)

    const gameHomeTeamData = currentGame.homeTeam
    const gameAwayTeamData = currentGame.awayTeam

    gameHomeTeamData.goals = homeTeamScored
    gameAwayTeamData.goals = awayTeamScored
    console.log(homeTeamInput, homeTeamInput.value, awayTeamInput, awayTeamInput.value);
    if (homeTeamInput.value && awayTeamInput.value) {
        if (homeTeamScored > awayTeamScored) {
            currentGame.winner = gameHomeTeamData.team
        } else {
            currentGame.winner = gameAwayTeamData.team
        }

        currentGame.played = true
        gameEl.parentElement.classList.add('played')
    } else {
        currentGame.played = false
        currentGame.winner = null
        gameEl.parentElement.classList.remove('played')
    }
}