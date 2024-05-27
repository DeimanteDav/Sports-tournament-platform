import { TeamsType, PlayoffsPairInterface } from "../types.js";
import League from "./League.js";


interface DataType {
    teams: TeamsType,
    teamsAmount: number,
    roundsData: {
        [k: string]: {
            gamesAmount: number
            knockouts: number | null
            bestOutOf?: number | null
        }
    }
    pairsData: {
        [k: string]: PlayoffsPairInterface[]
    }
}

export default class Playoffs extends League  {
    constructor(teams: TeamsType, private roundsData: DataType['roundsData']) {
        super(teams)
        this.roundsData = roundsData
    }

    static getData(nec?: boolean) {
        const playoffsData = localStorage.getItem('playoffs-data')

        if (playoffsData) {
            let result: DataType = JSON.parse(playoffsData)
            return result
        }
        // } else if (nec) {
        //     return {
        //         teams: [],
        //         teamsAmount: 0,
        //         roundsData: {},
        //         pairsData: {}
        //     }
        // }

        return null
    }

    static setTeams(teams: TeamsType) {
        const oldData = Playoffs.getData(true)
        
        if (!oldData) throw new Error('no teams')

        const playoffTeams = teams.slice(0, oldData.teamsAmount)
        const updatedData = {...oldData, teams: playoffTeams}

        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    static setPlayoffsData(teamsAmount: number, roundsData: DataType['roundsData']) {
        const oldData = Playoffs.getData(true)
    
        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, roundsData, teamsAmount}
    
        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    static setPairsData(pairsData: DataType['pairsData']) {
        const oldData = Playoffs.getData(true)
        
        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, pairsData}
    
        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    static removeData() {
        localStorage.removeItem('playoffs-data')
    }
}
