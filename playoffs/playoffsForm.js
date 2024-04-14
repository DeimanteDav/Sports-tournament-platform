import Game from "../classes/Game.js"
import updateGameData from "../functions/updateGameData.js"

export default function playoffsForm(container, teams, gamesData) {
    const {roundsData, teamsAmount} = gamesData
    const form = document.createElement('form')
    form.classList.add('playoffs')

    form.style.display = 'grid'
    form.style.gridTemplateColumns = `repeat(${Object.keys(roundsData).length}, 1fr)`
    form.style.gap = '80px'
    container.append(form)

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

    const playoffsGames = localStorage.getItem('playoffs-games-data') ? JSON.parse(localStorage.getItem('playoffs-games-data')) : {}


    Object.entries(sortedData).forEach(([round, data], index) => {
        const {gamesAmount, knockouts} = data
        let gameIndex = 0

        if (gamesAmount > 1) {
            const pairsAmount = gamesAmount/2
            for (let i = 0; i < pairsAmount; i++) {
                const pairWrapper = document.createElement('div')
                pairWrapper.append(gamesAmount)
                form.append(pairWrapper)


                for (let j = 0; j < 2; j++) {
                    const gameWrapper = document.createElement('div')                    
                    gameWrapper.classList.add('game-wrapper')
                    pairWrapper.append(gameWrapper)

                    const sortedTeams = [...teams].sort((a, b) => a.currentPlace - b.currentPlace)

                    gameWrapper.dataset.gameIndex = gameIndex+1
                    gameWrapper.dataset.knockouts = knockouts
                    gameWrapper.dataset.round = round

                    if (gameIndex < pairsAmount*2 ) {
                        createTeamWrapers(gameWrapper, playoffsGames, round, gamesAmount, roundsData, sortedTeams)
                        gameIndex+=1
                    }
                }
            }
        } else {
            const gameWrapper = document.createElement('div')                    
            gameWrapper.classList.add('game-wrapper', 'final')
            gameWrapper.dataset.knockouts = knockouts

            gameWrapper.dataset.gameIndex = 1
            gameWrapper.dataset.knockouts = knockouts
            gameWrapper.dataset.round = round

            form.append(gameWrapper)

            createTeamWrapers(gameWrapper, playoffsGames, round, gamesAmount, roundsData, teams)

        }
    })


    form.addEventListener('change', (e) => {
        console.log(e);
        const gameEl = e.target.parentElement.parentElement
        const gameWrapper = gameEl.parentElement

        const gameIndex = +gameWrapper.dataset.gameIndex
        const knockouts = +gameWrapper.dataset.knockouts

        const knockoutIndex = +gameEl.dataset.knockoutIndex

        const currentRound = gameWrapper.dataset.round
        const teamsGames = playoffsGames[currentRound][gameIndex]

        const currentGame = teamsGames[knockoutIndex-1]

        updateGameData(gameEl, currentGame)
        localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

        const allGamesPlayed = teamsGames.every(game => game.played)

        if (allGamesPlayed) {
            createTeamWrapers(gameWrapper, playoffsGames, currentRound, currentRound.slice(-1), roundsData, teams, gameEl, true)
        }

        // const knockout = Number(gameEl.dataset.knockout)
        // console.log(knockout);

        // const homeTeamInput = gameEl.querySelector('.home-team .result-input')
        // const awayTeamInput = gameEl.querySelector('.away-team .result-input')

        // const homeTeamScored = Number(homeTeamInput.value)
        // const awayTeamScored = Number(awayTeamInput.value)
        // console.log(homeTeamScored, awayTeamScored);

        // if (homeTeamInput.value && awayTeamInput.value) {
        //     currentGame.played = true


        // }
        // const currentRound = gameEl.dataset.round
        // const gameId = gameEl.dataset.gameId

        // const currentRoundGames = gamesData[currentRound]
        // const currentIndex = [Math.round(+gameId/2)-1]
        // const currentGames = currentRoundGames[currentIndex]
        // const currentGame = currentGames[knockout-1]
    
        // const gameHomeTeamData = currentGame.homeTeam
        // const gameAwayTeamData = currentGame.awayTeam
    
        // gameHomeTeamData.goals = homeTeamScored
        // gameAwayTeamData.goals = awayTeamScored
    })




    
    // let idCounter = 0
    // Object.entries(sortedData).forEach(([round, data], m) => {
    //     const {gamesAmount, knockouts} = data

    //     if (gamesAmount > 1) {
    //         const roundWrapper = document.createElement('div')
    //         roundWrapper.append(round)
    //         roundWrapper.classList.add(`round`, `round-games-${gamesAmount}`)
    //         const wrapper1 = document.createElement('div')
    //         wrapper1.classList.add('games')
    //         const wrapper2 = document.createElement('div')
    //         wrapper2.classList.add('games')
            
    //         // wrapper1.prepend(round, '1')
    //         // wrapper2.prepend(round, '2')

    //         if (gamesAmount > 2) {
    //             roundWrapper.append(wrapper1, wrapper2)
    //         } else {
    //             roundWrapper.append(wrapper1)
    //         }
    //         playoffsWrapper.append(roundWrapper)

    //         const pairsAmount = gamesAmount/2
    //         for (let i = 1; i <= pairsAmount; i++) {
    //             const pairWrapper = document.createElement('div')
    //             pairWrapper.classList.add('pair-wrapper')   
    
    //             if (i < pairsAmount/2 + 1) {
    //                 wrapper1.append(pairWrapper)
    //             } else {
    //                 wrapper2.append(pairWrapper)
    //             }

    //             // pairWrapper.append(`Pair ${i}`)
    //             for (let j = 1; j <= gamesAmount; j++) {
    //                 const gameWrapper = document.createElement('div')
    //                 gameWrapper.classList.add('game-wrapper')
                    
    //                 const pairIndex = Math.round(j / 2)

    //                 if (i === pairIndex) {
    //                     pairWrapper.append(gameWrapper)
    //                 }
    //             }
    //         }  
            
            
    //         if (m === 0) {
    //             console.log('addf');

    //             let round1Games
    //             if (!gamesData[round]) {
    //                 round1Games = []
    //                 for (let i = 0; i < teams.length; i++) {
    //                     let modifiedTeams
    //                     let round1Game
        
    //                     if (i === 0) {
    //                         modifiedTeams = teams
    //                     } else {
    //                         modifiedTeams = teams.slice(i, -i)
    //                     }
        
    //                     if (modifiedTeams.length > 0) {
    //                         round1Game = [new Game(modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1])]
    
                            
    //                         if (knockouts === 2) {
    //                             round1Game.push(new Game(modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]))
    //                         }
    //                     }
                    
                
    //                     round1Game && round1Games.push(round1Game)
    //                 }
    //                 round1Games.forEach((games, j) => {
    //                     idCounter++
    //                     games.forEach((game, m) => {
    //                         console.log(j, idCounter);
    //                         game.id = j + idCounter + m
    //                     })
    //                 })
    
    //                 gamesData[round] = round1Games
    //             } else {
    //                 round1Games = gamesData[round]
    //             }

    //             const gamesWrappers = roundWrapper.querySelectorAll('.game-wrapper')

    //             gamesWrappers.forEach((gameWrapper, n) => {
    //                 const games = round1Games[n]
    //                 for (let i = 0; i < games.length; i++) {
    //                     const game = games[i]
    //                     const gameEl = document.createElement('div')
    //                     gameEl.classList.add('game')
    //                     gameEl.dataset.round = round
    //                     gameEl.dataset.gameId = game.id
    //                     gameEl.dataset.knockout = i+1

    
    //                     gameWrapper.append(gameEl)
    //                     createTeamWrapers(gameEl, game, i)
    //                 }
    //             })
                
    //             localStorage.setItem('playoffs-games-data', JSON.stringify(gamesData))
    //         }
    //     } else {
    //         const finalsWrapper = document.createElement('div')
    //         finalsWrapper.classList.add('final', 'round')
    //         finalsWrapper.append(round)

    //         const wrapper = document.createElement('div')
    //         wrapper.classList.add('round')

    //         const gameWrapper = document.createElement('div')
    //         gameWrapper.classList.add('game-wrapper')

    //         wrapper.append(gameWrapper)
    //         finalsWrapper.append(wrapper)
    //         playoffsWrapper.append(finalsWrapper)
    //     }

 
    // })

    // container.append(playoffsWrapper)

    // playoffsWrapper.addEventListener('change', (e) => {
    //     const gameEl = e.target.parentElement.parentElement

    //     const knockout = Number(gameEl.dataset.knockout)
    //     console.log(knockout);

    //     const homeTeamInput = gameEl.querySelector('.home-team .result-input')
    //     const awayTeamInput = gameEl.querySelector('.away-team .result-input')

    //     const homeTeamScored = Number(homeTeamInput.value)
    //     const awayTeamScored = Number(awayTeamInput.value)
    //     const currentRound = gameEl.dataset.round
    //     const gameId = gameEl.dataset.gameId

    //     const currentRoundGames = gamesData[currentRound]
    //     const currentIndex = [Math.round(+gameId/2)-1]
    //     const currentGames = currentRoundGames[currentIndex]
    //     const currentGame = currentGames[knockout-1]
    
    //     const gameHomeTeamData = currentGame.homeTeam
    //     const gameAwayTeamData = currentGame.awayTeam
    
    //     gameHomeTeamData.goals = homeTeamScored
    //     gameAwayTeamData.goals = awayTeamScored
    
    
    //     if (homeTeamInput.value && awayTeamInput.value) {
    //         currentGame.played = true
    //         gameEl.parentElement.classList.add('played')
    //         gameEl.dataset.played = true
    //     } else {
    //         currentGame.played = false
    //         gameEl.parentElement.classList.remove('played')
    //         gameEl.dataset.played = false
    //     }

    //     if (currentGames.every(game => game.played)) {
    //         const nextRound = currentRoundGames.length/2 === 1 ? 'final' : currentRoundGames.length/2

    //         const nextRoundElement = document.querySelector(`.round-games-${nextRound}`)

    //         let nextRoundIndex
    //         if (currentIndex + 1 < currentRoundGames.length/2 || currentRoundGames.length === 2) {
    //             nextRoundIndex = 0 
    //         } else {
    //             nextRoundIndex = 1
    //         }

    //         const nextRoundGames = [...nextRoundElement.children]
    //         const nextRoundPairs = [...nextRoundGames[nextRoundIndex].children]
    //         const currentPairsLeft = Math.floor((currentRoundGames.length - currentIndex - 1)/2)

    //         const nextPair = currentPairsLeft > 1 ? nextRoundPairs[Math.round(nextRoundPairs.length-1 - currentPairsLeft/2)] : nextRoundPairs[0]
    //         const nextGames = [...nextPair.children]
    //         const nextGameIndex = currentPairsLeft % 2 === 0 ? 1 : 0

    //         const nextGameWrapper = nextGames[nextGameIndex]

    //         const gameEl = document.createElement('div')
    //         gameEl.classList.add('game')

    //         nextGameWrapper.append(gameEl)
    //     }

    //     localStorage.setItem('playoffs-games-data', JSON.stringify(gamesData))
    // })
}

