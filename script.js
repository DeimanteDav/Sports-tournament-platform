const gamesForm = document.getElementById('games-wrapper')
const container = document.querySelector('.container')
const table = document.querySelector('#standings-table')

const WIN_POINTS = 3
const DRAW_POINTS = 1
const LOSE_POINTS = 0
const ROUNDS = 2

// is praddziu ne 0 o tuscias inputas ir lentele tuscia. Inputus isskirt kurie zaisti P
// abu inputai ivesti pazymet kad suzaistas P

// games 2 rata P
// kada komanda uzsitikrinus cempiono varda. Prie komandos ikonele P

// kuri komanda uztikrintai paskutine.
// jeigu nutrini abu inputus played = false


// PRISIDETI prie komandos kiek liko tasku

class Team {
    constructor(team, totalGames) {
        this.team = team
        this.playedGames = 0
        this.wins = 0
        this.draws = 0
        this.losses = 0
        this.goals = 0
        this.missedGoals = 0
        this.goalDifference = 0
        this.awayGoals = 0
        this.awayWins = 0
        this.points = 0
        this.potentialPoints = 0
        this.gamesLeft = 0
        this.maxPotentialPoints = 0

        this.currentPlace = 0
        this.maxPlace = 0
        this.minPlace = 0 
        // nauji
        this.totalGames = totalGames
        this.winner = false
        this.loser = false
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
    }
}

const teamNames = ['A', 'B', 'C', 'D']
const TOTAL_GAMES = (teamNames.length-1)*ROUNDS

const teams = teamNames.map(name => new Team(name, TOTAL_GAMES))
const games = generateGames(teams)

function generateGames(teams) {
    const savedTeamsData = localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data')) : null

    const savedGamesData = localStorage.getItem('games-data') ? JSON.parse(localStorage.getItem('games-data')) : null
    let games = []

    if (savedGamesData && savedTeamsData) {
        games = savedGamesData
        teams = savedTeamsData
        changeTable(table, games, teams)
    } else {
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
        changeTable(table, games, teams)
    }

    return games
}


function generateElements(games, form) {
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

        gameEl.dataset.gameId = i + 1

        if (i < 6) {
            round1.append(gameWrapper)
            gameNumber.textContent = `${i + 1}.`
        } else {
            round2.append(gameWrapper)
            gameNumber.textContent = `${i + 1 - 6}.`
        }

        for (let team in game) {
            if (team !== 'played') {
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

    form.append(round1, round2)
}
generateElements(games, gamesForm)



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
    updateTeamsData(table, games, teams)
})


function updateTeamsData(table, games, teams) {
    teams.forEach(team => {
        for (const [key, value] of Object.entries(team)) {
            if (Number(value)) {
                team[key] = 0
            }
            if (typeof value === 'boolean') {
                team[key] = false
            }
        }
    })
    
    games.forEach(game => {
        if (game.played) {
            const gameHomeTeam = game.homeTeam
            const gameAwayTeam = game.awayTeam
    
            const homeTeamScored = gameHomeTeam.goals
            const awayTeamScored = gameAwayTeam.goals
    
            const homeTeamData = teams.find(team => team.team === gameHomeTeam.team)
            const awayTeamData = teams.find(team => team.team === gameAwayTeam.team)
    

            homeTeamData.totalGames = TOTAL_GAMES
            awayTeamData.totalGames = TOTAL_GAMES

            homeTeamData.playedGames++
            awayTeamData.playedGames++
    
            homeTeamData.goals += homeTeamScored
            awayTeamData.goals += awayTeamScored
            awayTeamData.awayGoals += awayTeamScored
    
    
            homeTeamData.missedGoals += awayTeamScored
            awayTeamData.missedGoals += homeTeamScored
        
            homeTeamData.goalDifference = homeTeamData.goals - homeTeamData.missedGoals
            awayTeamData.goalDifference = awayTeamData.goals - awayTeamData.missedGoals
    
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

            homeTeamData.setGamesLeft()
            awayTeamData.setGamesLeft()

            homeTeamData.setPotentialPoints(WIN_POINTS)
            awayTeamData.setPotentialPoints(WIN_POINTS)
        }
    })

    localStorage.setItem('teams-data', JSON.stringify(teams))

    changeTable(table, games, teams)
}


