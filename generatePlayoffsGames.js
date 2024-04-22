import Game from "./classes/Game.js"
import Team from "./classes/Team.js"

export default function generatePlayoffsGames(container) {
    const playoffsData = JSON.parse(localStorage.getItem('playoffs-data'))
    const {roundsData, teamsAmount} = playoffsData

    if (!localStorage.getItem('teams-data')) {
        const teamNames = JSON.parse(localStorage.getItem('team-names'))
        const difference = teamNames.length - teamsAmount
        
        const teamsData = teamNames.slice(0, -difference).map(name => new Team(name, 0, teamsAmount))

        localStorage.setItem('teams-data', JSON.stringify(teamsData))
    }

    const teamsData = JSON.parse(localStorage.getItem('teams-data'))
    const gamesData = localStorage.getItem('playoffs-games-data') ? JSON.parse(localStorage.getItem('playoffs-games-data')) : {}

    const sortedData = Object.fromEntries(
        Object.entries(roundsData)
            .sort(([key1], [key2]) => {
                const a = +key1.slice(-1)
                const b = +key2.slice(-1)

                if (a && b) {
                    return Number(b[0]) - Number(a[0])
                } else if (!Number(a)) {
                    return 1
                } else {
                    return -1
                }
            })
    );

    const playoffsWrapper = document.createElement('form')
    playoffsWrapper.classList.add('playoffs')

    playoffsWrapper.style.display = 'grid'
    playoffsWrapper.style.gridTemplateColumns = `repeat(${Object.keys(roundsData).length}, 1fr)`
    playoffsWrapper.style.gap = '80px'

    let idCounter = 0
    Object.entries(sortedData).forEach(([round, data], m) => {
        const {gamesAmount, knockouts} = data

        if (gamesAmount > 1) {
            const roundWrapper = document.createElement('div')
            roundWrapper.append(round)
            roundWrapper.classList.add(`round`, `round-games-${gamesAmount}`)
            const wrapper1 = document.createElement('div')
            wrapper1.classList.add('games')
            const wrapper2 = document.createElement('div')
            wrapper2.classList.add('games')
            
            // wrapper1.prepend(round, '1')
            // wrapper2.prepend(round, '2')

            if (gamesAmount > 2) {
                roundWrapper.append(wrapper1, wrapper2)
            } else {
                roundWrapper.append(wrapper1)
            }
            playoffsWrapper.append(roundWrapper)

            const pairsAmount = gamesAmount/2
            for (let i = 1; i <= pairsAmount; i++) {
                const pairWrapper = document.createElement('div')
                pairWrapper.classList.add('pair-wrapper')   
    
                if (i < pairsAmount/2 + 1) {
                    wrapper1.append(pairWrapper)
                } else {
                    wrapper2.append(pairWrapper)
                }

                // pairWrapper.append(`Pair ${i}`)
                for (let j = 1; j <= gamesAmount; j++) {
                    const gameWrapper = document.createElement('div')
                    gameWrapper.classList.add('game-wrapper')
                    
                    const pairIndex = Math.round(j / 2)

                    if (i === pairIndex) {
                        pairWrapper.append(gameWrapper)
                    }
                }
            }  
            
            
            if (m === 0) {
                let round1Games
                if (!gamesData[round]) {
                    round1Games = []
                    for (let i = 0; i < teamsData.length; i++) {
                        let modifiedTeams
                        let round1Game
        
                        if (i === 0) {
                            modifiedTeams = teamsData
                        } else {
                            modifiedTeams = teamsData.slice(i, -i)
                        }
        
                        if (modifiedTeams.length > 0) {
                            round1Game = [new Game(modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1])]
    
                            
                            if (knockouts === 2) {
                                round1Game.push(new Game(modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]))
                            }
                        }
                    
                
                        round1Game && round1Games.push(round1Game)
                    }
                    round1Games.forEach((games, j) => {
                        idCounter++
                        games.forEach((game, m) => {
                            game.id = j + idCounter + m
                        })
                    })
    
                    gamesData[round] = round1Games
                } else {
                    round1Games = gamesData[round]
                }

                const gamesWrappers = roundWrapper.querySelectorAll('.game-wrapper')

                gamesWrappers.forEach((gameWrapper, n) => {
                    const games = round1Games[n]
                    for (let i = 0; i < games.length; i++) {
                        const game = games[i]
                        const gameEl = document.createElement('div')
                        gameEl.classList.add('game')
                        gameEl.dataset.round = round
                        gameEl.dataset.gameId = game.id
                        gameEl.dataset.knockout = i+1

    
                        gameWrapper.append(gameEl)
                        createTeamWrapers(gameEl, game, i)
                    }
                })
                
                localStorage.setItem('playoffs-games-data', JSON.stringify(gamesData))
            }
        } else {
            const finalsWrapper = document.createElement('div')
            finalsWrapper.classList.add('final', 'round')
            finalsWrapper.append(round)

            const wrapper = document.createElement('div')
            wrapper.classList.add('round')

            const gameWrapper = document.createElement('div')
            gameWrapper.classList.add('game-wrapper')

            wrapper.append(gameWrapper)
            finalsWrapper.append(wrapper)
            playoffsWrapper.append(finalsWrapper)
        }

 
    })

    container.append(playoffsWrapper)

    playoffsWrapper.addEventListener('change', (e) => {
        const gameEl = e.target.parentElement.parentElement

        const knockout = Number(gameEl.dataset.knockout)

        const homeTeamInput = gameEl.querySelector('.home-team .result-input')
        const awayTeamInput = gameEl.querySelector('.away-team .result-input')

        const homeTeamScored = Number(homeTeamInput.value)
        const awayTeamScored = Number(awayTeamInput.value)
        const currentRound = gameEl.dataset.round
        const gameId = gameEl.dataset.gameId

        const currentRoundGames = gamesData[currentRound]
        const currentIndex = [Math.round(+gameId/2)-1]
        const currentGames = currentRoundGames[currentIndex]
        const currentGame = currentGames[knockout-1]
    
        const gameHomeTeamData = currentGame.homeTeam
        const gameAwayTeamData = currentGame.awayTeam
    
        gameHomeTeamData.goals = homeTeamScored
        gameAwayTeamData.goals = awayTeamScored
    
    
        if (homeTeamInput.value && awayTeamInput.value) {
            currentGame.played = true
            gameEl.parentElement.classList.add('played')
            gameEl.dataset.played = true
        } else {
            currentGame.played = false
            gameEl.parentElement.classList.remove('played')
            gameEl.dataset.played = false
        }

        if (currentGames.every(game => game.played)) {
            const nextRound = currentRoundGames.length/2 === 1 ? 'final' : currentRoundGames.length/2

            const nextRoundElement = document.querySelector(`.round-games-${nextRound}`)

            let nextRoundIndex
            if (currentIndex + 1 < currentRoundGames.length/2 || currentRoundGames.length === 2) {
                nextRoundIndex = 0 
            } else {
                nextRoundIndex = 1
            }

            const nextRoundGames = [...nextRoundElement.children]
            const nextRoundPairs = [...nextRoundGames[nextRoundIndex].children]
            const currentPairsLeft = Math.floor((currentRoundGames.length - currentIndex - 1)/2)

            const nextPair = currentPairsLeft > 1 ? nextRoundPairs[Math.round(nextRoundPairs.length-1 - currentPairsLeft/2)] : nextRoundPairs[0]
            const nextGames = [...nextPair.children]
            const nextGameIndex = currentPairsLeft % 2 === 0 ? 1 : 0

            const nextGameWrapper = nextGames[nextGameIndex]

            const gameEl = document.createElement('div')
            gameEl.classList.add('game')

            nextGameWrapper.append(gameEl)

        }
        localStorage.setItem('playoffs-games-data', JSON.stringify(gamesData))
    })

    // const teamsData = JSON.parse

    // const sortedTeams = [...teams].sort((a, b) => a.currentPlace - b.currentPlace)

    // const round1Games = []
    // for (let i = 0; i < sortedTeams.length; i++) {
    //     let modifiedTeams
    //     let round1Game

    //     if (i === 0) {
    //         modifiedTeams = sortedTeams
    //         round1Game = new Game(modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1])
    //     } else {
    //         modifiedTeams = sortedTeams.slice(i, -i)

    //         if (modifiedTeams.length > 0) {
    //             round1Game = new Game(modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1])
    //         }
    //     }

    //     round1Game && round1Games.push(round1Game)
    // }