// const gameIndex = +gameWrapper.dataset.gameIndex
// const knockouts = +gameWrapper.dataset.knockouts
// const prevRound = `1/${gamesAmount*2}`

// const prevRoundGame1 = playoffsGames[prevRound] && playoffsGames[prevRound][gameIndex*2-1]
// const prevRoundGame2 = playoffsGames[prevRound] && playoffsGames[prevRound][gameIndex*2]


// console.log(roundsData[prevRound]);
// const playedAllPrevGames = (playoffsGames[prevRound] && [...prevRoundGame1, ...prevRoundGame2].every(game => game.played)) || !roundsData[prevRound]

// const currentGameExists = playoffsGames[round] && playoffsGames[round][gameIndex]

// console.log(playedAllPrevGames, !currentGameExists, round);

// if (!currentGameExists && playedAllPrevGames)

function createTeamWrapers(gameWrapper, playoffsGames, round, gamesAmount, roundsData, allTeams, type) {

    const gameIndex = +gameWrapper.dataset.gameIndex
    const knockouts = +gameWrapper.dataset.knockouts
    const prevRound = `1/${gamesAmount*2}`

    let currentRoundGames = playoffsGames[round]
    const currentGames = currentRoundGames && currentRoundGames[gameIndex]

    if (!type, !roundsData[prevRound] && !currentGames) {
        const round1TeamPairs = []
        for (let i = 0; i < allTeams.length; i++) {
            let modifiedTeams
            let pair
            if (i === 0) {
                modifiedTeams = allTeams
                    pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                } else {
                    modifiedTeams = allTeams.slice(i, -i)
                    if (modifiedTeams.length > 0) {
                        pair = [modifiedTeams[0], modifiedTeams[modifiedTeams.length - 1]]
                    }
                }
            pair && round1TeamPairs.push(pair)
        }

        let  teams = round1TeamPairs[gameIndex-1]
        let games = []
        for (let i = 0; i < knockouts; i++) {
            if (!playoffsGames[round]) {
                playoffsGames[round] = {}
            }
            games.push(new Game(teams[0], teams[1]))
    
            playoffsGames[round][gameIndex] = games
            console.log(playoffsGames);
    
            localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
        }
    } 
    if (!type && currentGames) {
        currentGames.forEach((game, i) => {
            createGameElement(gameWrapper, game, i)
        })
    }

    if (currentGames && type) {
        const currentRoundGames = playoffsGames[round]

        const games1 = gameIndex-1 % 2 === 0 ? currentRoundGames[gameIndex] : currentRoundGames[gameIndex - 1]
        const games2 = gameIndex-1 % 2 === 0 ? currentRoundGames[gameIndex+1] : currentRoundGames[gameIndex]


        if (games1 && games2) {
            const allGamesPlayed = [...games1, ...games2].every(game => game.played)
    
            const nextRound = gamesAmount === 2 ? 'final' : `1/${gamesAmount/2}`
            const nextRoundGameIndex = Math.round(gameIndex/2)

            const winnerGame1 = getRoundWinner(allTeams, games1)
            const winnerGame2 = getRoundWinner(allTeams, games2)

            const nextRoundGames = playoffsGames[nextRound] && playoffsGames[nextRound][nextRoundGameIndex]


            const changedTeams = nextRoundGames && !nextRoundGames.some(game => (
                (game.homeTeam.team === winnerGame1.team || game.awayTeam.team === winnerGame1.team)
                &&
                (game.homeTeam.team === winnerGame2.team || game.awayTeam.team === winnerGame2.team)
            ))

            let nextRoundWrapper = document.querySelector(`.game-wrapper[data-round="${nextRound}"][data-game-index="${nextRoundGameIndex}"]`)

            if (allGamesPlayed) {
                if (!(playoffsGames[nextRound] && playoffsGames[nextRound][nextRoundGameIndex]) || changedTeams) {
                    let games = []
                    console.log(roundsData[nextRound].knockoutss);
                    for (let i = 0; i < roundsData[nextRound].knockouts; i++) {
                        if (!playoffsGames[nextRound]) {
                            playoffsGames[nextRound] = {}
                        }
                        games.push(new Game(winnerGame1, winnerGame2))
                
                        playoffsGames[nextRound][nextRoundGameIndex] = games
                        console.log(playoffsGames[nextRound][nextRoundGameIndex]);
                
                        localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))
                    }

                    nextRoundWrapper.innerHTML = ''
                    playoffsGames[nextRound][nextRoundGameIndex].forEach((game, i) => {
                        createGameElement(nextRoundWrapper,game, i)
                    })
                }
            }
        }
        
    }
}

