import { GamesType, PlayoffsTeam } from "../types.js"
import BasketballGame from "./Basketball/BasketballGame.js"
import FootballGame from "./Football/FootballGame.js"


export default class PlyoffsPair {
    id: number
    games: (FootballGame | BasketballGame)[]
    prevIds: number[]
    nextId: number
    public teams: PlayoffsTeam[] | [] = []
    winnerId: number | null = null

    constructor(id: number, games: (FootballGame | BasketballGame)[], prevIds?: number[], nextId?: number) {
        this.id = id
        this.games = games
        this.prevIds = prevIds || []
        this.nextId = nextId || 0
    }
}