import { PlayoffsTeams } from "../types.js"
import BasketballGame from "./BasketballGame.js"
import FootballGame from "./FootballGame.js"


export default class PlyoffsPair {
    id: number
    games: FootballGame[] | BasketballGame[]
    prevIds: number[]
    nextId: number
    public teams: PlayoffsTeams | [] = []
    winnerId: number | null = null

    constructor(id: number, games: FootballGame[] | BasketballGame[], prevIds: number[], nextId: number) {
        this.id = id
        this.games = games
        this.prevIds = prevIds
        this.nextId = nextId
    }
}