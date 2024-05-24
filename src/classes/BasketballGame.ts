import BasketballTeam from "./BasketballTeam.js"
import Game from "./Game.js"

export default class BasketballGame extends Game {
    overtime: Game[] = []

    constructor(id: number, leg: number, round:  | string, homeT?: BasketballTeam | null, awayT?: BasketballTeam | null, pairId?: number) {
        super(id, leg, round, pairId, homeT, awayT)
    }

    // static gameElement(game: BasketballGame) {
    //     const gameWrapper = document.createElement('div')
    //     gameWrapper.classList.add('game-wrapper')

    //     gameWrapper.textContent = game.homeTeam.team + ' ' + game.awayTeam.team

    //     return gameWrapper
    // }
}