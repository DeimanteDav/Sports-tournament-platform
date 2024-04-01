const container = document.querySelector('.container')
const resetDataBtn = document.getElementById('reset-data-btn')
// resetDataBtn.style.display = 'none'

const WIN_POINTS = 3
const DRAW_POINTS = 1
const LOSE_POINTS = 0


// Pradzioj kad butu forma. Kiek komandu turnyre.
// Komandu pavadinimus irasyti.

// Kiek rounds.
const ROUNDS = 2

// ISSAUGOTI LOCAL STORAGE
// Resetint



class Team {
    constructor(team, totalGames, minPlace) {
        this.team = team
        this.playedGames = 0
        this.wins = 0
        this.draws = 0
        this.losses = 0
        this.goals = 0
        this.goalsMissed = 0
        this.goalDifference = 0
        this.awayGoals = 0
        this.awayWins = 0
        this.points = 0
        this.gamesLeft = 0

        this.potentialPoints = 0
        this.maxPotentialPoints = 0

        this.currentPlace = 0
        this.maxPlace = 1
        this.minPlace = minPlace

        this.totalGames = totalGames
    }

    setGamesLeft() {
        this.gamesLeft = this.totalGames - this.playedGames
    }
    
    setPotentialPoints(winPoints) {
        this.potentialPoints = this.gamesLeft*winPoints
        this.maxPotentialPoints = this.potentialPoints + this.points
    }
}


class Game {
    constructor(homeTeam, awayTeam) {
        this.homeTeam = {
            team: homeTeam.team,
            goals: 0
        }
        this.awayTeam = {
            team: awayTeam.team,
            goals: 0
        }
        this.played = false
        this.id
    }
}



function getLocalStorageData(container) {
    const teamsData = localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data')) : null
    const gamesData = localStorage.getItem('games-data') ? JSON.parse(localStorage.getItem('games-data')) : null
    const comparingTeams = JSON.parse(localStorage.getItem('comparing-teams'))

    if (teamsData && gamesData) {
        tournamentForm(container, gamesData, teamsData)
        changeTable(container, teamsData, gamesData)

        if (comparingTeams) {
            compareTeamsTable(container, comparingTeams, gamesData)
        }
    } else {
        teamsAmountForm(container)
    }
}
getLocalStorageData(container)


function teamsAmountForm(container) {
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many teams in tournament?'
    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 2
    input.max = 10

    wrapper.append(text, input)
    
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    form.append(wrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = e.target.amount.value
    
        if (amount) {
            form.remove()
            teamNamesForm(container, amount)
        }
    })
}


function teamNamesForm(container, teamsAmount) {
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    for (let i = 0; i < teamsAmount; i++) {
        const div = document.createElement('div')
        const number = document.createElement('span')
        number.textContent = `${i+1}.`
        const input = document.createElement('input')
        input.type = 'text'
        input.required = true

        div.append(number, input)
        wrapper.append(div)
    }


    form.append(wrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const teamNamesElements = [...document.querySelectorAll('input')]

        const teamNames = teamNamesElements.map(teamNameElement => teamNameElement.value)


        localStorage.setItem('team-names', JSON.stringify(teamNames))

        form.remove()

        generateTeams(container)

    })
}

function generateTeams(container) {
    const teamNames = JSON.parse(localStorage.getItem('team-names'))
    const totalGames = (teamNames.length-1)*ROUNDS
    const teams = teamNames.map(name => new Team(name, totalGames, teamNames.length))

    const games = generateGames(container, teams)
    tournamentForm(container, games, teams)

    localStorage.setItem('total-games', totalGames)
    localStorage.setItem('teams-data', JSON.stringify(teams))

    return teams
}


