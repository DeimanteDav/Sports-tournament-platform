import { SPORTS } from "../config.js"
import { GameType, GamesType, SportDataInterface, TeamsType } from "../types.js"
import BasketballGame from "./Basketball/BasketballGame.js"
import BasketballTeam, { BasketballTeamData } from ".//Basketball/BasketballTeam.js"
import FootballGame from "./Football/FootballGame.js"
import FootballTeam, { FootballTeamData } from "./Football/FootballTeam.js"
import Game from "./Game.js"

// export default class League implements RegularSeason, Playoffs {
//     roundsAmount?: number
//     private teams: FootballTeam[] | BasketballTeam[]
//     private relegation?: number
//     private playoffsPairsData?: {}

//     get rounds() {
//         const localStorageRounds = localStorage.getItem('rounds-amount')

//         if (localStorageRounds) {
//             return JSON.parse(localStorageRounds)
//         }
        
//         throw new Error('no rounds found in local storage')
//     }

//     set rounds(amount: number) {
//         if (!amount) {
//             throw new Error('no rounds given')
//         } 

//         this.roundsAmount = amount
//         localStorage.setItem('rounds-amount', JSON.stringify(amount))
//     }
    

//     constructor(teams: FootballTeam[] | BasketballTeam[], relegation?: number) {
//         this.roundsAmount = 0
//         this.teams = teams
//         this.relegation = relegation
//     }
  

//     static getLeagueData() {
//         const leagueData = localStorage.getItem('league-data')
//             }

//     static setLeagueData() {
        
//     }
// }

// interface playoffsAccordion = {
//     leg: number
//     playoffsPairs: 
// } 


export default abstract class League {
    private _leagueTeams: TeamsType = []
    private _sportType: SportDataInterface | null = null

    get leagueTeams(): TeamsType {
        if (this._leagueTeams) {
            return this._leagueTeams
        }

        throw new Error('no teams in league')
    }

    set leagueTeams(newTeams: (FootballTeamData | BasketballTeamData)[]) {
        if (this.sportType.id === SPORTS.football.id) {
            this._leagueTeams = newTeams.map(newTeam => {
                return new FootballTeam(newTeam)
            })
        } else {
            this._leagueTeams = newTeams.map(newTeam => {
                return new BasketballTeam(newTeam)
            })
        }

        localStorage.setItem('teams', JSON.stringify(newTeams))
    }


    get sportType() {
        if (this._sportType) {
            return this._sportType
        }

        throw new Error('no sport type in league')
    }

    set sportType(type) {
        this._sportType = type
        localStorage.setItem('sport-type', JSON.stringify(type))
    }

    
    overtimeGameHandler(wrapper: HTMLElement, currentGame: GameType, gameEl: HTMLElement, gameTeams: TeamsType, overtimeId: number) {
        const basketballGame = currentGame as BasketballGame
        const basketballOvertime = basketballGame.overtime.find(overtime => overtime.id === overtimeId)

        if (!basketballOvertime || !gameEl) throw new Error('no overtime and/or gameEl in overtime game handler')

        const overtimeInputs = [...gameEl.querySelectorAll<HTMLInputElement>(`.result-input[data-overtime="${overtimeId}"]`)]

        const currentGameAllInputs = [...gameEl.querySelectorAll<HTMLInputElement>(`.result-input`)]
    
        if (!overtimeInputs || !currentGameAllInputs) throw new Error('no overtime inputs and/or current game inputs in overtime handler')
        
        this.updateGameData(wrapper, overtimeInputs, basketballOvertime)

        const equalOvertimeGoals = basketballOvertime.teams.every(team => basketballOvertime.teams[0].goals === team.goals)

        if (equalOvertimeGoals && basketballOvertime.played) {
            const basketballOvertime = new Game(basketballGame.overtime.length+1, currentGame.leg, currentGame.round, null, gameTeams[0], gameTeams[1])
    
            overtimeInputs.forEach((input, i) => {
                const overtimeInput = document.createElement('input')
                overtimeInput.dataset.overtime = (overtimeId+1).toString()
                overtimeInput.dataset.teamId = gameTeams[i].teamId?.toString()
                overtimeInput.classList.add('result-input')
    
                input.after(overtimeInput)
            })
    
            basketballGame.overtime.push(basketballOvertime)
        } else {
            basketballGame.overtime = basketballGame.overtime.filter(overtime => overtime.id <= overtimeId)
    
            currentGameAllInputs.forEach(input => {
                if (input.dataset.overtime && +input.dataset.overtime > overtimeId) {
                    input.remove()
                }
            })
        }
    }

    updateGameData(wrapper: HTMLElement, inputs: HTMLInputElement[], currentGame: GameType | Game) {
        if (!inputs || inputs.length !== 2 || !wrapper) {
            throw new Error('no inputs in update game data')
        }
 
        const team1Input = inputs[0]
        const team2Input = inputs[1]
    
        const team1Id = team1Input.dataset.teamId && +team1Input.dataset.teamId
        const team2Id = team2Input.dataset.teamId && +team2Input.dataset.teamId

        if (!team1Id || !team2Id) {
            throw new Error('no team id')
        }

        const team1Scored = Number(team1Input.value)
        const team2Scored = Number(team2Input.value)
        
        currentGame.teams.forEach(team => {
            if (team.id === team1Id) {
                team.goals = team1Input.value ? team1Scored : null
            } else if (team.id === team2Id) {
                team.goals = team2Input.value ? team2Scored : null
            }
    
            if (team1Input.value && team2Input.value) {
                currentGame.played = true
                if (this.sportType.id === SPORTS.basketball.id) {
                    const basketballGame = currentGame as BasketballGame
        
                    if (basketballGame.overtime?.length > 0) {
                        if (basketballGame.overtime.every(overtimeGame => overtimeGame.played)) {
                            wrapper.classList.add('played')
                            currentGame.playedAll = true
                        } else {
                            wrapper.classList.remove('played')
                            currentGame.playedAll = false
                        }
                    } else {
                        wrapper.classList.add('played')
                        currentGame.playedAll = true
                    }
                } else if (this.sportType.id === SPORTS.football.id) {
                    const footballGame = currentGame as FootballGame
                    if (footballGame.extraTime && footballGame.shootout) {
                        if (footballGame.extraTime.played) {
                            wrapper.classList.add('played')
                            currentGame.playedAll = true
                        } else {
                            wrapper.classList.remove('played')
                            currentGame.playedAll = false
                        }
    
                        if (footballGame.shootout.played) {
                            wrapper.classList.add('played')
                            currentGame.playedAll = true
                        } else {
                            wrapper.classList.remove('played')
                            currentGame.playedAll = false
                        }
                    } else {
                        wrapper.classList.add('played')
                    }
                }
            } else {
                currentGame.played = false
                currentGame.playedAll = false
                wrapper.classList.remove('played')
            }
        })
    }
}