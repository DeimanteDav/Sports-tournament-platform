import { TeamsType } from "../types.js"

interface RegularSeason {
    roundsAmount?: number
}
interface Playoffs {

}

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

export default abstract class League {
    constructor (private teams: TeamsType) {
        this.teams = teams
    }
}