function generateGames(container, teams) {
    let games = []

    for (let i = 0; i < teams.length; i++) {
        const homeTeam = teams[i];

        for (let j = i + 1; j < teams.length; j++) {

            const awayTeam = teams[j];
            
            const game = new Game(homeTeam, awayTeam)
            games.push(game)
        }
    }

    for (let i = 0; i < teams.length; i++) {
        const homeTeam = teams[i];
    
        for (let j = i + 1; j < teams.length; j++) {
            const awayTeam = teams[j];
            
            const game = new Game(awayTeam, homeTeam)
            games.push(game)
        }
    }

    games.forEach((game, i) => {
        game.id = i + 1
    })

    changeTable(container, teams, games)

    localStorage.setItem('games-data', JSON.stringify(games))
    
    return games
}


function tournamentForm(container, games, teams) {
    const gamesForm = document.createElement('form')
    gamesForm.id = 'games-wrapper'



    const round1 = document.createElement('div')
    round1.className = 'round'
    const round2 = document.createElement('div')
    round2.className = 'round'

    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        const gameNumber = document.createElement('p')

        const gameEl = document.createElement('div')
        gameEl.classList.add('game')

        gameWrapper.append(gameNumber, gameEl)
        game.played && gameWrapper.classList.add('played')

        gameEl.dataset.gameId = game.id
        gameNumber.textContent = `${game.id}.`

        if (i < Math.round(games.length/2)) {
            round1.append(gameWrapper)
        } else {
            round2.append(gameWrapper)
        }

        for (let team in game) {
            if (team == 'homeTeam' || team === 'awayTeam') {
                const teamWrapper = document.createElement('div')
                teamWrapper.classList.add('team')
    
                if (team === 'homeTeam') {
                    teamWrapper.classList.add('home-team')
                } else {
                    teamWrapper.classList.add('away-team')
                }
    
                const label = document.createElement('label')
                const input = document.createElement('input')               
                input.type = 'number'
                input.dataset.team = game[team].team
                label.htmlFor = input.id
                label.textContent = game[team].team
                input.classList.add('result-input')
                input.value = game.played ? game[team].goals : ''           
                
                teamWrapper.append(label, input)

                gameEl.append(teamWrapper) 
            }
        }
    }

    gamesForm.append(round1, round2)
    container.prepend(gamesForm)

    gamesForm.addEventListener('change', (e) => {
        const gameEl = e.target.parentElement.parentElement
        const homeTeamInput = gameEl.querySelector('.home-team .result-input')
        const awayTeamInput = gameEl.querySelector('.away-team .result-input')
    
        const homeTeamScored = Number(homeTeamInput.value)
        const awayTeamScored = Number(awayTeamInput.value)
    
        const currentGame = games[gameEl.dataset.gameId-1]
    
    
        if (homeTeamInput.value && awayTeamInput.value) {
            currentGame.played = true
            gameEl.parentElement.classList.add('played')
        } else {
            currentGame.played = false
            gameEl.parentElement.classList.remove('played')
        }
    
        const gameHomeTeamData = currentGame.homeTeam
        const gameAwayTeamData = currentGame.awayTeam
    
        gameHomeTeamData.goals = homeTeamScored
        gameAwayTeamData.goals = awayTeamScored
    
    
        localStorage.setItem('games-data', JSON.stringify(games))
        updateTeamsData(games, teams)
    })

    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'RESET'
    resetBtn.id = 'reset-btn'

    gamesForm.after(resetBtn)

    resetBtn.addEventListener('click', (e) => {
        localStorage.removeItem('team-names')
        localStorage.removeItem('total-games')
        localStorage.removeItem('teams-data')
        localStorage.removeItem('games-names')
        localStorage.removeItem('comparing-teams')
    
        container.innerHTML = ''
        
        teamsAmountForm(container)
    })
}


