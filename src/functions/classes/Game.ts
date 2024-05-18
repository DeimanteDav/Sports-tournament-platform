import Team from "./Team.js"

export default class Game {
  homeTeam: { team: string, id: number | null, goals: number | null }
  awayTeam: { team: string, id: number | null, goals: number | null }
  teams: { team: string, id: number | null, goals: number | null, home: boolean, away: boolean  }[]
  id: number
  played: boolean = false
  leg: number
  round: number
  playedAll: boolean = false
  pairId?: number

  constructor(homeT: Team, awayT: Team, id: number, leg: number, round: number, pairId?: number) {
    this.teams =[
      {
        team: homeT ? homeT.team : '',
        id: homeT ? homeT.id : null,
        goals: null,
        home: true,
        away: false
      },
      {
        team: awayT ? awayT.team : '',
        id: awayT ? awayT.id : null,
        goals: null,
        home: false,
        away: true,
      }
    ] 
    this.homeTeam = {
      team: homeT ? homeT.team : '',
      id: homeT ? homeT.id : null,
      goals: null,
    };
    this.awayTeam = {
      team: awayT ? awayT.team : '',
      id: awayT ? awayT.id : null,
      goals: null,
    };
    this.id = id
    this.leg = leg
    this.pairId = pairId
    this.round = round
  }

  static gameElement(game: Game) {
    const gameWrapper = document.createElement('div')
    gameWrapper.classList.add('game-wrapper')

    gameWrapper.textContent = game.homeTeam.team + ' ' + game.awayTeam.team

    return gameWrapper
}
}