//     const leftWrapper = document.createElement('div')
//     const rightWrapper = document.createElement('div')
//     leftWrapper.classList.add('left-side')
//     rightWrapper.classList.add('right-side')

//     let leftGamesAmount = 0
//     let rightGamesAmount = 0

//     for (let i = 0; i < round1Games.length/2; i++) {
//         const leftPairWrapper = document.createElement('div')
//         leftPairWrapper.className = 'left-pair-wrapper'
//         const rightPairWrapper = document.createElement('div')
//         rightPairWrapper.className = 'right-pair-wrapper'

//         if (i < round1Games.length/4) {
//             leftWrapper.append(leftPairWrapper)
//         } else {
//             rightWrapper.append(rightPairWrapper)
//         }

//         playoffsWrapper.append(leftWrapper, rightWrapper)
//     }

//     for (let i = 0; i < round1Games.length; i++) {
//         const game = round1Games[i];
//         const gameWrapper = document.createElement('div')
//         gameWrapper.classList.add('game-wrapper')

//         const leftPairWrappers = playoffsWrapper.querySelectorAll('.left-pair-wrapper')
//         const rightPairWrappers = playoffsWrapper.querySelectorAll('.right-pair-wrapper')

        // for (let team in game) {
        //     if (team == 'homeTeam' || team === 'awayTeam') {
        //         const teamWrapper = document.createElement('div')
        //         teamWrapper.classList.add('team')
    
        //         if (team === 'homeTeam') {
        //             teamWrapper.classList.add('home-team')
        //         } else {
        //             teamWrapper.classList.add('away-team')
        //         }
        //         const label = document.createElement('label')
        //         const input = document.createElement('input')               
        //         input.type = 'number'
        //         input.id = `Playoffs-${i+1}-${game[team].team}`
        //         input.dataset.team = game[team].team
        //         label.htmlFor = input.id
        //         label.textContent = game[team].team
        //         input.value = game.played ? game[team].goals : ''           
                
        //         teamWrapper.append(label, input)

        //         gameWrapper.append(teamWrapper) 
        //     }
        // }

