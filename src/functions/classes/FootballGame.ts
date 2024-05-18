import FootballTeam from "./FootballTeam.js"
import Game from "./Game.js"

export default class FootballGame extends Game {
    extraTime: null | Game = null
    shootout: null | Game = null
    
    constructor(homeT: FootballTeam, awayT: FootballTeam, id: number, leg: number, round: number, pairId?: number) {
        super(homeT, awayT, id, leg, round, pairId)
    }

    static gameElement(game: FootballGame) {
        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('game-wrapper')

        gameWrapper.textContent = game.homeTeam.team + ' ' + game.awayTeam.team

        return gameWrapper
    }
}