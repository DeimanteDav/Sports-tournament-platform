import BasketballGame from "./classes/BasketballGame"
import BasketballTeam from "./classes/BasketballTeam"
import FootballGame from "./classes/FootballGame"
import FootballTeam from "./classes/FootballTeam"

function  getInbetweenTeamsGames(teams: (BasketballTeam | FootballTeam)[], games: FootballGame[] | BasketballGame[], params: {allGames: boolean} = {allGames: false}) {
    const {allGames} = params
    const inbetweenGames: FootballGame[] | BasketballGame[] = []

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