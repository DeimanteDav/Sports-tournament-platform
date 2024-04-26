export default class Game {
  constructor(homeTeam, awayTeam, id, pairId, roundNr, round) {
    this.homeTeam = {
      team: homeTeam && homeTeam.team,
      goals: 0,
    };
    this.awayTeam = {
      team: awayTeam && awayTeam.team,
      goals: 0,
    };
    this.played = false;
    this.id = id
    this.pairId = pairId
    this.roundNr = roundNr
    this.round = round
    this.winner = null
  }
}
