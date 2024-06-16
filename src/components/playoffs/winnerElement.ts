import { Container, TeamsType } from "../../types.js"

function winnerElement(container: Container, winnerId: number, teams: TeamsType) {
    const prevWinnerId = localStorage.getItem('winner-id')

    const winnerWrapper = document.createElement('div')
    winnerWrapper.classList.add('winner')
    const winnerText = document.createElement('p')
    winnerText.textContent = 'winner'

    const winnerData = teams.find(team => team.id === winnerId)

    winnerWrapper.append(winnerText)
    
    if (winnerData) {
        const winnerEl = document.createElement('p')
        winnerEl.textContent = winnerData.team
        winnerWrapper.append(winnerEl)
    }

    container.append(winnerWrapper)
    // if (!prevWinnerId || +prevWinnerId !== winnerId) {
    //     console.log('suveikkia');
    //     const MyPromise = require('some-promise-lib');
    //     const confetti = require('canvas-confetti');
    //     confetti.Promise = MyPromise;

    //     var myCanvas = document.createElement('canvas');
    //     container.appendChild(myCanvas);

    //     var myConfetti = confetti.create(myCanvas, {
    //     resize: true,
    //     useWorker: true
    //     });
    //     myConfetti({
    //     particleCount: 100,
    //     spread: 160
    //     // any other options from the global
    //     // confetti function
    //     });
    // }

}

export default winnerElement