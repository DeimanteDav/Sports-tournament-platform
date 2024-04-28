import { DRAW_POINTS, WIN_POINTS } from "./config.js"
import { createModernTable, createOldTable } from "./functions/table.js"
import getInbetweenTeamsGames from "./functions/getInbetweenTeamsGames.js"
import sortTeams from "./functions/sortTeams.js"
import compareGamesData from "./functions/compareGamesData.js"
import { teamsAmountForm } from "./functions/forms.js"
import updateGameData from "./functions/updateGameData.js"
import playoffsForm from "./playoffs/playoffsForm.js"
import resetDataBtn from "./components/resetDataBtn.js"
import accordion from "./components/accordion.js"

// FUTBOLO IR KREPSINIO
// Jei krepsinio, tai skirsis: 
    // taskai;
    // lygiuju nera;
    // points: WIN 2, LOSS 1, TECHNINIS PRALAIMEJIMAS 0 (pazymet, kad neatvyko i rungtynes 0-20 taskai, kuriuos imeta);
    // Laimejimu procentas;
    // tasku neatvaizduoja, bet imesti taskai 
    // OT (overtime points) 


// SORTINTI:
    // 1. taskai (ne imesti)
    // 2. laimejimu procentas;
    // TIE BREAKS: 
    // 3. kas daugiau laimejo tarpusavio zaidimuose
    // 4. didesnis santykis imestu ir praleistu tasku tarp VISU zaidimu (+/-)
    // 5. daugiau imestu tasku tarp VISU zaidimu

    // jei tie break neissiaiskina, tai kartoti breakus tarp likusiu komandu nuo 3. punko TARPUSAVY

// POINTS imesti ir OVERTIME POINTS imesti atskirai rasos ir tie breakuose points skaicuojas, o laimejimuose TOTAL 


// ADD CONDITION:
// PATSS IRASAI VISKA
// tEIGIAMAS NEIGIAMAS
// PATENka i europos lyga aukstesne / zemesne NUO KELINTOS IKI KELINTA

// Prie games round, RATAI
// Pervadinti rounds i ratus kazkaip angliskai


const container = document.querySelector('.container')

// Ar kova del 3 vietos yra

// Daugiau lenteliu jei pvz.: 16komandu i 4 grupes.
// kiek teamsu iseina i kita etapa PASIRINKTI.

// rungtyniu nr prideti



function getLocalStorageData(container) {
    const teamsData = localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data')) : null
    const gamesData = localStorage.getItem('league-games-data') ? JSON.parse(localStorage.getItem('league-games-data')) : null

    const playoffsTeamsData = localStorage.getItem('playoffs-teams-data') ? JSON.parse(localStorage.getItem('playoffs-teams-data')) : null
    const playoffGamesData = JSON.parse(localStorage.getItem('playoffs-data'))

    if (gamesData || playoffGamesData) {
        resetDataBtn(container)
        if (gamesData && playoffGamesData) {
            tournamentForm(container, gamesData, teamsData)
            changeTable(container, teamsData, gamesData)
    
            playoffsForm(container, playoffGamesData, playoffsTeamsData, teamsData)
        } else if (gamesData) {
            tournamentForm(container, gamesData, teamsData)
            changeTable(container, teamsData, gamesData)
        } else if (playoffGamesData) {
            playoffsForm(container, playoffGamesData, playoffsTeamsData)
        }
    } else {
        teamsAmountForm(container)
    }
}
getLocalStorageData(container)


