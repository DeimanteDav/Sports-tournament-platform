import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballTeam from "../../classes/FootballTeam.js";
import RegularSeason from "../../classes/RegularSeason.js";
import getInbetweenTeamsGames from "../../functions/getInbetweenTeamsGames.js";
import compareTeamsButtonHandler from "../../functions/league/compareTeamsButtonHandler.js";
import { GamesType, TeamsType } from "../../types.js";

function oldLeagueTable(wrapper: HTMLElement, sportData: RegularSeason['sportType'], games: GamesType, teams: TeamsType, params: {comparisonBtn?: boolean, comparisonTable?: boolean} = {comparisonBtn: false, comparisonTable: false}) {

    const {comparisonBtn, comparisonTable} = params
    const {winPoints, drawPoints, lossPoints} = sportData.points

    const table = document.createElement('table')
    table.classList.add('table', 'old-table')
    comparisonTable && (table.id = 'comparison-table')

    const expandAllBtn = document.createElement('button')
    expandAllBtn.type = 'button'
    expandAllBtn.textContent = 'Expand All'

    const tableHead = document.createElement('thead')
    const tableBody = document.createElement('tbody')
    const tr = document.createElement('tr')

    const queueNum = document.createElement('th')
    queueNum.setAttribute('scope', 'col')
    queueNum.textContent = 'Queue No.'
    
    const teamTitleTh = document.createElement('th')
    teamTitleTh.setAttribute('scope', 'col')
    teamTitleTh.textContent = 'Team'

    tr.append(queueNum, teamTitleTh)

    teams.forEach((_, i) => {
        const th = document.createElement('th')
        th.textContent = `${i + 1}`
        th.setAttribute('scope', 'col')
        tr.append(th)
    })

    const gamesData: { text: string, property: string }[] = [
        { text: 'Points', property: 'points' },
        { text: 'Goal diff.', property: 'goalDifference' }, 
        { text: 'Place', property: 'currentPlace' }
    ]  

    gamesData.forEach(item => {
        const th = document.createElement('th')
        th.textContent = item.text
        th.setAttribute('scope', 'col')

        tr.append(th)
    })
    tableHead.append(tr)

    const roundsAmount = Number(localStorage.getItem('rounds-amount'))

    teams.forEach((team, i) => {
        const row = document.createElement('tr')

        const teamIndexEl = document.createElement('th')
        teamIndexEl.setAttribute('scope', 'row')
        teamIndexEl.textContent =`${i + 1}`
        teamIndexEl.style.padding = '10px'

        const teamTitleEl = document.createElement('th')
        teamTitleEl.setAttribute('scope', 'row')
        teamTitleEl.textContent = team.team     


        if (team.maxPlace === 1 && team.minPlace === 1) {
            row.classList.add('winner')
        }

        row.append(teamIndexEl, teamTitleEl)

        const roundsData = document.createElement('td')
        roundsData.setAttribute('colspan', teams.length.toString())
        roundsData.classList.add('rounds-data')

        const innerTable = document.createElement('table')
        innerTable.classList.add('inner-table')

        const innerTableBody = document.createElement('tbody')
        innerTableBody.id = 'rounds-info'
        innerTableBody.classList.add('hidden')

        const innerTableFoot = document.createElement('tfoot')
        const footRow = document.createElement('tr')
        const footGoalsRow = document.createElement('tr')
           

        const buttonWrapper = document.createElement('div')
        buttonWrapper.classList.add('btn-wrapper')
        teamTitleEl.append(buttonWrapper)

        if (comparisonBtn) {
            compareTeamsButtonHandler(wrapper, team, games, buttonWrapper)
        }

        const expandTeamDataBtn = document.createElement('button')
        expandTeamDataBtn.classList.add('expand-btn')
        expandTeamDataBtn.type = 'button'
        expandTeamDataBtn.textContent = 'Expand'
        
        expandTeamDataBtn.addEventListener('click', (e) => {
            if ([...innerTableBody.classList].includes('expanded')) {
                innerTableBody.className = 'hidden'
                expandTeamDataBtn.textContent = 'Expand'
            } else {
                innerTableBody.className = 'expanded'
                expandTeamDataBtn.textContent = 'Hide'
            }
        })

        buttonWrapper.append(expandTeamDataBtn)


        for (let m = 0; m < roundsAmount; m++)  {
            const innerRow = document.createElement('tr') 

            teams.forEach((otherTeam, j) => {
                const innerCell = document.createElement('td')

                if (i === j) {
                    innerCell.classList.add('empty-cell')
                } else {
                    const inbetweenGames = getInbetweenTeamsGames([team, otherTeam], games, {allGames: true})
                    console.log(inbetweenGames, inbetweenGames[m]);
                    
                    if (inbetweenGames[m]) {
                        const gameTeam = inbetweenGames[m].teams.find(gTeam => gTeam.id === team.id)
                        const gameOppTeam = inbetweenGames[m].teams.find(gTeam => gTeam.id !== team.id)
    
                        if (gameTeam && gameOppTeam) {
                            const playedIn = gameTeam.home ? 'H' : 'A'
            
        
                            const scoresEl = document.createElement('p')
                            const earnedPointsEl = document.createElement('p')
        
                            if (inbetweenGames[m].played) {
                                scoresEl.textContent = `${playedIn} ${gameTeam.goals}:${gameOppTeam.goals}`
        
                                if (gameTeam.goals && gameOppTeam.goals) {
                                    if (gameTeam.goals === gameOppTeam.goals) {
                                        earnedPointsEl.textContent = drawPoints
                                    } else if (gameTeam.goals > gameOppTeam.goals) {
                                        earnedPointsEl.textContent = winPoints
                                    } else if (gameTeam.goals < gameOppTeam.goals) {
                                        earnedPointsEl.textContent = lossPoints || 0
                                    }
                                }
                            } else {
                                scoresEl.textContent = 'X'
                            }
        
                            innerCell.append(scoresEl, earnedPointsEl)  
                        }
                    }

                }          
                innerRow.append(innerCell)

           
            })

            innerTableBody.append(innerRow)    
        }


        teams.forEach((otherTeam, j) => {
            const cell = document.createElement('td')

            const inbetweenGames = getInbetweenTeamsGames([team, otherTeam], games, {allGames: true})
            
            let pointsSum = 0
            let goalDiff = 0

            if (i === j) {
                cell.classList.add('empty-cell')
            } else {
                inbetweenGames.forEach(game => {
                    const gameTeam = game.teams.find(gTeam => gTeam.id === team.id)
                    const gameOppTeam = game.teams.find(gTeam => gTeam.id !== team.id)
    
                    if (game.played && gameTeam?.goals && gameOppTeam?.goals) {
                        if (gameTeam.goals === gameOppTeam.goals && gameTeam.goals !== null) {
                            pointsSum += drawPoints || 0 
                        } else if (gameTeam.goals > gameOppTeam.goals) {
                            pointsSum += winPoints
                        } else if (gameTeam.goals > gameOppTeam.goals) {
                            pointsSum += lossPoints || 0
                        }
    
                        goalDiff += gameTeam.goals - gameOppTeam.goals
    
                        cell.textContent = `${pointsSum}(${goalDiff})`
                    }
                })
            }

            footRow.append(cell)
        })

        innerTableFoot.append(footRow, footGoalsRow)
        innerTable.append(innerTableBody, innerTableFoot)
        roundsData.append(innerTable)
        row.append(roundsData)

        gamesData.forEach(item => {
            const cell = document.createElement('td')
            
            cell.textContent = team[item.property]

            row.append(cell)
        })

        tableBody.append(row)
    })

    expandAllBtn.addEventListener('click', (e) => {
        const innerTableBodies = [...tableBody.querySelectorAll('#rounds-info')]
        const teamExpandBtns = [...tableBody.querySelectorAll('.expand-btn')]

        if (expandAllBtn.textContent === 'Hide All') {
            innerTableBodies.forEach((item, i) => {
                teamExpandBtns[i].textContent = 'Expand'
                item.className = 'hidden'
            })

            expandAllBtn.textContent = 'Expand All'
        } else {
            innerTableBodies.forEach((item, i) => {
                teamExpandBtns[i].textContent = 'Hide'
                item.className = 'expanded'
            })
    
            expandAllBtn.textContent = 'Hide All'
        }
    })

    table.append(tableHead, tableBody, expandAllBtn)
    wrapper.append(table)
}

export default oldLeagueTable