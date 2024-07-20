import { SPORTS } from "../config.js";
import { TeamsType, PlayoffsPairInterface, GamesType, legDataInterface } from "../types.js";
import BasketballGame from "./Basketball/BasketballGame.js";
import FootballGame from "./Football/FootballGame.js";
import PlayoffsPair from "./PlayoffsPair.js";
import League from "./League.js";
import Game from "./Game.js";
import setPlayoffPairTeams from "../functions/playoffs/setPlayoffPairTeams.js";
import winnerElement from "../components/playoffs/winnerElement.js";
import FootballTeam, { FootballTeamData } from "./Football/FootballTeam.js";
import BasketballTeam, { BasketballTeamData } from "./Basketball/BasketballTeam.js";

export interface playoffsInteface {
    _playoffsTeams: TeamsType,
    _teamsAmount: number,
    _roundsData: roundsDataInterface
    _pairsData: pairsDataInterface
}

interface roundsDataInterface {
    [k: string]: {
        gamesAmount: number
        knockouts: number | null
        bestOutOf?: number | null
    }
}

interface pairsDataInterface {
    [k: string]: PlayoffsPairInterface[]
}

export default class Playoffs extends League {
    private _playoffsTeams: TeamsType
    private _teamsAmount: number
    private _roundsData: roundsDataInterface
    private _pairsData: pairsDataInterface
    private _fightForThird: boolean

    get playoffsTeams(): TeamsType {
        if (this._playoffsTeams) {
            return this._playoffsTeams
        }
        throw new Error('no teams')
    }

