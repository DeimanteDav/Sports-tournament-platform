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

        const playoffsData = playoffs ? new Playoffs(playoffs._playoffsTeams, playoffs._teamsAmount, playoffs._roundsData, playoffs._pairsData) : null
        
        if (regularSeason) {
            const regularSeasonData = new RegularSeason(regularSeason._gamesAmount, regularSeason._roundsAmount, regularSeason._games, regularSeason?._relegation)


            regularSeasonData.sportType = regularSeason._sportType
            regularSeasonData.leagueTeams = regularSeason._leagueTeams

            if (playoffsData) {
                regularSeasonData.renderHtml(container, playoffsData)
            } else {
                regularSeasonData.renderHtml(container)
            }
        }

        if (playoffsData) {
            playoffsData.sportType = playoffs._sportType
            playoffsData.leagueTeams = regularSeason ? regularSeason._leagueTeams : []

            playoffsData.playoffsTeams = playoffs._playoffsTeams
            playoffsData.renderHtml(container)
        }
    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData