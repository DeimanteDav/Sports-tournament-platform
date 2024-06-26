import Team, { TeamData } from "../Team.js"

export interface FootballTeamData extends TeamData {
    draws?: number
    awayGoals?: number
    awayWins?: number
}

export default class FootballTeam extends Team {
    draws: number = 0
    awayGoals: number = 0
    awayWins: number = 0

    constructor(data: FootballTeamData) {
        super(data)
        const {draws, awayGoals, awayWins} = data
 
        this.draws = draws ?? 0
        this.awayGoals = awayGoals ?? 0
        this.awayWins = awayWins ?? 0
    }
} 