//         // if (i === 0 || rightGamesAmount >= round1Games.length/2) {
//         //     leftPairWrappers[Math.floor(leftGamesAmount/2)].append(gameWrapper)
//         //     leftGamesAmount++
//         // } else {
//         //     rightPairWrappers[Math.floor(rightGamesAmount/2)].append(gameWrapper)
//         //     rightGamesAmount++
//         // }
//     }


//     let roundsInfo = [] 
//     let roundGamesAmount = round1Games.length / 2
//     let prevRoundGamesAmount

//     for (let i = 0; i < round1Games.length; i++) {
//         roundGamesAmount = Math.round(roundGamesAmount / 2)
//         if (prevRoundGamesAmount !== roundGamesAmount) {
//             roundsInfo.push(roundGamesAmount)
//         }
//         prevRoundGamesAmount = roundGamesAmount
//     }
//     playoffsWrapper.style.gridTemplateColumns = `repeat(${roundsInfo.length*2 + 3}, 1fr)`


//     const createEmptyRounds = (roundNum, gamesAmount, prevLeftWrapper) => {
//         const leftWrapper = document.createElement('div')
//         const rightWrapper = document.createElement('div')
//         leftWrapper.classList.add(`left-side${roundNum}`)
//         leftWrapper.dataset.roundNum = roundNum
//         rightWrapper.classList.add(`right-side${roundNum}`)
//         rightWrapper.dataset.roundNum = roundNum