// faila pasidaryti
export function tournamentForm(container, games, teams) {
    const gamesForm = document.createElement('form')
    gamesForm.id = 'games-form'

    const roundsAmount = Number(localStorage.getItem('rounds-amount'))

    for (let i = 0; i < roundsAmount; i++) {
        const btnText = `Round ${i+1}`
        const roundGames = games.filter(game => game.round === i+1)
        const innerRounds = [...new Set(roundGames.map(game => game.roundNr))]

        accordion(gamesForm, roundGames, innerRounds, btnText)
        // const accordionWrapper = accordion(accordiontText, 'block')
        // const panel = accordionWrapper.querySelector('.panel')

        // accordion(gamesForm, games, innerRounds, round)


        // for (let j = 0; j < games.length/(roundsAmount*5); j++) {
        //     const innerAccordionWrapper = accordion(`Round ${j+1}`, 'flex', 'round')
        //     innerAccordionWrapper.style.margin = '0 20px'
        //     const innerPanel = innerAccordionWrapper.querySelector('.panel')

        //     for (let m = 0; m < games.length; m++) {
        //         const game = games[m];
        //         const gameWrapper = document.createElement('div')
        //         gameWrapper.classList.add('game-wrapper')
        //         const gameNumber = document.createElement('p')

        //         const gameEl = document.createElement('div')
        //         gameEl.classList.add('game')

                
        //         game.played && gameWrapper.classList.add('played')
                
        //         gameEl.dataset.gameId = game.id
        //         gameNumber.textContent = `${game.id}.`
                
        //         for (let team in game) {
        //             if (team == 'homeTeam' || team === 'awayTeam') {
        //                 const teamWrapper = document.createElement('div')
        //                 teamWrapper.classList.add('team')
            
        //                 if (team === 'homeTeam') {
        //                     teamWrapper.classList.add('home-team')
        //                 } else {
        //                     teamWrapper.classList.add('away-team')
        //                 }
            
        //                 const label = document.createElement('label')
        //                 const input = document.createElement('input')  

        //                 input.type = 'number'
        //                 input.id = `${game.id}-${game[team].team}`
        //                 input.dataset.team = game[team].team
        //                 label.htmlFor = input.id
        //                 label.textContent = game[team].team
        //                 input.classList.add('result-input')
        //                 input.value = game.played ? game[team].goals : ''           
                        
        //                 teamWrapper.append(label, input)

        //                 gameEl.append(teamWrapper) 
        //                 gameWrapper.append(gameEl)
        //             }
        //         }
        //         if (j === Math.floor(m/5)) {
        //             innerPanel.append(gameWrapper)
        //         }
        //     }

        //     panel.append(innerAccordionWrapper)
        // }

        // gamesForm.append(accordionWrapper)

    }

    gamesForm.addEventListener('change', (e) => {
        console.log(e);
        const gameEl = e.target.parentElement.parentElement
        const gameId = +gameEl.dataset.gameId
        const currentGame = games.find(game => game.id === gameId)
        
        updateGameData(gameEl, currentGame)
        localStorage.setItem('league-games-data', JSON.stringify(games))

        updateTeamsData(games, teams)
    })

    const changeTableBtn = document.createElement('button')
    changeTableBtn.type = 'button'
    changeTableBtn.textContent = 'Change Table View'

    changeTableBtn.addEventListener('click', (e) => {
        const prevTableType = localStorage.getItem('table-type')

        if (prevTableType === 'modern' || !prevTableType) {
            localStorage.setItem('table-type', 'old')
            changeTable(container, teams, games)
        } else {
            localStorage.setItem('table-type', 'modern')
            changeTable(container, teams, games)
        }
    })

    const generateScoresBtn = document.createElement('button')
    generateScoresBtn.type = 'button'
    generateScoresBtn.textContent = 'Generate Scores'

    generateScoresBtn.addEventListener('click', (e) => {
        const scoresEl = [...gamesForm.querySelectorAll('.result-input')]
        
        
        scoresEl.forEach(element => {
            const gameEl = element.parentElement.parentElement
            const randomScore = Math.floor(Math.random() * 30)
            element.value = randomScore

            const currentGame = games[gameEl.dataset.gameId-1]
            updateGameData(gameEl, currentGame)
            localStorage.setItem('league-games-data', JSON.stringify(games))

            updateTeamsData(games, teams)
        });
        

    })



    // gamesForm.after(generateScoresBtn, changeTableBtn)
    container.append(gamesForm, generateScoresBtn, changeTableBtn)
    changeTable(container, teams, games)
}

