import { Container, TeamsType } from "../../types.js"

function winnerElement(container: Container, winnerId: number, teams: TeamsType) {
    const winnerWrapper = document.createElement('div')
    winnerWrapper.classList.add('winner')
    const winnerText = document.createElement('p')
    winnerText.textContent = 'winner'

    const winnerData = teams.find(team => team.teamId === winnerId)

    winnerWrapper.append(winnerText)
    
    if (winnerData) {
        const winnerEl = document.createElement('p')
        winnerEl.textContent = winnerData.team
        winnerWrapper.append(winnerEl)
    }

    container.append(winnerWrapper)
}

export default winnerElement