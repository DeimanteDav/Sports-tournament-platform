import Game from "../Game.js"
import FootballTeam from "./FootballTeam.js"

export default class FootballGame extends Game {
    extraTime: null | Game = null
    shootout: null | Game = null

    constructor(homeT: FootballTeam, awayT: FootballTeam, id: number, leg: number, round: number | string, pairId?: number) {
        super(homeT, awayT, id, leg, round, pairId)
    }

    // static gameElement(game: FootballGame) {
    //     const gameWrapper = document.createElement('div')
    //     gameWrapper.classList.add('game-wrapper')


    //     return gameWrapper
    // }
}