    set playoffsTeams(newTeams: (FootballTeamData | BasketballTeamData)[]) {
        if (this.sportType.id === SPORTS.football.id) {
            this._playoffsTeams = newTeams.map(newTeam => {
                return new FootballTeam(newTeam)
            })
        } else {
            this._playoffsTeams = newTeams.map(newTeam => {
                return new BasketballTeam(newTeam)
            })
        }

        const updatedData = { ...this, _playoffsTeams: this._playoffsTeams }
        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))

    }

    get roundsData() {
        if (this._roundsData) {
            return this._roundsData
        }
        throw new Error('no rounds data')
    }

    set roundsData(data) {
        this._roundsData = data
        const updatedData = { ...this, _roundsData: this._roundsData }

        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    get teamsAmount() {
        if (this._teamsAmount) {
            return this._teamsAmount
        }
        throw new Error('no teams amount')
    }

    set teamsAmount(amount) {
        this._teamsAmount = amount
        const updatedData = { ...this, _teamsAmount: this._teamsAmount }

        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    get pairsData() {
        if (this._pairsData) {
            return this._pairsData
        }
        throw new Error('no pair data')
    }

    set pairsData(data) {
        this._pairsData = data
        const updatedData = { ...this, _pairsData: this._pairsData }

        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }


    get fightForThird() {
        return this._fightForThird
    }

    set fightForThird(data) {
        this._fightForThird = data
        const updatedData = { ...this, _fightForThird: this._fightForThird }

        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }


    constructor(playoffsTeams?: TeamsType, teamsAmount?: number, roundsData?: roundsDataInterface, pairsData?: pairsDataInterface, fightForThird: boolean = false) {
        super()
        this._playoffsTeams = playoffsTeams ? playoffsTeams : []
        this._teamsAmount = teamsAmount ? teamsAmount : 0
        this._roundsData = roundsData ? roundsData : {}
        this._pairsData = pairsData ? pairsData : {}
        this._fightForThird = fightForThird
    }

    static getData() {
        const playoffsData = localStorage.getItem('playoffs-data')

        if (playoffsData) {
            let result = JSON.parse(playoffsData)
            return result
        }
        return null
    }

    static removeData() {
        localStorage.removeItem('playoffs-data')
    }

    renderHtml(container: HTMLDivElement, params: { leagueTableUpdated: boolean } = { leagueTableUpdated: false }) {
        const { leagueTableUpdated } = params

        const playoffsWrapper = document.createElement('div')
        playoffsWrapper.classList.add('season-wrapper')
        const title = document.createElement('h2')
        title.textContent = 'Playoffs'

        const ClassGame = this.sportType.id === SPORTS.football.id ? FootballGame : BasketballGame
        const ClassTeam = this.sportType.id === SPORTS.football.id ? FootballTeam : BasketballTeam

        const oldForm: HTMLElement | null = document.querySelector('.playoffs-form')
        let form: HTMLElement

        if (oldForm) {
            oldForm.innerHTML = ''
            form = oldForm
        } else {
            form = document.createElement('div')
            form.classList.add('playoffs-form', 'accordion-parent')
        }


        const sortedData = Object.fromEntries(
            Object.entries(this.roundsData)
                .sort(([key1], [key2]) => {
                    const a = +key1.slice(-1)
                    const b = +key2.slice(-1)

                    if (a && b) {
                        return b - a
                    } else if (!Number(a)) {
                        return 1
                    } else {
                        return -1
                    }
                })
        )

        let pairId = 0
        let gameId = 0


        const roundsDataConverted = Object.entries(sortedData)

        roundsDataConverted.forEach(([round, data], index) => {
            const { gamesAmount, knockouts, bestOutOf } = data

            if (!this.pairsData[round] || leagueTableUpdated) {
                this.pairsData[round] = []

                const prevRoundGamesAmount = index > 0 && roundsDataConverted[index - 1][1].gamesAmount

                const round1TeamPairs = []
                if (index === 0) {
                    for (let i = 0; i < this.teamsAmount; i++) {
                        let modifiedTeams: any[]
                        let pair
                        if (i === 0) {
                            modifiedTeams = this.playoffsTeams

                            pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                        } else {
                            modifiedTeams = this.playoffsTeams.slice(i, -i)
                            if (modifiedTeams.length > 0) {
                                pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                            }
                        }
                        pair && round1TeamPairs.push(pair)
                    }
                }

                for (let i = 0; i < gamesAmount; i++) {
                    pairId += 1

                    let prevId = prevRoundGamesAmount && (pairId - prevRoundGamesAmount + i)

                    const prevGamesIds = prevId ? [prevId, prevId + 1] : []

                    const nextGameId = pairId + gamesAmount - (i + 1) + Math.round((i + 1) / 2)
                    const pairData = new PlayoffsPair(pairId, [], prevGamesIds, nextGameId)

                    const teams = index === 0 && round1TeamPairs[i]


                    if (knockouts) {
                        for (let leg = 1; leg <= knockouts; leg++) {
                            gameId += 1
                            let game

                            if (index === 0 && teams) {
                                if (leg % 2 === 0) {
                                    game = new ClassGame(teams[1], teams[0], gameId, leg, round, pairId)
                                } else {
                                    game = new ClassGame(teams[0], teams[1], gameId, leg, round, pairId)
                                }
                            } else {
                                const newTeam = new ClassTeam({ team: '', id: 0, totalGames: 0, minPlace: 0 }) as FootballTeam & BasketballTeam

                                game = new ClassGame(newTeam, newTeam, gameId, leg, round, pairId)
                            }

                            pairData.games.push(game)
                        }
                    } else if (bestOutOf) {
                        for (let leg = 1; leg <= bestOutOf * 2 - 1; leg++) {
                            gameId += 1
                            let game

                            if (index === 0 && teams) {
                                if (leg % 2 === 0) {
                                    game = new ClassGame(teams[1], teams[0], gameId, leg, round, pairId)
                                } else {
                                    game = new ClassGame(teams[0], teams[1], gameId, leg, round, pairId)
                                }
                            } else {
                                const newTeam = new ClassTeam({ team: '', id: 0, totalGames: 0, minPlace: 0 }) as FootballTeam & BasketballTeam

                                game = new ClassGame(newTeam, newTeam, gameId, leg, round, pairId)
                            }
                            pairData.games.push(game)
                        }
                    }

                    this.pairsData[round].push(pairData)

                    pairData.teams = setPlayoffPairTeams(this.sportType.id, pairData.games)
                }
            }

            this.pairsData = this.pairsData

            const groupedGames: legDataInterface[] = []
            this.pairsData[round].forEach((pair, i) => {
                this.groupGamesByLeg(pair.games, groupedGames)
            })

            if (bestOutOf) {
                this.pairsData[round].forEach((round, i) => {
                    const prevGames: boolean[] = []

                    round.games.forEach((game, j) => {
                        const prevGame = round.games[j - 1] && round.games[j - 1]
                        if (prevGame) prevGames.push(prevGame.playedAll)

                        if (j + 1 > bestOutOf && !prevGames.includes(true)) {
                            const groupsIfNeeded = groupedGames.filter(group => group.leg === game.leg && game)

                            groupsIfNeeded.forEach(group => {
                                group.extraData = 'If needed'
                            })
                        }
                    })

                })
            }

            const text = round
            this.renderAccordion(form, round, text, groupedGames)
        })

        // if (this.fightForThird) {
        //     // this.renderAccordion(form, '', 'Fight for 3rd Place', )
        // }

        playoffsWrapper.append(title, form)

        this.renderTable(playoffsWrapper, sortedData)
        container.append(playoffsWrapper)


        const winnerId = localStorage.getItem('winner-id')
        if (winnerId) {
            winnerElement(playoffsWrapper, +winnerId, this.playoffsTeams)
        }

        form.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement
            const gameEl = target.parentElement && target.parentElement.parentElement
            const gameWrapper = gameEl?.parentElement && gameEl.parentElement

            if (!gameEl || !gameWrapper) {
                console.error('171 error')
                return
            }

            const pairId = gameEl.dataset.pairId && +gameEl.dataset.pairId
            const currentRound = gameEl.dataset.round
            const gameId = gameEl.dataset.gameId && +gameEl.dataset.gameId
            const overtimeId = target.dataset.overtime && +target.dataset.overtime
            const extraTime = target.dataset.extraTime && JSON.parse(target.dataset.extraTime || '')
            const shootout = target.dataset.shootout && JSON.parse(target.dataset.shootout || '')


            const currentGameAllInputs = gameEl && [...gameEl.querySelectorAll<HTMLInputElement>('.result-input')]


            if (!pairId || !currentRound || !gameId || !currentGameAllInputs) {
                console.error('185 error', pairId, currentRound, gameId)
                return
            }

            const currentGameInputs = currentGameAllInputs?.filter(input => {
                if (!input.dataset.overtime && !input.dataset.extraTime && !input.dataset.shootout) {
                    return input
                }
            })

            const currentRoundInfo = this.roundsData[currentRound]
            const { gamesAmount, knockouts, bestOutOf } = currentRoundInfo

            const pairData = this.pairsData[currentRound].find(pair => pair.id === pairId)!
            const pairGames = pairData.games
            const currentGame = pairGames.find(game => game.id === gameId)

            const lastGame = pairGames.slice(-1)[0]



            const lastGameEl = document.querySelector(`.game[data-game-id="${lastGame.id}"][data-round="${currentRound}"]`)
            const lastGameInputs = lastGameEl && [...lastGameEl.querySelectorAll<HTMLInputElement>('.result-input')]

            if (!currentGame || !lastGameInputs) {
                throw new Error('new currentGame arba lastGAmeInputs')
            }

            const gameTeams = this.playoffsTeams.filter(team => team.teamId === currentGame.teams[0].id || team.teamId === currentGame.teams[1].id)

            if (this.sportType.id === SPORTS.football.id) {
                const footballLastGame = lastGame as FootballGame

                if (extraTime) {
                    const extraTimeInputs = currentGameAllInputs.filter(input => input.dataset.extraTime)

                    const extraTimeGame = footballLastGame.extraTime!

                    this.updateGameData(gameWrapper, extraTimeInputs, extraTimeGame)

                    if (extraTimeGame.teams.every(team => extraTimeGame.teams[0].goals === team.goals) && extraTimeGame.played) {
                        const newGame = new Game(gameTeams[0], gameTeams[1], lastGame.id, lastGame.leg, lastGame.round, null)

                        footballLastGame.shootout = newGame

                        const extraTimeInputs = lastGameInputs.filter(input => input.dataset.extraTime)

                        extraTimeInputs && extraTimeInputs.forEach((input, i) => {
                            const shootoutInput = document.createElement('input')
                            shootoutInput.classList.add('result-input')
                            shootoutInput.dataset.shootout = 'true'
                            shootoutInput.dataset.teamId = gameTeams[i].teamId.toString()

                            input.after(shootoutInput)
                        })
                    } else {
                        footballLastGame.playedAll = true
                        lastGameInputs.forEach(input => {
                            if (input.dataset.shootout) {
                                input.remove()
                            }
                        })
                    }
                } else if (shootout) {
                    const shootoutInputs = currentGameAllInputs.filter(input => input.dataset.shootout)

                    const shootoutGame = footballLastGame.shootout!

                    if (shootoutGame.teams.every(team => shootoutGame.teams[0].goals === team.goals) && shootoutGame.played) {
                        footballLastGame.playedAll = false
                    } else {
                        footballLastGame.playedAll = true
                    }

                    this.updateGameData(gameWrapper, shootoutInputs, shootoutGame)
                }
            }

            if (overtimeId && this.sportType.id === SPORTS.basketball.id) {
                this.overtimeGameHandler(gameWrapper, currentGame, gameEl, gameTeams, overtimeId)
            }

            this.updateGameData(gameWrapper, currentGameInputs, currentGame)

            pairData.teams = setPlayoffPairTeams(this.sportType.id, pairData.games)

            if (this.sportType.id === SPORTS.football.id && !extraTime && !shootout) {
                const footballLastGame = currentGame as FootballGame

                if (pairGames.every(game => game.playedAll) && pairData.teams[0].totalScore === pairData.teams[1].totalScore) {
                    const newGame = new Game(gameTeams[0], gameTeams[1], lastGame.id, lastGame.leg, lastGame.round, null)

                    footballLastGame.extraTime = newGame
                    footballLastGame.playedAll = false
                    gameWrapper.classList.remove('played')

                    lastGameInputs.forEach((input, i) => {
                        const extraTimeInput = document.createElement('input')
                        extraTimeInput.classList.add('result-input')
                        extraTimeInput.dataset.extraTime = 'true'
                        extraTimeInput.dataset.teamId = gameTeams[i].teamId.toString()

                        input.after(extraTimeInput)
                    })
                } else {
                    footballLastGame.extraTime = null
                    footballLastGame.shootout = null

                    if (footballLastGame.teams.every(team => team.goals)) {
                        footballLastGame.playedAll = true
                        gameWrapper.classList.add('played')
                    }
                    lastGameInputs.forEach(input => {
                        if (input.dataset.shootout || input.dataset.extraTime) {
                            input.remove()
                        }
                    })
                }
            }

            if (this.sportType.id === SPORTS.basketball.id && !overtimeId) {
                const basketballGame = currentGame as BasketballGame

                if (bestOutOf) {
                    const equalGameGoals = basketballGame.teams.every(team => basketballGame.teams[0].goals === team.goals)

                    if (equalGameGoals && basketballGame.playedAll) {
                        const overtimeGame = new Game(gameTeams[0], gameTeams[1], basketballGame.overtime.length + 1, currentGame.leg, currentGame.round, null)

                        basketballGame.overtime.push(overtimeGame)
                        basketballGame.playedAll = false
                        gameWrapper.classList.remove('played')

                        currentGameAllInputs.forEach((input, i) => {
                            const overtimeInput = document.createElement('input')
                            overtimeInput.dataset.overtime = overtimeGame.id.toString()
                            overtimeInput.classList.add('result-input')
                            overtimeInput.dataset.teamId = pairData.teams[i].id?.toString()
                            input.after(overtimeInput)
                        })

                        currentGame.playedAll = false
                        gameWrapper.classList.remove('played')
                    } else {

                        if (basketballGame.teams.every(team => team.goals)) {
                            basketballGame.playedAll = true
                            gameWrapper.classList.add('played')
                        }
                        basketballGame.overtime = []
                        currentGameAllInputs.forEach(input => {
                            if (input.dataset.overtime) {
                                input.remove()
                            }
                        })
                    }
                } else if (knockouts) {
                    const lastBasketballGame = lastGame as BasketballGame

                    if (pairGames.every(game => game.playedAll) && pairData.teams[0].totalScore === pairData.teams[1].totalScore) {
                        const overtimeGame = new Game(gameTeams[0], gameTeams[1], lastBasketballGame.overtime.length + 1, currentGame.leg, currentGame.round, null)

                        lastBasketballGame.overtime.push(overtimeGame)

                        lastGameInputs.forEach((input, i) => {
                            const overtimeInput = document.createElement('input')
                            overtimeInput.dataset.overtime = overtimeGame.id.toString()
                            overtimeInput.classList.add('result-input')
                            overtimeInput.dataset.teamId = pairData.teams[i].id?.toString()

                            input.after(overtimeInput)
                        })

                        currentGame.playedAll = false
                        gameWrapper.classList.remove('played')
                    } else {
                        lastBasketballGame.overtime = []

                        if (lastBasketballGame.teams.every(team => team.goals)) {
                            lastBasketballGame.playedAll = true
                            gameWrapper.classList.add('played')
                        }
                        lastGameInputs.forEach(input => {
                            if (input.dataset.overtime) {
                                input.remove()
                            }
                        })
                    }
                }
            }

            if (pairGames.length > 0) {
                for (let leg = 1; leg <= pairGames.length; leg++) {
                    if (leg > currentGame.leg) {
                        const followingGame = pairGames.find(game => game.leg === leg)
                        const followingGameElement = document.querySelector(`.game[data-leg="${leg}"][data-pair-id="${pairId}"]`)

                        const followingGameInputs = followingGameElement && [...followingGameElement.querySelectorAll<HTMLInputElement>('.result-input')]

                        if (followingGameInputs && followingGame) {
                            if (!currentGame.playedAll) {
                                followingGameInputs.forEach(input => {
                                    input.value = ''
                                    input.setAttribute('disabled', 'true')

                                    followingGame.played = false
                                    followingGame.playedAll = false

                                    followingGame.teams.forEach(team => {
                                        team.goals = null
                                    });

                                    if (this.sportType.id === SPORTS.football.id) {
                                        const followingFootballGame = followingGame as FootballGame

                                        followingFootballGame.shootout = null
                                        followingFootballGame.extraTime = null
                                    } else if (this.sportType.id === SPORTS.basketball.id) {
                                        (followingGame as BasketballGame).overtime = []
                                    }

                                    if (input.dataset.extraTime || input.dataset.shootout || input.dataset.overtime) {
                                        input.remove()
                                    }
                                })

                                pairData.teams = setPlayoffPairTeams(this.sportType.id, pairGames)
                            } else if (currentGame.playedAll) {
                                followingGameInputs.forEach(input => {
                                    input.removeAttribute('disabled')
                                })
                            }
                        }
                    }
                }
            }

            if (bestOutOf && pairData.teams.some(team => team.wins >= bestOutOf)) {
                pairData.winnerId = pairData.teams.reduce((prev, current) => {
                    return (prev && prev.wins > current.wins) ? prev : current
                }).id

            } else if (knockouts && pairGames.every(game => game.playedAll)) {
                pairData.winnerId = pairData.teams.reduce((prev, current) => {
                    return (prev && prev.totalScore > current.totalScore) ? prev : current
                }).id
            } else {
                pairData.winnerId = null
            }

            if (currentRound === '1/2') {
                const roundGamesPlayed = this.pairsData[currentRound].every(data => data.games.every(game => game.playedAll))

                const roundWinners = this.pairsData[currentRound].map(pairData => pairData.winnerId)

                const roundLosers = this.pairsData[currentRound].map(pairData => pairData.teams.filter(team => team.id !== roundWinners[0] && team.id !== roundWinners[1])[0])

                const roundLosersTeams = this.playoffsTeams.filter(team => team.teamId === roundLosers[0].id || team.teamId === roundLosers[1].id) as (FootballTeam & BasketballTeam)[]

                const oldFightForThirdPair = this.pairsData['final'].find(data => data.fightForThird)

                const differentTeams = (oldFightForThirdPair && roundLosersTeams.length > 0) ? (oldFightForThirdPair.teams[0].id !== roundLosersTeams[0].teamId || oldFightForThirdPair.teams[1].id !== roundLosersTeams[1].teamId) : true


                if (!roundGamesPlayed || differentTeams) {
                    this.pairsData['final'] = this._pairsData['final'].filter(data => !data.fightForThird)

                    const accordionWrapper = this.getAccordionGamesWrapper('final')

                    const gemeWrappers = [...accordionWrapper.children] as HTMLDivElement[]

                    gemeWrappers.forEach(item => {
                        if (item.dataset.fightForThird) {
                            item.remove()
                        }
                    });
                }

                if (roundGamesPlayed && differentTeams) {
                    const fightForThirdPairData = new PlayoffsPair(pairId + 1, [])

                    const fightForThirdGame = new ClassGame(roundLosersTeams[0], roundLosersTeams[1], Math.random(), 1, 'final')
                    fightForThirdGame.fightForThird = true

                    fightForThirdPairData.games.push(fightForThirdGame)

                    fightForThirdPairData.teams = setPlayoffPairTeams(this.sportType.id, fightForThirdPairData.games)
                    fightForThirdPairData.fightForThird = true

                    const accordionWrapper = this.getAccordionGamesWrapper('final')

                    accordionWrapper.append(this.createGameWrapper(null, fightForThirdGame, 'final', false))

                    this.pairsData['final'].push(fightForThirdPairData)
                }
            }

            const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount / 2}`
            const nextPair = gamesAmount >= 2 && this.pairsData[nextRound].find(pair => pair.id === pairData.nextId)

            const nextPairGameElements = [...document.querySelectorAll(`.game[data-pair-id="${pairData.nextId}"] `)]

            if (!nextPairGameElements) throw new Error('no next pair game els')

            if (gamesAmount >= 2 && nextPair) {
                nextPair.games.forEach((game, i) => {
                    const nextPairElement = nextPairGameElements[i]
                    const nextPairGameWraper = nextPairElement?.parentElement?.parentElement

                    const nextPairInputs = [...nextPairElement.querySelectorAll<HTMLInputElement>('.result-input')]
                    const nextPairLabel = [...nextPairElement.querySelectorAll<HTMLLabelElement>('label')]

                    nextPairInputs.forEach((input, index) => {
                        if (pairData.winnerId) {
                            game.played = false
                            const winnningTeam = this.playoffsTeams.find(team => team.teamId === pairData.winnerId)!

                            const winnerData = { team: winnningTeam.team, id: winnningTeam.teamId }

                            const nextPairTeamExists = nextPair.teams.find(team => team.id === winnningTeam.teamId)

                            if (!nextPairTeamExists) {
                                if (input.dataset.overtime || input.dataset.extraTime || input.dataset.shootout) {
                                    input.remove()
                                }

                                nextPairGameWraper?.classList.remove('played')
                                input.value = ''
                                game.played = false
                                game.playedAll = false


                                this.setNextPairElements(game.teams, pairId, i, nextPairLabel, winnerData)

                            }
                        } else {
                            if (input.dataset.overtime || input.dataset.extraTime || input.dataset.shootout) {
                                input.remove()
                            }

                            nextPairGameWraper?.classList.remove('played')
                            input.value = ''
                            game.played = false
                            game.playedAll = false

                            this.setNextPairElements(game.teams, pairId, i, nextPairLabel)
                        }

                    })
                })

                nextPair.teams = setPlayoffPairTeams(this.sportType.id, nextPair.games)

                nextPairGameElements.forEach((gameEl, i) => {
                    const inputs = gameEl.querySelectorAll<HTMLInputElement>('.result-input')

                    inputs.forEach(input => {
                        if (nextPair.teams.some(team => !team.id)) {
                            input.setAttribute('disabled', 'true')
                        } else if (i === 0) {
                            input.removeAttribute('disabled')
                        }
                    })
                })
            }


            this.renderTable(container, sortedData)

            if (currentRound === 'final' && pairGames.every(game => game.playedAll) && pairData.winnerId) {

                winnerElement(container, pairData.winnerId, this.playoffsTeams)

                localStorage.setItem('winner-id', pairData.winnerId.toString())

            } else {
                localStorage.removeItem('winner-id')
            }

            this.pairsData = this.pairsData
        })
    }

    private renderTable(container: HTMLDivElement, roundsData: { [k: string]: { gamesAmount: number, knockouts: number | null, bestOutOf?: number | null } }) {
        const oldTableWrapper = document.querySelector('.playoffs-table')

        if (oldTableWrapper) {
            oldTableWrapper.remove()
        }
        const tableWrapper = document.createElement('div')
        tableWrapper.classList.add('playoffs-table')
        container.append(tableWrapper)

        const headerEl = document.createElement('ul')
        headerEl.classList.add('playoffs-header')
        const table = document.createElement('div')
        table.classList.add('playoffs-games')

        let colsAmount = Object.keys(this.pairsData).length
        let rowsAmount = Object.values(this.pairsData)[0].length

        const wideScreen = window.matchMedia('(min-width: 1000px)');

        const resizeHandler = (e: MediaQueryList | MediaQueryListEvent) => {
            if (e.matches) {
                colsAmount = Object.keys(this.pairsData).length * 2 - 1
                rowsAmount = Object.values(this.pairsData)[0].length / 2
            } else {
                colsAmount = Object.keys(this.pairsData).length
                rowsAmount = Object.values(this.pairsData)[0].length
            }

            if (Object.values(this.pairsData)[0].some(pair => pair.fightForThird)) {
                rowsAmount--
            }

            table.style.gridTemplateColumns = `repeat(${colsAmount}, 1fr)`
            table.style.gridTemplateRows = `repeat(${rowsAmount}, 1fr)`

            headerEl.innerHTML = ''

            Object.entries(roundsData).forEach(([round]) => {
                const headerItem = document.createElement('li')
                headerItem.textContent = round
                headerEl.append(headerItem)
            })
            if (e.matches) {
                Object.entries(roundsData).reverse().forEach(([round]) => {
                    if (round !== 'final') {
                        const anotherHeader = document.createElement('li')
                        anotherHeader.textContent = round
                        headerEl.append(anotherHeader)
                    }
                })
            }
        }

        wideScreen.addEventListener('change', resizeHandler)
        resizeHandler(wideScreen)

        Object.entries(this.pairsData).forEach(([round, roundPairs], index) => {
            const gamesAmount = this._roundsData[round].gamesAmount

            let rowIndex = 1
            let leftRowIndex = 1
            let rowSpan: number

            wideScreen.addEventListener('change', (e) => {
                rowIndex = 1
                leftRowIndex = 1
            })

            for (let i = 0; i < roundPairs.length; i++) {
                // const teamsWrapper = document.createElement('div')
                const pair = roundPairs[i];
                const pairId = pair.id

                const positionInRound = i + 1

                const gridWrapper = document.createElement('div')
                gridWrapper.classList.add('grid-wrapper')

                if (pair.fightForThird) {
                    gridWrapper.classList.add('fight-for-third')
                    const title = document.createElement('p')
                    title.textContent = 'Fight for 3rd place'
                    gridWrapper.append(title)
                }

                const gameResultWrapper = document.createElement('div')
                gameResultWrapper.classList.add('game-result-wrapper')
                gameResultWrapper.style.border = '1px solid black'

                const gameNumberEl = document.createElement('span')
                gameNumberEl.classList.add('pair-id')
                gameNumberEl.textContent = `${pairId}.`


                for (let i = 0; i < pair.teams.length; i++) {
                    const teamData = pair.teams[i];

                    const infoWrapper = document.createElement('div')
                    infoWrapper.classList.add('info-btn-wrapper')

                    const infoButton = document.createElement('button')
                    infoButton.textContent = 'i'
                    infoButton.type = 'button'
                    infoButton.classList.add('btn', 'btn-secondary')
                    infoButton.dataset.container = 'body'
                    infoButton.dataset.bsToggle = 'tooltip'
                    infoButton.dataset.bsPlacement = 'top'
                    const content = teamData.scores.map(score => `${score.playedIn} ${score.score || '-'}`).join(', ')
                    infoButton.dataset.bsTitle = content || ''
                    infoWrapper.append(infoButton)
                    const tooltip = new bootstrap.Tooltip(infoButton)

                    const teamEl = document.createElement('span')
                    teamEl.classList.add('team-title')
                    teamEl.textContent = teamData.team ? teamData.team : `${pair.prevIds[i]} winner`

                    const totalScoreEl = document.createElement('span')

                    totalScoreEl.textContent = roundsData[round].bestOutOf ? teamData.wins.toString() : teamData.totalScore.toString()
                    totalScoreEl.style.fontWeight = 'bold'

                    for (let j = 0; j < teamData.scores.length; j++) {
                        const gameData = teamData.scores[j];
                        const gameResultEl = document.createElement('td')


                        if ((gameData.playedIn === 'extra' || gameData.playedIn === 'p' || gameData.playedIn === 'OT') && teamData.team) {
                            gameResultEl.textContent = gameData.score !== null ? gameData.score.toString() : '-'
                        } else {
                            gameResultEl.textContent = gameData.playedIn + ' ' + (gameData.score !== null ? gameData.score : '-')
                        }
                    }
                    gameResultWrapper.append(infoWrapper, teamEl, totalScoreEl)
                }

                if (index === 0) {
                    gridWrapper.classList.add('first-row')
                }
                console.log(gamesAmount, pair);

                if (gamesAmount > 1) {
                    if (gamesAmount / 2 < positionInRound) {
                        gridWrapper.classList.add('right')
                    }
                } else if (!pair.fightForThird) {
                    gridWrapper.classList.add('final')
                }

                gameResultWrapper.prepend(gameNumberEl)
                gridWrapper.append(gameResultWrapper)
                table.append(gridWrapper)

                const repositionResultWrapper = (e: MediaQueryList | MediaQueryListEvent) => {
                    if (![...gridWrapper.classList].includes('fight-for-third')) {

                        if (e.matches) {
                            rowSpan = rowsAmount * 2 / gamesAmount
                            if (gamesAmount > 1 && gamesAmount / 2 < positionInRound) {
                                gridWrapper.style.gridColumn = (colsAmount - (index)).toString()
    
                                gridWrapper.style.gridRow = `${leftRowIndex} / span ${rowSpan}`
    
                                leftRowIndex += rowSpan
                            } else {
                                gridWrapper.style.gridColumn = (index + 1).toString()
    
                                if (gamesAmount > 1) {
                                    gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
                                } else {
                                    gridWrapper.style.gridRow = `${rowIndex} / span ${rowsAmount}`
                                }
                            }
                        } else {
                            rowSpan = rowsAmount / gamesAmount
                            gridWrapper.style.gridColumn = (index + 1).toString()
                            gridWrapper.style.gridRow = `${rowIndex} / span ${rowSpan}`
                        }
                        rowIndex += rowSpan
                    }
                }

                wideScreen.addEventListener('change', repositionResultWrapper)

                repositionResultWrapper(wideScreen)
            }
        })

        tableWrapper.append(headerEl, table)
    }

    setNextPairElements(teams: { team: string, id: number | null, goals: number | null, home: boolean, away: boolean }[], pairId: number, index: number, label: HTMLLabelElement[], winnerData?: { team: string, id: number }) {
        const team1Index = pairId % 2 === 0 ? 0 : 1
        const team2Index = pairId % 2 === 0 ? 1 : 0
        if (index % 2 === 0) {
            label[team2Index].textContent = winnerData ? winnerData.team : ''
            teams[team2Index].team = winnerData ? winnerData.team : ''
            teams[team2Index].id = winnerData ? winnerData.id : null
            teams[team2Index].goals = null
        } else if (index % 2 !== 0) {

            label[team1Index].textContent = winnerData ? winnerData.team : ''
            teams[team1Index].team = winnerData ? winnerData.team : ''
            teams[team1Index].id = winnerData ? winnerData.id : null
            teams[team1Index].goals = null
        }
    }

    // static setTeams(teams: TeamsType) {
    //     const oldData = Playoffs.getData(true)

    //     if (!oldData) throw new Error('no teams')

    //     const playoffTeams = teams.slice(0, oldData.teamsAmount)
    //     const updatedData = {...oldData, teams: playoffTeams}

    //     localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    // }

    // static setPlayoffsData(teamsAmount: number, roundsData: playoffsInteface['roundsData']) {
    //     const oldData = Playoffs.getData(true)

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, roundsData, teamsAmount}

    //     localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    // }

    // static setPairsData(pairsData: playoffsInteface['pairsData']) {
    //     const oldData = Playoffs.getData(true)

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, pairsData}

    //     localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    // }
}
