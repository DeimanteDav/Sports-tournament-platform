import { GamesType, TeamsType } from "../types"

function  getInbetweenTeamsGames(teams: TeamsType, games: GamesType, params: {allGames: boolean} = {allGames: false}) {
    const {allGames} = params
    const inbetweenGames: GamesType = []

    // FIXME: game type
    games.forEach(game => {
        if (teams.some(team => team.id === game.teams[0].id) && teams.some(team => team.id === game.teams[1].id)) {
            if (!allGames) {
                game.played && inbetweenGames.push(game)
            } else {
                inbetweenGames.push(game)
            }
        }
    })

    return inbetweenGames
}
export default getInbetweenTeamsGames