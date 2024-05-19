import { Container, SPORTS } from "../../config.js";
import BasketballGame from "../../functions/classes/BasketballGame.js";
import BasketballTeam from "../../functions/classes/BasketballTeam.js";
import FootballGame from "../../functions/classes/FootballGame.js";
import FootballTeam from "../../functions/classes/FootballTeam.js";
import Game from "../../functions/classes/Game.js";
import updateGameData from "../../functions/updateGameData.js";
import updateTeamsData from "../../functions/updateTeamsData.js";
import accordion from "../accordion.js";

function leagueTournament(container: Container, games: BasketballGame[] | FootballGame[], teams: FootballTeam[] | BasketballTeam[]) {
    const gamesForm = document.createElement('form')
    gamesForm.id = 'games-form'
    const roundsAmount = Number(localStorage.getItem('rounds-amount') || '')
    const sportId: number = JSON.parse(localStorage.getItem('sport') || '').id

    const ClassGame = sportId === SPORTS.football.id ? FootballGame : BasketballGame

    for (let i = 0; i < roundsAmount; i++) {
        let round = i+1
        const btnText = `Round ${round}`
        const roundGames = games.filter(game => game.round === round)

        const legs = [...new Set(roundGames.map(game => game.leg))]

        accordion(gamesForm, btnText, legs, roundGames)
    }


    gamesForm.addEventListener('change', (e) => {
        const target = e.target as HTMLFormElement
        const gameEl = target?.parentElement && target.parentElement.parentElement
        
        const gameId = gameEl?.dataset.gameId && +gameEl.dataset.gameId
        const currentGame = games.find(game => game.id === gameId)
        const overtimeId = target.dataset.overtime && +target.dataset.overtime

        const currentGameGameInputs = gameEl && [...gameEl.querySelectorAll<HTMLInputElement>('.result-input')]

        if (!currentGame || !currentGameGameInputs || !gameEl) {
            return
        }

        const homeTeam = teams.find(team => team.id === currentGame.homeTeam.id)
        const awayTeam = teams.find(team => team.id === currentGame.awayTeam.id)

        if (!homeTeam || !awayTeam) {
            return
        }

        const oldGame = Object.assign(currentGame, {})

        if (overtimeId && sportId === SPORTS.basketball.id) {
            const currentInputs = gameEl && [...gameEl.querySelectorAll(`.result-input[data-overtime="${overtimeId}"]`)]

            const overtimeGame: Game = currentGame.overtime.find(overtime => overtime.id === overtimeId)

            if (!overtimeGame) {
                return
            }

            updateGameData(gameEl, overtimeGame, sportId, {overtime: true})

            const equalOvertimeGoals = overtimeGame.teams.every(team => currentGame.teams[0].goals === team.goals)

            if (equalOvertimeGoals && overtimeGame.played) {
                const overtimeGame = new Game(homeTeam, awayTeam, currentGame.overtime.length+1, currentGame.leg, currentGame.round)

                currentInputs.forEach(input => {
                    const overtimeInput = document.createElement('input')
                    overtimeInput.dataset.overtime = (overtimeId+1).toString()

                    overtimeInput.classList.add('result-input', 'overtime')
                    input.after(overtimeInput)
                })

                currentGame.overtime.push(overtimeGame)
            } else {
                currentGame.overtime = currentGame.overtime.filter(overtime => overtime.id <= overtimeId)

                currentGameGameInputs.forEach(input => {
                    if (input.dataset.overtime && +input.dataset.overtime > overtimeId) {
                        input.remove()
                    }
                })
            }
        }

        updateGameData(gameEl, currentGame, sportId)

        if (sportId === SPORTS.basketball.id && !overtimeId) {
            const equalGoals = currentGame.teams.every(team => currentGame.teams[0].goals === team.goals)

            if (equalGoals && currentGame.playedAll) {
                const overtimeGame = new ClassGame(homeTeam, awayTeam, currentGame.overtime.length+1, currentGame.leg, currentGame.round)

                currentGame.overtime.push(overtimeGame)
                gameEl.parentElement && gameEl.parentElement.classList.remove('played')
              
                currentGameGameInputs.forEach(input => {
                    const overtimeInput = document.createElement('input')
                    overtimeInput.dataset.overtime = currentGame.overtime.length.toString()
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

        localStorage.setItem('league-games-data', JSON.stringify(games))

        updateTeamsData(currentGame, oldGame, teams, sportId)
    })

    const changeTableBtn = document.createElement('button')
    changeTableBtn.type = 'button'
    changeTableBtn.textContent = 'Change Table View'

    // changeTableBtn.addEventListener('click', (e) => {
    //     const prevTableType = localStorage.getItem('table-type')

    //     if (prevTableType === 'modern' || !prevTableType) {
    //         localStorage.setItem('table-type', 'old')
    //         changeTable(container, teams, games)
    //     } else {
    //         localStorage.setItem('table-type', 'modern')
    //         changeTable(container, teams, games)
    //     }
    // })

    const generateScoresBtn = document.createElement('button')
    generateScoresBtn.type = 'button'
    generateScoresBtn.textContent = 'Generate Scores'

    generateScoresBtn.addEventListener('click', (e) => {
        const scoresEl = [...gamesForm.querySelectorAll<HTMLInputElement>('.result-input')]
        
        scoresEl.forEach(element => {
            const gameEl = element.parentElement && element.parentElement.parentElement

            if (!gameEl) {
                return
            }
            const gameId = gameEl.dataset.gameId && +gameEl.dataset.gameId

            const randomScore = Math.floor(Math.random() * 30)
            element.value = randomScore.toString()

            const currentGame = games.find(game => game.id === gameId)

            if (currentGame) {
                const oldGame = {...currentGame}
                updateGameData(gameEl, currentGame, sportId)
                localStorage.setItem('league-games-data', JSON.stringify(games))
    
                updateTeamsData(currentGame, oldGame, teams, sportId)
            }
        });
    })
    gamesForm.after()
    container.append(gamesForm, generateScoresBtn, changeTableBtn)

    // changeTable(container, teams, games)
}

export default leagueTournament