function updateTeamsData(games, teams) {
    teams.forEach(team => {
        for (const [key, value] of Object.entries(team)) {
            if (key !== 'team') {
                if (Number(value)) {
                    team[key] = 0
                }
                if (typeof value === 'boolean') {
                    team[key] = false
                }
            }
        }
    })
    
    games.forEach(game => {
        const gameHomeTeam = game.homeTeam
        const gameAwayTeam = game.awayTeam
        

        const homeTeamData = teams.find(team => team.team === gameHomeTeam.team)
        const awayTeamData = teams.find(team => team.team === gameAwayTeam.team)

        const totalGames = Number(localStorage.getItem('total-games'))

        homeTeamData.totalGames = totalGames
        awayTeamData.totalGames = totalGames

        // homeTeamData.setGamesLeft()
        // awayTeamData.setGamesLeft()

        // homeTeamData.setPotentialPoints(WIN_POINTS)
        // awayTeamData.setPotentialPoints(WIN_POINTS)

        homeTeamData.gamesLeft = homeTeamData.totalGames - homeTeamData.playedGames
        awayTeamData.gamesLeft = awayTeamData.totalGames - awayTeamData.playedGames

        homeTeamData.potentialPoints = homeTeamData.gamesLeft*WIN_POINTS
        awayTeamData.potentialPoints = awayTeamData.gamesLeft*WIN_POINTS

        homeTeamData.maxPotentialPoints = homeTeamData.potentialPoints + homeTeamData.points
        awayTeamData.maxPotentialPoints = awayTeamData.potentialPoints + awayTeamData.points


        if (game.played) {
            const homeTeamScored = gameHomeTeam.goals
            const awayTeamScored = gameAwayTeam.goals
   
            homeTeamData.playedGames++
            awayTeamData.playedGames++
    
            homeTeamData.goals += homeTeamScored
            awayTeamData.goals += awayTeamScored
            awayTeamData.awayGoals += awayTeamScored
    
    
            homeTeamData.goalsMissed += awayTeamScored
            awayTeamData.goalsMissed += homeTeamScored
        
            homeTeamData.goalDifference = homeTeamData.goals - homeTeamData.goalsMissed
            awayTeamData.goalDifference = awayTeamData.goals - awayTeamData.goalsMissed
    
            if (homeTeamScored > awayTeamScored) {
                homeTeamData.wins++
                awayTeamData.losses++
            } else if (homeTeamScored < awayTeamScored) {
                homeTeamData.losses++
                awayTeamData.wins++
                awayTeamData.awayWins++
            } else if (homeTeamScored === awayTeamScored) {
                homeTeamData.draws++
                awayTeamData.draws++
            }
            homeTeamData.points = homeTeamData.wins*WIN_POINTS + homeTeamData.draws*DRAW_POINTS
            awayTeamData.points = awayTeamData.wins*WIN_POINTS + awayTeamData.draws*DRAW_POINTS
        }
    })

    localStorage.setItem('teams-data', JSON.stringify(teams))

    changeTable(container, teams, games)
}



function changeTable(container, teams, games) {
    const sortedTeams = sortTeams(teams, games, {compareBetweenGames: true})

    sortedTeams.forEach((sortedTeam, i) => {
        sortedTeam.currentPlace = i + 1
    })


    // const competingTeams = sortedTeams.filter(team => {
    //     return team.maxPotentialPoints >= sortedTeams[0].points
    // })

    // if (competingTeams.length > 0) {
        checkTeamPosition(sortedTeams, games)
    // }

    /*/ jei lygus taskai
        TARPUSAVIO varzybose
        - jei zaide kartu tai kuris surinko  tasku daugiau
        - ivarciu santykis tarp komandu daugiau
            A, B (1:0) 2, 0
            B, C (1:0) 2, 1    
            C, A (1:0) 1, 0     
        - kas imuse daugiau ivarciu 

        VISUOSE zaidimuose
        - ivarciu skirtumas
        - daugiau ivarciu
        - daugiau away goals imuse (galima away goals i team isirasyti)
        - daugiau laimejimu
        - daugiau away laimejimu
    /*/

    
    createTable(container, 'standings-table', sortedTeams, games, {addComparinsonBtn: true, position: true})

    const comparingTeams = JSON.parse(localStorage.getItem('comparing-teams'))
    if (comparingTeams) {
        const updatedTeams = comparingTeams.map(oldTeam => {
            const updatedTeam = teams.find(team => team.team === oldTeam.team)

            return updatedTeam
        })
        localStorage.setItem('comparing-teams', JSON.stringify(updatedTeams))
        compareTeamsTable(container, updatedTeams, games)
    }
}



