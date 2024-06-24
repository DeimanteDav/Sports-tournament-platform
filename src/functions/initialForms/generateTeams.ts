import titleWrapper from "../../components/titleWrapper.js";
import generateGames from "./generateGames.js";
import RegularSeason from "../../classes/RegularSeason.js";
import { Container } from "../../types.js";
import Playoffs from "../../classes/Playoffs.js";

function generateTeams(container: Container, gameTypes: {playoffs?: Playoffs | null , regularSeason?: RegularSeason | null} = {playoffs: null, regularSeason: null}) {
    const teamNames: string[] = localStorage.getItem('team-names') ? JSON.parse(localStorage.getItem('team-names') || '') : null

    const {playoffs, regularSeason} = gameTypes
    const sportId = localStorage.getItem('sport-type') ? JSON.parse(localStorage.getItem('sport-type') || '').id : null


    if (regularSeason) {
        const totalGames = regularSeason?.roundsAmount ? (teamNames.length-1)* regularSeason?.roundsAmount : (teamNames.length-1)


        const leagueTeams = teamNames.map((name, i) => {
            return {team: name, id: i+1, totalGames: totalGames, minPlace: teamNames.length}
        })

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
        const allTeams = teamNames.map((name, i) => {
            return {team: name, id: i+1, totalGames: playoffs?.teamsAmount, minPlace: teamNames.length}
        })

        playoffs.leagueTeams = allTeams
        const playoffTeams = allTeams.slice(0, playoffs.teamsAmount)

        playoffs.playoffsTeams = playoffTeams

        titleWrapper(container)

        playoffs.renderHtml(container)
        console.log('suveikia', playoffs);
    }
}

export default generateTeams