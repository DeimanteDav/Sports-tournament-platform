import Team from "../Team.js"

export default class BasketballTeam extends Team {
    techLosses: number = 0
    winPerc: number = 0
    overtime: {won: number, lost: number} = {won: 0, lost: 0}
    homeGames: {won: number, lost: number} = {won: 0, lost: 0}
    awayGames: {won: number, lost: number} = {won: 0, lost: 0}

    constructor(team: string, id: number, totalGames: number, minPlace: number, allData?: BasketballTeam) {
        super(team, id, totalGames, minPlace)
        if (allData) {
            Object.assign(this, allData)            
        }
    }
}