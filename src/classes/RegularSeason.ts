import accordion from "../components/accordion.js"
import { SPORTS } from "../config.js"
import getModernTableHeadItems from "../functions/league/getModernTableHeadItems.js"
import { GameType, GamesType, TeamType, TeamsType } from "../types.js"
import BasketballGame from "./Basketball/BasketballGame.js"
import BasketballTeam from "./Basketball/Basketball/Basketball/BasketballTeam.js"
import FootballGame from "./Football/FootballGame.js"
import FootballTeam from "./Football/FootballTeam.js"
import Game from "./Game.js"
import League from "./League.js"
import Playoffs from "./Playoffs.js"

// interface RegularSeasonInterface {
//     _teams: TeamsType
//     _gamesAmount: number
//     _roundsAmount: number
//     _games: GamesType
//     _relegation?: number | null
// }

interface ComparisonTeamInterface {
    team: string
    playedGames: number
    wins: number
    draws: number
    losses: number
    goals: number
    goalsMissed: number
    goalDifference: number
    points: number
    currentPlace: number
    id?: number
    homeGames?: { won: number, lost: number }
    awayGames?: { won: number, lost: number }
    overtime?: { won: number, lost: number }
    winPerc?: number
}

interface ComparisonTeamData extends ComparisonTeamInterface {
    teamId: number
}

export default class RegularSeason extends League {
    private _gamesAmount: number
    private _roundsAmount: number
    private _games: GamesType
    private _relegation: number

    get gamesAmount() {
        if (this._gamesAmount) {
            return this._gamesAmount
        }
        throw new Error('no games amount')
    }

    set gamesAmount(amount) {
        this._gamesAmount = amount
        const updatedData = {...this, _gamesAmount: this._gamesAmount}

        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }

    get roundsAmount() {
        if (this._roundsAmount) {
            return this._roundsAmount
        }
        throw new Error('no rounds amount')
    }

    set roundsAmount(amount) {
        this._roundsAmount = amount
        const updatedData = {...this, _roundsAmount: this._roundsAmount}

        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }
    
    get games() {
        if (this._games) {
            return this._games
        }
        throw new Error('no games')
    }

    set games(games) {
        this._games = games
        const updatedData = {...this, _games: this._games}

        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }
    
    get relegation() {
        if (!Number(this._relegation)) {
            return this._relegation
        }
        this.relegation = 0

        throw new Error('no relegation')
    }

    set relegation(amount: number) {
        this._relegation = amount
        const updatedData = {...this, _relegation: this._relegation}

        localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    }

    constructor(gamesAmount?: number, roundsAmount?: number, games?: GamesType, relegation?: number | null) {
        super()
        this._gamesAmount = gamesAmount ? gamesAmount : 0
        this._roundsAmount = roundsAmount ? roundsAmount : 0
        this._games = games ? games : []
        this._relegation = relegation ? relegation : 0
    }

    static getData() {
        const regularSeasonData = localStorage.getItem('regular-season-data')
        
        if (regularSeasonData) {
            let result = JSON.parse(regularSeasonData)
            return result
        }
        return null
    }

