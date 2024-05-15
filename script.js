import { DRAW_POINTS, SPORTS, WIN_POINTS } from "./config.js"
import { createModernTable, createOldTable } from "./functions/table.js"
import getInbetweenTeamsGames from "./functions/getInbetweenTeamsGames.js"
import sortTeams from "./functions/sortTeams.js"
import compareGamesData from "./functions/compareGamesData.js"
import { sportTypeForm } from "./functions/forms.js"
import updateGameData from "./functions/updateGameData.js"
import playoffsForm from "./playoffs/playoffsForm.js"
import resetDataBtn from "./components/resetDataBtn.js"
import accordion from "./components/accordion.js"
import Game from "./classes/Game.js"
import checkTeamPosition from "./functions/checkTeamPosition.js"

// ADD CONDITION:
// PATSS IRASAI VISKA
// tEIGIAMAS NEIGIAMAS
// PATENka i europos lyga aukstesne / zemesne NUO KELINTOS IKI KELINTA



const container = document.querySelector('.container')

// Ar kova del 3 vietos yra

// Daugiau lenteliu jei pvz.: 16komandu i 4 grupes.
// kiek teamsu iseina i kita etapa PASIRINKTI.


function getLocalStorageData(container) {
    const teamsData = localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data')) : null
    const gamesData = localStorage.getItem('league-games-data') ? JSON.parse(localStorage.getItem('league-games-data')) : null

    const playoffsTeamsData = localStorage.getItem('playoffs-teams-data') ? JSON.parse(localStorage.getItem('playoffs-teams-data')) : null
    const playoffGamesData = JSON.parse(localStorage.getItem('playoffs-data'))

    if (gamesData || playoffGamesData) {
        resetDataBtn(container)
        if (gamesData && playoffGamesData) {
            tournamentForm(container, gamesData, teamsData)
            changeTable(container, teamsData, gamesData)
    
            playoffsForm(container, playoffGamesData, playoffsTeamsData, teamsData)
        } else if (gamesData) {
            tournamentForm(container, gamesData, teamsData)
            changeTable(container, teamsData, gamesData)
        } else if (playoffGamesData) {
            playoffsForm(container, playoffGamesData, playoffsTeamsData)
        }
    } else {
        sportTypeForm(container)
    }
}
getLocalStorageData(container)


