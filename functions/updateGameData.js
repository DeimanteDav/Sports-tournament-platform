export default function updateGameData(gameEl, games) {
    const homeTeamInput = gameEl.querySelector('.home-team .result-input')
    const awayTeamInput = gameEl.querySelector('.away-team .result-input')

    const homeTeamScored = Number(homeTeamInput.value)
    const awayTeamScored = Number(awayTeamInput.value)

    const currentGame = games[gameEl.dataset.gameId-1]


    const gameHomeTeamData = currentGame.homeTeam
    const gameAwayTeamData = currentGame.awayTeam

    gameHomeTeamData.goals = homeTeamScored
    gameAwayTeamData.goals = awayTeamScored


    if (homeTeamInput.value && awayTeamInput.value) {
        currentGame.played = true
        gameEl.parentElement.classList.add('played')
    } else {
        currentGame.played = false
        gameEl.parentElement.classList.remove('played')
    }

    localStorage.setItem('games-data', JSON.stringify(games))
}