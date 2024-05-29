import { Container, GamesType, TeamsType } from "../../types.js";
import checkTeamPosition from "../../functions/league/checkTeamPosition.js";
import sortTeams from "../../functions/sortTeams.js";
import comparisonTable from "./comparisonTable.js";
import modernLeagueTable from "./modernLeagueTable.js";
import oldLeagueTable from "./oldLeagueTable.js";
import RegularSeason from "../../classes/RegularSeason.js";

function leagueTable(container: Container, data: RegularSeason) {
    const {leagueTeams: teams, games, sportType} = data

    const sortedTeams = sortTeams(sportType.id, data.leagueTeams, games, {compareBetweenGames: true})

    sortedTeams.forEach((sortedTeam, i) => {
        sortedTeam.currentPlace = i + 1

        if (games.some(game => game.played)) {
            sortedTeam.maxPlace = i + 1
            sortedTeam.minPlace = i + 1
        }
    })

    if (games.some(game => game.played)) {
        checkTeamPosition(sortedTeams, games)
    }

    const oldTableWrapper = document.querySelector('.table-wrapper')
    let tableWrapper: HTMLElement

    if (oldTableWrapper) {
        oldTableWrapper.innerHTML = ''
        tableWrapper = oldTableWrapper as HTMLElement
    } else {
        tableWrapper = document.createElement('div')
        tableWrapper.classList.add('table-wrapper')
    
        container.append(tableWrapper)
    }


    const tableType = localStorage.getItem('table-type') ? localStorage.getItem('table-type') : 'modern'

    if (tableType === 'old') {
        oldLeagueTable(tableWrapper, data.sportType, games, teams, {comparisonBtn: true})
    } else {
        modernLeagueTable(tableWrapper, data.sportType, games, sortedTeams, {comparisonBtn: true, position: true})
    }

    const comparingTeams: TeamsType = localStorage.getItem('comparing-teams') && JSON.parse(localStorage.getItem('comparing-teams') || '')

    if (comparingTeams?.length > 0) {
        const updatedTeams = comparingTeams.map(oldTeam => {
            const updatedTeam = teams.find(team => team.team === oldTeam.team)

            return updatedTeam
        })
        localStorage.setItem('comparing-teams', JSON.stringify(updatedTeams))

        comparisonTable(tableWrapper, data)
    }
}

export default leagueTable