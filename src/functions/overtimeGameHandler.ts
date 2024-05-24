import BasketballGame from "../classes/BasketballGame.js"
import BasketballTeam from "../classes/BasketballTeam.js"
import FootballGame from "../classes/FootballGame.js"
import FootballTeam from "../classes/FootballTeam.js"
import Game from "../classes/Game.js"
import updateGameData from "./updateGameData.js"

function overtimeGameHandler(currentGame: FootballGame | BasketballGame, gameWrapper: HTMLElement, gameEl: HTMLElement, gameTeams: (FootballTeam | BasketballTeam)[], overtimeId: number, sportId: number) {
    const basketballGame = currentGame as BasketballGame
    const basketballOvertime = basketballGame.overtime.find(overtime => overtime.id === overtimeId)

    if (!basketballOvertime || !gameEl) return

    const overtimeInputs = [...gameEl.querySelectorAll<HTMLInputElement>(`.result-input[data-overtime="${overtimeId}"]`)]

    const currentGameAllInputs = [...gameEl.querySelectorAll<HTMLInputElement>(`.result-input`)]

    if (!overtimeInputs || !currentGameAllInputs) return


    updateGameData(gameWrapper, overtimeInputs, basketballOvertime, sportId)

    const equalOvertimeGoals = basketballOvertime.teams.every(team => basketballOvertime.teams[0].goals === team.goals)

    if (equalOvertimeGoals && basketballOvertime.played) {
        const basketballOvertime = new Game(basketballGame.overtime.length+1, currentGame.leg, currentGame.round, null, gameTeams[0], gameTeams[1])

        overtimeInputs.forEach((input, i) => {
            const overtimeInput = document.createElement('input')
            overtimeInput.dataset.overtime = (overtimeId+1).toString()
            overtimeInput.dataset.teamId = gameTeams[i].id?.toString()
            overtimeInput.classList.add('result-input')

            input.after(overtimeInput)
        })

        basketballGame.overtime.push(basketballOvertime)
    } else {
        basketballGame.overtime = basketballGame.overtime.filter(overtime => overtime.id <= overtimeId)

        currentGameAllInputs.forEach(input => {
            if (input.dataset.overtime && +input.dataset.overtime > overtimeId) {
                input.remove()
            }
        })
    }
}

export default overtimeGameHandler