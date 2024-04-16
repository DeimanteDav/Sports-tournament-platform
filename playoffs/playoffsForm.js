import Game from "../classes/Game.js"
import updateGameData from "../functions/updateGameData.js"

export default function playoffsForm(container, gamesData, playoffTeams, teams) {
    let prevForm = document.querySelector('.playoffs-table')
    let form

    if (prevForm) {
        prevForm.innerHTML = ''
        form = prevForm
    } else {
        form = document.createElement('form')
        form.classList.add('playoffs-table')
        container.append(form)
    }

    const {roundsData, teamsAmount} = gamesData

    let teamsChanged = false
    if (playoffTeams !== teams) {
        playoffTeams = teams.slice(0, teamsAmount)
        localStorage.setItem('playoffs-teams-data', JSON.stringify(playoffTeams))
        teamsChanged = true
    }

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

    const rowsAmount = Object.keys(roundsData).length
    form.style.gridTemplateColumns = `repeat(${rowsAmount}, 1fr)`
    form.style.gridAutoFlow = 'column'
    form.style.gap = '80px'

    const playoffsGames = localStorage.getItem('playoffs-games-data') ? JSON.parse(localStorage.getItem('playoffs-games-data')) : {}

    Object.entries(sortedData).forEach(([round, data], index) => {
        const {gamesAmount, knockouts} = data
        let gameIndex = 0
        const roundWrapper = document.createElement('div')
        roundWrapper.classList.add('round-wrapper')

        form.append(roundWrapper)

        if (gamesAmount > 1) {
            const pairsAmount = gamesAmount/2
            for (let i = 0; i < pairsAmount; i++) {
                const pairWrapper = document.createElement('div')
                pairWrapper.classList.add('pair-wrapper')
                pairWrapper.append(round)
                roundWrapper.append(pairWrapper)

                for (let j = 0; j < 2; j++) {
                    const gameWrapper = document.createElement('div')                    
                    gameWrapper.classList.add('game-wrapper')
                    pairWrapper.append(gameWrapper)

                    const sortedTeams = [...playoffTeams].sort((a, b) => a.currentPlace - b.currentPlace)

                    gameWrapper.dataset.gameIndex = gameIndex+1
                    gameWrapper.dataset.knockouts = knockouts
                    gameWrapper.dataset.round = round
                    console.log(sortedTeams);
                    if (gameIndex < pairsAmount*2 ) {
                        createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundsData[round], playoffTeams, {teamsChanged})

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

            roundWrapper.append(gameWrapper)

            createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundsData[round], playoffTeams, {teamsChanged})
        }
    })


    form.addEventListener('change', (e) => {
        console.log(e);
        const gameEl = e.target.parentElement.parentElement
        const gameWrapper = gameEl.parentElement

        const gameIndex = +gameWrapper.dataset.gameIndex
        const knockoutIndex = +gameEl.dataset.knockoutIndex

        const currentRound = gameWrapper.dataset.round
        const teamsGames = playoffsGames[currentRound][gameIndex]

        const currentGame = teamsGames[knockoutIndex-1]

        updateGameData(gameEl, currentGame)
        localStorage.setItem('playoffs-games-data', JSON.stringify(playoffsGames))

        const allGamesPlayed = teamsGames.every(game => game.played)

        const teams = JSON.parse(localStorage.getItem('playoffs-teams-data'))


        if (allGamesPlayed) {
            createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundsData[currentRound], gameEl, playoffTeams, {update: true})
        }
    })
}


function createTeamWrapers(gameWrapper, playoffsGames, roundsData, roundData, allTeams, params = {}) {
    const {teamsChanged, update} = params
    const {gamesAmount, knockouts} = roundData
    console.log(teamsChanged);

    const round = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`
    const prevRound = `1/${gamesAmount*2}`
    const gameIndex = +gameWrapper.dataset.gameIndex

    let currentRoundGames = playoffsGames[round]
    const currentGames = currentRoundGames && currentRoundGames[gameIndex]

    console.log(teamsChanged);
    if ((!roundsData[prevRound] && !currentGames) || teamsChanged) {
        const round1TeamPairs = []
        console.log(teamsChanged, 'pakeista');

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
    if (!update && currentGames) {
        currentGames.forEach((game, i) => {
            createGameElement(gameWrapper, game, i)
        })
        console.log(update);
    }


    if (currentGames && update) {
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

            const nextRoundWrapper = document.querySelector(
              `.game-wrapper[data-round="${nextRound}"][data-game-index="${nextRoundGameIndex}"]`
            );

            // game index blogai apskaiciuojamas
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