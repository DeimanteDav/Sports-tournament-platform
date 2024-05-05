import getInbetweenTeamsGames from "./getInbetweenTeamsGames.js";

export default function checkTeamPosition(teams, games) {
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
        
        for (let j = i+1; j < teams.length; j++) {
            const otherTeam = teams[j];


            const canSucceed = otherTeam.maxPotentialPoints > team.points
            const equalPoints = otherTeam.maxPotentialPoints === team.points

            if (team.gamesLeft === 0) {
                team.minPlace = team.currentPlace
                team.maxPlace = team.currentPlace
            } else if (canSucceed ) {
                team.minPlace += 1
                otherTeam.maxPlace -= 1
            } else if (equalPoints) {
                console.log('suveikia', team, otherTeam);
                const inbetweenGames = getInbetweenTeamsGames([otherTeam, team], games)

                let otherTeamGamesWon = 0
            
                inbetweenGames.forEach(game => {
                    const teamGameData = game.homeTeam.team === team.team ? game.homeTeam : game.awayTeam
                    const otherTeamGameData = game.homeTeam.team === otherTeam.team ? game.homeTeam : game.awayTeam

                    if (otherTeamGameData.goals > teamGameData.goals) {
                        otherTeamGamesWon++
                    }
                })

                if (otherTeamGamesWon > roundsAmount/2) {
                    team.minPlace += 1
                    otherTeam.maxPlace -=1
                } else {
                    // team.minPlace
                }
            }
           

            // const canSucceed = otherTeam.maxPotentialPoints > team.points
            // const equalPoints = otherTeam.maxPotentialPoints === team.points
            // if (canSucceed) {
            //     team.minPlace += 1
            //     otherTeam.maxPlace -= 1
            // } else if (equalPoints) {
            //     console.log('suveikia', team, otherTeam);
            //     const inbetweenGames = getInbetweenTeamsGames([otherTeam, team], games)
            //     let otherTeamGamesWon = 0
            
            //     inbetweenGames.forEach(game => {
            //         const teamGameData = game.homeTeam.team === team.team ? game.homeTeam : game.awayTeam
            //         const otherTeamGameData = game.homeTeam.team === otherTeam.team ? game.homeTeam : game.awayTeam

            //         if (otherTeamGameData.goals > teamGameData.goals) {
            //             otherTeamGamesWon++
            //         }
            //     })

            //     if (otherTeamGamesWon > roundsAmount/2) {
            //         team.minPlace += 1
            //         otherTeam.maxPlace -=1
            //     } else {
            //         // team.minPlace
            //     }
            // }
        }    
    }

    // patikrtinti ar suzaidusios visus zaidimus tarpusavy
    // jei suzaidusios naudoti maxpotentialPoints
    // jei nesuzaidusios tikrinti tas komandas kartu ir prideti kad rast max min place
}

