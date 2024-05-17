import BasketballTeam from "./BasketballTeam.js"
import Game from "./Game.js"

export default class BasketballGame extends Game {
    overtime: [] | Game[] = []

    constructor(homeT: BasketballTeam, awayT: BasketballTeam, id: number, leg: number, round: number, pairId?: number) {
        super(homeT, awayT, id, leg, round, pairId)
    }

    gameElement() {
        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        gameWrapper.textContent = this.homeTeam.team + ' ' + this.awayTeam.team

        return gameWrapper
    }
}