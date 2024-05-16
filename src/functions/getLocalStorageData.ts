import { Container } from "../config.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const teamsData =  localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data') || '') : null

    const leagueGamesData = localStorage.getItem('league-games-data') ? JSON.parse(localStorage.getItem('league-games-data') || '') : null
    const playoffsData = localStorage.getItem('playoffs-data') ? JSON.parse(localStorage.getItem('playoffs-data') || '') : null

    if (leagueGamesData || playoffsData) {
        // resetDataBtn(container)
        // if (leagueGamesData && playoffsData) {
        //     tournamentForm(container, gamesData, teamsData)
        //     changeTable(container, teamsData, gamesData)
    
        //     playoffsForm(container, playoffGamesData, playoffsTeamsData, teamsData)
        // } else if (gamesData) {
        //     tournamentForm(container, gamesData, teamsData)
        //     changeTable(container, teamsData, gamesData)
        // } else if (playoffGamesData) {
        //     playoffsForm(container, playoffGamesData, playoffsTeamsData)
        // }
        console.log(leagueGamesData, playoffsData);
    } else {
        console.log(leagueGamesData, playoffsData);
        // sportTypeForm(container)
    }
}

export default getLocalStorageData