function sortTeams(teams, games, params = {}) {
    const {compareBetweenGames} = params
    const samePointsTeams = []

    const result = teams.sort((a, b) => {
        if (a.points > b.points) {
            return -1
        } else if (a.points < b.points) {
            return 1
        } else {
            if (compareBetweenGames) {
                !samePointsTeams.includes(a) && samePointsTeams.push(a)
                !samePointsTeams.includes(b) && samePointsTeams.push(b)
                const teamsGameData = compareGamesData(samePointsTeams, games);
                // jei abi suzaide
                // jei suzaide visas 
    
                // jei maxpotential vienodas patikrint ar suzaide visus kartu
                // uzdet du maxpotential kurie gali buti
    
                if (teamsGameData.length === 0) {
                    return 0
                }
    
                if (teamsGameData[a.team].points > teamsGameData[b.team].points) {
                    return -1
                } else if (teamsGameData[a.team].points < teamsGameData[b.team].points) {
                    return 1
                }
        
                if (teamsGameData[a.team].goalDifference > teamsGameData[b.team].goalDifference) {
                    return -1
                } else if (teamsGameData[a.team].goalDifference < teamsGameData[b.team].goalDifference) {
                    return 1
                }
        
                if (teamsGameData[a.team].goals > teamsGameData[b.team].goals) {
                    return -1
        
                } else if (teamsGameData[a.team].goals < teamsGameData[b.team].goals) {
                    return 1
                }
            }

            
            if (a.goalDifference > b.goalDifference) {
                return -1
            } else if (a.goalDifference < b.goaDifference) {
                return 1
            } 
    
            if (a.goals > b.goals) {
                return -1
            } else if (a.goals < b.goals) {
                return 1
            } 
    
            if (a.awayGoals > b.awayGoals) {
                return -1
            } else if (a.awayGoals < b.awayGoals) {
                return 1
            } 
    
            if (a.wins > b.wins) {
                return -1
            } else if (a.wins < b.wins) {
                return 1
            }
    
            if (a.awayWins > b.awayWins) {
                return -1
            } else if (a.awayWins < b.awayWins) {
                return 1
            }
    
            if (a.playedGames > b.playedGames) {
                return -1
            } else if (a.playedGames < b.playedGames) {
                return 1
            }
        }
    
        return 0
    })

    return result
}

function compareGamesData(teams, games) {
    const teamsData = {}

    const teamsGamesData = getInbetweenTeamsGames(teams, games, {allGames: true})

    if (teamsGamesData.length === 0) {
        return []
    } 
    
    teams.forEach(team => {
        const teamGames = teamsGamesData.filter(game => game.homeTeam.team === team.team || game.awayTeam.team === team.team);
        
        let points = 0
        let goals = 0
        let goalsMissed = 0

        let wins = 0
        let draws = 0
        let losses = 0
        let playedGames = 0
        // nesaugoju awaygoals awaywins


        teamGames.forEach(game => {
            if (game.homeTeam.team === team.team) {
                goals += game.homeTeam.goals
                goalsMissed += game.awayTeam.goals

                if (game.homeTeam.goals > game.awayTeam.goals) {
                    points += WIN_POINTS
                    wins++
                } else if (game.played && game.homeTeam.goals === game.awayTeam.goals) {
                    points += DRAW_POINTS
                    draws++
                } else if (game.played) {
                    losses++
                }
            } else  if (game.awayTeam.team === team.team) {
                goals += game.awayTeam.goals
                goalsMissed += game.homeTeam.goals

                if (game.awayTeam.goals > game.homeTeam.goals) {
                    points += WIN_POINTS
                    wins++
                } else if (game.played && game.awayTeam.goals === game.homeTeam.goals) {
                    points += DRAW_POINTS
                    draws++
                } else if (game.played) {
                    losses++
                }
            } 

            if (game.played) {
                playedGames++
            }

            teamsData[team.team] = {
                playedGames,
                wins,
                draws,
                losses,
                goals,
                goalsMissed,
                goalDifference: goals - goalsMissed,
                points,
                // points,
                // goalDifference: goals - goalsMissed,
                // goals
            }
        })

    })

    return teamsData
}


