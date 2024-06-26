export interface TeamData {
    team: string
    id: number
    totalGames: number
    minPlace: number
    playedGames?: number
    wins?: number
    losses?: number
    goals?: number
    goalsMissed?: number
    goalDifference?: number
    points?: number
    potentialPoints?: number
    maxPotentialPoints?: number
    currentPlace?: number
    maxPlace?: number
}

export default abstract class Team {
    team: string
    protected id: number
    minPlace: number
    gamesLeft: number
    totalGames: number

    playedGames: number = 0
    wins: number = 0
    losses: number = 0
    goals: number = 0
    goalsMissed: number = 0
    goalDifference: number = 0
    points: number = 0
    potentialPoints: number = 0
    maxPotentialPoints: number = 0
    currentPlace: number = 0
    maxPlace: number = 1

    get teamId() {
        return this.id
    }

    // TODO:
    // i objekta sudeti visus duomenis
    // susikurti interface
    constructor(data: TeamData) {
        const {team, id, totalGames, minPlace} = data
        
        this.team = team
        this.id = id
        this.minPlace = minPlace
        this.gamesLeft = totalGames
        this.totalGames = totalGames
 
        this.playedGames = data.playedGames ?? 0
        this.wins = data.wins ?? 0
        this.losses = data.losses ?? 0
        this.goals = data.goals ?? 0
        this.goalsMissed = data.goalsMissed ?? 0
        this.goalDifference = data.goalDifference ?? 0
        this.points = data.points ?? 0
        this.potentialPoints = data.potentialPoints ?? 0
        this.maxPotentialPoints = data.maxPotentialPoints ?? 0
        this.currentPlace = data.currentPlace ?? 0
        this.maxPlace = data.currentPlace ?? 1
    }
}