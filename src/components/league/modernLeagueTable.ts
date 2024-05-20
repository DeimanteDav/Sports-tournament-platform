import BasketballGame from "../../classes/BasketballGame.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballGame from "../../classes/FootballGame.js";
import FootballTeam from "../../classes/FootballTeam.js";
import compareTeamsButtonHandler from "../../functions/league/compareTeamsButtonHandler.js";
import getModernTableHeadItems from "../../functions/league/getModernTableHeadItems.js";

function modernLeagueTable(wrapper: HTMLElement, games: FootballGame[] | BasketballGame[], teams: (FootballTeam | BasketballTeam)[], params: {comparisonBtn?: boolean, position?: boolean, comparisonTable?: boolean} = {comparisonBtn: false, position: false, comparisonTable: false}) {
    const {comparisonBtn, position, comparisonTable} = params

    const sportId = JSON.parse(localStorage.getItem('sport') || '').id

    const table = document.createElement('table')
    table.classList.add('table', 'modern-table')
    comparisonTable && (table.id = 'comparison-table')

    const conditions = localStorage.getItem('conditions') && JSON.parse(localStorage.getItem('conditions') || '')

    const relegations = localStorage.getItem('relegation')

    const tableHead = document.createElement('thead')
    const tableBody = document.createElement('tbody')
    const tHeadRow = document.createElement('tr')

    const headItems: {text: string, title: string | null, selector: string}[] = getModernTableHeadItems(sportId , position)

    headItems && headItems.forEach(item => {
        const th = document.createElement('th')
        th.textContent = item.text
        item.title && th.setAttribute('title', item.title)
        th.setAttribute('scope', 'col')

        tHeadRow.append(th)
    })
    tableHead.append(tHeadRow)

    // TODO: ??
    let conditionsInfoWrapper
    if (conditions) {
        conditionsInfoWrapper = document.createElement('div')
        conditionsInfoWrapper.classList.add('conditions-info-wrapper')

        wrapper.append(conditionsInfoWrapper)
    }

    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        const row = document.createElement('tr');

        headItems && headItems.forEach((item, j) => {
            const cell = document.createElement('td');
            let selector = item.selector

            let value
            if (typeof (team as any)[selector] === 'object') {
                const selected = (team as any)[selector]
                value = `${selected.won} - ${selected.lost}`
            } else {
                value = (team as any)[selector]
            }

            cell.textContent = value !== undefined ? value : ''

            row.append(cell)

            if (comparisonBtn && j === 1) {
                compareTeamsButtonHandler(wrapper, team, games, cell)
            }

            if (relegations && comparisonBtn) {
                const lastPlace = teams.length - (relegations ? +relegations : 0)

                if (i === lastPlace) {
                    row.classList.add('relegation')
                }
            }
        });
    
        
        tableBody.appendChild(row);
    }

    table.append(tableHead, tableBody)

    wrapper.append(table)
}

export default modernLeagueTable