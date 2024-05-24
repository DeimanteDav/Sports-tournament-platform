import { Container, SPORTS } from "../../config.js";
import BasketballGame from "../../classes/BasketballGame.js";
import BasketballTeam from "../../classes/BasketballTeam.js";
import FootballGame from "../../classes/FootballGame.js";
import FootballTeam from "../../classes/FootballTeam.js";
import Game from "../../classes/Game.js";
import updateGameData from "../../functions/updateGameData.js";
import updateTeamsData from "../../functions/updateTeamsData.js";
import accordion from "../accordion.js";
import leagueTable from "./leagueTable.js";
import overtimeGameHandler from "../../functions/overtimeGameHandler.js";

function leagueTournament(container: Container, games: (BasketballGame | FootballGame)[], teams: (FootballTeam | BasketballTeam)[]) {
    const gamesForm = document.createElement('form')
    gamesForm.id = 'games-form'
    const roundsAmount = Number(localStorage.getItem('rounds-amount') || '')
    const sportId: number = JSON.parse(localStorage.getItem('sport') || '').id

    for (let i = 0; i < roundsAmount; i++) {
        let round = i+1
        const btnText = `Round ${round}`
        const roundGames = games.filter(game => game.round === round)

        const legs = [...new Set(roundGames.map(game => game.leg))]

        const roundGamesClasses = roundGames as FootballGame[] | BasketballGame[]

        accordion(gamesForm, btnText, legs, roundGamesClasses)
    }


    gamesForm.addEventListener('change', (e) => {
        const target = e.target as HTMLFormElement

        const gameEl = target?.parentElement && target.parentElement.parentElement
        const gameWrapper = gameEl?.parentElement && gameEl.parentElement
        
        const gameId = gameEl?.dataset.gameId && +gameEl.dataset.gameId
        const currentGame = games.find(game => game.id === gameId)
        const overtimeId = target.dataset.overtime && +target.dataset.overtime

        const currentGameAllInputs = gameEl && [...gameEl.querySelectorAll<HTMLInputElement>('.result-input')]

        const currentGameInputs = currentGameAllInputs?.filter(input => {
            if (!input.dataset.overtime && !input.dataset.extraTime && !input.dataset.shootout) {
                return input
            }
        })!

        if (!currentGame || !currentGameAllInputs || !gameEl || !gameWrapper) {
            return
        }

        const gameTeams = teams.filter(team => team.id === currentGame.teams[0].id || team.id === currentGame.teams[1].id)

        const oldGame = JSON.parse(JSON.stringify(currentGame))

        if (overtimeId && sportId === SPORTS.basketball.id) {
            overtimeGameHandler(currentGame, gameWrapper, gameEl, gameTeams, overtimeId, sportId)
        }

        updateGameData(gameWrapper, currentGameInputs, currentGame, sportId)

        if (sportId === SPORTS.basketball.id && !overtimeId) {
            const basketballGame = currentGame as BasketballGame

            const equalGameGoals = currentGame.teams.every(team => currentGame.teams[0].goals === team.goals)

            if (equalGameGoals && currentGame.playedAll) {
                const overtimeGame = new Game(basketballGame.overtime.length+1, currentGame.leg, currentGame.round, null, gameTeams[0], gameTeams[1])

                basketballGame.overtime.push(overtimeGame)
                gameEl.parentElement && gameEl.parentElement.classList.remove('played')
              
                currentGameAllInputs.forEach(input => {
                    const overtimeInput = document.createElement('input')
                    overtimeInput.dataset.overtime = basketballGame.overtime.length.toString()
                    overtimeInput.classList.add('result-input', 'overtime')
                    input.after(overtimeInput)
                })
            } else {
                basketballGame.overtime = []
                currentGameAllInputs.forEach(input => {
                    if (input.dataset.overtime) {
                        input.remove()
                    }
                })
            }
        }      

        localStorage.setItem('league-games-data', JSON.stringify(games))

        updateTeamsData(container, games, currentGame, oldGame, teams)
    })

    const changeTableBtn = document.createElement('button')
    changeTableBtn.type = 'button'
    changeTableBtn.textContent = 'Change Table View'

    changeTableBtn.addEventListener('click', (e) => {
        const prevTableType = localStorage.getItem('table-type')

        if (prevTableType === 'modern' || !prevTableType) {
            localStorage.setItem('table-type', 'old')
            leagueTable(container, games, teams)
        } else {
            localStorage.setItem('table-type', 'modern')
            leagueTable(container, games, teams)
        }
    })

    const generateScoresBtn = document.createElement('button')
    generateScoresBtn.type = 'button'
    generateScoresBtn.textContent = 'Generate Scores'

    generateScoresBtn.addEventListener('click', (e) => {
        const scoresEl = [...gamesForm.querySelectorAll<HTMLInputElement>('.result-input')]
        
        scoresEl.forEach(element => {
            const gameEl = element.parentElement && element.parentElement.parentElement
            const gameWrapper = gameEl?.parentElement && gameEl.parentElement

            const currentGameAllInputs = gameEl && [...gameEl.querySelectorAll<HTMLInputElement>('.result-input')]

            if (!gameWrapper || !currentGameAllInputs) {
                return
            }

            const currentGameInputs = currentGameAllInputs?.filter(input => {
                if (!input.dataset.overtime && !input.dataset.extraTime && !input.dataset.shootout) {
                    return input
                }
            })

            const gameId = gameEl.dataset.gameId && +gameEl.dataset.gameId

            const randomScore = Math.floor(Math.random() * 30)

            element.value = randomScore.toString()

            const currentGame = games.find(game => game.id === gameId)

            if (currentGame) {
                const oldGame = {...currentGame}
                updateGameData(gameWrapper, currentGameInputs, currentGame, sportId)
                localStorage.setItem('league-games-data', JSON.stringify(games))
    
                updateTeamsData(container, games, currentGame, oldGame, teams)
            }
        });
    })
    gamesForm.after()
    container.append(gamesForm, generateScoresBtn, changeTableBtn)

    leagueTable(container, games, teams)
}

export default leagueTournament