import Playoffs from "../classes/Playoffs.js";
import RegularSeason from "../classes/RegularSeason.js";
import titleWrapper from "../components/titleWrapper.js";
import { Container } from "../types.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const regularSeason = RegularSeason.getData()
    const playoffs = Playoffs.getData()
    const sportType = localStorage.getItem('sport-type')

    if ((regularSeason || playoffs) && sportType) {
        titleWrapper(container)

        const playoffsData: null | Playoffs = playoffs && new Playoffs(playoffs.playoffsTeams, playoffs.teamsAmount, playoffs.roundsData, playoffs.pairsData)
        
        if (regularSeason) {
            const regularSeasonData = new RegularSeason(regularSeason._gamesAmount, regularSeason._roundsAmount, regularSeason._games, regularSeason?._relegation)

            regularSeasonData.leagueTeams = regularSeason.leagueTeams
            regularSeasonData.sportType = JSON.parse(sportType)
            
            if (playoffsData) {
                regularSeasonData.renderHtml(container, playoffsData)
            } else {
                regularSeasonData.renderHtml(container)
            }
        }

        if (playoffsData) {
            playoffsData.leagueTeams = regularSeason ? regularSeason.leagueTeams : []
            playoffsData.sportType = JSON.parse(sportType)

            playoffsData.renderHtml(container)
        }
    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData