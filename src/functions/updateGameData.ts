import BasketballGame from "../classes/Basketball/BasketballGame.js"
import FootballGame from "../classes/Football/FootballGame.js"
import Game from "../classes/Game.js"
import { SPORTS } from "../config.js"

function updateGameData(gameWrapper: HTMLElement, inputs: HTMLInputElement[], currentGame: BasketballGame | FootballGame | Game, sportId: number): void {
    // FIXME: <HTMLInputElement>
    // const homeTeamInput = gameEl.querySelector<HTMLInputElement>(`.home-team ${overtime ? `[data-overtime="${currentGame.id}"]` : '.result-input'}`)
    // const awayTeamInput = gameEl.querySelector<HTMLInputElement>(`.away-team ${overtime ? `[data-overtime="${currentGame.id}"]` : '.result-input'}`)

    if (!inputs || inputs.length !== 2 || !gameWrapper) {
        return
    }

    const team1Input = inputs[0]
    const team2Input = inputs[1]

    const team1Id = team1Input.dataset.teamId && +team1Input.dataset.teamId
    const team2Id = team2Input.dataset.teamId && +team2Input.dataset.teamId

    if (!team1Id || !team2Id) {
        throw new Error('no team id')
    }

    const team1Scored = Number(team1Input.value)
    const team2Scored = Number(team2Input.value)
    
    currentGame.teams.forEach((team, i) => {
        if (team.id === team1Id) {
            team.goals = team1Input.value ? team1Scored : null
        } else if (team.id === team2Id) {
            team.goals = team2Input.value ? team2Scored : null
        }

        if (team1Input.value && team2Input.value) {
            currentGame.played = true
            if (sportId === SPORTS.basketball.id) {
                const basketballGame = currentGame as BasketballGame
    
                if (basketballGame.overtime?.length > 0) {
                    if (basketballGame.overtime.every(overtimeGame => overtimeGame.played)) {
                        gameWrapper.classList.add('played')
                        currentGame.playedAll = true
                    } else {
                        gameWrapper.classList.remove('played')
                        currentGame.playedAll = false
                    }
                } else {
                    gameWrapper.classList.add('played')
                    currentGame.playedAll = true
                }
            } else if (sportId === SPORTS.football.id) {
                const footballGame = currentGame as FootballGame
                if (footballGame.extraTime && footballGame.shootout) {
                    if (footballGame.extraTime.played) {
                        gameWrapper.classList.add('played')
                        currentGame.playedAll = true
                    } else {
                        gameWrapper.classList.remove('played')
                        currentGame.playedAll = false
                    }

                    if (footballGame.shootout.played) {
                        gameWrapper.classList.add('played')
                        currentGame.playedAll = true
                    } else {
                        gameWrapper.classList.remove('played')
                        currentGame.playedAll = false
                    }
                }
            }
        } else {
            currentGame.played = false
            currentGame.playedAll = false
            gameWrapper.classList.remove('played')
        }
    })
    // homeTeamData.goals = homeTeamInput.value ? homeTeamScored : null
    // awayTeamData.goals = awayTeamInput.value ?  awayTeamScored : null
    // if (homeTeamInput.value && awayTeamInput.value) {
    //     currentGame.played = true

    //     if (sportId === SPORTS.basketball.id) {
    //         // FIXME: ?? as
    //         const basketballGame = currentGame as BasketballGame

    //         if (basketballGame.overtime.length > 0 && !overtime) {
    //             if (basketballGame.overtime.every(overtimeGame => overtimeGame.played)) {
    //                 gameWrapper.classList.add('played')
    //                 currentGame.playedAll = true
    //             } else {
    //                 gameWrapper.classList.remove('played')
    //                 currentGame.playedAll = false
    //             }
    //         } else {
    //             gameWrapper.classList.add('played')
    //             currentGame.playedAll = true
    //         }
    //     } else if (sportId === SPORTS.football.id) {
    //         gameWrapper.classList.add('played')
    //     }
    // } else {
    //     currentGame.played = false
    //     gameWrapper.classList.remove('played')
    // }
}

export default updateGameData