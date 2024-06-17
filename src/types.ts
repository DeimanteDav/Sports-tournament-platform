import BasketballGame from "./classes/Basketball/BasketballGame.js"
import BasketballTeam from "./classes/Basketball/Basketball/Basketball/BasketballTeam.js"
import FootballGame from "./classes/Football/FootballGame.js"
import FootballTeam from "./classes/Football/FootballTeam.js"

export interface PlayoffsTeam {
    team: string
    id: number | null
    totalScore: number
    wins: number
    scores: { playedIn: string, score: number | null }[]
}

export type Container = HTMLDivElement

export type TeamsType = BasketballTeam[] | FootballTeam[] | (BasketballTeam | FootballTeam)[]
export type TeamType = BasketballTeam | FootballTeam

export type GamesType = BasketballGame[] | FootballGame[] | (BasketballGame | FootballGame)[]
export type GameType = BasketballGame | FootballGame

export interface PlayoffsPairInterface {
    id: number
    games: GamesType
    prevIds: number[]
    nextId: number
    teams: PlayoffsTeam[] | []
    winnerId: number | null
}