// faila pasidaryti
export function tournamentForm(container, games, teams) {
    const gamesForm = document.createElement('form')
    gamesForm.id = 'games-form'
    const roundsAmount = Number(localStorage.getItem('rounds-amount'))
    const sportId = JSON.parse(localStorage.getItem('sport')).id

    for (let i = 0; i < roundsAmount; i++) {
        const btnText = `Round ${i+1}`
        const roundGames = games.filter(game => game.round === i+1)

        const innerRounds = [...new Set(roundGames.map(game => game.roundNr))]

        accordion(gamesForm, roundGames, innerRounds, btnText)
    }

    gamesForm.addEventListener('change', (e) => {
        const gameEl = e.target.parentElement.parentElement
        const gameId = +gameEl.dataset.gameId
        const currentGame = games.find(game => game.id === gameId)
        const overtimeId = +e.target.dataset.overtime
        
        const currentGameGameInputs = [...gameEl.querySelectorAll('.result-input')]


        if (e.target.dataset.overtime && sportId === SPORTS.basketball.id) {
            const currentInputs = [...gameEl.querySelectorAll(`.result-input[data-overtime="${overtimeId}"]`)]
            const overtimeGame = currentGame.overtime.find(overtime => overtime.id === overtimeId)

            updateGameData(gameEl, overtimeGame, sportId, {overtime: true})

            if (overtimeGame.homeTeam.goals === overtimeGame.awayTeam.goals && overtimeGame.played) {
                const overtimeGame = new Game(sportId, currentGame.homeTeam, currentGame.awayTeam, currentGame.overtime.length+1)
                currentInputs.forEach(input => {
                    const overtimeInput = document.createElement('input')
                    overtimeInput.dataset.overtime = overtimeId+1
                    overtimeInput.classList.add('result-input', 'overtime')
                    input.after(overtimeInput)
                })

                currentGame.overtime.push(overtimeGame)
            } else {
                currentGame.overtime = currentGame.overtime.filter(overtime => overtime.id <= overtimeId)

                currentGameGameInputs.forEach(input => {
                    if (+input.dataset.overtime > overtimeId) {
                        input.remove()
                    }
                })
            }
        }

        updateGameData(gameEl, currentGame, sportId)

        if (sportId === SPORTS.basketball.id && !overtimeId) {
            if (currentGame.homeTeam.goals === currentGame.awayTeam.goals && currentGame.homeTeam.goals !== null && (currentGame.overtime?.length > 0 ? currentGame.overtime.every(overtimeGame => overtimeGame.homeTeam.goals === overtimeGame.awayTeam.goals) : true)) {
                const overtimeGame = new Game(sportId, currentGame.homeTeam, currentGame.awayTeam, currentGame.overtime.length+1)

                currentGame.overtime.push(overtimeGame)
                gameEl.parentElement.classList.remove('played')
              
                currentGameGameInputs.forEach(input => {
                    const overtimeInput = document.createElement('input')
                    overtimeInput.dataset.overtime = currentGame.overtime.length
                    overtimeInput.classList.add('result-input', 'overtime')
                    input.after(overtimeInput)
                })
            } else {
                currentGame.overtime = []
                currentGameGameInputs.forEach(input => {
                    if (input.dataset.overtime) {
                        input.remove()
                    }
                })
            }
        }
        console.log(currentGame);
        

        localStorage.setItem('league-games-data', JSON.stringify(games))

        updateTeamsData(games, teams, sportId)
    })

    const changeTableBtn = document.createElement('button')
    changeTableBtn.type = 'button'
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

    const generateScoresBtn = document.createElement('button')
    generateScoresBtn.type = 'button'
    generateScoresBtn.textContent = 'Generate Scores'

    generateScoresBtn.addEventListener('click', (e) => {
        const scoresEl = [...gamesForm.querySelectorAll('.result-input')]
        
        scoresEl.forEach(element => {
            const gameEl = element.parentElement.parentElement
            const randomScore = Math.floor(Math.random() * 30)
            element.value = randomScore

            const currentGame = games[gameEl.dataset.gameId-1]

            updateGameData(gameEl, currentGame, sportId)
            localStorage.setItem('league-games-data', JSON.stringify(games))

            updateTeamsData(games, teams, sportId)
        });
    })
    gamesForm.after()
    container.append(gamesForm, generateScoresBtn, changeTableBtn)

    changeTable(container, teams, games)
}

