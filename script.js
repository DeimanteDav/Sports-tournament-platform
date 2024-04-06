const container = document.querySelector('.container')

const WIN_POINTS = 3
const DRAW_POINTS = 1
const LOSE_POINTS = 0
const TEAM_NAMES = ['Bears', 'Lions', 'Eagles', 'Jaguars', 'Hawks', 'Falcons', 'Ravens', 'Wolves', 'Sharks', 'Cobras']


// PADARYTI LENTELE. PAZYMETI H IR A PRIE REZULTATU. PAKEISTI TA LENTELE I SITA

// atkrentamoji lentele playoffs.

// VIETOJ SKAICIU IDET TEAM NAMES gal

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

    if (teamsData && gamesData) {
        tournamentForm(container, gamesData, teamsData)
        changeTable(container, teamsData, gamesData)
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
            teamNamesForm(container, Number(amount))
        }
    })
}


function teamNamesForm(container, teamsAmount) {
    const form = document.createElement('form')
    
    const text = document.createElement('p')
    text.textContent = `Set Teams' names`

    const namesWrapper = document.createElement('div')

    const generateWrapper = document.createElement('div')
    const select = document.createElement('select')
    const options = [
        {
            title: 'Alphabetized',
            value: 1
        }, 
        {
            title: 'Numbered',
            value: 2,
        },
        {
            title: 'Animals',
            value: 3,
        }
    ]


    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionElement = document.createElement('option')
        optionElement.textContent = option.title
        optionElement.value = option.value

        select.append(optionElement)
    }

    const generateNamesBtn = document.createElement('button')
    generateNamesBtn.type = 'button'
    generateNamesBtn.textContent = 'Generate'

    generateWrapper.append(select, generateNamesBtn)

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
        namesWrapper.append(div)
    }


    form.append(text, generateWrapper, namesWrapper, submitBtn)
    container.append(form)

    generateNamesBtn.addEventListener('click', (e) => {
        const optionValue = select.value
        const inputs = [...namesWrapper.querySelectorAll('input')]

        if (optionValue === '1') {
            const alphabet = Array.from({ length: teamsAmount }, (_, i) => String.fromCharCode(65 + i))

            alphabet.forEach((letter, i) => {
                inputs[i].value = letter
            })
        } else if (optionValue === '2') {
            const numbers = Array.from({ length: teamsAmount }, (_, i) => i + 1)

            numbers.forEach((number, i) => {
                inputs[i].value = number
            })
        } else {
            TEAM_NAMES.sort(() => Math.random() - 0.5).slice(0,teamsAmount).forEach((name, i) => {
                inputs[i].value = name
            })
        }
    })

    
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const teamNamesElements = [...document.querySelectorAll('input')]
        const teamNames = teamNamesElements.map(teamNameElement => teamNameElement.value)

        form.remove()
        roundsAmountForm(container)
        localStorage.setItem('team-names', JSON.stringify(teamNames))
    })
}

function roundsAmountForm(container) {
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many rounds in tournament?'

    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 1
    input.max = 5

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
            localStorage.setItem('rounds-amount', amount)
            generateTeams(container, amount)
        }
    })
}

function generateTeams(container, roundsAmount) {
    const teamNames = JSON.parse(localStorage.getItem('team-names'))
    const totalGames = (teamNames.length-1)*roundsAmount
    const teams = teamNames.map(name => new Team(name, totalGames, teamNames.length))

    const games = generateGames(container, teams, roundsAmount)
    tournamentForm(container, games, teams)

    localStorage.setItem('total-games', totalGames)
    localStorage.setItem('teams-data', JSON.stringify(teams))

    return teams
}


