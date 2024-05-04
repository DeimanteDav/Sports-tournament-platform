import { DRAW_POINTS, MODERN_TABLE_HEAD_ITEMS, WIN_POINTS } from "../config.js"
import { compareTeamsTable } from "../script.js"
import getInbetweenTeamsGames from "./getInbetweenTeamsGames.js"

export function createModernTable(wrapper, teams, games, params = {}) {
    const {comparinsonBtn, position} = params

    const sportId = JSON.parse(localStorage.getItem('sport')).id

    const table = document.createElement('table')
    table.classList.add('table', 'modern-table')
    const conditions = JSON.parse(localStorage.getItem('conditions'))
    const relegations = localStorage.getItem('relegation')

    const tableHead = document.createElement('thead')
    const tableBody = document.createElement('tbody')
    const tHeadRow = document.createElement('tr')

    const headItems = MODERN_TABLE_HEAD_ITEMS[sportId](position)
    // const headItems = [
    //     { text: '#',  title: null },
    //     { text: 'Team', title: null },
    //     ...(position ? [{ text: 'Highest', title: null }, { text: 'Lowest', title: null }] : []),
    //     { text: 'PL', title: 'Played Matches' },
    //     { text: 'W', title: 'Wins' },
    //     { text: 'D', title: 'Draws' },
    //     { text: 'L', title: 'Losses' },
    //     { text: 'F', title: 'Goals For' },
    //     { text: 'A', title: 'Goals Against' },
    //     { text: 'GD', title: 'Goal Difference' },
    //     { text: 'P', title: 'Points' },
    // ]

    headItems.forEach(item => {
        const th = document.createElement('th')
        th.textContent = item.text
        item.title && th.setAttribute('title', item.title)
        th.setAttribute('scope', 'col')

        tHeadRow.append(th)
    })
    tableHead.append(tHeadRow)

    let conditionsInfoWrapper
    if (conditions) {
        conditionsInfoWrapper = document.createElement('div')
        conditionsInfoWrapper.classList.add('conditions-info-wrapper')
        wrapper.append(conditionsInfoWrapper)
    }

    console.log(headItems);
    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        const row = document.createElement('tr');

        headItems.forEach((item, j) => {
            const cell = document.createElement('td');
            let selector = item.selector

            let value
            if (typeof selector === 'object') {
                const selected = team[selector.prop]
                // value = `${selected[selector.inside[0]]} - ${selected[selector.inside[1]]}`;
            } else {
                value = team[selector]
            }
            cell.textContent = value !== undefined ? value : ''

            row.append(cell)

            if (comparinsonBtn && j === 1) {
                compareTeamsButtonHandler(wrapper, team, games, cell, 'modern')
            }

            if (relegations) {
                const lastPlace = teams.length - relegations
                if (i === lastPlace) {
                    row.classList.add('relegation')
                }
            }

        });
    
        
        tableBody.appendChild(row);
    }

    table.append(tableHead, tableBody)

    return table
}


export function createOldTable(wrapper, teams, games, params = {}) {
    const {comparinsonBtn} = params

    const table = document.createElement('table')
    table.classList.add('table', 'old-table')

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
        th.textContent = i + 1
        th.setAttribute('scope', 'col')
        tr.append(th)
    })

    const gamesData = [
        {text: 'Points', property: 'points'},
        {text: 'Goal diff.', property: 'goalDifference'}, 
        {text: 'Place', property: 'currentPlace'}
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
        teamIndexEl.textContent = i + 1
        teamIndexEl.style.padding = '10px'

        const teamTitleEl = document.createElement('th')
        teamTitleEl.setAttribute('scope', 'row')
        teamTitleEl.textContent = team.team     


        if (team.maxPlace === 1 && team.minPlace === 1) {
            row.classList.add('winner')
        }

        row.append(teamIndexEl, teamTitleEl)

        const roundsData = document.createElement('td')
        roundsData.setAttribute('colspan', teams.length)
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

        if (comparinsonBtn) {
            compareTeamsButtonHandler(wrapper, team, games, buttonWrapper, 'old')
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
    
                    const teamGoals = inbetweenGames[m].homeTeam.team === team.team ? inbetweenGames[m].homeTeam.goals : inbetweenGames[m].awayTeam.goals
                    const playedIn = inbetweenGames[m].homeTeam.team === team.team ? 'H' : 'A'
    
                    const otherTeamGoals = inbetweenGames[m].homeTeam.team === otherTeam.team ? inbetweenGames[m].homeTeam.goals : inbetweenGames[m].awayTeam.goals

                    const scoresEl = document.createElement('p')
                    const earnedPointsEl = document.createElement('p')

                    if (inbetweenGames[m].played) {
                        scoresEl.textContent = `${playedIn} ${teamGoals}:${otherTeamGoals}`

                        if (teamGoals === otherTeamGoals) {
                            earnedPointsEl.textContent = DRAW_POINTS
                        } else if (teamGoals > otherTeamGoals) {
                            earnedPointsEl.textContent = WIN_POINTS
                        } else {
                            earnedPointsEl.textContent = 0
                        }
                    } else {
                        scoresEl.textContent = 'X'
                    }

                    innerCell.append(scoresEl, earnedPointsEl)  
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
                    const teamGoals = game.homeTeam.team === team.team ? game.homeTeam.goals : game.awayTeam.goals
            
                    const otherTeamGoals = game.homeTeam.team === otherTeam.team ? game.homeTeam.goals : game.awayTeam.goals
    
                    if (game.played) {
                        if (teamGoals === otherTeamGoals) {
                            pointsSum+= DRAW_POINTS
                        } else if (teamGoals > otherTeamGoals) {
                            pointsSum+= WIN_POINTS
                        } else {
                            pointsSum+=0
                        }
    
                        goalDiff+=teamGoals-otherTeamGoals
    
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
        console.log(teamExpandBtns);


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

    return table
}


function compareTeamsButtonHandler(wrapper, team, games, btnWrapper, tableType) {
    let comparingTeams = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams')) : []

    const btn = document.createElement('button')
    btn.classList.add('comparison-btn')
    btn.type = 'button'
    
    btn.textContent = comparingTeams.some(comparingTeam => comparingTeam.team === team.team) ? '-' : '+'

    btn.addEventListener('click', (e) => {  
        comparingTeams = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams')) : []

        if (comparingTeams.some(comparingTeam => comparingTeam.team === team.team)) {
            comparingTeams = comparingTeams.filter(comparingTeam => comparingTeam.team !== team.team)
            btn.textContent = '+'
        } else {
            comparingTeams.push(team)
            btn.textContent = '-'
        }

        localStorage.setItem('comparing-teams', JSON.stringify(comparingTeams))
        
        
        document.getElementById('comparing-table') && document.getElementById('comparing-table').remove()
        
        if (comparingTeams.length > 0) {
            const teamsTable = compareTeamsTable(wrapper, comparingTeams, games, tableType)
            wrapper.append(teamsTable)
        }
    })

    btnWrapper.append(btn)
}