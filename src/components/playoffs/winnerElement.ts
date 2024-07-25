import { Container, TeamsType } from "../../types.js"

function winnerElement(container: Container, winnerId: number, teams: TeamsType) {
    const winnerWrapper = document.createElement('div')
    winnerWrapper.id = 'winner-el'
    winnerWrapper.classList.add('winner-container')

    const winnerData = teams.find(team => team.teamId === winnerId)

    let oldWinnerEl = document.getElementById('winner-el')
    console.log(oldWinnerEl, 'old');
    if (oldWinnerEl) oldWinnerEl.remove() 
    
    if (winnerData) {
    
        const winnerEl = document.createElement('div')
        winnerEl.classList.add('winner')
        winnerEl.textContent = 'Winner ' + winnerData.team
        winnerWrapper.append(winnerEl)
    }

    container.append(winnerWrapper)
}

export default winnerElement