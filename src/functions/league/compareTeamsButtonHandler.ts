import comparisonTable from "../../components/league/comparisonTable.js";
import BasketballGame from "../../classes/BasketballGame.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballGame from "../../classes/FootballGame.js";
import FootballTeam from "../../classes/FootballTeam.js";

function compareTeamsButtonHandler(wrapper: HTMLElement, team: FootballTeam | BasketballTeam, games: FootballGame[] | BasketballGame[], btnWrapper: HTMLElement) {
    let comparingTeams: FootballTeam[] | BasketballTeam[] = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams') || '') : []

    const btn = document.createElement('button')
    btn.classList.add('comparison-btn')
    btn.type = 'button'
    
    btn.textContent = comparingTeams.some(comparingTeam => comparingTeam.team === team.team) ? '-' : '+'

    btn.addEventListener('click', (e) => {  
        comparingTeams = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams') || '') : []

        if (comparingTeams.some(comparingTeam => comparingTeam.team === team.team)) {
            comparingTeams = comparingTeams.filter(comparingTeam => comparingTeam.team !== team.team)
            btn.textContent = '+'
        } else {
            comparingTeams.push(team)
            btn.textContent = '-'
        }

        localStorage.setItem('comparing-teams', JSON.stringify(comparingTeams))
        
        const oldTable = document.getElementById('comparison-table')
        console.log(oldTable);
        oldTable && oldTable.remove()
        
        if (comparingTeams.length > 0) {
            comparisonTable(wrapper, games)
        }
    })

    btnWrapper.append(btn)
}

export default compareTeamsButtonHandler