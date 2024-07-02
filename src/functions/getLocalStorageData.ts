import Playoffs from "../classes/Playoffs.js";
import RegularSeason from "../classes/RegularSeason.js";
import tabs from "../components/tabs.js";
import titleWrapper from "../components/titleWrapper.js";
import { Container } from "../types.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const regularSeason = RegularSeason.getData()
    const playoffs = Playoffs.getData()
    const sportType = localStorage.getItem('sport-type')
    const leagueTeams = localStorage.getItem('teams')


    if ((regularSeason || playoffs) && sportType) {

  
        

        const playoffsData = playoffs ? new Playoffs(playoffs._playoffsTeams, playoffs._teamsAmount, playoffs._roundsData, playoffs._pairsData) : null

        const regularSeasonData =  playoffs ?  new RegularSeason(regularSeason._gamesAmount, regularSeason._roundsAmount, regularSeason?._relegation) : null
        
        if (regularSeasonData) {
            regularSeasonData.sportType = regularSeason._sportType
            regularSeasonData.games = regularSeason._games
            regularSeasonData.leagueTeams = JSON.parse(leagueTeams || '')

            if (playoffsData) {
                regularSeasonData.renderHtml(container, playoffsData)
            } else {
                regularSeasonData.renderHtml(container)
            }
        }

        if (playoffsData) {
            playoffsData.sportType = playoffs._sportType
            playoffsData.leagueTeams = regularSeason ?  JSON.parse(leagueTeams || '') : []

            playoffsData.playoffsTeams = playoffs._playoffsTeams
            playoffsData.renderHtml(container)
        }

        if (regularSeasonData && playoffsData) {
            tabs(container, regularSeasonData, playoffsData)
        }

        titleWrapper(container)
    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData