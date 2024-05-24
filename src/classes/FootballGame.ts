import FootballTeam from "./FootballTeam.js"
import Game from "./Game.js"

export default class FootballGame extends Game {
    extraTime: null | Game = null
    shootout: null | Game = null

    constructor(id: number, leg: number, round: number | string, homeT?: FootballTeam | null, awayT?: FootballTeam | null, pairId?: number) {
        super(id, leg, round, pairId, homeT, awayT)
    }

    static gameElement(game: FootballGame) {
        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        gameWrapper.textContent = game.homeTeam.team + ' ' + game.awayTeam.team

        return gameWrapper
    }
}