//         let leftGamesAmount = 0
//         let rightGamesAmount = 0

//         prevLeftWrapper.classList.remove('prev-wrapper')

//         for (let i = 0; i < gamesAmount*2; i++) {
//             const leftPairWrapper = document.createElement('div')
//             leftPairWrapper.className = `left-pair-wrapper${roundNum} left-pair-wrapper`
//             const rightPairWrapper = document.createElement('div')
//             rightPairWrapper.className = `right-pair-wrapper${roundNum} right-pair-wrapper`

//             if (i < gamesAmount/4) {
//                 leftWrapper.append(leftPairWrapper)
//             } else {
//                 rightWrapper.append(rightPairWrapper)
//             }

//         }

//         prevLeftWrapper.after(leftWrapper, rightWrapper)
//         leftWrapper.classList.add('prev-wrapper')
//         console.log(leftWrapper.classList);


//         const leftPairWrappers = leftWrapper.querySelectorAll(`.left-pair-wrapper${roundNum}`)
//         const rightPairWrappers = rightWrapper.querySelectorAll(`.right-pair-wrapper${roundNum}`)

//         for (let i = 0; i < gamesAmount*2; i++) {
//             const gameWrapper = document.createElement('div')
//             gameWrapper.classList.add('game-wrapper')
//             const game = document.createElement('div')
//             game.classList.add('game')
//             gameWrapper.append(game)

//             if (i <= Math.round(gamesAmount/4)) {
//                 leftPairWrappers[Math.floor(leftGamesAmount/4)].append(gameWrapper)
//                 leftGamesAmount++
//             } else {
//                 rightPairWrappers[Math.floor(rightGamesAmount/4)].append(gameWrapper)
//                 rightGamesAmount++
//             }
//         }

//     }


//     let roundsCreated = false
//     for (let i = 0; i < roundsInfo.length; i++) {
//         let prevLeftWrapper = playoffsWrapper.querySelector('.prev-wrapper') ? playoffsWrapper.querySelector('.prev-wrapper') : leftWrapper

//         const gamesAmount = roundsInfo[i]
//         createEmptyRounds(i, gamesAmount, prevLeftWrapper)  

//         if (i === roundsInfo.length - 1) {
//             roundsCreated = true
//         }
//     }
  
//     if (roundsCreated) {
//         let prevLeftWrapper = playoffsWrapper.querySelector('.prev-wrapper')
//         const finalsWrapper = document.createElement('div')
//         finalsWrapper.classList.add('finals-wrapper')
        
//         const gameWrapper = document.createElement('div')
//         gameWrapper.classList.add('game-wrapper')
//         const game = document.createElement('div')
//         game.classList.add('game')
//         gameWrapper.append(game)
    
//         finalsWrapper.append(gameWrapper)
    
//         prevLeftWrapper.after(finalsWrapper)
//     }

//     container.append(playoffsWrapper)
}


function createTeamWrapers(gameEl, game, i) {
    for (let team in game) {
        if (team === 'homeTeam' || team === 'awayTeam') {
            const teamWrapper = document.createElement('div')
            teamWrapper.classList.add('team')
            const label = document.createElement('label')
            const input = document.createElement('input')               
            input.type = 'number'
            input.id = `Playoffs-${i+1}-${game[team].team}`
            input.classList.add('result-input')

            if (team === 'homeTeam') {
                teamWrapper.classList.add('home-team')
            } else {
                teamWrapper.classList.add('away-team')
            }
            input.dataset.team = game[team].team
            label.htmlFor = input.id
            label.textContent = game[team].team

            if (i === 1) {
                label.style.display = 'none'
            }

            input.value = game.played ? game[team].goals : '' 
            teamWrapper.append(label, input)
            gameEl.append(teamWrapper) 
        }
    }
}

