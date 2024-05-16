import { Container } from "../../config.js";

function generateTeams(container: Container) {
    // const teamNames = JSON.parse(localStorage.getItem('team-names'))

    // const leagueRoundsAmount = localStorage.getItem('rounds-amount')
    // const playoffsGamesData = JSON.parse(localStorage.getItem('playoffs-data'))
    // const sportId = JSON.parse(localStorage.getItem('sport')).id

    // if (leagueRoundsAmount && playoffsGamesData) {
    //     const totalGames = (teamNames.length-1)*leagueRoundsAmount
    //     const teams = teamNames.map(name => new Team(sportId, name, totalGames, teamNames.length))
    //     const games = generateGames(teams, leagueRoundsAmount)

    //     localStorage.setItem('total-games', totalGames)
    //     localStorage.setItem('teams-data', JSON.stringify(teams))
    //     localStorage.setItem('league-games-data', JSON.stringify(games))

    //     localStorage.setItem('playoffs-teams-data', JSON.stringify( teams.slice(0, playoffsGamesData.teamsAmount)))
    //     resetDataBtn(container)

    //     tournamentForm(container, games, teams)

    //     playoffsForm(container, playoffsGamesData, teams.slice(0, playoffsGamesData.teamsAmount))
    // } else if (leagueRoundsAmount) {
    //     const totalGames = (teamNames.length-1)*leagueRoundsAmount
    
    //     const teams = teamNames.map(name => new Team(sportId, name, totalGames, teamNames.length))

    //     const games = generateGames(teams, leagueRoundsAmount)
    //     localStorage.setItem('league-games-data', JSON.stringify(games))
    //     localStorage.setItem('total-games', totalGames)
    //     localStorage.setItem('teams-data', JSON.stringify(teams))

    //     resetDataBtn(container)

    //     tournamentForm(container, games, teams)

    // } else if (playoffsGamesData) {
    //     const teamsAmount = playoffsGamesData.teamsAmount
    //     const difference = teamNames.length - teamsAmount

    //     let teams
    //     if (difference > 0) {
    //         teams = teamNames.slice(0, -difference)
    //     } else {
    //         teams = teamNames
    //     }

    //     const playoffTeams = teams.map(name => new Team(sportId, name, 0, teamsAmount))

    //     localStorage.setItem('playoffs-teams-data', JSON.stringify(playoffTeams))
    //     resetDataBtn(container)

    //     playoffsForm(container, playoffsGamesData, playoffTeams)
    // }
}

export default generateTeams