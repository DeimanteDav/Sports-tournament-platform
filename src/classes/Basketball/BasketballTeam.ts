import Team, { TeamData } from "../Team.js"

export interface BasketballTeamData extends TeamData {
    techLosses?: number;
    winPerc?: number;
    overtime?: { won: number; lost: number };
    homeGames?: { won: number; lost: number };
    awayGames?: { won: number; lost: number };
}

export default class BasketballTeam extends Team {
    techLosses: number = 0
    winPerc: number = 0
    overtime: {won: number, lost: number} = {won: 0, lost: 0}
    homeGames: {won: number, lost: number} = {won: 0, lost: 0}
    awayGames: {won: number, lost: number} = {won: 0, lost: 0}

    constructor(data: BasketballTeamData) {
        super(data)
        const {techLosses, winPerc, overtime, homeGames, awayGames} = data

        this.techLosses = techLosses ?? 0;
        this.winPerc = winPerc ?? 0;
        this.overtime = overtime ?? { won: 0, lost: 0 };
        this.homeGames = homeGames ?? { won: 0, lost: 0 };
        this.awayGames = awayGames ?? { won: 0, lost: 0 };
    }
}