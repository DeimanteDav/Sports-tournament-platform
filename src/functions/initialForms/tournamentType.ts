import Playoffs, { playoffsInteface } from "../../classes/Playoffs.js"
import RegularSeason from "../../classes/RegularSeason.js"
import { SPORTS } from "../../config.js"
import { Container, SportDataInterface } from "../../types.js"
import generateTeams from "./generateTeams.js"

function tournamentType(container: Container, teamsAmount: number) {
    const formWrapper = document.createElement('div')
    formWrapper.classList.add('form-wrapper')
    const form = document.createElement('form')
    form.classList.add('form')

    const leagueTitleWrapper = document.createElement('div')
    leagueTitleWrapper.classList.add('title')

    const leagueWrapper = document.createElement('div')
    leagueWrapper.classList.add('form-control')
    const leagueText = document.createElement('p')
    leagueText.textContent = 'Regular Season'


    const regularSeasonData = new RegularSeason()
    const leagueSwitch = toggleSwitch(leagueSwitchHandler, leagueWrapper, regularSeasonData, teamsAmount)


    const playoffsTitleWrapper = document.createElement('div')
    playoffsTitleWrapper.classList.add('title')

    const playoffsWrapper = document.createElement('div')
    playoffsWrapper.classList.add('form-control')
    const playoffsText = document.createElement('p')
    playoffsText.textContent = 'Playoffs'


    const playoffsData = new Playoffs()
    const playoffsSwitch = toggleSwitch(playoffsSwitchHandler, playoffsWrapper, playoffsData, teamsAmount)

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'SUBMIT'

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const regularSeason = RegularSeason.getData()
        const playoffs = Playoffs.getData()

        if (regularSeason || playoffs) {
            formWrapper.remove()
            console.log('suveikia');

            generateTeams(container, {playoffs: playoffs && playoffsData, regularSeason: regularSeason && regularSeasonData})
        }
    })

    leagueTitleWrapper.prepend(leagueText, leagueSwitch)
    leagueWrapper.append(leagueTitleWrapper)

    playoffsTitleWrapper.prepend(playoffsText, playoffsSwitch)
    playoffsWrapper.append(playoffsTitleWrapper)

    form.append(leagueWrapper, playoffsWrapper, submitBtn)
    formWrapper.append(form)
    container.append(formWrapper)
}
export default tournamentType


function toggleSwitch(switchHandler: Function, wrapper: HTMLElement, data: Playoffs | RegularSeason, teamsAmount: number) {
    const sportData: SportDataInterface = JSON.parse(localStorage.getItem('sport-type') || '')

    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.classList.add('toggle')

    toggle.addEventListener('change', (e) => {
        const checkbox = e.target as HTMLInputElement
        switchHandler(checkbox.checked, wrapper, data, sportData, teamsAmount)
    })
    return toggle
}

function leagueSwitchHandler(checked: boolean, wrapper: HTMLElement, regularSeasonData: RegularSeason, sportData: SportDataInterface, teamsAmount: number, ) {
    if (checked) {
        regularSeasonData.sportType = sportData

        const infoWrapper = document.createElement('div')
        infoWrapper.id = 'league-info'
        infoWrapper.classList.add('games-info')
    
        const roundsAmountWrapper = document.createElement('div')
        roundsAmountWrapper.classList.add('selection-wrapper')
    
        const roundsLabel = document.createElement('label')
        roundsLabel.htmlFor = 'rounds-amount'
        roundsLabel.textContent = 'Rounds amount'
    
        const roundsAmountInput = document.createElement('input')
        roundsAmountInput.id = 'rounds-amount'
        roundsAmountInput.name = 'rounds-amount'
        roundsAmountInput.type = 'number'
        roundsAmountInput.min = '1'
        roundsAmountInput.max = '5'
        roundsAmountInput.value = '1'
        regularSeasonData.roundsAmount = 1
    
        roundsAmountInput.addEventListener('change', (e) => {
            const amount = (e.target as HTMLInputElement).value

            if (!amount) throw new Error('rounds amount is not given')

            regularSeasonData.roundsAmount = +amount
        })
    
        const relegationWrapper = document.createElement('div')
        relegationWrapper.classList.add('selection-wrapper')

        const relegationLabel = document.createElement('label')
        relegationLabel.htmlFor = 'relegation-amount'
        relegationLabel.textContent = 'Relegation'
    
        const relegationAmountInput = document.createElement('input')
        relegationAmountInput.id = 'relegation-amount'
        relegationAmountInput.type = 'number'
        relegationAmountInput.value = '0'
        relegationAmountInput.min = '0'
        relegationAmountInput.max = `${Math.round(teamsAmount/3)}`
    
        relegationAmountInput.addEventListener('change', (e) => {
            const amount = (e.target as HTMLInputElement).value
            if (!amount) {
                regularSeasonData.relegation = 0
            } else {
                regularSeasonData.relegation = +amount
            }
            console.log(amount, regularSeasonData);
        })

        // TODO: conditions

        roundsAmountWrapper.append(roundsLabel, roundsAmountInput)
        relegationWrapper.append(relegationLabel, relegationAmountInput)

        infoWrapper.append(roundsAmountWrapper,relegationWrapper)
        wrapper.append(infoWrapper)
    } else {
        const oldInfoWrapper = document.getElementById('league-info')
        oldInfoWrapper?.remove()
        
        RegularSeason.removeData()
    }
}

