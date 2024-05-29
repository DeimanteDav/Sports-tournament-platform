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

        const regularSeasonData: null | RegularSeason = regularSeason && new RegularSeason(regularSeason._gamesAmount, regularSeason._roundsAmount, regularSeason._games, regularSeason?._relegation)

        const playoffsData: null | Playoffs = playoffs && new Playoffs(playoffs.playoffsTeams, playoffs.teamsAmount, playoffs.roundsData, playoffs.pairsData)

        if (regularSeasonData) {
            regularSeasonData.leagueTeams = regularSeason.leagueTeams
            regularSeasonData.sportType = JSON.parse(sportType)
            
            if (playoffs) {
                regularSeasonData.renderHtml(container, playoffs)
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