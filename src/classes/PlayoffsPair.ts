import BasketballGame from "./BasketballGame.js"
import FootballGame from "./FootballGame.js"

export default class PlyoffsPair {
    id: number
    games: FootballGame[] | BasketballGame[]
    prevIds: number[]
    nextId: number
    public teams: {
        team: string,
        id: number,
        totalScore: number,
        wins: number,
        scores: { playedIn: string, score: number }[]
    }[] = []

    constructor(id: number, games: FootballGame[] | BasketballGame[], prevIds: number[], nextId: number) {
        this.id = id
        this.games = games
        this.prevIds = prevIds
        this.nextId = nextId
    }
}