function getRoundWinner(allTeams, round) {
    const alwaysWon = round.every(game => game.winner === round[0].winner)
    let winner

    if (alwaysWon) {
        winner = allTeams.find(team => team.team === round[0].winner)
    } else {
        let homeTeamGoalsSum = 0
        let awayTeamGoalsSum = 0

        round.forEach(game => {
            const homeTeamGoals = +game.homeTeam.goals
            const awayTeamGoals = +game.awayTeam.goals

            homeTeamGoalsSum+=homeTeamGoals
            awayTeamGoalsSum+=awayTeamGoals
        })

        if (homeTeamGoalsSum > awayTeamGoalsSum) {
            winner = allTeams.find(team => team.team ===  round[0].homeTeam.team)
        } else {
            winner = allTeams.find(team => team.team ===  round[0].awayTeam.team)
        }
    }

    return winner
}

function createGameElement(gameWrapper, game, i) {
    const gameEl = document.createElement('div')
    gameEl.classList.add('game')
    gameEl.dataset.knockoutIndex = i+1
    gameWrapper.append(gameEl)

    for (let team in game) {
        if (team === 'homeTeam' || team === 'awayTeam') {
            const teamWrapper = document.createElement('div')
            teamWrapper.classList.add('team')
            const label = document.createElement('label')
            const input = document.createElement('input')               
            input.type = 'number'
            input.classList.add('result-input')

            if (team === 'homeTeam') {
                teamWrapper.classList.add('home-team')
            } else {
                teamWrapper.classList.add('away-team')
            }
            input.dataset.team = game[team].team
            label.htmlFor = input.id
            label.textContent = game[team].team

            if (i > 0) {
                // label.style.display = 'none'
            }

            input.value = game.played ? game[team].goals : '' 
            teamWrapper.append(label, input)
            gameEl.append(teamWrapper) 
        }
    }
}