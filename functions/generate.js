import Game from "../classes/Game.js";
import Team from "../classes/Team.js";
import resetDataBtn from "../components/resetDataBtn.js";
import playoffsForm from "../playoffs/playoffsForm.js";
import { tournamentForm } from "../script.js";

export default function generateTeams(container) {
    const teamNames = JSON.parse(localStorage.getItem('team-names'))

    const leagueRoundsAmount = localStorage.getItem('rounds-amount')
    const playoffsGamesData = JSON.parse(localStorage.getItem('playoffs-data'))
    const sportId = JSON.parse(localStorage.getItem('sport')).id

    if (leagueRoundsAmount && playoffsGamesData) {
        const totalGames = (teamNames.length-1)*leagueRoundsAmount
        const teams = teamNames.map(name => new Team(sportId, name, totalGames, teamNames.length))
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
    
        const teams = teamNames.map(name => new Team(sportId, name, totalGames, teamNames.length))

        const games = generateGames(teams, leagueRoundsAmount)
        localStorage.setItem('league-games-data', JSON.stringify(games))
        localStorage.setItem('total-games', totalGames)
        localStorage.setItem('teams-data', JSON.stringify(teams))

        resetDataBtn(container)

        tournamentForm(container, games, teams)

    } else if (playoffsGamesData) {
        const teamsAmount = playoffsGamesData.teamsAmount
        const difference = teamNames.length - teamsAmount

        let teams
        if (difference > 0) {
            teams = teamNames.slice(0, -difference)
        } else {
            teams = teamNames
        }

        const playoffTeams = teams.map(name => new Team(sportId, name, 0, teamsAmount))

        localStorage.setItem('playoffs-teams-data', JSON.stringify(playoffTeams))
        resetDataBtn(container)

        playoffsForm(container, playoffsGamesData, playoffTeams)
    }
}



function generateGames(teams, roundsAmount) {
    const sportId = JSON.parse(localStorage.getItem('sport')).id

    let games = []
    const gamesByRounds = {}
    let gameId = 0
    for (let i = 0; i < roundsAmount; i++) {
        if (!gamesByRounds[i+1]) {
            gamesByRounds[i+1] = []
        }

        for (let j = 0; j < teams.length; j++) {
            let roundNrr = 0
            const homeTeam = teams[j];
            for (let m = j + 1; m < teams.length; m++) {
                const awayTeam = teams[m];
                gameId+=1

                let round = i+1
                // let roundNrr = Math.ceil(gameId / (teams.length * (teams.length - 1) / 2));
                let roundNr = Math.ceil(gameId/5)

                let game
                if ((i % 2) === 0) {
                    game = new Game(sportId, homeTeam, awayTeam, gameId, null, null, round)
                } else {
                    game = new Game(sportId, awayTeam, homeTeam, gameId, null, null, round)
                }
                games.push(game)

            }
        }
    }


    games.map(game => {
        gamesByRounds[game.round].push(game)
    })

    Object.values(gamesByRounds).forEach(games => {
        let roundNr = 1

        let innerRoundTeams = {
            1: []
        }
        
        games.forEach((game, i) => {

            let availableRound = [...Object.keys(innerRoundTeams)].find(round => {
                console.log(innerRoundTeams[round], round, game);
                if (!innerRoundTeams[+round].includes(game.awayTeam.team) && !innerRoundTeams[+round].includes(game.homeTeam.team)) {
                    return round
                }
            })
            roundNr = availableRound ? +availableRound : +[...Object.keys(innerRoundTeams)].pop()+1
            game.roundNr = roundNr

            if (!innerRoundTeams[roundNr]) {
                innerRoundTeams[roundNr] = []
            }
            innerRoundTeams[roundNr].push(game.homeTeam.team)
            innerRoundTeams[roundNr].push(game.awayTeam.team)
           
        })
    })

    localStorage.setItem('league-games-data', JSON.stringify(games))
    
    return games
}