
const gamesForm = document.getElementById('games-wrapper')
const container = document.querySelector('.container')

const table = document.createElement('table')
container.append(table)

class Team {
    constructor(name) {
        this.name = name
    }


}

class Game {
    constructor(homeTeam, awayTeam) {
        this.homeTeam = homeTeam.name
        this.awayTeam = awayTeam.name
    }
}

const teamA = new Team('A')
const teamB = new Team('B')
const teamC = new Team('C')
const teamD = new Team('D')
const teams = [teamA, teamB, teamC, teamD]

const games = generateGames()

function generateGames() {
    const games = []
    for (let i = 0; i < teams.length; i++) {
        const homeTeam = teams[i];
    
        for (let j = i + 1; j < teams.length; j++) {
            const awayTeam = teams[j];
            
            const game = new Game(homeTeam, awayTeam)
            games.push(game)
        }
    }
    return games
}

function generateElements() {
    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        let gameEl = document.createElement('div')
        gameEl.className = 'game'
        gamesForm.append(gameEl)

        Object.entries(game).forEach(team => {
            const teamWrapper = document.createElement('div')
            teamWrapper.className = 'team'
            gameEl.append(teamWrapper)
            
            const label = document.createElement('label')
            const input = document.createElement('input')               
            input.type = 'number'
            input.id = `${team[1]}-${i+1}`
            input.dataset.team = team[1]
            label.htmlFor = input.id
            label.textContent = team[1]
            
            teamWrapper.append(label, input)
        })
    }


    for (let i = 0; i < teams.length; i++) {

    }
}
generateElements()


gamesForm.addEventListener('change', (e) => {
    let homeTeamName = e.target.dataset.team

    let homeTeam = teams.filter(team => team.name === teamName)[0]
    let game = [...e.target.parentElement.parentElement.children]
    


    changeTable()

})


function changeTable() {

}


// const teams = [
//     {
//         name: 'A',
//         gamesPlayed: 0,
//         wins: 0,
//         draws: 0,
//         losses: 0,
//         goals: 0,
//         missedGoals: 0,
//         points: 0,
//     },
//     {
//         name: 'B',
//         gamesPlayed: 0,
//         wins: 0,
//         draws: 0,
//         losses: 0,
//         goals: 0,
//         missedGoals: 0,
//         points: 0,
//     },
//     {
//         name: 'C',
//         gamesPlayed: 0,
//         wins: 0,
//         draws: 0,
//         losses: 0,
//         goals: 0,
//         missedGoals: 0,
//         points: 0,
//     },
//     {
//         name: 'D',
//         gamesPlayed: 0,
//         wins: 0,
//         draws: 0,
//         losses: 0,
//         goals: 0,
//         missedGoals: 0,
//         points: 0,
//     }
// ]