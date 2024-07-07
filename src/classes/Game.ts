import Team from "./Team.js"

export default class Game {
  teams: { team: string, id: number | null, goals: number | null, home: boolean, away: boolean  }[]
  id: number
  played: boolean = false
  leg: number
  round: number | string
  playedAll: boolean = false
  pairId?: number | null
  
  constructor(homeT: Team, awayT: Team, id: number, leg: number, round: number | string, pairId?: number | null) {
    this.teams = [
      {
        team: homeT ? homeT.team : '',
        id: homeT ? homeT.teamId : null,
        goals: null,
        home: true,
        away: false
      },
      {
        team: awayT ? awayT.team : '',
        id: awayT ? awayT.teamId : null,
        goals: null,
        home: false,
        away: true,
      }
    ] 
    this.id = id
    this.leg = leg
    this.pairId = pairId
    this.round = round
  }
  
  static gameElement() {
    const gameWrapper = document.createElement('div')
    gameWrapper.classList.add('game-wrapper')

    return gameWrapper
}
}