function playoffsSwitchHandler(checked: boolean, wrapper: HTMLElement, playoffsData: Playoffs, sportData: SportDataInterface, teamsAmount: number) {
    if (checked) {
        playoffsData.sportType = sportData

        const infoWrapper = document.createElement('div')
        infoWrapper.id = 'playoffs-info'
        infoWrapper.classList.add('games-info')

        const fightForThirdWrapper = document.createElement('div')
        fightForThirdWrapper.classList.add('selection-wrapper')
        const fightForThirdLabel = document.createElement('label')
        fightForThirdLabel.htmlFor = 'fight-for-third'
        fightForThirdLabel.textContent = 'Fight for 3rd place?'
        
        const fightForThirdSelect = document.createElement('select')
        fightForThirdSelect.id = 'fight-for-third'
        const fightForThirdOptions = ['No', 'Yes']

        fightForThirdOptions.forEach(option => {
            const optionElement = document.createElement('option')
            optionElement.textContent = option

            optionElement.value = option === 'Yes' ? JSON.stringify(true) : JSON.stringify(false)

            fightForThirdSelect.append(optionElement)
        })

        playoffsData.fightForThird = false
        fightForThirdSelect.setAttribute('disabled', 'true')


        const teamsAmountWrapper = document.createElement('div')
        teamsAmountWrapper.classList.add('selection-wrapper')

        const teamsAmountLabel = document.createElement('label')
        teamsAmountLabel.htmlFor = 'possible-amounts'
        teamsAmountLabel.textContent = 'How many teams play in Playoffs?'

        const possibleAmounts = []
        const relegationTeamsAmount = localStorage.getItem('relegation') ? +localStorage.getItem('relegation')! : 0

        teamsAmount = teamsAmount - Number(relegationTeamsAmount)
        let minAmount = 2

        for (let i = 0; i < teamsAmount; i++) {
            if (i === 0) {
                possibleAmounts.push(minAmount)
                minAmount = minAmount*2
            } else if (minAmount <= teamsAmount) {
                possibleAmounts.push(minAmount)
                minAmount = minAmount*2
            }
        }           

        const possibleAmountsSelect = document.createElement('select')
        possibleAmountsSelect.id = 'possible-amounts'

        for (let i = 0; i < possibleAmounts.length; i++) {
            const possibleAmount = possibleAmounts[i];
            const option = document.createElement('option')       

            option.textContent = JSON.stringify(possibleAmount)
            option.value = JSON.stringify(possibleAmount)

            possibleAmountsSelect.append(option)
        }

        fightForThirdWrapper.append(fightForThirdLabel, fightForThirdSelect)
        teamsAmountWrapper.append(teamsAmountLabel, possibleAmountsSelect)
    
        infoWrapper.append(fightForThirdWrapper, teamsAmountWrapper)


        generatePlayoffsData(infoWrapper, 2, playoffsData)

        fightForThirdSelect.addEventListener('change', (e) => {
            const value = JSON.parse((e.target as HTMLOptionElement).value)

            playoffsData.fightForThird = value
            generatePlayoffsData(infoWrapper, +possibleAmountsSelect.value, playoffsData)
        })


        possibleAmountsSelect.addEventListener('change', (e) => {
            const amount = Number((e.target as HTMLOptionElement).value)

            if (amount > 2) {
                fightForThirdSelect.removeAttribute('disabled')
            } else {
                fightForThirdSelect.setAttribute('disabled', 'true')
                playoffsData.fightForThird = false
            }

            generatePlayoffsData(infoWrapper, amount, playoffsData)
        })

        wrapper.append(infoWrapper)
    } else {
        const oldInfoWrapper = document.getElementById('playoffs-info')
        oldInfoWrapper?.remove()

        Playoffs.removeData()
    }
}


