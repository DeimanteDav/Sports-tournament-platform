import { GamesType, PlayoffsTeam } from "../types.js"


export default class PlyoffsPair {
    id: number
    games: GamesType
    prevIds: number[]
    nextId: number
    public teams: PlayoffsTeam[] | [] = []
    winnerId: number | null = null

    constructor(id: number, games: GamesType, prevIds: number[], nextId: number) {
        this.id = id
        this.games = games
        this.prevIds = prevIds
        this.nextId = nextId
    }
}