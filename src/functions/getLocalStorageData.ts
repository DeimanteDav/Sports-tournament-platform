import leagueTournament from "../components/league/leagueTournament.js";
import playoffsForm from "../components/playoffs/playoffsForm.js";
import titleWrapper from "../components/titleWrapper.js";
import { Container } from "../config.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const teamsData =  localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data') || '') : null

    const leagueGamesData = localStorage.getItem('league-games-data') ? JSON.parse(localStorage.getItem('league-games-data') || '') : null

    const playoffsTeamsData = localStorage.getItem('playoffs-teams-data') ? JSON.parse(localStorage.getItem('playoffs-teams-data') || '') : null
    const playoffsData = localStorage.getItem('playoffs-data') ? JSON.parse(localStorage.getItem('playoffs-data') || '') : null

    if (leagueGamesData || playoffsData) {
       titleWrapper(container)

        if (leagueGamesData && playoffsData) {
            leagueTournament(container, leagueGamesData, teamsData)
            playoffsForm(container, playoffsData, playoffsTeamsData)
        } else if (leagueGamesData) {
            leagueTournament(container, leagueGamesData, teamsData)
        } else if (playoffsData) {
            playoffsForm(container, playoffsData, playoffsTeamsData)
        }
    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData