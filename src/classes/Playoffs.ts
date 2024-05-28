import { TeamsType, PlayoffsPairInterface } from "../types.js";
import League from "./League.js";


export interface playoffsInteface {
    _playoffsTeams: TeamsType,
    _teamsAmount: number,
    _roundsData: roundsDataInterface
    _pairsData: pairsDataInterface

    get teamsAmount(): number
    set teamsAmount(amount)

    get roundsData(): roundsDataInterface
    set roundsData(data)

    get sportType(): {id: number, name: string, points: Object}
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

export default class Playoffs extends League  {
    private _playoffsTeams: TeamsType
    private _teamsAmount: number
    private _roundsData: roundsDataInterface
    private _pairsData: pairsDataInterface

    get playoffsTeams() {
        if (this._playoffsTeams) {
            return this._playoffsTeams
        }
        throw new Error('no teams')
    }

    set playoffsTeams(teams) {
        this._playoffsTeams = teams
        const updatedData = {...this, _playoffsTeams: this._playoffsTeams}

        localStorage.setItem('playoffs-data-test', JSON.stringify(updatedData))
    }

    get roundsData() {
        if (this._roundsData) {
            return this._roundsData
        }
        throw new Error('no rounds data')
    }

    set roundsData(data) {
        this._roundsData = data
        const updatedData = {...this, _roundsData: this._roundsData}
            
        localStorage.setItem('playoffs-data-test', JSON.stringify(updatedData))
    }

    get teamsAmount() {
        if (this._teamsAmount) {
            return this._teamsAmount
        }
        throw new Error('no teams amount')
    }

    set teamsAmount(amount) {
        this._teamsAmount = amount
        const updatedData = {...this, _teamsAmount: this._teamsAmount}
            
        localStorage.setItem('playoffs-data-test', JSON.stringify(updatedData))
    }
    
    get pairsData() {
        if (this._pairsData) {
            return this._pairsData
        }
        throw new Error('no pair data')
    }

    set pairsData(data) {
        this._pairsData = data
        const updatedData = {...this, _pairsData: this._pairsData}
            
        localStorage.setItem('playoffs-data-test', JSON.stringify(updatedData))
    }


    constructor(playoffsTeams?: TeamsType, teamsAmount?: number, roundsData?: roundsDataInterface, pairsData?: pairsDataInterface) {
        super()
        this._playoffsTeams = playoffsTeams ? playoffsTeams : []
        this._teamsAmount = teamsAmount ? teamsAmount : 0
        this._roundsData = roundsData ? roundsData : {}
        this._pairsData = pairsData ? pairsData : {}
    }

    static getData(nec?: boolean) {
        const playoffsData = localStorage.getItem('playoffs-data')

        if (playoffsData) {
            let result = JSON.parse(playoffsData)
            return result
        // }
        } else if (nec) {
            return {
                teams: [],
                teamsAmount: 0,
                roundsData: {},
                pairsData: {}
            }
        }

        return null
    }

    static removeData() {
        localStorage.removeItem('playoffs-data-test')
    }

    static setTeams(teams: TeamsType) {
        const oldData = Playoffs.getData(true)
        
        if (!oldData) throw new Error('no teams')

        const playoffTeams = teams.slice(0, oldData.teamsAmount)
        const updatedData = {...oldData, teams: playoffTeams}

        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    static setPlayoffsData(teamsAmount: number, roundsData: playoffsInteface['roundsData']) {
        const oldData = Playoffs.getData(true)
    
        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, roundsData, teamsAmount}
    
        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    static setPairsData(pairsData: playoffsInteface['pairsData']) {
        const oldData = Playoffs.getData(true)
        
        if (!oldData) throw new Error('no data')

        const updatedData = {...oldData, pairsData}
    
        localStorage.setItem('playoffs-data', JSON.stringify(updatedData))
    }

    // static removeData() {
    //     localStorage.removeItem('playoffs-data')
    // }
}