function generatePlayoffsData(wrapper: HTMLElement, teamsAmount: number, playoffsData: Playoffs) {
    playoffsData.teamsAmount = teamsAmount

    let roundGamesAmount = teamsAmount/2
    let prevRoundGamesAmount
    let roundsInfo = []
    
    for (let i = 0; i < teamsAmount/2; i++) {
        if (i > 0) {
            roundGamesAmount = roundGamesAmount/2
        }

        if (prevRoundGamesAmount !== roundGamesAmount) {
            roundGamesAmount >= 1 && roundsInfo.push(roundGamesAmount)
        }
        prevRoundGamesAmount = roundGamesAmount
    }
    playoffsData.roundsData = {}

    console.log(roundsInfo, playoffsData, 'alla');
    roundsInfo.forEach(gamesAmount => {
        const property = gamesAmount === 1 ? 'finals' : `1/${gamesAmount}`
        playoffsData.roundsData[property] = {
            gamesAmount: 0, knockouts: 0, bestOutOf: null
        }
        playoffsData.roundsData[property].gamesAmount = gamesAmount
        playoffsData.roundsData[property].knockouts = 1
        playoffsData.roundsData[property].bestOutOf = null
    })

    if (playoffsData.fightForThird) {
        playoffsData.roundsData['fightForThird'] = {
            gamesAmount: 1, knockouts: 1, bestOutOf: null
        }
    } else {
        delete playoffsData.roundsData['fightForThird']
    }

    playoffsData.roundsData = playoffsData.roundsData

    const prevRoundsInfoWrapper = document.getElementById('rounds-info-wrapper')
    prevRoundsInfoWrapper && prevRoundsInfoWrapper.remove()

    const roundsInfoWrapper = document.createElement('div')
    roundsInfoWrapper.id = 'rounds-info-wrapper'

    const roundsInfoTitle = document.createElement('p')
    roundsInfoTitle.textContent = playoffsData.sportType.id === SPORTS.football.id ? 'Knockouts single/double?' : 'Knockouts or Best out of number of games?'

    roundsInfoWrapper.append(roundsInfoTitle)

    console.log(playoffsData, playoffsData.roundsData);
    Object.entries(playoffsData.roundsData).forEach(([round, data]) => {
        console.log(round, data);
        if (round !== 'fightForThird') {
            const roundWrapper = document.createElement('div')
            const roundElement = document.createElement('span')
            roundElement.textContent = round
            
            const buttonsWrapper = document.createElement('div')
            buttonsWrapper.classList.add('btn-wrapper')
    
            const knockoutsWrapper = document.createElement('div')
            knockoutsWrapper.classList.add('btn-wrapper')
            knockoutsWrapper.id = `knockouts-${data.gamesAmount}`
    
            const singleKnockoutBtn = document.createElement('button')
            singleKnockoutBtn.type = 'button'
            singleKnockoutBtn.textContent = 'single'
            const doubleKnockoutBtn = document.createElement('button')
            doubleKnockoutBtn.type = 'button'
            doubleKnockoutBtn.textContent = 'double'
    
            singleKnockoutBtn.classList.add('clicked')
    
    
            singleKnockoutBtn.addEventListener('click', (e) => {
                const buttons = buttonsWrapper.querySelectorAll('button')
                buttons.forEach(button => {
                    button.classList.remove('clicked')
                })
                singleKnockoutBtn.classList.add('clicked')
    
                playoffsData.roundsData[round].knockouts = 1
                playoffsData.roundsData = playoffsData.roundsData
    
            })
    
            doubleKnockoutBtn.addEventListener('click', (e) => {
                const buttons = buttonsWrapper.querySelectorAll('button')
                buttons.forEach(button => {
                    button.classList.remove('clicked')
                })
    
                doubleKnockoutBtn.classList.add('clicked')
    
                playoffsData.roundsData[round].knockouts = 2
                playoffsData.roundsData = playoffsData.roundsData
            })
    
            knockoutsWrapper.append(singleKnockoutBtn, doubleKnockoutBtn)
            buttonsWrapper.append(knockoutsWrapper)
    
            if (playoffsData.sportType.id === SPORTS.basketball.id) {
                const gameTypesWrapper = document.createElement('div')
                const gameTypes = [
                    {type: 'Knockouts', id: `knockouts-${data.gamesAmount}`},
                    {type: 'Best out of n games', id: `best-out-of-${data.gamesAmount}`}
                ]
    
                gameTypes.forEach((gameType, i) => {
                    const gameTypeWrapper = document.createElement('div')
    
                    const label = document.createElement('label')
                    label.textContent = gameType.type
                    label.htmlFor = `game-type-${gameType.id}`
    
                    const radioInput = document.createElement('input')
                    radioInput.type = 'radio'
                    radioInput.name = `game-type-${round}`
                    radioInput.id = `game-type-${gameType.id}`
    
                    if (i === 0) {
                        radioInput.checked = true
                    }
    
                    radioInput.addEventListener('change', (e) => {
                        const selectedTypeBtnWrapper = document.querySelector(`#${gameType.id}`) as HTMLDivElement
    
                        const selectedTypeButtons = [...selectedTypeBtnWrapper.children]
    
                        selectedTypeButtons.forEach((btn, j) => {
                            if (j === 0) {
                                btn.classList.add('clicked')
                                if (gameType.id === 'knockouts') {
                                    playoffsData.roundsData[round].knockouts = 1 
                                    playoffsData.roundsData[round].bestOutOf = null
                                } else {
                                    playoffsData.roundsData[round].knockouts = null
                                    playoffsData.roundsData[round].bestOutOf = 2 
                                }
                                playoffsData.roundsData = playoffsData.roundsData
                            }
                            btn.removeAttribute('disabled')
                        })
    
                       const otherTypes = gameTypes.filter(otherGameType => otherGameType.id !== gameType.id)
    
                       otherTypes.forEach(otherType => {
                        const otherBtnWrapper = document.querySelector(`#${otherType.id}`) as HTMLDivElement
                        const otherButtons = [...otherBtnWrapper.children]
    
                        otherButtons.forEach(btn => {
                            btn.setAttribute('disabled', 'true')
                            btn.classList.remove('clicked')
                        });
                       })
                    })
    
                    gameTypeWrapper.append(radioInput, label)
                    gameTypesWrapper.append(gameTypeWrapper)
                })
    
                const bestOutOfWrapper = document.createElement('div')
                bestOutOfWrapper.style.marginLeft = '20px'
                bestOutOfWrapper.classList.add('btn-wrapper')
                bestOutOfWrapper.id = `best-out-of-${data.gamesAmount}`
    
                const amounts = [2, 3, 4]
                amounts.forEach(amount => {
                    const bestOutOfButton = document.createElement('button')
                    bestOutOfButton.type = 'button'
                    bestOutOfButton.textContent = `Best out of ${amount*2-1} games` 
                    bestOutOfButton.setAttribute('disabled', 'true')
    
                    bestOutOfButton.addEventListener('click', () => {
                        const buttons = buttonsWrapper.querySelectorAll('button')
                        buttons.forEach(button => {
                            button.classList.remove('clicked')
                        })
    
                        bestOutOfButton.classList.add('clicked')
    
                        playoffsData.roundsData[round].knockouts = null 
                        playoffsData.roundsData[round].bestOutOf = amount
                        playoffsData.roundsData = playoffsData.roundsData
    
                    })
    
                    bestOutOfWrapper.append(bestOutOfButton)
                })
    
                roundWrapper.append(gameTypesWrapper)
                buttonsWrapper.append(bestOutOfWrapper)
            }
            
            roundWrapper.prepend(roundElement)
            roundWrapper.append(buttonsWrapper)
            roundsInfoWrapper.append(roundWrapper)
        }
    })

    wrapper.append(roundsInfoWrapper)
}