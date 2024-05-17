import leagueTournament from "../../components/league/leagueTournament.js";
import resetDataBtn from "../../components/resetDataBtn.js";
import { Container, SPORTS } from "../../config.js";
import BasketballTeam from "../classes/BasketballTeam.js";
import FootballTeam from "../classes/FootballTeam.js";
import generateGames from "./generateGames.js";

function generateTeams(container: Container) {
    const teamNames: string[] = localStorage.getItem('team-names') ? JSON.parse(localStorage.getItem('team-names') || '') : null

    const leagueRoundsAmount = localStorage.getItem('rounds-amount') ? JSON.parse(localStorage.getItem('rounds-amount') || '') : null
    const playoffsData = localStorage.getItem('playoffs-data') ? JSON.parse(localStorage.getItem('playoffs-data') || '') : null
    const sportId = localStorage.getItem('sport') ? JSON.parse(localStorage.getItem('sport') || '').id : null

    let Team = sportId === SPORTS.football.id ? FootballTeam : BasketballTeam

    const totalGames = leagueRoundsAmount ? (teamNames.length-1)*leagueRoundsAmount : (teamNames.length-1)
    const leagueTeams = teamNames.map((name, i) => new Team(name, i+1, totalGames, teamNames.length))

    if (leagueRoundsAmount) {
        const games = generateGames(sportId, leagueTeams, leagueRoundsAmount)

        localStorage.setItem('total-games', JSON.stringify(totalGames))
        localStorage.setItem('teams-data', JSON.stringify(leagueTeams))
        localStorage.setItem('league-games-data', JSON.stringify(games))


        resetDataBtn(container)

        leagueTournament(container, games, leagueTeams)

        if (playoffsData) {
            const playoffTeams = leagueTeams.slice(0, playoffsData.teamsAmount)
            localStorage.setItem('playoffs-teams-data', JSON.stringify(playoffTeams))
            //     playoffsForm(container, playoffsData, teams.slice(0, playoffsData.teamsAmount))

        }
    } else if (playoffsData) {
        const playoffTeams = leagueTeams.slice(0, playoffsData.teamsAmount)

        localStorage.setItem('playoffs-teams-data', JSON.stringify(playoffTeams))
        
        resetDataBtn(container)

    //     playoffsForm(container, playoffsData, playoffTeams)
    }
}

export default generateTeams