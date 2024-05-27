import accordion from "../components/accordion.js"
import leagueTable from "../components/league/leagueTable.js"
import leagueTournament from "../components/league/leagueTournament.js"
import { SPORTS } from "../config.js"
import overtimeGameHandler from "../functions/overtimeGameHandler.js"
import updateGameData from "../functions/updateGameData.js"
import updateTeamsData from "../functions/updateTeamsData.js"
import { GamesType, TeamsType } from "../types.js"
import BasketballGame from "./BasketballGame.js"
import Game from "./Game.js"
import League from "./League.js"

interface RegularSeasonInterface {
    teams: TeamsType
    gamesAmount: number
    roundsAmount: number
    games: GamesType
    relegation?: number | null
}

export default class RegularSeason extends League {
    constructor(public gamesAmount: number, public roundsAmount: number, public relegation?: number) {
        super()

        this.roundsAmount = 0
        this.relegation = relegation
    }

    static getData(nec?: boolean) {
        const regularSeasonData = localStorage.getItem('regular-season-data')
        
        if (regularSeasonData) {
            let result: RegularSeasonInterface = JSON.parse(regularSeasonData)
            return result
        } else if (nec) {
            return {
                teams: [],
                gamesAmount: 0,
                roundsAmount: 0,
                games: []
            } 
        }

        return null
    }

    static setTeams(teams: TeamsType) {
        const oldData = RegularSeason.getData(true)

        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, teams}

        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }
    
    static setRoundsAmount(roundsAmount: number) {
        const oldData = RegularSeason.getData(true)

        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, roundsAmount}

        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }

    static setRelegation(relegation: number) {
        const oldData = RegularSeason.getData(true)

        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, relegation}
    
        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }

    static setGames(games: DataType['games']) {
        const oldData = RegularSeason.getData(true)

        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, games}
    
        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }

    static setGamesAmount(gamesAmount: number) {
        const oldData = RegularSeason.getData()

        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, gamesAmount}
    
        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }

    static removeData() {
        localStorage.removeItem('regular-season-data')
    }

    renderHtml(container: HTMLDivElement) {
        const data = RegularSeason.getData()!
        const {games, teams, roundsAmount} = data
    
        const gamesForm = document.createElement('form')
        gamesForm.id = 'games-form'
        const sportId: number = JSON.parse(localStorage.getItem('sport') || '').id
    
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
    
            RegularSeason.setGames(games)
    
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
    
                    RegularSeason.setGames(games)
    
                    updateTeamsData(container, games, currentGame, oldGame, teams)
                }
            });
        })
    
        container.append(gamesForm, generateScoresBtn, changeTableBtn)
    
        leagueTable(container, games, teams)    }
}