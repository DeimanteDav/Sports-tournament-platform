export default class Game {
  constructor(homeTeam, awayTeam, id, pairId, roundNr, round, extraTime) {
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
    this.extraTime = extraTime
  }
}
 