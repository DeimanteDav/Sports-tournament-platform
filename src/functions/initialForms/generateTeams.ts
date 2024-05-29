import titleWrapper from "../../components/titleWrapper.js";
import { SPORTS } from "../../config.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballTeam from "../../classes/FootballTeam.js";
import generateGames from "./generateGames.js";
import RegularSeason from "../../classes/RegularSeason.js";
import { Container } from "../../types.js";
import Playoffs from "../../classes/Playoffs.js";

function generateTeams(container: Container, gameTypes: {playoffs?: Playoffs | null , regularSeason?: RegularSeason | null} = {playoffs: null, regularSeason: null}) {
    const teamNames: string[] = localStorage.getItem('team-names') ? JSON.parse(localStorage.getItem('team-names') || '') : null

    const {playoffs, regularSeason} = gameTypes
    const sportId = localStorage.getItem('sport-type') ? JSON.parse(localStorage.getItem('sport-type') || '').id : null

    let Team: typeof FootballTeam | typeof BasketballTeam
    if (sportId === SPORTS.football.id) {
        Team = FootballTeam
    } else if (sportId === SPORTS.basketball.id) {
        Team = BasketballTeam
    }

    console.log(regularSeason, playoffs);
    if (regularSeason) {
        const totalGames = regularSeason?.roundsAmount ? (teamNames.length-1)* regularSeason?.roundsAmount : (teamNames.length-1)
        const leagueTeams = teamNames.map((name, i) => new Team(name, i+1, totalGames, teamNames.length))

        regularSeason.leagueTeams = leagueTeams

        const games = generateGames(regularSeason)
        regularSeason.games = games
        regularSeason.gamesAmount = totalGames

        console.log(regularSeason);
        titleWrapper(container)
        // leagueTournament(container)

        if (playoffs) {
            regularSeason.renderHtml(container, playoffs)
        } else {
            regularSeason.renderHtml(container)
        }
        console.log('suveikia', regularSeason);
    } 
    if (playoffs) {
        const allTeams = teamNames.map((name, i) => new Team(name, i+1, playoffs?.teamsAmount, teamNames.length))
        const playoffTeams = allTeams.slice(0, playoffs.teamsAmount)

        playoffs.playoffsTeams = playoffTeams

        titleWrapper(container)

        playoffs.renderHtml(container)
        console.log('suveikia', playoffs);
    }
}

export default generateTeams