function generateGames(container, teams, roundsAmount) {
    let games = []

    for (let i = 0; i < roundsAmount; i++) {
        for (let j = 0; j < teams.length; j++) {
            const homeTeam = teams[j];
            for (let m = j + 1; m < teams.length; m++) {
                const awayTeam = teams[m];
      
                let game
                if ((i % 2) === 0) {
                    game = new Game(homeTeam, awayTeam)
                } else {
                    game = new Game(awayTeam, homeTeam)
                }
                games.push(game)
            }
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

    const roundsAmount = Number(localStorage.getItem('rounds-amount'))
    const gamesPerRound = Math.ceil(games.length / roundsAmount)

    const roundContainers = []
    for (let i = 0; i < roundsAmount; i++) {
        const roundEl = document.createElement('div')
        roundEl.className = 'round'
        roundContainers.push(roundEl)

        gamesForm.append(roundEl)
    }

    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const roundIndex = Math.floor(i / gamesPerRound)
        const roundContainer = roundContainers[roundIndex]

        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        const gameNumber = document.createElement('p')

        const gameEl = document.createElement('div')
        gameEl.classList.add('game')

        
        game.played && gameWrapper.classList.add('played')
        
        gameEl.dataset.gameId = game.id
        gameNumber.textContent = `${game.id}.`
        
        gameWrapper.append(gameNumber, gameEl)
        roundContainer.append(gameWrapper)

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
                input.id = `${game.id}-${team.team}`
                input.dataset.team = game[team].team
                label.htmlFor = `${game.id}-${team.team}`
                label.textContent = game[team].team
                input.classList.add('result-input')
                input.value = game.played ? game[team].goals : ''           
                
                teamWrapper.append(label, input)

                gameEl.append(teamWrapper) 
            }
        }
    }

    container.prepend(gamesForm)

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


        if (homeTeamInput.value && awayTeamInput.value) {
            currentGame.played = true
            gameEl.parentElement.classList.add('played')
        } else {
            currentGame.played = false
            gameEl.parentElement.classList.remove('played')
        }

        updateTeamsData(games, teams)
    
        localStorage.setItem('games-data', JSON.stringify(games))
    })


    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'RESET all data'
    resetBtn.id = 'reset-btn'


    resetBtn.addEventListener('click', (e) => {
        // localStorage.removeItem('team-names')
        // localStorage.removeItem('total-games')
        // localStorage.removeItem('teams-data')
        // localStorage.removeItem('games-names')
        // localStorage.removeItem('comparing-teams')
        // localStorage.removeItem('rounds-amount')
        localStorage.clear()
        container.innerHTML = ''
        
        teamsAmountForm(container)
    })

    const changeTableBtn = document.createElement('button')
    changeTableBtn.textContent = 'Change Table View'

    changeTableBtn.addEventListener('click', (e) => {
        const prevTableType = localStorage.getItem('table-type')

        if (prevTableType === 'modern' || !prevTableType) {
            localStorage.setItem('table-type', 'old')
            changeTable(container, teams, games)
        } else {
            localStorage.setItem('table-type', 'modern')
            changeTable(container, teams, games)
        }
    })

    gamesForm.before(resetBtn)
    gamesForm.after(changeTableBtn)

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
    
    changeTable(container, teams, games)
    localStorage.setItem('teams-data', JSON.stringify(teams))
}



function changeTable(container, teams, games) {
    const sortedTeams = sortTeams(teams, games, {compareBetweenGames: true})

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

    let prevTableWrapper = document.querySelector('.table-wrapper')
    let tableWrapper
    
    if (prevTableWrapper) {
        prevTableWrapper.innerHTML = ''
        tableWrapper = prevTableWrapper
    } else {
        tableWrapper = document.createElement('div')
        tableWrapper.classList.add('table-wrapper')
        container.append(tableWrapper)
    }

    const tableType = localStorage.getItem('table-type')

    let table
    const comparingTeams = JSON.parse(localStorage.getItem('comparing-teams'))

    if (tableType === 'old') {
        table = createOldTable(tableWrapper, teams, games, {comparinsonBtn: true})
    } else {
        table = createModernTable(tableWrapper, sortedTeams, games, {comparinsonBtn: true, position: true})
    }
    tableWrapper.prepend(table)

    if (comparingTeams?.length > 0) {
        const updatedTeams = comparingTeams.map(oldTeam => {
            const updatedTeam = teams.find(team => team.team === oldTeam.team)

            return updatedTeam
        })
        localStorage.setItem('comparing-teams', JSON.stringify(updatedTeams))

        tableWrapper.append(compareTeamsTable(tableWrapper, updatedTeams, games, tableType))
    }
}



function sortTeams(teams, games, params = {}) {
    const {compareBetweenGames} = params
    const samePointsTeams = []

    const result = [...teams].sort((a, b) => {
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
                currentPlace: team.currentPlace
                // points,
                // goalDifference: goals - goalsMissed,
                // goals
            }
        })

    })

    return teamsData
}


function checkTeamPosition(teams, games) {
    // KURIOS KOMANDOS ISKRENTA
    // KURIOS I EROPOS CEMPTIONATA ISEINA

    // paikrint kiekviena komanda ar ja gali aplenkti points, maxpotential
    // maxPoints < points, komandą negali aplnekti
    // maxPoints > points, komandą gali aplenekti

    // maxPoints = points, ar ta komanda su kitom suzaidusios DAUGIAU NEI PUSE tarpusavy.
    // Ar ta komanda surinkusi daugiau nei puse tasku tarpusavy, tai Uzsitikrinusi vieta ir nenukris
    // Jei surinkusi komanda puse ar maziau tai neuzsitikrinusi savo vietos
    
    // Jei daugiau nei dvi ar daugiau su maxPotential = points, tai tikrinti: 1.ar tos dvi su maxpoints suzaidusios viskaa tarpusavy tai tada  KOmanda minPlace nukrent
    const roundsAmount = localStorage.getItem('rounds-amount')

    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];

        for (let j = i + 1; j < teams.length; j++) {
            const otherTeam = teams[j];

            const canSucceed = otherTeam.maxPotentialPoints > team.points
            const equalPoints = otherTeam.maxPotentialPoints === team.points

            if (canSucceed) {
                team.minPlace += 1
                otherTeam.maxPlace -= 1
            } else if (equalPoints) {
                const inbetweenGames = getInbetweenTeamsGames([otherTeam, team], games)

            
                const otherTeamGamesWon = inbetweenGames.filter(game => {
                    const teamGameData = game.homeTeam.team === team.team ? game.homeTeam : game.awayTeam
                    const otherTeamGameData = game.homeTeam.team === otherTeam.team ? game.homeTeam : game.awayTeam

                    if (otherTeamGameData.goals > teamGameData.goals) {
                        return game
                    }
                })

                if (otherTeamGamesWon.length > roundsAmount/2) {
                    team.minPlace += 1
                    otherTeam.maxPlace -=1
                } else {
                    // team.minPlace
                }
            }
        }    

    }

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


