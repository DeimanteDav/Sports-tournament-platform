export default abstract class Team {
    team: string

    // TODO:
    private id: number
    // id: number
    playedGames: number = 0
    wins: number = 0
    losses: number = 0
    goals: number = 0
    goalsMissed: number = 0
    goalDifference: number = 0
    points: number = 0
    gamesLeft: number
    potentialPoints: number = 0
    maxPotentialPoints: number = 0
    currentPlace: number = 0
    maxPlace: number = 1
    minPlace: number
    totalGames: number

    get teamId() {
        return this.id
    }
    
    constructor(team: string, id: number, totalGames: number, minPlace: number) {
        this.team = team
        this.id = id
        this.minPlace = minPlace
        this.gamesLeft = totalGames
        this.totalGames = totalGames
    }
}