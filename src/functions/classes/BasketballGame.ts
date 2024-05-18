import BasketballTeam from "./BasketballTeam.js"
import Game from "./Game.js"

export default class BasketballGame extends Game {
    overtime: [] | Game[] = []

    constructor(homeT: BasketballTeam, awayT: BasketballTeam, id: number, leg: number, round: number, pairId?: number) {
        super(homeT, awayT, id, leg, round, pairId)
    }

    // static gameElement(game: BasketballGame) {
    //     const gameWrapper = document.createElement('div')
    //     gameWrapper.classList.add('game-wrapper')

    //     gameWrapper.textContent = game.homeTeam.team + ' ' + game.awayTeam.team

    //     return gameWrapper
    // }
}