function updateTeamsData(games, teams) {
    teams.forEach(team => {
        for (const [key, value] of Object.entries(team)) {
            if (key !== 'team' || key !== 'totalGames') {
                if (Number(value)) {
                    team[key] = 0
                }
                if (typeof value === 'boolean') {
                    team[key] = false
                }
            }
        }
    })
    
    games.forEach(game => {
        const gameHomeTeam = game.homeTeam
        const gameAwayTeam = game.awayTeam
        
        const homeTeamData = teams.find(team => team.team === gameHomeTeam.team)
        const awayTeamData = teams.find(team => team.team === gameAwayTeam.team)

        const totalGames = Number(localStorage.getItem('total-games'))
        
        homeTeamData.totalGames = totalGames
        awayTeamData.totalGames = totalGames

        // homeTeamData.setGamesLeft()
        // awayTeamData.setGamesLeft()

        // homeTeamData.setPotentialPoints(WIN_POINTS)
        // awayTeamData.setPotentialPoints(WIN_POINTS)

        if (game.played) {
            const homeTeamScored = gameHomeTeam.goals
            const awayTeamScored = gameAwayTeam.goals
   
            homeTeamData.playedGames++
            awayTeamData.playedGames++
    
            homeTeamData.goals += homeTeamScored
            awayTeamData.goals += awayTeamScored
            awayTeamData.awayGoals += awayTeamScored
    
    
            homeTeamData.goalsMissed += awayTeamScored
            awayTeamData.goalsMissed += homeTeamScored
        
            homeTeamData.goalDifference = homeTeamData.goals - homeTeamData.goalsMissed
            awayTeamData.goalDifference = awayTeamData.goals - awayTeamData.goalsMissed
    
            if (homeTeamScored > awayTeamScored) {
                homeTeamData.wins++
                awayTeamData.losses++
            } else if (homeTeamScored < awayTeamScored) {
                homeTeamData.losses++
                awayTeamData.wins++
                awayTeamData.awayWins++
            } else if (homeTeamScored === awayTeamScored) {
                homeTeamData.draws++
                awayTeamData.draws++
            }
            homeTeamData.points = homeTeamData.wins*WIN_POINTS + homeTeamData.draws*DRAW_POINTS
            awayTeamData.points = awayTeamData.wins*WIN_POINTS + awayTeamData.draws*DRAW_POINTS
        }

        homeTeamData.gamesLeft = homeTeamData.totalGames - homeTeamData.playedGames
        awayTeamData.gamesLeft = awayTeamData.totalGames - awayTeamData.playedGames

        homeTeamData.potentialPoints = homeTeamData.gamesLeft*WIN_POINTS
        awayTeamData.potentialPoints = awayTeamData.gamesLeft*WIN_POINTS

        homeTeamData.maxPotentialPoints = homeTeamData.potentialPoints + homeTeamData.points
        awayTeamData.maxPotentialPoints = awayTeamData.potentialPoints + awayTeamData.points
    })

    changeTable(container, teams, games)


    const playoffsTeamsData = JSON.parse(localStorage.getItem('playoffs-teams-data'))
    const playoffGamesData = JSON.parse(localStorage.getItem('playoffs-data'))

    if (playoffGamesData) {
        const teamsToPlayoffs = teams.slice(0, playoffGamesData.teamsAmount)

        let leagueTableUpdated = !teamsToPlayoffs.every((team, i) => Object.keys(team).every(p => team[p] === playoffsTeamsData[i][p]));
 
        localStorage.setItem('playoffs-teams-data', JSON.stringify(teamsToPlayoffs))

        if (leagueTableUpdated) {
            playoffsForm(container, playoffGamesData, teamsToPlayoffs, {leagueTableUpdated})
        }
    }

    localStorage.setItem('teams-data', JSON.stringify(teams))
}


export function changeTable(container, teams, games) {
    const sortedTeams = sortTeams(teams, games, {compareBetweenGames: true})

    sortedTeams.forEach((sortedTeam, i) => {
        sortedTeam.currentPlace = i + 1
        if (games.some(game => game.played)) {
            sortedTeam.maxPlace = i + 1
            sortedTeam.minPlace = i + 1
        }
    })

    if (games.some(game => game.played)) {
        checkTeamPosition(sortedTeams, games)
    }

    /*/ jei lygus taskai
        TARPUSAVIO varzybose
        - jei zaide kartu tai kuris surinko  tasku daugiau
        - ivarciu santykis tarp komandu daugiau
            A, B (1:0) 2, 0
            B, C (1:0) 2, 1    
            C, A (1:0) 1, 0     
        - kas imuse daugiau ivarciu 

        VISUOSE zaidimuose
        - ivarciu skirtumas
        - daugiau ivarciu
        - daugiau away goals imuse (galima away goals i team isirasyti)
        - daugiau laimejimu
        - daugiau away laimejimu
    /*/

    let prevTableWrapper = document.querySelector('.table-wrapper')
    let tableWrapper
    
    if (prevTableWrapper) {
        prevTableWrapper.innerHTML = ''
        tableWrapper = prevTableWrapper
    } else {
        tableWrapper = document.createElement('div')
        tableWrapper.classList.add('table-wrapper')
        container.append(tableWrapper)
    }

    const tableType = localStorage.getItem('table-type')

    let table
    const comparingTeams = JSON.parse(localStorage.getItem('comparing-teams'))

    if (tableType === 'old') {
        table = createOldTable(tableWrapper, teams, games, {comparinsonBtn: true})
    } else {
        table = createModernTable(tableWrapper, sortedTeams, games, {comparinsonBtn: true, position: true})
    }
    tableWrapper.prepend(table)

    if (comparingTeams?.length > 0) {
        const updatedTeams = comparingTeams.map(oldTeam => {
            const updatedTeam = teams.find(team => team.team === oldTeam.team)

            return updatedTeam
        })
        localStorage.setItem('comparing-teams', JSON.stringify(updatedTeams))

        tableWrapper.append(compareTeamsTable(tableWrapper, updatedTeams, games, tableType))
    }
}

