import Team from "./Team.js";

export default class FootballTeam extends Team {
    draws: number = 0
    awayGoals: number = 0
    awayWins: number = 0
    constructor(team: string, id: number, totalGames: number, minPlace: number) {
        super(team, id, totalGames, minPlace)
        // this.draws = 0
        // this.awayGoals = 0
        // this.awayWins = 0
    }
}