function checkTeamPosition(teams, games) {
    // paikrint kiekviena komanda ar ja gali aplenkti points, maxpotential
    // maxPoints < points, komandą negali aplnekti
    // maxPoints > points, komandą gali aplenekti

    // maxPoints = points, ar ta komanda su kitom suzaidusios DAUGIAU NEI PUSE tarpusavy.
    // Ar ta komanda surinkusi daugiau nei puse tasku tarpusavy, tai Uzsitikrinusi vieta ir nenukris
    // Jei surinkusi komanda puse ar maziau tai neuzsitikrinusi savo vietos
    

    // Jei daugiau nei dvi ar daugiau su maxPotential = points, tai tikrinti: 1.ar tos dvi su maxpoints suzaidusios viskaa tarpusavy tai tada  KOmanda minPlace nukrent

    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];

        for (let j = i + 1; j < teams.length; j++) {
            const otherTeam = teams[j];

            const canSucceed = otherTeam.maxPotentialPoints > team.points
            // const cantSucced = otherTeam.maxPotentialPoints < team.points
            const equalPoints = otherTeam.maxPotentialPoints === team.points

            team.maxPlace = team.currentPlace
            team.minPlace = team.currentPlace
            otherTeam.maxPlace = otherTeam.currentPlace
            otherTeam.minPlace = otherTeam.currentPlace

            if (canSucceed) {
                team.minPlace+= 1
                otherTeam.maxPlace-= 1
            } else if (equalPoints) {
                const inbetweenGames = getInbetweenTeamsGames([otherTeam, team], games)

                if (inbetweenGames.length === ROUNDS) {
                    const otherTeamGamesWon = inbetweenGames.filter(game => {
                        const teamGameData = game.homeTeam.team === team.team ? game.homeTeam : game.awayTeam
                        const otherTeamGameData = game.homeTeam.team === otherTeam.team ? game.homeTeam : game.awayTeam

                        if (otherTeamGameData.goals > teamGameData.goals) {
                            return game
                        }
                    })

                    if (otherTeamGamesWon.lenght > Math.round(ROUNDS/2)) {
                        team.minPlace = team.currentPlace+= 1
                        otherTeam.maxPlace = otherTeam.currentPlace-=1
                    } 
                }
            }
        }    

    }



    // const inbetweenGamesPlayed = getInbetweenTeamsGames(otherTeams, games, {allGames: false})
    // const inbetweenGamesAll = getInbetweenTeamsGames(otherTeams, games, {allGames: true})


    // if (inbetweenGamesAll.length === inbetweenGamesPlayed.length) {
    //     if (otherTeams.every(otherTeam => otherTeam.maxPotentialPoints < team.points)) {
    //         team.minPlace = 1
    //         team.maxPlace = 1
    //     } else {
    //         team.minPlace = team.currentPlace + otherTeams.length
    //         team.maxPlace = team.currentPlace
    //     }
    // } else {

    // }

    // patikrtinti ar suzaidusios visus zaidimus tarpusavy
    // jei suzaidusios naudoti maxpotentialPoints
    // jei nesuzaidusios tikrinti tas komandas kartu ir prideti
    // kad rast max min place

}


function getInbetweenTeamsGames(teams, games, params = {}) {
    const {allGames} = params

    const inbetweenGames = []
    games.forEach(game => {
        if (teams.some(team => team.team === game.homeTeam.team) && teams.some(team => team.team === game.awayTeam.team)) {
            if (!allGames) {
                game.played && inbetweenGames.push(game)
            } else {
                inbetweenGames.push(game)
            }
        }
    })

    return inbetweenGames
}

