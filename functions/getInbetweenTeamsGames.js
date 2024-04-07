export default function getInbetweenTeamsGames(teams, games, params = {}) {
    const {allGames} = params
    const inbetweenGames = []
    games.forEach(game => {
        if (teams.some(team => team.team === game.homeTeam.team) && teams.some(team => team.team === game.awayTeam.team)) {
            if (!allGames) {
                game.played && inbetweenGames.push(game)
            } else {
                inbetweenGames.push(game)
            }
        }
    })

    return inbetweenGames
}