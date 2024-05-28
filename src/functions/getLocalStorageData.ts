import League from "../classes/League.js";
import Playoffs from "../classes/Playoffs.js";
import RegularSeason from "../classes/RegularSeason.js";
import leagueTournament from "../components/league/leagueTournament.js";
import playoffsForm from "../components/playoffs/playoffsForm.js";
import titleWrapper from "../components/titleWrapper.js";
import { SPORTS } from "../config.js";
import { Container } from "../types.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const regularSeason = RegularSeason.getData()
    const playoffs = Playoffs.getData()
    const sportType = localStorage.getItem('sport-type')

    if ((regularSeason || playoffs) && sportType) {
        titleWrapper(container)
        // const sportType = JSON.parse(localStorage.getItem('sport-type') || '').id

        if (regularSeason) {
            // leagueTournament(container)
            const regularSeasonData = new RegularSeason(regularSeason._gamesAmount, regularSeason._roundsAmount, regularSeason._games, regularSeason?._relegation)
            
            regularSeasonData.leagueTeams = regularSeason.leagueTeams
            regularSeasonData.sportType = JSON.parse(sportType)
            
            regularSeasonData.renderHtml(container)

            console.log(regularSeasonData);
            // leagueTournament(container)
        }

        if (playoffs) {
            const playoffsData = new Playoffs(playoffs.playoffsTeams, playoffs.teamsAmount, playoffs.roundsData, playoffs.pairsData)

            playoffsData.leagueTeams = regularSeason ? regularSeason.leagueTeams : []

            playoffsData.sportType = JSON.parse(sportType)

            // playoffsData.playoffsTeams = playoffs.teams
            // playoffsData.teamsAmount = playoffs.teamsAmount
            // playoffsData.roundsData = playoffs.roundsData
            // playoffsData.pairsData = playoffs.pairsData

            playoffsForm(container)
        }
    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData