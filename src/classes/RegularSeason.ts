import { GamesType, TeamsType } from "../types.js"
import League from "./League.js"

interface DataType {
    teams: TeamsType
    gamesAmount: number
    roundsAmount: number
    games: GamesType
    relegation?: number | null
}

export default class RegularSeason extends League {
    constructor(teams: TeamsType, private roundsAmount: number, public relegation?: number) {
        super(teams)
        this.roundsAmount = 0
        this.relegation = relegation
    }

    static getData(nec?: boolean) {
        const regularSeasonData = localStorage.getItem('regular-season-data')

        
        if (regularSeasonData) {
            let result: DataType  = JSON.parse(regularSeasonData)
            return result
        } else if (nec) {
            return {
                teams: [],
                gamesAmount: 0,
                roundsAmount: 0,
                games: []
            } 
        }

        null
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
}