import Game from "../classes/Game.js";
import Team from "../classes/Team.js";
import resetDataBtn from "../components/resetDataBtn.js";
import playoffsForm from "../playoffs/playoffsForm.js";
import { tournamentForm } from "../script.js";

export default function generateTeams(container) {
    const teamNames = JSON.parse(localStorage.getItem('team-names'))

    const leagueRoundsAmount = localStorage.getItem('rounds-amount')
    const playoffsGamesData = JSON.parse(localStorage.getItem('playoffs-data'))


    if (leagueRoundsAmount && playoffsGamesData) {
        const totalGames = (teamNames.length-1)*leagueRoundsAmount
        const teams = teamNames.map(name => new Team(name, totalGames, teamNames.length))
        const games = generateGames(teams, leagueRoundsAmount)
   

        localStorage.setItem('total-games', totalGames)
        localStorage.setItem('teams-data', JSON.stringify(teams))
        localStorage.setItem('league-games-data', JSON.stringify(games))

        localStorage.setItem('playoffs-teams-data', JSON.stringify( teams.slice(0, playoffsGamesData.teamsAmount)))
        resetDataBtn(container)

        tournamentForm(container, games, teams)

        playoffsForm(container, playoffsGamesData, teams.slice(0, playoffsGamesData.teamsAmount))
    } else if (leagueRoundsAmount) {
        const totalGames = (teamNames.length-1)*leagueRoundsAmount
    
        const teams = teamNames.map(name => new Team(name, totalGames, teamNames.length))

        const games = generateGames(teams, leagueRoundsAmount)
        localStorage.setItem('league-games-data', JSON.stringify(games))
        localStorage.setItem('total-games', totalGames)
        localStorage.setItem('teams-data', JSON.stringify(teams))

        resetDataBtn(container)

        tournamentForm(container, games, teams)

    } else if (playoffsGamesData) {
        const teamsAmount = playoffsGamesData.teamsAmount
        const difference = teamNames.length - teamsAmount
        const playoffTeams = teamNames.slice(0, -difference).map(name => new Team(name, 0, teamsAmount))

        localStorage.setItem('playoffs-teams-data', JSON.stringify(playoffTeams))
        resetDataBtn(container)

        playoffsForm(container, playoffsGamesData, playoffTeams)
    }
}



function generateGames(teams, roundsAmount) {
    let games = []

    let gameId = 0
    for (let i = 0; i < roundsAmount; i++) {
        for (let j = 0; j < teams.length; j++) {
            const homeTeam = teams[j];
            for (let m = j + 1; m < teams.length; m++) {
                const awayTeam = teams[m];
                gameId+=1

                let round = i+1
                let roundNr = Math.ceil(gameId/5)
                let game
                if ((i % 2) === 0) {
                    game = new Game(homeTeam, awayTeam, gameId, null, roundNr, round)
                } else {
                    game = new Game(awayTeam, homeTeam, gameId, null, roundNr, round)
                }
                games.push(game)
            }
        }
    }

    localStorage.setItem('league-games-data', JSON.stringify(games))
    
    return games
}