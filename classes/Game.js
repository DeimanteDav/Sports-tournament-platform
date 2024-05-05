import { SPORTS } from "../config.js";
 
export default class Game {
  constructor(sportId, homeTeam, awayTeam, id, pairId, roundNr, round) {

    this.homeTeam = {
      team: homeTeam ? homeTeam.team : '',
      goals: null,
    };
    this.awayTeam = {
      team: awayTeam ? awayTeam.team : '',
      goals: null,
    };
    this.played = false;
    this.id = id
    this.pairId = pairId
    this.roundNr = roundNr
    this.round = round
    this.winner = null
    
    if (sportId === SPORTS.football.id) {
      this.extraTime = null
      this.shootout = null
    } else if (sportId === SPORTS.basketball.id) {
      this.overtime = []
    }
  }
}
 