function getTeamGames(team, games, params = {}) {
    const {allGames} = params
    const teamGames = games.filter(game => {
        if (game.homeTeam.team === team.team || game.awayTeam.team === team.team) {
            if (allGames) {
                return game
            } else {
                if (game.played) {
                    return game
                }
            }
        }
    })
    
    return teamGames
}


function compareTeamsTable(container, teams, games) {
    const teamsGamesDataObject = compareGamesData(teams, games)

    const teamsData = Object.entries(teamsGamesDataObject).map(([team, stats]) => ({
        team,
        ...stats
    }));
    const sortedTeams = sortTeams(teamsData)

    if (sortedTeams.length > 0) {
        createTable(container, 'comparing-table', sortedTeams)
    } else if (teams.length === 1) {
        const team = {...teams[0]}
        for (const [key, value] of Object.entries(team)) {
            if (key !== 'team') {
                if (Number(value)) {
                    team[key] = 0
                }
            }
        }

        createTable(container, 'comparing-table', [team])
    } else {
        document.getElementById('comparing-table') && document.getElementById('comparing-table').remove()
    }
}


function createTable(container, tableId, teams, games, params = {}) {
    const {addComparinsonBtn, position} = params
    const oldTable = document.getElementById(tableId)

    let table
    if (oldTable) {
        oldTable.innerHTML = ''
        table = oldTable
    } else {
        table = document.createElement('table')
        table.id = tableId
        table.classList.add('table')
    }

    const tableHead = document.createElement('thead')
    const tableBody = document.createElement('tbody')
    const tHeadRow = document.createElement('tr')

    const headItems = [
        { text: '#',  title: null },
        { text: 'Team', title: null },
        ...(position ? [{ text: 'Highest', title: null }, { text: 'Lowest', title: null }] : []),
        { text: 'PL', title: 'Played Matches' },
        { text: 'W', title: 'Wins' },
        { text: 'D', title: 'Draws' },
        { text: 'L', title: 'Losses' },
        { text: 'F', title: 'Goals For' },
        { text: 'A', title: 'Goals Against' },
        { text: 'GD', title: 'Goal Difference' },
        { text: 'P', title: 'Points' },
    ]

    headItems.forEach(item => {
        const th = document.createElement('th')
        th.textContent = item.text
        item.title && th.setAttribute('title', item.title)
        th.setAttribute('scope', 'col')

        tHeadRow.append(th)
    })
    tableHead.append(tHeadRow)

    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];

        const row = document.createElement('tr')
        const place = document.createElement('td')
        place.textContent = i + 1
        row.append(place)

        
        if (team.currentPlace === 1 && team.minPlace === team.maxPlace) {
            row.classList.add('winner')
        }

        const rowItems = [team.team, ...(position ? [team.maxPlace, team.minPlace] : []),, team.playedGames, team.wins, team.draws, team.losses, team.goals, team.goalsMissed, team.goalDifference, team.points]

        rowItems.forEach((item, i) => {
            const cell = document.createElement('td')
            cell.textContent = item
            row.append(cell)

            if (addComparinsonBtn && i === 0) {
                let comparingTeams = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams')) : []

                cell.dataset.teamName = team.team
                let btn = document.createElement('button')
                cell.append(btn)
                
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
                    compareTeamsTable(container, comparingTeams, games)                    
                })

                cell.style.display = 'flex'
                cell.style.justifyContent = 'space-between'
                btn.type = 'button'
                btn.style.borderRadius = '50%'
                btn.style.width = '20px'
                btn.style.height = '20px'
                btn.style.padding = '0'
            }
        })
        tableBody.append(row)
    }

    table.append(tableHead, tableBody)

    const comparisonTable = document.getElementById('comparing-table');

    if (tableId === 'standings-table' && comparisonTable) {
        table.insertAdjacentElement('afterend', comparisonTable);
    } else {
        container.append(table)
    }
}