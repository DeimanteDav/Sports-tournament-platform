import { SPORTS } from "../config.js"

import { GameType, GamesType, SportDataInterface, TeamsType, legDataInterface } from "../types.js"
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
            const basketballOvertime = new Game(gameTeams[0], gameTeams[1], basketballGame.overtime.length+1, currentGame.leg, currentGame.round, null)
    
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

    groupGamesByLeg(games: GamesType, groupedGames: legDataInterface[]) {
        games.forEach(game => {
            const group = groupedGames.find(group => group.leg === game.leg)

            if (group) {
                group.games.push(game)
            } else {
                groupedGames.push({leg: game.leg, games: [game]})
            }
        })
    }


    renderAccordion(wrapper: HTMLElement, round: string | number, text: string, legsData: legDataInterface[], params: {inner: boolean, disable: boolean} = {inner: false, disable: true}) {
        const {inner, disable} = params

        const itemWrapper = document.createElement('div')
        itemWrapper.classList.add('accordion-item')

        const tabWrapper = document.createElement('div')
        tabWrapper.classList.add('accordion-tab-wrapper')

        const markWrapper = document.createElement('div')
        markWrapper.classList.add('accordion-mark-wrapper')

        const mark = document.createElement('span')
        mark.classList.add('accordion-mark')
        mark.textContent = '>'

        const title = document.createElement('span')
        title.classList.add('accordion-title')
        title.textContent = text

        const item = document.createElement('div')
        item.classList.add('accordion-item')
        item.classList.add('display')

        if (inner) {
            itemWrapper.classList.add('inner')
        }
        const data = document.createElement('div')
        

        markWrapper.append(mark)
        tabWrapper.append(markWrapper, title)
        item.append(data)
        itemWrapper.append(tabWrapper, item)
        wrapper.append(itemWrapper)

        if (!inner) {
            legsData.forEach((legData, i) => {
                const legTitle = legData.leg + (legData.extraData ? ' ' + legData.extraData : '')

                this.renderAccordion(data, round, legTitle, [legData, legsData[i-1]], {inner: true, disable})
            })
        } else {
            const legData = legsData[0]
            const prevLegData = legsData[1]
            const legGames = legData.games
            data.classList.add('games', round.toString())

            legGames?.forEach((game, i) => {
                const prevGame = prevLegData?.games[i] || null
                data.append(this.createGameWrapper(prevGame, game, round, disable))
            })
        }

        tabWrapper.addEventListener('click', (e) => {
            this.accordionHandler(itemWrapper)
        })
    }

    private accordionHandler(item: HTMLDivElement) {
        const isActive = item.classList.contains('active');

        const allAccordions = item.parentElement && item.parentElement.querySelectorAll(':scope > .accordion-item');

        allAccordions?.forEach(acc => {
            if (item.classList.contains('inner')) {
                acc.classList.remove('active')
            } else {
                const childrenAcc = acc.querySelectorAll('.inner')
                childrenAcc.forEach(acc => acc.classList.remove('active'))
                acc.classList.remove('active')
            }
        })

        if (!isActive) {
            item.classList.add('active');
        }
    }


    createGameWrapper(prevGame: GameType | null, game: GameType, round: number | string, disable: boolean = true): HTMLDivElement {
        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        const idsWrapper = document.createElement('div')
        
        const gameIdElement = document.createElement('p')

        gameIdElement.textContent = `${game.id}.`
        idsWrapper.append(gameIdElement)

        if (game.playedAll) {
            gameWrapper.classList.add('played')
        }

        if (game.pairId) {
            const pairIdElement = document.createElement('p')
            pairIdElement.textContent = `Pair ${game.pairId}`

            idsWrapper.append(pairIdElement)
        }

        if (game.fightForThird) {
            gameWrapper.classList.add('fight-for-third')
            gameWrapper.dataset.fightForThird = 'true'
        }

        gameWrapper.append(idsWrapper)

        const gameEl = this.createGameElement(prevGame, game, round, disable)
        gameWrapper.append(gameEl)

        return gameWrapper
    }

    private createGameElement(prevGame: GameType | null, game: GameType, round: number | string, disable: boolean = true): HTMLDivElement {
        const gameEl = document.createElement('div')
        gameEl.dataset.gameId = game.id.toString()
        gameEl.dataset.leg = game.leg.toString()
        gameEl.dataset.round = round.toString()
        gameEl.classList.add('game')

        game.hasOwnProperty('extraTime') && (gameEl.dataset.extraTime = 'true')

        if (game.pairId) {
            gameEl.dataset.pairId = game.pairId.toString()
        }


        for (const team of game.teams) {
            const teamWrapper = document.createElement('div')
            teamWrapper.classList.add('team')
            const label = document.createElement('label')
            const input = document.createElement('input')               
            input.type = 'number'
            input.classList.add('result-input')

            if (team.home) {
                teamWrapper.classList.add('home-team')
            } else {
                teamWrapper.classList.add('away-team')
            }
            label.htmlFor = input.id

            label.textContent = team.team
            input.dataset.teamId = team.id?.toString()
            
            input.value = team.goals !== null ? team.goals.toString() : ''

            if ((game.teams.some(team => !team.team || !team.id) || (prevGame && !prevGame.playedAll)) && disable) {
                input.setAttribute('disabled', 'true')
            }

        
            teamWrapper.append(label, input)
            
            if ((game as FootballGame).extraTime) {
                const extraTimeTeam = (game as FootballGame).extraTime?.teams.find(extraGameTeam => extraGameTeam.id === team.id)

                if (extraTimeTeam) {
                    const extraTimeInput = document.createElement('input')
                    extraTimeInput.dataset.extraTime = 'true'
                    extraTimeInput.type = 'number'
                    extraTimeInput.classList.add('result-input')
                    extraTimeInput.dataset.teamId = team.id?.toString()

                    extraTimeInput.value = extraTimeTeam.goals !== null ? extraTimeTeam.goals.toString() : ''
        
                    teamWrapper.append(extraTimeInput)
                }
            }

            if ((game as FootballGame).shootout) {
                const shootoutTeam = (game as FootballGame).shootout?.teams.find(shootoutTeam => shootoutTeam.id === team.id)

                if (shootoutTeam) {
                    const shootoutInput = document.createElement('input')
                    shootoutInput.dataset.shootout = 'true'         
                    shootoutInput.type = 'number'
                    shootoutInput.classList.add('result-input')
                    shootoutInput.dataset.teamId = team.id?.toString()

                    shootoutInput.value = shootoutTeam.goals !== null ? shootoutTeam.goals.toString() : ''
        
                    teamWrapper.append(shootoutInput)
                }
            }
            if ((game as BasketballGame).overtime) {
                (game as BasketballGame).overtime.forEach((overtime, i) => {
                    const overtimeTeam = overtime.teams.find(overtimeTeam => overtimeTeam.id === team.id)
                    if (overtimeTeam) {
                        const overtimeInput = document.createElement('input')
                        overtimeInput.dataset.overtime = `${i+1}`
                        overtimeInput.type = 'number'
                        overtimeInput.classList.add('result-input')
                        overtimeInput.dataset.teamId = team.id?.toString()

                        overtimeInput.value = overtimeTeam.goals !== null ? overtimeTeam.goals.toString() : ''
        
                        teamWrapper.append(overtimeInput)
                    }
                })
            }

            gameEl.append(teamWrapper) 
        }

        return gameEl
    }

    getAccordionGamesWrapper(round: string) {
        const wrapper = document.getElementsByClassName(`games ${round}`)

        return wrapper[0]

    }
}