function checkTeamPosition(teams, games) {
    // KURIOS KOMANDOS ISKRENTA
    // KURIOS I EROPOS CEMPTIONATA ISEINA

    // paikrint kiekviena komanda ar ja gali aplenkti points, maxpotential
    // maxPoints < points, komandą negali aplnekti
    // maxPoints > points, komandą gali aplenekti

    // maxPoints = points, ar ta komanda su kitom suzaidusios DAUGIAU NEI PUSE tarpusavy.
    // Ar ta komanda surinkusi daugiau nei puse tasku tarpusavy, tai Uzsitikrinusi vieta ir nenukris
    // Jei surinkusi komanda puse ar maziau tai neuzsitikrinusi savo vietos
    
    // Jei daugiau nei dvi ar daugiau su maxPotential = points, tai tikrinti: 1.ar tos dvi su maxpoints suzaidusios viskaa tarpusavy tai tada  KOmanda minPlace nukrent
    const roundsAmount = localStorage.getItem('rounds-amount')

    for (let i = 0; i < teams.length; i++) {
        const team = teams[i];

        for (let j = i + 1; j < teams.length; j++) {
            const otherTeam = teams[j];

            const canSucceed = otherTeam.maxPotentialPoints > team.points
            const equalPoints = otherTeam.maxPotentialPoints === team.points

            if (canSucceed) {
                team.minPlace += 1
                otherTeam.maxPlace -= 1
            } else if (equalPoints) {
                const inbetweenGames = getInbetweenTeamsGames([otherTeam, team], games)

            
                const otherTeamGamesWon = inbetweenGames.filter(game => {
                    const teamGameData = game.homeTeam.team === team.team ? game.homeTeam : game.awayTeam
                    const otherTeamGameData = game.homeTeam.team === otherTeam.team ? game.homeTeam : game.awayTeam

                    if (otherTeamGameData.goals > teamGameData.goals) {
                        return game
                    }
                })

                if (otherTeamGamesWon.length > roundsAmount/2) {
                    team.minPlace += 1
                    otherTeam.maxPlace -=1
                } else {
                    // team.minPlace
                }
            }
        }    

    }

    // patikrtinti ar suzaidusios visus zaidimus tarpusavy
    // jei suzaidusios naudoti maxpotentialPoints
    // jei nesuzaidusios tikrinti tas komandas kartu ir prideti
    // kad rast max min place
}

function getTeamGames(team, games, params = {}) {
    const {allGames} = params
    const teamGames = games.filter(game => {
        if (game.homeTeam.team === team.team || game.awayTeam.team === team.team) {
            if (allGames) {
                return game
            } else {
                if (game.played) {
                    return game
                }
            }
        }
    })
    
    return teamGames
}

export function compareTeamsTable(wrapper, teams, games, tableType) {
    const teamsGamesDataObject = compareGamesData(teams, games)

    const teamsData = Object.entries(teamsGamesDataObject).map(([team, stats]) => ({
        team,
        ...stats
    }));
    const sortedTeams = sortTeams(teamsData)

    let updatedTeams
    let table

    if (sortedTeams.length > 0) {
        updatedTeams = sortedTeams
    } else if (teams.length === 1) {
        const team = {...teams[0]}
        for (const [key, value] of Object.entries(team)) {
            if (key !== 'team') {
                if (Number(value)) {
                    team[key] = 0
                }
            }
        }
        
        updatedTeams = [team]
    }

    if (tableType === 'old') {
        table = createOldTable(wrapper, updatedTeams, games)
    } else {
        table = createModernTable(wrapper, updatedTeams, games)
    }
    table.id = 'comparing-table'

    return table
}