function compareTeamsTable(wrapper, teams, games, tableType) {
    const teamsGamesDataObject = compareGamesData(teams, games)

    const teamsData = Object.entries(teamsGamesDataObject).map(([team, stats]) => ({
        team,
        ...stats
    }));
    const sortedTeams = sortTeams(teamsData)

    let updatedTeams
    let table

    if (sortedTeams.length > 0) {
        updatedTeams = sortedTeams
    } else if (teams.length === 1) {
        const team = {...teams[0]}
        for (const [key, value] of Object.entries(team)) {
            if (key !== 'team') {
                if (Number(value)) {
                    team[key] = 0
                }
            }
        }
        
        updatedTeams = [team]
    }

    if (tableType === 'old') {
        table = createOldTable(wrapper, updatedTeams, games)
    } else {
        table = createModernTable(wrapper, updatedTeams, games)
    }
    table.id = 'comparing-table'

    return table
}


function createModernTable(wrapper, teams, games, params = {}) {
    const {comparinsonBtn, position} = params

    const table = document.createElement('table')
    table.classList.add('table', 'modern-table')


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

        
        if (team.maxPlace === 1 && team.minPlace === 1) {
            row.classList.add('winner')
        }

        const rowItems = [team.team, ...(position ? [team.maxPlace, team.minPlace] : []),, team.playedGames, team.wins, team.draws, team.losses, team.goals, team.goalsMissed, team.goalDifference, team.points]

        rowItems.forEach((item, i) => {
            const cell = document.createElement('td')
            cell.textContent = item
            row.append(cell)

            if (comparinsonBtn && i === 0) {
               compareTeamsButtonHandler(wrapper, team, games, cell, 'modern')
            }
        })
        tableBody.append(row)
    }
    table.append(tableHead, tableBody)

    return table
}


function createOldTable(wrapper, teams, games, params = {}) {
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

        if (comparinsonBtn) {
            compareTeamsButtonHandler(wrapper, team, games, teamTitleEl, 'old')
        }

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
        const footPointsRow = document.createElement('tr')
        const footGoalsRow = document.createElement('tr')


        for (let m = 0; m < roundsAmount; m++)  {
            const innerRow = document.createElement('tr') 

            teams.forEach((otherTeam, j) => {
                const innerCell = document.createElement('td')

                if (i === j) {
                    innerCell.classList.add('empty-cell')
                } else {
                    const inbetweenGames = getInbetweenTeamsGames([team, otherTeam], games, {allGames: true})
    
                    const teamGoals = inbetweenGames[m].homeTeam.team === team.team ? inbetweenGames[m].homeTeam.goals : inbetweenGames[m].awayTeam.goals
    
                    const otherTeamGoals = inbetweenGames[m].homeTeam.team === otherTeam.team ? inbetweenGames[m].homeTeam.goals : inbetweenGames[m].awayTeam.goals

                    const scoresEl = document.createElement('p')
                    const earnedPointsEl = document.createElement('p')

                    if (inbetweenGames[m].played) {
                        scoresEl.textContent = `${teamGoals}:${otherTeamGoals}`

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
            const poinstCell = document.createElement('td')
            const goalDiffCell = document.createElement('td')

            const inbetweenGames = getInbetweenTeamsGames([team, otherTeam], games, {allGames: true})
            
            let pointsSum = 0
            let goalDiff = 0

            if (i === j) {
                poinstCell.classList.add('empty-cell')
                goalDiffCell.classList.add('empty-cell')
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
    
                        poinstCell.textContent = `Points: ${pointsSum}`
                        goalDiffCell.textContent = `Goal diff.: ${goalDiff}`
                    }
                })
            }

            footPointsRow.append(poinstCell)
            footGoalsRow.append(goalDiffCell)

        })

        innerTableFoot.append(footPointsRow, footGoalsRow)
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

        if (expandAllBtn.textContent === 'Hide All') {
            innerTableBodies.forEach(item => {
                item.className = 'hidden'
            })
            expandAllBtn.textContent = 'Expand All'
        } else {
            innerTableBodies.forEach(item => {
                item.className = 'expanded'
            })
    
            expandAllBtn.textContent = 'Hide All'
        }
    })

    table.append(tableHead, tableBody, expandAllBtn)

    return table
}


function compareTeamsButtonHandler(wrapper, team, games, cell, tableType) {
    let comparingTeams = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams')) : []

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
        
        
        document.getElementById('comparing-table') && document.getElementById('comparing-table').remove()
        
        if (comparingTeams.length > 0) {
            let teamsTable = compareTeamsTable(wrapper, comparingTeams, games, tableType)
            wrapper.append(teamsTable)
        }
    })

    btn.type = 'button'
}