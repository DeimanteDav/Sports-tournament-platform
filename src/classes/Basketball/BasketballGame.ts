import Game from "../Game.js"
import BasketballTeam from "./BasketballTeam.js"

export default class BasketballGame extends Game {
    overtime: Game[] = []

    constructor(id: number, leg: number, round: number | string, homeT?: BasketballTeam | null, awayT?: BasketballTeam | null, pairId?: number) {
        super(id, leg, round, pairId, homeT, awayT)
    }
}