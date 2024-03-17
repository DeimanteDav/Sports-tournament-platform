const gamesForm = document.getElementById('games-wrapper')
const container = document.querySelector('.container')
const table = document.querySelector('#standings-table')


class Team {
    constructor(team) {
        this.team = team
        this.playedGames = 0
        this.wins = 0
        this.draws = 0
        this.losses = 0
        this.goals = 0
        this.missedGoals = 0
        this.awayGoals = 0
        this.awayWins = 0
        this.points = 0
    }
}

class Game {
    constructor(homeTeam, awayTeam) {
        this.homeTeam = {
            team: homeTeam.team,
            goals: homeTeam.goals
        }
        this.awayTeam = {
            team: awayTeam.team,
            goals: awayTeam.goals
        }

    }
}

const teamNames = ['A', 'B', 'C', 'D']
const teams = teamNames.map(name => new Team(name))

const games = generateGames(teams)

function generateGames(teams) {
    const savedTeamsData = localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data')) : null

    const savedGamesData = localStorage.getItem('games-data') ? JSON.parse(localStorage.getItem('games-data')) : null
    let games = []

    if (savedGamesData && savedTeamsData) {
        games = savedGamesData
        changeTable(table, games)
    } else {
        for (let i = 0; i < teams.length; i++) {
            const homeTeam = teams[i];
        
            for (let j = i + 1; j < teams.length; j++) {
                const awayTeam = teams[j];
                
                const game = new Game(homeTeam, awayTeam)
                games.push(game)
            }
        }
    }

    return games
}


function generateElements(games, form) {
    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        let gameEl = document.createElement('div')
        gameEl.classList.add('game')
        gameEl.dataset.gameId = i + 1
        form.append(gameEl)

        for (let team in game) {
            const teamWrapper = document.createElement('div')
            teamWrapper.classList.add('team')

            if (team === 'homeTeam') {
                teamWrapper.classList.add('home-team')
            } else {
                teamWrapper.classList.add('away-team')
            }

            gameEl.append(teamWrapper) 
            const label = document.createElement('label')
            const input = document.createElement('input')               
            input.type = 'number'
            input.dataset.team = game[team].team
            label.htmlFor = input.id
            label.textContent = game[team].team
            input.classList.add('result-input')
            input.value = game[team].goals            
            
            teamWrapper.append(label, input)
        }
    }
}
generateElements(games, gamesForm)


gamesForm.addEventListener('change', (e) => {
    const gameEl = e.target.parentElement.parentElement
    const homeTeamInput = gameEl.querySelector('.home-team .result-input')
    const awayTeamInput = gameEl.querySelector('.away-team .result-input')

    const homeTeamScored = Number(homeTeamInput.value)
    const awayTeamScored = Number(awayTeamInput.value)

    const currentGame = games[gameEl.dataset.gameId-1]
    const gameHomeTeamData = currentGame.homeTeam
    const gameAwayTeamData = currentGame.awayTeam

    gameHomeTeamData.goals = homeTeamScored
    gameAwayTeamData.goals = awayTeamScored

    localStorage.setItem('games-data', JSON.stringify(games))

    updateTeamsData(table, games)
})


function updateTeamsData(table, games) {
    teams.forEach(team => {
        for (const [key, value] of Object.entries(team)) {
            if (Number(value)) {
                team[key] = 0
            }
        }
    })

    games.forEach(game => {
        const gameHomeTeam = game.homeTeam
        const gameAwayTeam = game.awayTeam

        const homeTeamScored = gameHomeTeam.goals
        const awayTeamScored = gameAwayTeam.goals

        const homeTeamData = teams.find(team => team.team === gameHomeTeam.team)
        const awayTeamData = teams.find(team => team.team === gameAwayTeam.team)

        homeTeamData.playedGames++
        awayTeamData.playedGames++

        homeTeamData.goals += homeTeamScored
        awayTeamData.goals += awayTeamScored
        awayTeamData.awayGoals += awayTeamScored


        homeTeamData.missedGoals += awayTeamScored
        awayTeamData.missedGoals += homeTeamScored
    
        if (homeTeamScored > awayTeamScored) {
            homeTeamData.wins++
            awayTeamData.losses++
        } else if (homeTeamScored < awayTeamScored) {
            homeTeamData.losses++
            awayTeamData.wins++
            awayTeamData.awayWins++
        } else if (homeTeamScored > 0 && homeTeamScored === awayTeamScored) {
            homeTeamData.draws++
            awayTeamData.draws++
        }

                
        homeTeamData.points = homeTeamData.wins*3 + homeTeamData.draws
        awayTeamData.points = awayTeamData.wins*3 + awayTeamData.draws
    })

    localStorage.setItem('teams-data', JSON.stringify(teams))

    changeTable(table, games)
}

function compareGamesData(teams, games) {
    const teamsGamesData = []

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
                    points += 3
                } else if (game.homeTeam.goals === game.awayTeam.goals) {
                    points += 1
                }
            } else  if (game.awayTeam.team === team.team) {
                goalsScored += game.awayTeam.goals
                goalsMissed += game.homeTeam.goals

                if (game.awayTeam.goals > game.homeTeam.goals) {
                    points += 3
                } else if (game.awayTeam.goals === game.homeTeam.goals) {
                    points += 1
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


function changeTable(table, games) {
    const savedTeamsData = JSON.parse(localStorage.getItem('teams-data'))
    table.innerHTML = ''
    const teamsData = savedTeamsData ? savedTeamsData : teams

    const tableHead = document.createElement('thead')
    const tableBody = document.createElement('tbody')
    const tHeadRow = document.createElement('tr')

    Object.keys(teamsData[0]).forEach(item => {
        if (item !== 'awayGoals' && item !== 'awayWins') {
            const th = document.createElement('th')
            th.textContent = item
            th.setAttribute('scope', 'col')
            th.style.textTransform = 'capitalize'
    
            tHeadRow.append(th)
        }
    })
    tableHead.append(tHeadRow)

    const samePointsTeams = []
    const sortedTeams = teamsData.sort((a, b) => {
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
            console.log(teamsGameData[a.team].goalsScored, a, teamsGameData[b.team].goalsScored, b);
            if (teamsGameData[a.team].goalsScored > teamsGameData[b.team].goalsScored) {
                return -1

            } else if (teamsGameData[a.team].goalsScored < teamsGameData[b.team].goalsScored) {
                return 1
            }


            if (a.goals - a.missedGoals > b.goals - b.missedGoals) {
                return -1
            } else if (a.goals - a.missedGoals < b.goals - b.missedGoals) {
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
        }

        return 0

    })

    for (const team of sortedTeams) {
        const row = document.createElement('tr')

        for (const key in team) {
            if (key !== 'awayGoals' && key !== 'awayWins') {
                const cell = document.createElement('td')
                cell.textContent = team[key]
                row.append(cell)
            }
        }
        tableBody.append(row)
    }
    
    table.append(tableHead, tableBody)
}