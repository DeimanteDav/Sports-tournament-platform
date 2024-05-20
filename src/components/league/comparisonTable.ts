import BasketballGame from "../../functions/classes/BasketballGame.js";
import BasketballTeam from "../../functions/classes/BasketballTeam.js";
import FootballGame from "../../functions/classes/FootballGame.js";
import FootballTeam from "../../functions/classes/FootballTeam.js";
import compareGamesData from "../../functions/league/compareGamesData.js";
import getModernTableHeadItems from "../../functions/league/getModernTableHeadItems.js";
import sortTeams from "../../functions/sortTeams.js";
import modernLeagueTable from "./modernLeagueTable.js";
import oldLeagueTable from "./oldLeagueTable.js";

function comparisonTable(wrapper: HTMLElement, games: FootballGame[] | BasketballGame[]) {
    const teams = localStorage.getItem('comparing-teams') && JSON.parse(localStorage.getItem('comparing-teams') || '')

    const sportId: number = localStorage.getItem('sport') && JSON.parse(localStorage.getItem('sport') || '').id
    const tableType = localStorage.getItem('table-type')

    const teamsGamesDataObject = compareGamesData(teams, games)

    const teamsData = teamsGamesDataObject && Object.values(teamsGamesDataObject).map((data) => ({...data}))

    const sortedTeams = sortTeams(teamsData, games)


    let updatedTeams

    if (sortedTeams.length > 0) {
        updatedTeams = sortedTeams
    } else if (teams.length === 1) {
        const headItems = getModernTableHeadItems(sportId)

        const team = {...teams[0]}
        headItems?.forEach((item, i) => {
            if (i !== 0) {
                if (typeof team[item.selector] === 'number') {
                    console.log(team[item.selector]);
                    team[item.selector] = 0
                } else if (typeof team[item.selector] === 'object') {
                    console.log(team[item.selector]);
    
                    team[item.selector].won = 0
                    team[item.selector].lost = 0
                }
            }
        })
        
        updatedTeams = [team]
    }

    if (!updatedTeams) {
        return
    }
    
    if (tableType === 'old') {
        oldLeagueTable(wrapper, games, updatedTeams, {comparisonTable: true})
    } else {
        modernLeagueTable(wrapper, games, updatedTeams, {comparisonTable: true})
    }
}

export default comparisonTable