function updateTeamsData(games, teams, sportId) {
    teams.forEach(team => {
        for (const [key, value] of Object.entries(team)) {
            if (key !== 'team' && key !== 'totalGames') {
                if (Number(value)) {
                    team[key] = 0
                } else if (typeof value === 'boolean') {
                    team[key] = false
                } else if (typeof value === 'object' && value !== null) {
                    Object.keys(value).forEach(a => {
                        value[a] = 0
                    })
                }
            }
        }
    })

    let winPoints = sportId === SPORTS.basketball.id ? SPORTS.basketball.points.winPoints : SPORTS.football.points.winPoints

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
        
        if (game.played) {
            const homeTeamScored = gameHomeTeam.goals
            const awayTeamScored = gameAwayTeam.goals

            let homeTeamTotalScored = gameHomeTeam.goals
            let awayTeamTotalScored = gameAwayTeam.goals

            if (sportId === SPORTS.basketball.id) {
                let homeTeamOverTime = 0
                let awayTeamOverTime = 0
                game.overtime.forEach(overtime => {
                    homeTeamOverTime+=overtime.homeTeam.goals
                    awayTeamOverTime+=overtime.awayTeam.goals


                    if (overtime.homeTeam.goals > overtime.awayTeam.goals) {
                        homeTeamData.overtime.won++
                        awayTeamData.overtime.lost++
                    } else if (overtime.homeTeam.goals < overtime.awayTeam.goals) {
                        awayTeamData.overtime.won++
                        homeTeamData.overtime.lost++
                    }
                });

                homeTeamTotalScored += homeTeamOverTime
                awayTeamTotalScored += awayTeamOverTime
            }
   
            homeTeamData.playedGames++
            awayTeamData.playedGames++
    
            homeTeamData.goals += homeTeamScored
            awayTeamData.goals += awayTeamScored
            sportId === SPORTS.football.id && (awayTeamData.awayGoals += awayTeamScored)

            homeTeamData.goalsMissed += awayTeamScored
            awayTeamData.goalsMissed += homeTeamScored
        
            homeTeamData.goalDifference = homeTeamData.goals - homeTeamData.goalsMissed
            awayTeamData.goalDifference = awayTeamData.goals - awayTeamData.goalsMissed
    
            if (homeTeamTotalScored > awayTeamTotalScored) {
                homeTeamData.wins++
                awayTeamData.losses++

                if (sportId === SPORTS.basketball.id) {
                    homeTeamData.homeGames.won++
                    awayTeamData.awayGames.lost++
                }
            } else if (homeTeamTotalScored < awayTeamTotalScored) {
                homeTeamData.losses++
                awayTeamData.wins++
                
                if (sportId === SPORTS.basketball.id) {
                    homeTeamData.homeGames.lost++
                    awayTeamData.awayGames.won++
                } else if (sportId === SPORTS.football.id) {
                    awayTeamData.awayWins++
                }
            } else if (homeTeamTotalScored === awayTeamTotalScored && sportId === SPORTS.football.id) {
                console.log(homeTeamData);
                homeTeamData.draws++
                awayTeamData.draws++
            }

            if (sportId === SPORTS.basketball.id) {
                homeTeamData.winPerc = calcWinningPerc(homeTeamData.wins, homeTeamData.playedGames)
                awayTeamData.winPerc = calcWinningPerc(awayTeamData.wins, awayTeamData.playedGames)

                game.overtime.forEach(overtime => {
                    homeTeamData.overtime.scored += overtime.homeTeam.goals
                    homeTeamData.overtime.missed += overtime.awayTeam.goals    

                    awayTeamData.overtime.missed += overtime.homeTeam.goals                    
                    awayTeamData.overtime.scored += overtime.awayTeam.goals             
                });

                const {winPoints, lossPoints} = SPORTS.basketball.points

                homeTeamData.points = homeTeamData.wins*winPoints + homeTeamData.losses*lossPoints
                awayTeamData.points = awayTeamData.wins*winPoints + awayTeamData.losses*lossPoints
            } else if (sportId === SPORTS.football.id) {
                const {winPoints, drawPoints} = SPORTS.football.points

                homeTeamData.points = homeTeamData.wins*winPoints + homeTeamData.draws*drawPoints
                awayTeamData.points = awayTeamData.wins*winPoints + awayTeamData.draws*drawPoints

            }
        }

    
        homeTeamData.gamesLeft = homeTeamData.totalGames - homeTeamData.playedGames
        awayTeamData.gamesLeft = awayTeamData.totalGames - awayTeamData.playedGames

        homeTeamData.potentialPoints = homeTeamData.gamesLeft*winPoints
        awayTeamData.potentialPoints = awayTeamData.gamesLeft*winPoints

        homeTeamData.maxPotentialPoints = homeTeamData.potentialPoints + homeTeamData.points
        awayTeamData.maxPotentialPoints = awayTeamData.potentialPoints + awayTeamData.points
    })


    changeTable(container, teams, games)


    const playoffsTeamsData = JSON.parse(localStorage.getItem('playoffs-teams-data'))
    const playoffGamesData = JSON.parse(localStorage.getItem('playoffs-data'))

    if (playoffGamesData) {
        const teamsToPlayoffs = teams.slice(0, playoffGamesData.teamsAmount)

        let leagueTableUpdated = !teamsToPlayoffs.every((team, i) => Object.keys(team).every(p => team[p] === playoffsTeamsData[i][p]));
 
        localStorage.setItem('playoffs-teams-data', JSON.stringify(teamsToPlayoffs))

        if (leagueTableUpdated) {
            playoffsForm(container, playoffGamesData, teamsToPlayoffs, {leagueTableUpdated})
        }
    }

    localStorage.setItem('teams-data', JSON.stringify(teams))
}


const calcWinningPerc = (wins, played) => {
    const result = Math.round((wins/played)*1000)/10
    return result
}

export function changeTable(container, teams, games) {
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

export function compareTeamsTable(wrapper, teams, games, tableType) {
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
    console.log(sortedTeams, teams);

    if (tableType === 'old') {
        table = createOldTable(wrapper, updatedTeams, games)
    } else {
        table = createModernTable(wrapper, updatedTeams, games)
    }
    table.id = 'comparing-table'

    return table
}