// pervadinti ffirsstplace
function checkTeamPosition(teams, games) {
    const team = teams[0]
    const otherTeams = teams.slice(1)

    const competingTeams = otherTeams.filter(otherTeams => otherTeams.maxPotentialPoints === team.points)
    competingTeams.unshift(team)
    console.log(competingTeams);

    if (competingTeams.length > 0) {
        const sortedTeams = sortTeams(competingTeams, games)

        sortedTeams.forEach((sortedTeam, i) => {
            sortedTeam.maxPlace = i + 1
        })
    }
}


function changeTable(table, games, teams) {
    table.innerHTML = ''
    const tableHead = document.createElement('thead')
    const tableBody = document.createElement('tbody')
    const tHeadRow = document.createElement('tr')

    const headItems = [
        { text: '#',  title: null },
        { text: 'Team', title: null },
        { text: 'PL', title: 'Played Matches' },
        { text: 'W', title: 'Wins' },
        { text: 'D', title: 'Draws' },
        { text: 'L', title: 'Losses' },
        { text: 'F', title: 'Goals For' },
        { text: 'A', title: 'Goals Against' },
        { text: 'GD', title: 'Goal Difference' },
        { text: 'P', title: 'Points' }
    ]


    headItems.forEach(item => {
        const th = document.createElement('th')
        // th.textContent = item.title || item.text
        // item.title && th.setAttribute('title', item.title)
        th.setAttribute('scope', 'col')
        th.dataset.title = item.title || item.text
        th.dataset.smallTitle = item.text

        tHeadRow.append(th)
    })
    tableHead.append(tHeadRow)

    const sortedTeams = sortTeams(teams, games)

    sortedTeams.forEach((sortedTeam, i) => {
        sortedTeam.currentPlace = i + 1
    })

    const filteredTeams = sortedTeams.filter(team => {
        return team.maxPotentialPoints >= sortedTeams[0].points
    })

    if (filteredTeams.length > 0) {
        checkTeamPosition(filteredTeams, games)
    } else {
        sortedTeams[0].winner = true
    }

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

    for (let i = 0; i < sortedTeams.length; i++) {
        const team = sortedTeams[i];

        const row = document.createElement('tr')
        const place = document.createElement('td')
        place.textContent = i + 1
        row.append(place)

        team.winner && row.classList.add('winner')
        const rowItems = [team.team, team.playedGames, team.wins, team.draws, team.losses, team.goals, team.missedGoals, team.goalDifference, team.points]
        
        rowItems.forEach(item => {
            const cell = document.createElement('td')
            cell.textContent = item
            row.append(cell)
        })

        tableBody.append(row)
        
    }

    table.append(tableHead, tableBody)
}



function sortTeams(teams, games) {
    const samePointsTeams = []

    const result = teams.sort((a, b) => {
        if (a.points > b.points) {
            return -1
        } else if (a.points < b.points) {
            return 1
        } else {
            !samePointsTeams.includes(a) && samePointsTeams.push(a)
            !samePointsTeams.includes(b) && samePointsTeams.push(b)
            const teamsGameData = compareGamesData(samePointsTeams, games);
    
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
    
            if (teamsGameData[a.team].goalsScored > teamsGameData[b.team].goalsScored) {
                return -1
    
            } else if (teamsGameData[a.team].goalsScored < teamsGameData[b.team].goalsScored) {
                return 1
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
    const teamsGamesData = []

    console.log(teams);

    games.forEach(game => {
        if (teams.some(team => team.team === game.homeTeam.team) && teams.some(team => team.team === game.awayTeam.team)) {
            teamsGamesData.push(game)
        }
    });
    const teamsData = {}
    
    teams.forEach(team => {
        const teamGames = teamsGamesData.filter(game => game.homeTeam.team === team.team || game.awayTeam.team === team.team);
        

        let points = 0
        let goalsScored = 0
        let goalsMissed = 0

        teamGames.forEach(game => {
            if (game.homeTeam.team === team.team) {
                goalsScored += game.homeTeam.goals
                goalsMissed += game.awayTeam.goals

                if (game.homeTeam.goals > game.awayTeam.goals) {
                    points += WIN_POINTS
                } else if (game.homeTeam.goals === game.awayTeam.goals) {
                    points += DRAW_POINTS
                }
            } else  if (game.awayTeam.team === team.team) {
                goalsScored += game.awayTeam.goals
                goalsMissed += game.homeTeam.goals

                if (game.awayTeam.goals > game.homeTeam.goals) {
                    points += WIN_POINTS
                } else if (game.awayTeam.goals === game.homeTeam.goals) {
                    points += DRAW_POINTS
                }
            }

            teamsData[team.team] = {
                points,
                goalDifference: goalsScored - goalsMissed,
                goalsScored
            }
        })
    })

    return teamsData
}
