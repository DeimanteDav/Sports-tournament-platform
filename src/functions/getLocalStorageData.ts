import leagueTournament from "../components/league/leagueTournament.js";
import resetDataBtn from "../components/resetDataBtn.js";
import sportTitle from "../components/sportTitle.js";
import titleWrapper from "../components/titleWrapper.js";
import { Container } from "../config.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const teamsData =  localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data') || '') : null

    const leagueGamesData = localStorage.getItem('league-games-data') ? JSON.parse(localStorage.getItem('league-games-data') || '') : null
    const playoffsData = localStorage.getItem('playoffs-data') ? JSON.parse(localStorage.getItem('playoffs-data') || '') : null

    if (leagueGamesData || playoffsData) {
       titleWrapper(container)

        if (leagueGamesData && playoffsData) {
            // leagueTournament(container, gamesData, teamsData)
            // changeTable(container, teamsData, gamesData)
    
            // playoffsForm(container, playoffsData, playoffsTeamsData, teamsData)
        } else if (leagueGamesData) {
            leagueTournament(container, leagueGamesData, teamsData)
            // changeTable(container, teamsData, gamesData)
        } else if (playoffsData) {
            // playoffsForm(container, playoffsData, playoffsTeamsData)
        }
    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData