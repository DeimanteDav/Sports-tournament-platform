export default class Game {
  constructor(homeTeam, awayTeam) {
    this.homeTeam = {
      team: homeTeam.team,
      goals: 0,
    };
    this.awayTeam = {
      team: awayTeam.team,
      goals: 0,
    };
    this.played = false;
    this.id;
  }
}