    // static setTeams(teams: TeamsType) {
    //     const oldData = RegularSeason.getData(true)

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, teams}

    //     localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    // }
    
    // static setRoundsAmount(roundsAmount: number) {
    //     const oldData = RegularSeason.getData(true)

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, roundsAmount}

    //     localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    // }

    // static setRelegation(relegation: number) {
    //     const oldData = RegularSeason.getData(true)

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, relegation}
    
    //     localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    // }

    // static setGames(games: DataType['games']) {
    //     const oldData = RegularSeason.getData(true)

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, games}
    
    //     localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    // }

    // static setGamesAmount(gamesAmount: number) {
    //     const oldData = RegularSeason.getData()

    //     if (!oldData) throw new Error('no data')

    //     const updatedData = {...oldData, gamesAmount}
    
    //     localStorage.setItem('regular-season-data', JSON.stringify(updatedData))
    // }

    static removeData() {
        localStorage.removeItem('regular-season-data')
    }

    renderHtml(container: HTMLDivElement, playoffsData?: Playoffs) {
        const gamesForm = document.createElement('form')
        gamesForm.id = 'games-form'
    
        for (let i = 0; i < this.roundsAmount; i++) {
            let round = i+1
            const btnText = `Round ${round}`
            const roundGames = this.games.filter(game => game.round === round)
    
            const legs = [...new Set(roundGames.map(game => game.leg))]
    
            accordion(gamesForm, btnText, legs, roundGames)
        }
    
    
        gamesForm.addEventListener('change', (e) => {
            const target = e.target as HTMLFormElement
    
            const gameEl = target?.parentElement && target.parentElement.parentElement
            const gameWrapper = gameEl?.parentElement && gameEl.parentElement
            
            const gameId = gameEl?.dataset.gameId && +gameEl.dataset.gameId
            const currentGame = this._games.find(game => game.id === gameId)
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
    
            const gameTeams = this.leagueTeams.filter(team => team.teamId === currentGame.teams[0].id || team.teamId === currentGame.teams[1].id)
    
            const oldGame = JSON.parse(JSON.stringify(currentGame))
    
            if (overtimeId && this.sportType.id === SPORTS.basketball.id) {
                this.overtimeGameHandler(gameWrapper, currentGame, gameEl, gameTeams, overtimeId)
            }
    
            this.updateGameData(gameWrapper, currentGameInputs, currentGame)
    
            if (this.sportType.id === SPORTS.basketball.id && !overtimeId) {
                const basketballGame = currentGame as BasketballGame
    
                const equalGameGoals = currentGame.teams.every(team => currentGame.teams[0].goals === team.goals)
    
                if (equalGameGoals && currentGame.playedAll) {
                    const overtimeGame = new Game(basketballGame.overtime.length+1, currentGame.leg, currentGame.round, null, gameTeams[0], gameTeams[1])
    
                    basketballGame.overtime.push(overtimeGame)
                    gameEl.parentElement && gameEl.parentElement.classList.remove('played')
                  
                    currentGameAllInputs.forEach((input, i) => {
                        const overtimeInput = document.createElement('input')
                        overtimeInput.dataset.teamId = basketballGame.teams[i].id?.toString()
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
    
            this.games = this.games
    
            this.updateTeamsData(container, currentGame, oldGame, playoffsData)
        })
    
        const changeTableBtn = document.createElement('button')
        changeTableBtn.type = 'button'
        changeTableBtn.textContent = 'Change Table View'
    
        changeTableBtn.addEventListener('click', (e) => {
            const prevTableType = localStorage.getItem('table-type')
    
            if (prevTableType === 'modern' || !prevTableType) {
                localStorage.setItem('table-type', 'old')
                this.renderTable(container)
            } else {
                localStorage.setItem('table-type', 'modern')
                this.renderTable(container)
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
    
                const currentGame = this.games.find(game => game.id === gameId)
    
                if (currentGame) {
                    const oldGame = {...currentGame}
                    this.updateGameData(gameWrapper, currentGameInputs, currentGame)
    
                    this.games = this.games
                    this.updateTeamsData(container, currentGame, oldGame, playoffsData)
                }
            })
        })
    
        container.append(gamesForm, generateScoresBtn, changeTableBtn)
    
        this.renderTable(container)
    }

    private renderTable(container: HTMLDivElement) {
        const {leagueTeams: teams, games, sportType} = this

        const sortedTeams = this.sortTeams(teams, {compareBetweenGames: true}) as TeamsType

        sortedTeams.forEach((sortedTeam, i) => {
            sortedTeam.currentPlace = i + 1

            if (games.some(game => game.played)) {
                sortedTeam.maxPlace = i + 1
                sortedTeam.minPlace = i + 1
            }
        })

        if (games.some(game => game.played)) {
            this.checkTeamPosition(sortedTeams)
        }

        const oldTableWrapper = document.querySelector('.table-wrapper')
        let tableWrapper: HTMLElement
    
        if (oldTableWrapper) {
            oldTableWrapper.innerHTML = ''
            tableWrapper = oldTableWrapper as HTMLElement
        } else {
            tableWrapper = document.createElement('div')
            tableWrapper.classList.add('table-wrapper')
        
            container.append(tableWrapper)
        }
    

        const tableType = localStorage.getItem('table-type') ? localStorage.getItem('table-type') : 'modern'

        if (tableType === 'old') {
            this.oldTable(tableWrapper, this.leagueTeams, {comparisonBtn: true})
        } else {
            this.modernTable(tableWrapper, sortedTeams, {comparisonBtn: true, position: true})
        }
    }

    private oldTable(wrapper: HTMLElement, teams: TeamsType, params: {comparisonBtn?: boolean, comparisonTable?: boolean} = {comparisonBtn: false, comparisonTable: false}) {
        const {comparisonBtn, comparisonTable} = params
        const {winPoints, drawPoints, lossPoints} = this.sportType.points

        const table = document.createElement('table')
        table.classList.add('table', 'old-table')
        comparisonTable && (table.id = 'comparison-table')

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
            th.textContent = `${i + 1}`
            th.setAttribute('scope', 'col')
            tr.append(th)
        })
    
        const gamesData: { text: string, property: string }[] = [
            { text: 'Points', property: 'points' },
            { text: 'Goal diff.', property: 'goalDifference' }, 
            { text: 'Place', property: 'currentPlace' }
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
            teamIndexEl.textContent =`${i + 1}`
            teamIndexEl.style.padding = '10px'
    
            const teamTitleEl = document.createElement('th')
            teamTitleEl.setAttribute('scope', 'row')
            teamTitleEl.textContent = team.team     
    
    
            if (team.maxPlace === 1 && team.minPlace === 1) {
                row.classList.add('winner')
            }
    
            row.append(teamIndexEl, teamTitleEl)
    
            const roundsData = document.createElement('td')
            roundsData.setAttribute('colspan', teams.length.toString())
            roundsData.classList.add('rounds-data')
    
            const innerTable = document.createElement('table')
            innerTable.classList.add('inner-table')
    
            const innerTableBody = document.createElement('tbody')
            innerTableBody.id = 'rounds-info'
            innerTableBody.classList.add('hidden')
    
            const innerTableFoot = document.createElement('tfoot')
            const footRow = document.createElement('tr')
            const footGoalsRow = document.createElement('tr')
               
    
            const buttonWrapper = document.createElement('div')
            buttonWrapper.classList.add('btn-wrapper')
            teamTitleEl.append(buttonWrapper)
    
            if (comparisonBtn) {
                this.compareTeamsButtonHandler(wrapper, team, buttonWrapper)
            }
    
            const expandTeamDataBtn = document.createElement('button')
            expandTeamDataBtn.classList.add('expand-btn')
            expandTeamDataBtn.type = 'button'
            expandTeamDataBtn.textContent = 'Expand'
            
            expandTeamDataBtn.addEventListener('click', (e) => {
                if ([...innerTableBody.classList].includes('expanded')) {
                    innerTableBody.className = 'hidden'
                    expandTeamDataBtn.textContent = 'Expand'
                } else {
                    innerTableBody.className = 'expanded'
                    expandTeamDataBtn.textContent = 'Hide'
                }
            })
    
            buttonWrapper.append(expandTeamDataBtn)
    
    
            for (let m = 0; m < roundsAmount; m++)  {
                const innerRow = document.createElement('tr') 
    
                teams.forEach((otherTeam, j) => {
                    const innerCell = document.createElement('td')
    
                    if (i === j) {
                        innerCell.classList.add('empty-cell')
                    } else {
                        const inbetweenGames = this.getInbetweenTeamsGames([team, otherTeam], {allGames: true})
                        console.log(inbetweenGames, inbetweenGames[m]);
                        
                        if (inbetweenGames[m]) {
                            const gameTeam = inbetweenGames[m].teams.find(gTeam => gTeam.id === team.teamId)
                            const gameOppTeam = inbetweenGames[m].teams.find(gTeam => gTeam.id !== team.teamId)
        
                            if (gameTeam && gameOppTeam) {
                                const playedIn = gameTeam.home ? 'H' : 'A'
                
                                const scoresEl = document.createElement('p')
                                const earnedPointsEl = document.createElement('p')
            
                                if (inbetweenGames[m].played) {
                                    scoresEl.textContent = `${playedIn} ${gameTeam.goals}:${gameOppTeam.goals}`
            
                                    if (gameTeam.goals && gameOppTeam.goals) {
                                        if (gameTeam.goals === gameOppTeam.goals && this.sportType.id === SPORTS.football.id) {
                                            earnedPointsEl.textContent = drawPoints!.toString()
                                        } else if (gameTeam.goals > gameOppTeam.goals) {
                                            earnedPointsEl.textContent = winPoints.toString()
                                        } else if (gameTeam.goals < gameOppTeam.goals) {
                                            earnedPointsEl.textContent = lossPoints.toString()
                                        }
                                    }
                                } else {
                                    scoresEl.textContent = 'X'
                                }
            
                                innerCell.append(scoresEl, earnedPointsEl)  
                            }
                        }
    
                    }          
                    innerRow.append(innerCell)
    
               
                })
    
                innerTableBody.append(innerRow)    
            }
    
    
            teams.forEach((otherTeam, j) => {
                const cell = document.createElement('td')
    
                const inbetweenGames = this.getInbetweenTeamsGames([team, otherTeam], {allGames: true})
                
                let pointsSum = 0
                let goalDiff = 0
    
                if (i === j) {
                    cell.classList.add('empty-cell')
                } else {
                    inbetweenGames.forEach(game => {
                        const gameTeam = game.teams.find(gTeam => gTeam.id === team.teamId)
                        const gameOppTeam = game.teams.find(gTeam => gTeam.id !== team.teamId)
        
                        if (game.played && gameTeam?.goals && gameOppTeam?.goals) {
                            if (gameTeam.goals === gameOppTeam.goals && gameTeam.goals !== null) {
                                pointsSum += drawPoints || 0 
                            } else if (gameTeam.goals > gameOppTeam.goals) {
                                pointsSum += winPoints
                            } else if (gameTeam.goals > gameOppTeam.goals) {
                                pointsSum += lossPoints || 0
                            }
        
                            goalDiff += gameTeam.goals - gameOppTeam.goals
        
                            cell.textContent = `${pointsSum}(${goalDiff})`
                        }
                    })
                }
    
                footRow.append(cell)
            })
    
            innerTableFoot.append(footRow, footGoalsRow)
            innerTable.append(innerTableBody, innerTableFoot)
            roundsData.append(innerTable)
            row.append(roundsData)
    
            type TeamPropsType = keyof TeamType

            gamesData.forEach(item => {
                const cell = document.createElement('td')
                cell.textContent = team[item.property as TeamPropsType].toString()
                row.append(cell)
            })
    
            tableBody.append(row)
        })

        expandAllBtn.addEventListener('click', (e) => {
            const innerTableBodies = [...tableBody.querySelectorAll('#rounds-info')]
            const teamExpandBtns = [...tableBody.querySelectorAll('.expand-btn')]
    
            if (expandAllBtn.textContent === 'Hide All') {
                innerTableBodies.forEach((item, i) => {
                    teamExpandBtns[i].textContent = 'Expand'
                    item.className = 'hidden'
                })
    
                expandAllBtn.textContent = 'Expand All'
            } else {
                innerTableBodies.forEach((item, i) => {
                    teamExpandBtns[i].textContent = 'Hide'
                    item.className = 'expanded'
                })
        
                expandAllBtn.textContent = 'Hide All'
            }
        })

        table.append(tableHead, tableBody)
        wrapper.append(table, expandAllBtn)
    }

    private modernTable(wrapper: HTMLElement, teams: TeamsType, params: {comparisonBtn?: boolean, position?: boolean, comparisonTable?: boolean} = {comparisonBtn: false, position: false, comparisonTable: false}) {
        const {comparisonBtn, position, comparisonTable} = params

        const table = document.createElement('table')
        table.classList.add('table', 'modern-table')
        comparisonTable && (table.id = 'comparison-table')


        const conditions = localStorage.getItem('conditions') && JSON.parse(localStorage.getItem('conditions') || '')

        const tableHead = document.createElement('thead')
        const tableBody = document.createElement('tbody')
        const tHeadRow = document.createElement('tr')

        const headItems: {text: string, title: string | null, selector: string}[] = getModernTableHeadItems(this.sportType.id , position)

        headItems && headItems.forEach(item => {
            const th = document.createElement('th')
            th.textContent = item.text
            item.title && th.setAttribute('title', item.title)
            th.setAttribute('scope', 'col')

            tHeadRow.append(th)
        })
        tableHead.append(tHeadRow)

        // TODO: ??
        let conditionsInfoWrapper
        if (conditions) {
            conditionsInfoWrapper = document.createElement('div')
            conditionsInfoWrapper.classList.add('conditions-info-wrapper')

            wrapper.append(conditionsInfoWrapper)
        }
        
        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            const row = document.createElement('tr');

            headItems && headItems.forEach((item, j) => {
                const cell = document.createElement('td');
                let selector = item.selector

                let value
                if (typeof (team as any)[selector] === 'object' && (team as any)[selector] !== null) {
                    const selected = (team as any)[selector]
                    value = `${selected.won} - ${selected.lost}`
                } else {
                    value = (team as any)[selector]
                }

                cell.textContent = value !== undefined ? value : ''

                row.append(cell)

                if (comparisonBtn && j === 1) {
                    this.compareTeamsButtonHandler(wrapper, team, cell)
                }

                if (this.relegation && comparisonBtn) {
                    const lastPlace = teams.length - (this.relegation ? this.relegation : 0)

                    if (i === lastPlace) {
                        row.classList.add('relegation')
                    }
                }
            })
            tableBody.appendChild(row);
        }

        table.append(tableHead, tableBody)

        wrapper.append(table)
    }

    private compareTeamsButtonHandler(wrapper: HTMLElement, team: TeamType, btnWrapper: HTMLElement) {
        let comparingTeams: (FootballTeam | BasketballTeam)[] = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams') || '') : []

        const btn = document.createElement('button')
        btn.classList.add('comparison-btn')
        btn.type = 'button'

        btn.textContent = comparingTeams.some(comparingTeam => comparingTeam.team === team.team) ? '-' : '+'

        btn.addEventListener('click', (e) => {  
            comparingTeams = localStorage.getItem('comparing-teams') ?  JSON.parse(localStorage.getItem('comparing-teams') || '') : []
    
            if (comparingTeams.some(comparingTeam => comparingTeam.team === team.team)) {
                comparingTeams = comparingTeams.filter(comparingTeam => comparingTeam.team !== team.team)
                btn.textContent = '+'
            } else {
                comparingTeams.push(team)
                btn.textContent = '-'
            }
    
            localStorage.setItem('comparing-teams', JSON.stringify(comparingTeams))
            
            const oldTable = document.getElementById('comparison-table')
            console.log(oldTable);
            oldTable && oldTable.remove()
            
            if (comparingTeams.length > 0) {
                this.comparisonTable(wrapper)
            }
        })
    
        btnWrapper.append(btn)
    }

    private comparisonTable(wrapper: HTMLElement) {
        const sportId = this.sportType.id
        const teams = localStorage.getItem('comparing-teams') && JSON.parse(localStorage.getItem('comparing-teams') || '')
    
        const tableType = localStorage.getItem('table-type')
    
        const teamsGamesDataObject = this.compareGamesData(teams)

        console.log(teamsGamesDataObject);
        if (!teamsGamesDataObject) {
            throw new Error('no teams games data obj  in comparison table')
        }
    
        const teamsData: ComparisonTeamData[] = Object.values(teamsGamesDataObject).map((data, i) => {
            const id = +Object.keys(teamsGamesDataObject)[i]
            return {...data, id, teamId: id}
        })
   
        if (!teamsData) {
            throw new Error('no teams daata in comparison table')
        }

        const sortedTeams = this.sortTeams(teamsData)

        let updatedTeams

        if (sortedTeams.length > 0) {
            updatedTeams = sortedTeams
        } else if (teams.length > 1) {
            updatedTeams = teams
        }
        else if (teams.length === 1) {
            const headItems = getModernTableHeadItems(sportId)
    
            const team = {...teams[0]}
            headItems.forEach((item, i) => {
                if (i !== 0) {
                    if (typeof team[item.selector] === 'number') {
                        team[item.selector] = 0
                    } else if (typeof team[item.selector] === 'object') {
        
                        team[item.selector].won = 0
                        team[item.selector].lost = 0
                    }
                }
            })
            
            updatedTeams = [team]
        }
    
        if (!updatedTeams) {
            throw new Error('no updated teams in comparison table')
        }

        if (tableType === 'old') {
            this.oldTable(wrapper, updatedTeams, {comparisonTable: true})
        } else {
            this.modernTable(wrapper, updatedTeams, {comparisonTable: true})
        }
    }

    private updateTeamsData(container: HTMLDivElement, updatedGame: GameType, oldGame: GameType, playoffsData?: Playoffs) {
        const playingTeams = this.leagueTeams.filter(team => oldGame.teams.some(oldTeam => oldTeam.id === team.teamId))
        
        this.changeTeamData(oldGame, playingTeams, {old: true})
        this.changeTeamData(updatedGame, playingTeams)

        this.renderTable(container)

        if (playoffsData) {
            const teamsToPlayoffs = this.leagueTeams.slice(0, playoffsData.teamsAmount)
    
            let leagueTableUpdated = !teamsToPlayoffs.every((team, i) => {
                return team.teamId === playoffsData.playoffsTeams[i].teamId
            });
     
            if (leagueTableUpdated) {
                playoffsData.playoffsTeams = teamsToPlayoffs
                playoffsData.renderHtml(container, {leagueTableUpdated: true})
            }
        }
    
        this.leagueTeams = this.leagueTeams
    }

    private changeTeamData(game: GameType, teams: TeamsType, params: {old: boolean} = {old: false}) {
        teams.forEach(team => {
            const gameTeam = game.teams.find(gTeam => gTeam.id === team.teamId)
            const gameOppTeam = game.teams.find(gTeam => gTeam.id !== team.teamId)
    
            const {id: sportId, points} = this.sportType
            const {winPoints, lossPoints, drawPoints} = points
    
            const calcData = (a: number, b: number) => params.old ? a - b : a + b
            const calcWinningPerc = (wins: number, played: number) => Math.round((wins/played)*1000)/10 
    
            if (game.played) {
                team.playedGames = calcData(team.playedGames, 1)
                team.gamesLeft = team.totalGames - team.playedGames
    
                if (gameTeam && gameOppTeam) {
                    let teamTotalScore: number = gameTeam.goals ? gameTeam.goals : 0
                    let oppTeamTotalScore: number = gameOppTeam.goals ? gameOppTeam.goals : 0
    
                    const basketballTeam = team as BasketballTeam
                    const footballTeam = team as FootballTeam
    
                    const basketballGame = game as BasketballGame
                
                    if (sportId === SPORTS.basketball.id) {
                        basketballGame.overtime.forEach(overtime => {
                            const overtimeTeam = overtime.teams.find(oTeam => oTeam.id === gameTeam.id)!
                            const overtimeOppTeam = overtime.teams.find(oTeam => oTeam.id === gameOppTeam.id)!
                            
                            if (overtimeTeam?.goals && overtimeOppTeam?.goals) {
                                if (overtimeTeam.goals > overtimeOppTeam.goals) {
                                    basketballTeam.overtime.won = calcData(basketballTeam.overtime.won, 1)
                                } else if (overtimeTeam.goals < overtimeOppTeam.goals) {
                                    basketballTeam.overtime.lost = calcData(basketballTeam.overtime.lost, 1)
                                }
                            }
                            
                            teamTotalScore += overtimeTeam.goals ? overtimeTeam.goals : 0
                            oppTeamTotalScore += overtimeOppTeam.goals ? overtimeOppTeam.goals : 0
                        })
                    }
                        
                    if (teamTotalScore !== 0) {
                        if (teamTotalScore > oppTeamTotalScore) {
                            team.wins = calcData(team.wins, 1)
                            team.points = calcData(team.points, winPoints)
            
                            if (sportId === SPORTS.basketball.id) {
                                if (gameTeam.home) {
                                    basketballTeam.homeGames.won = calcData(basketballTeam.homeGames.won, 1)
                                } else if (gameTeam.away) {
                                    basketballTeam.awayGames.won = calcData(basketballTeam.awayGames.won, 1)
                                }
                            } else if (sportId === SPORTS.football.id && gameTeam.away) {
                                footballTeam.awayWins = calcData(footballTeam.awayWins, 1)
                            }
                        } else if (teamTotalScore < oppTeamTotalScore) {
                            team.losses = calcData(team.losses, 1)
                            team.points = calcData(team.points, lossPoints)
            
                            if (sportId === SPORTS.basketball.id) {
                                if (gameTeam.home) {
                                    basketballTeam.homeGames.lost = calcData(basketballTeam.homeGames.lost, 1)
                                } else if (gameTeam.away) {
                                    basketballTeam.awayGames.lost = calcData(basketballTeam.awayGames.lost, 1)
                                }
                            }
                        } else if (teamTotalScore === oppTeamTotalScore && sportId === SPORTS.football.id && drawPoints) {
                            team.points = calcData(team.points, drawPoints)
            
                            footballTeam.draws = calcData(footballTeam.draws, 1)
                        }
                    }
    
                    team.goals = gameTeam.goals ? calcData(team.goals, gameTeam.goals) : team.goals
                    
                    team.goalsMissed = gameOppTeam.goals ? calcData(team.goalsMissed, gameOppTeam.goals) : team.goalsMissed
                    team.goalDifference = team.goals - team.goalsMissed
    
                    if (gameTeam.away && sportId === SPORTS.football.id && gameTeam.goals) {
                        footballTeam.awayGoals = calcData(footballTeam.awayGoals, gameTeam.goals)
                
                        if (gameOppTeam.goals && gameTeam.goals > gameOppTeam.goals) {
                            footballTeam.awayWins = calcData(footballTeam.awayWins, 1)
                        }
                    }
    
                    if (sportId === SPORTS.basketball.id && !params.old) {
                        basketballTeam.winPerc = calcWinningPerc(team.wins, team.playedGames)
                    }
                }
            }

            // ...
        })
    }

    private sortTeams(teams: TeamsType| ComparisonTeamData[], params: {compareBetweenGames: boolean} = {compareBetweenGames: false}) {
        const {compareBetweenGames} = params

        const samePointsTeams: (TeamType |ComparisonTeamData)[] = []
        const sportId = this.sportType.id

        const result = teams.sort((a, b) => {
            if (a.points > b.points) {
                return -1
            } else if (a.points < b.points) {
                return 1
            } else {
                !samePointsTeams.some(team => team.teamId === a.teamId) && samePointsTeams.push(a)
                !samePointsTeams.some(team => team.teamId === b.teamId) && samePointsTeams.push(b)
                const teamsGameData = this.compareGamesData(samePointsTeams as TeamsType | ComparisonTeamData[]);
    
                if (sportId === SPORTS.football.id) {
                    const teamA = a as FootballTeam
                    const teamB = b as FootballTeam
              
                    if (compareBetweenGames && teamsGameData) {
                        if (Object.keys(teamsGameData).length === 0) {
                            return 0
                        }
            
                        if (teamsGameData[teamA.teamId].points > teamsGameData[teamB.teamId].points) {
                            return -1
                        } else if (teamsGameData[teamA.teamId].points < teamsGameData[teamB.teamId].points) {
                            return 1
                        }
                
                        if (teamsGameData[teamA.teamId].goalDifference > teamsGameData[teamB.teamId].goalDifference) {
                            return -1
                        } else if (teamsGameData[teamA.teamId].goalDifference < teamsGameData[teamB.teamId].goalDifference) {
                            return 1
                        }
                
                        if (teamsGameData[teamA.teamId].goals > teamsGameData[teamB.teamId].goals) {
                            return -1
                
                        } else if (teamsGameData[teamA.teamId].goals < teamsGameData[teamB.teamId].goals) {
                            return 1
                        }
                    }
                    
                    if (teamA.goalDifference > teamB.goalDifference) {
                        return -1
                    } else if (teamA.goalDifference < teamB.goalDifference) {
                        return 1
                    } 
            
                    if (teamA.goals > teamB.goals) {
                        return -1
                    } else if (teamA.goals < teamB.goals) {
                        return 1
                    } 
            
                    if (teamA.awayGoals > teamB.awayGoals) {
                        return -1
                    } else if (teamA.awayGoals < teamB.awayGoals) {
                        return 1
                    } 
            
                    if (teamA.wins > teamB.wins) {
                        return -1
                    } else if (teamA.wins < teamB.wins) {
                        return 1
                    }
        
                    if (teamA.awayWins > teamB.awayWins) {
                        return -1
                    } else if (teamA.awayWins < teamB.awayWins) {
                        return 1
                    }
    
                    if (teamA.playedGames > teamB.playedGames) {
                        return -1
                    } else if (teamA.playedGames < teamB.playedGames) {
                        return 1
                    }
                } else if (sportId === SPORTS.basketball.id) {
                    const teamA = a as BasketballTeam
                    const teamB = b as BasketballTeam
    
                    if (teamA.winPerc > teamB.winPerc) {
                        return -1
                    } else if (teamA.winPerc < teamB.winPerc) {
                        return 1
                    }
    
                    if (compareBetweenGames && teamsGameData) {
                        if (Object.keys(teamsGameData).length === 0) {
                            return 0
                        }
    
                        if (teamsGameData[teamA.teamId].wins > teamsGameData[teamB.teamId].wins) {
                            return -1
                        } else if (teamsGameData[teamA.teamId].wins < teamsGameData[teamB.teamId].wins) {
                            return 1
                        }
                        if (teamsGameData[teamA.teamId].goalDifference > teamsGameData[teamB.teamId].goalDifference) {
                            return -1
                        } else if (teamsGameData[teamA.teamId].goalDifference < teamsGameData[teamB.teamId].goalDifference) {
                            return 1
                        }
                    }
    
                    if (teamA.goalDifference > teamB.goalDifference) {
                        return -1
                    } else if (teamA.goalDifference < teamB.goalDifference) {
                        return 1
                    }
    
                    if (teamA.goals > teamB.goals) {
                        return -1
                    } else if (teamA.goals < teamB.goals) {
                        return 1
                    }
                }
            }
        
            return 0
        })

        return result
    }

    private compareGamesData(samePointsTeams: TeamsType | ComparisonTeamData[]) {
        const teamsData: {[key: number]: ComparisonTeamInterface} = {}

        if (!this.games) {
            return
        }

        const teamsGamesData = this.getInbetweenTeamsGames(this.leagueTeams, {allGames: true})

        if (teamsGamesData.length === 0) {
            return []
        } 

        const sportId = this.sportType.id
        let winPoints = 0
        let lossPoints = 0
        let drawPoints: null | number = null
    
        if (sportId === SPORTS.basketball.id) {
            winPoints = SPORTS.basketball.points.winPoints
            lossPoints = SPORTS.basketball.points.lossPoints
        } else if (sportId === SPORTS.football.id) {
            winPoints = SPORTS.football.points.winPoints
            drawPoints = SPORTS.football.points.drawPoints
        }
        
        samePointsTeams.forEach(team => {
            const teamGames = teamsGamesData.filter(game => game.teams.some(gameTeam => gameTeam.id === team.teamId));

            let points = 0
            let goals = 0
            let goalsMissed = 0

            let wins = 0
            let draws = 0
            let losses = 0
            let playedGames = 0

            let homeGames = {won: 0, lost: 0}
            let awayGames = {won: 0, lost: 0}
            let overtime = {won: 0, lost: 0}
            let winPerc = 0

            teamGames.forEach(game => {
                const gameTeam = game.teams.find(gameTeam => gameTeam.id === team.teamId)!
                const oppGameTeam = game.teams.find(gameTeam => gameTeam.id !== team.teamId)!

                if (gameTeam && oppGameTeam) {
                    goals += gameTeam.goals ? gameTeam.goals : 0
                    goalsMissed += oppGameTeam.goals ? oppGameTeam.goals : 0
        
                    if (gameTeam.goals && oppGameTeam.goals) {
                        if (gameTeam.goals > oppGameTeam.goals) {
                            points += winPoints
                            wins++
                            homeGames.won++
                        } else if (gameTeam.goals < oppGameTeam?.goals) {
                            points += lossPoints
                            losses++
                            homeGames.lost++
                        } else if (gameTeam.goals === oppGameTeam.goals && drawPoints) {
                            points += drawPoints
                            draws++
                        }
                    }

                    if ((game as BasketballGame).overtime?.length > 0) {
                        (game as BasketballGame).overtime.forEach(overtimeGame => {
                            const overtimeTeam = overtimeGame.teams.find(oTeam => oTeam.id === gameTeam.id)
                            const oppOvertimeTeam = overtimeGame.teams.find(oTeam => oTeam.id === oppGameTeam.id)

                            if (overtimeTeam && oppOvertimeTeam && overtimeTeam.goals && oppOvertimeTeam.goals) {
                                if (overtimeTeam.goals > oppOvertimeTeam.goals) {
                                    overtime.won++
                                } else if (overtimeTeam.goals < oppOvertimeTeam.goals) {
                                    overtime.lost++
                                }
                            }
                        })
                    }
                }


                if (game.played) {
                    playedGames++
                }

                winPerc = playedGames !== 0 ? Math.round((wins/playedGames)*1000)/10 : 0

                teamsData[team.teamId] = {
                    team: team.team,
                    playedGames,
                    wins,
                    draws,
                    losses,
                    goals,
                    goalsMissed,
                    goalDifference: goals - goalsMissed,
                    points,
                    currentPlace: team.currentPlace,
                }

                if (sportId === SPORTS.basketball.id) {
                    teamsData[team.teamId] = {...teamsData[team.teamId], homeGames, awayGames, overtime, winPerc}
                }
            })
        })

        return teamsData
    }

    private checkTeamPosition(sortedTeams: TeamsType) {
        for (let i = 0; i < sortedTeams.length; i++) {
            const team = sortedTeams[i];
            
            for (let j = i+1; j < sortedTeams.length; j++) {
                const otherTeam = sortedTeams[j];

                const canSucceed = otherTeam.maxPotentialPoints > team.points
                const equalPoints = otherTeam.maxPotentialPoints === team.points

                if (team.gamesLeft === 0) {
                    team.minPlace = team.currentPlace
                    team.maxPlace = team.currentPlace
                } else if (canSucceed ) {
                    team.minPlace += 1
                    otherTeam.maxPlace -= 1
                } else if (equalPoints) {
                    const inbetweenGames = this.getInbetweenTeamsGames([otherTeam, team])

                    let otherTeamGamesWon = 0
                
                    inbetweenGames.forEach(game => {
                        const teamGameData = game.teams.find(gameTeam => gameTeam.id === team.teamId)!
                        const otherTeamGameData = game.teams.find(gameTeam => gameTeam.id !== team.teamId)!

                        if (otherTeamGameData.goals && teamGameData.goals && otherTeamGameData.goals > teamGameData?.goals) {
                            otherTeamGamesWon++
                        }
                    })

                    if (otherTeamGamesWon > this.roundsAmount/2) {
                        team.minPlace += 1
                        otherTeam.maxPlace -=1
                    } else {
                        // team.minPlace
                    }
                }
            }   
        }
    }

    private getInbetweenTeamsGames(teams: TeamsType, params: {allGames: boolean} = {allGames: false}) {
        const {allGames} = params
        const inbetweenGames: (BasketballGame | FootballGame)[] = []

        this.games.forEach(game => {
            if (teams.some(team => team.teamId === game.teams[0].id) && teams.some(team => team.teamId === game.teams[1].id)) {
                if (!allGames) {
                    game.played && inbetweenGames.push(game)
                } else {
                    inbetweenGames.push(game)
                }
            }
        })
    
        return inbetweenGames
    }
}