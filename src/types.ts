import BasketballGame from "./classes/BasketballGame.js"
import BasketballTeam from "./classes/BasketballTeam.js"
import FootballGame from "./classes/FootballGame.js"
import FootballTeam from "./classes/FootballTeam.js"

export interface PlayoffsTeam {
    team: string
    id: number | null
    totalScore: number
    wins: number
    scores: { playedIn: string, score: number | null }[]
}

export type Container = HTMLDivElement

export type TeamsType = BasketballTeam[] | FootballTeam[] | (BasketballTeam | FootballTeam)[]
export type GamesType = BasketballGame[] | FootballGame[] | (BasketballGame | FootballGame)[]

export interface PlayoffsPairInterface {
    id: number
    games: GamesType
    prevIds: number[]
    nextId: number
    teams: PlayoffsTeam[] | []
    winnerId: number | null
}