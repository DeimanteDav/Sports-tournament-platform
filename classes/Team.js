import { SPORTS } from "../config.js";

export default class Team {
    constructor(sportId, team, totalGames, minPlace) {
        this.team = team
        this.playedGames = 0
        this.wins = 0
        this.losses = 0
        this.goals = 0
        this.goalsMissed = 0
        this.goalDifference = 0
 
        this.points = 0
        this.gamesLeft = 0

        this.potentialPoints = 0
        this.maxPotentialPoints = 0

        this.currentPlace = 0
        this.maxPlace = 1
        this.minPlace = minPlace

        this.totalGames = totalGames

        if (sportId === SPORTS.football.id) {
            this.draws = 0
            this.awayGoals = 0
            this.awayWins = 0
        } else if (sportId === SPORTS.basketball.id) {
            this.techLosses = 0
            this.winPerc = 0
            this.overtime = {
                won: 0,
                lost: 0,
            }
            this.homeGames = {
                won: 0,
                lost: 0,
            }
            this.awayGames = {
                won: 0,
                lost: 0,
            }
        }
    }

     

    setGamesLeft() {
        this.gamesLeft = this.totalGames - this.playedGames
    }
    
    setPotentialPoints(winPoints) {
        this.potentialPoints = this.gamesLeft*winPoints
        this.maxPotentialPoints = this.potentialPoints + this.points
    }
}