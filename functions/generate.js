import Game from "../classes/Game.js";
import Team from "../classes/Team.js";
import generatePlayoffsGames from "../generatePlayoffsGames.js";
import { changeTable, tournamentForm } from "../script.js";

export default function generateTeams(container) {
    const teamNames = JSON.parse(localStorage.getItem('team-names'))

    const leagueRoundsAmount = localStorage.getItem('rounds-amount')
    const playoffsGamesData = localStorage.getItem('playoffs-data')


    if (leagueRoundsAmount) {
        const totalGames = (teamNames.length-1)*leagueRoundsAmount
    
        const teams = teamNames.map(name => new Team(name, totalGames, teamNames.length))

        const games = generateGames(container, teams, leagueRoundsAmount)
        tournamentForm(container, games, teams)

        localStorage.setItem('total-games', totalGames)
        localStorage.setItem('teams-data', JSON.stringify(teams))
    }

    if (playoffsGamesData) {
        generatePlayoffsGames(container)
    }


}


function generateGames(container, teams, roundsAmount) {
    let games = []

    for (let i = 0; i < roundsAmount; i++) {
        for (let j = 0; j < teams.length; j++) {
            const homeTeam = teams[j];
            for (let m = j + 1; m < teams.length; m++) {
                const awayTeam = teams[m];
      
                let game
                if ((i % 2) === 0) {
                    game = new Game(homeTeam, awayTeam)
                } else {
                    game = new Game(awayTeam, homeTeam)
                }
                games.push(game)
            }
        }
    }

    games.forEach((game, i) => {
        game.id = i + 1
    })

    changeTable(container, teams, games)

    localStorage.setItem('league-games-data', JSON.stringify(games))
    
    return games
}
