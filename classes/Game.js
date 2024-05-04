import { SPORTS } from "../config.js";
 
const sport = JSON.parse(localStorage.getItem('sport'))

export default class Game {
  constructor(homeTeam, awayTeam, id, pairId, roundNr, round) {

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
    
    if (sport.id === SPORTS.football.id) {
      this.extraTime = null
      this.shootout = null
    } else if (sport.id === SPORTS.basketball.id) {
      this.overtime = []
    }
  }
}
 