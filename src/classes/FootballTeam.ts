import Team from "./Team.js";

export default class FootballTeam extends Team {
    draws: number = 0
    awayGoals: number = 0
    awayWins: number = 0

    constructor(team: string, id: number, totalGames: number, minPlace: number) {
        super(team, id, totalGames, minPlace)
    }
}

const team = new FootballTeam('komanda', 2, 10, 2)
console.log(team.teamId);