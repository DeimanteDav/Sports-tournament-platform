import Playoffs from "../classes/Playoffs.js";
import RegularSeason from "../classes/RegularSeason.js";
import resetDataBtn from "../components/resetDataBtn.js";
import tabs from "../components/tabs.js";
import titleWrapper from "../components/titleWrapper.js";
import { Container, TeamsType } from "../types.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"



function getLocalStorageData(container: Container) {
    const regularSeason = RegularSeason.getData()
    const playoffs = Playoffs.getData()
    const sportType = localStorage.getItem('sport-type')
    const leagueTeams = localStorage.getItem('teams')
    const leagueTeamsParsed = leagueTeams && JSON.parse(leagueTeams)

    if ((regularSeason || playoffs?._playoffsTeams.length > 0) && sportType) {
        const playoffsData = playoffs?._playoffsTeams.length > 0 ? new Playoffs(playoffs._playoffsTeams, playoffs._teamsAmount, playoffs._roundsData, playoffs._pairsData, playoffs._fightForThird) : null

        const regularSeasonData = regularSeason ?  new RegularSeason(regularSeason._gamesAmount, regularSeason._roundsAmount, regularSeason?._relegation) : null

        if (regularSeasonData) {
            regularSeasonData.sportType = regularSeason._sportType
            regularSeasonData.games = regularSeason._games
            regularSeasonData.leagueTeams = leagueTeamsParsed

            if (playoffsData) {
                regularSeasonData.renderHtml(container, playoffsData)
            } else {
                regularSeasonData.renderHtml(container)
            }
        }

        if (playoffsData) {
            playoffsData.sportType = playoffs._sportType
            playoffsData.leagueTeams = leagueTeamsParsed ? leagueTeamsParsed : []

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