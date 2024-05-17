import FootballTeam from "./FootballTeam.js"
import Game from "./Game.js"

export default class FootballGame extends Game {
    extraTime: null | Game = null
    shootout: null | Game = null
    
    constructor(homeT: FootballTeam, awayT: FootballTeam, id: number, leg: number, round: number, pairId?: number) {
        super(homeT, awayT, id, leg, round, pairId)
    }

    gameElement() {
        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        gameWrapper.textContent = this.homeTeam.team + ' ' + this.awayTeam.team

        return gameWrapper
    }
}