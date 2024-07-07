import Game from "../Game.js"
import BasketballTeam from "./BasketballTeam.js"

export default class BasketballGame extends Game {
    overtime: Game[] = []

    constructor(homeT: BasketballTeam, awayT: BasketballTeam, id: number, leg: number, round: number | string, pairId?: number) {
        super(homeT, awayT, id, leg, round, pairId)
}
}