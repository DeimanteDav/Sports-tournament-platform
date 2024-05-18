import { Container, SPORTS } from "../../config.js"
import generateTeams from "./generateTeams.js"

function tournamentType(container: Container, teamsAmount: number) {
    const sportId = localStorage.getItem('sport') && JSON.parse(localStorage.getItem('sport') || '').id
    const form = document.createElement('form')
    form.classList.add('form')

    const leagueTitleWrapper = document.createElement('div')
    leagueTitleWrapper.classList.add('title')

    const leagueWrapper = document.createElement('div')
    leagueWrapper.classList.add('form-control')
    const leagueText = document.createElement('p')
    leagueText.textContent = 'Regular Season'

    const leagueSwitch = toggleSwitch(leagueSwitchHandler, leagueWrapper, [teamsAmount])


    const playoffsTitleWrapper = document.createElement('div')
    playoffsTitleWrapper.classList.add('title')

    const playoffsWrapper = document.createElement('div')
    playoffsWrapper.classList.add('form-control')
    const playoffsText = document.createElement('p')
    playoffsText.textContent = 'Playoffs'

    const playoffsSwitch = toggleSwitch(playoffsSwitchHadler, playoffsWrapper, [teamsAmount, sportId])


    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'SUBMIT'

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const leagueData = localStorage.getItem('rounds-amount')
        const playoffsData = localStorage.getItem('playoffs-data')
        
        if (leagueData || playoffsData) {
            form.remove()
            generateTeams(container)
        }
    })

    leagueTitleWrapper.prepend(leagueText, leagueSwitch)
    leagueWrapper.append(leagueTitleWrapper)

    playoffsTitleWrapper.prepend(playoffsText, playoffsSwitch)
    playoffsWrapper.append(playoffsTitleWrapper)

    form.append(leagueWrapper, playoffsWrapper, submitBtn)
    container.append(form)
}
export default tournamentType


function toggleSwitch(switchHandler: Function, wrapper: HTMLElement, props: number[]) {
    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.classList.add('toggle')

    toggle.addEventListener('change', (e) => {
        const checkbox = e.target as HTMLInputElement
        switchHandler(checkbox.checked, wrapper, props)
    })
    return toggle
}

function leagueSwitchHandler(checked: boolean, wrapper: HTMLElement, teamsAmount: number) {
    if (checked) {
        const infoWrapper = document.createElement('div')
        infoWrapper.id = 'league-info'
        infoWrapper.classList.add('games-info')
    
        const roundsAmountWrapper = document.createElement('div')
    
        const roundsText = document.createElement('p')
        roundsText.textContent = 'Rounds amount'
    
        const roundsAmountInput = document.createElement('input')
        roundsAmountInput.name = 'rounds-amount'
        roundsAmountInput.type = 'number'
        roundsAmountInput.min = '1'
        roundsAmountInput.max = '5'
        roundsAmountInput.value = '1'
        localStorage.setItem('rounds-amount', '1')
    
        roundsAmountInput.addEventListener('change', (e) => {
            const amount = (e.target as HTMLInputElement).value
            setLocalStorage('rounds-amount', amount)
        })
    
        const relegationWrapper = document.createElement('relegation')
    
        const relegationText = document.createElement('p')
        relegationText.textContent = 'Relegation'
    
        const relegationAmountInput = document.createElement('input')
        relegationAmountInput.type = 'number'
        relegationAmountInput.value = '0'
        relegationAmountInput.min = '0'
        relegationAmountInput.max = `${Math.round(teamsAmount/3)}`
    
        relegationAmountInput.addEventListener('change', (e) => {
            const amount = (e.target as HTMLInputElement).value
            setLocalStorage('relegation', amount)
        })

        // TODO: conditions

        roundsAmountWrapper.append(roundsText, roundsAmountInput)
        relegationWrapper.append(relegationText, relegationAmountInput)

        infoWrapper.append(roundsAmountWrapper,relegationWrapper)
        wrapper.append(infoWrapper)
    } else {
        const oldInfoWrapper = document.getElementById('league-info')
        oldInfoWrapper?.remove()
        localStorage.removeItem('rounds-amount')
        localStorage.removeItem('relegations')
        localStorage.removeItem('conditions')
    }
}

function playoffsSwitchHadler(checked: boolean, wrapper: HTMLElement, teamsAmount: number, sportId: number) {
    if (checked) {
        const playoffsData = {
            teamsAmount: 0,
            roundsData: {}
        }

        const infoWrapper = document.createElement('div')
        infoWrapper.id = 'playoffs-info'
        infoWrapper.classList.add('games-info')

        const teamsAmountWrapper = document.createElement('div')

        const teamsAmountText = document.createElement('p')
        teamsAmountText.textContent = 'How many teams play in Playoffs?'

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

        for (let i = 0; i < possibleAmounts.length; i++) {
            const possibleAmount = possibleAmounts[i];
            const option = document.createElement('option')       

            option.textContent = possibleAmount.toString()
            option.value = possibleAmount.toString()

            possibleAmountsSelect.append(option)
        }

        teamsAmountWrapper.append(teamsAmountText, possibleAmountsSelect)
    
        infoWrapper.append(teamsAmountWrapper)


        generatePlayoffsData(infoWrapper, 2, playoffsData, sportId)

        possibleAmountsSelect.addEventListener('change', (e) => {
            const amount = Number((e.target as HTMLOptionElement).value)

            generatePlayoffsData(infoWrapper, amount, playoffsData, sportId)
        })

        wrapper.append(infoWrapper)
    } else {
        const oldInfoWrapper = document.getElementById('playoffs-info')
        oldInfoWrapper?.remove()
        localStorage.removeItem('playoffs-data')
    }
}


// FIXME: roundsData ??????
function generatePlayoffsData(wrapper: HTMLElement, teamsAmount: number, playoffsData: {teamsAmount: number, roundsData: {[k: string]: any}}, sportId: number) {
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

    roundsInfo.forEach(gamesAmount => {
        const property = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`

        playoffsData.roundsData[property] = {}
        playoffsData.roundsData[property].gamesAmount = gamesAmount

        playoffsData.roundsData[property].knockouts = 1
        playoffsData.roundsData[property].bestOutOf = null
    })
    localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))

    const prevRoundsInfoWrapper = document.getElementById('rounds-info-wrapper')
    prevRoundsInfoWrapper && prevRoundsInfoWrapper.remove()

    const roundsInfoWrapper = document.createElement('div')
    roundsInfoWrapper.id = 'rounds-info-wrapper'

    const roundsInfoTitle = document.createElement('p')
    roundsInfoTitle.textContent = sportId === SPORTS.football.id ?'Knockouts single/double?' : 'Knockouts or Best out of number of games?'

    roundsInfoWrapper.append(roundsInfoTitle)

    Object.entries(playoffsData.roundsData).forEach(([round, data]) => {
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
            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
        })

        doubleKnockoutBtn.addEventListener('click', (e) => {
            const buttons = buttonsWrapper.querySelectorAll('button')
            buttons.forEach(button => {
                button.classList.remove('clicked')
            })

            doubleKnockoutBtn.classList.add('clicked')

            playoffsData.roundsData[round].knockouts = 2

            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
        })

        knockoutsWrapper.append(singleKnockoutBtn, doubleKnockoutBtn)
        buttonsWrapper.append(knockoutsWrapper)

        if (sportId === SPORTS.basketball.id) {
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
                    console.log(radioInput);
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
                            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
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
        
                    localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
                })

                bestOutOfWrapper.append(bestOutOfButton)
            })

            roundWrapper.append(gameTypesWrapper)
            buttonsWrapper.append(bestOutOfWrapper)
        }
        
        roundWrapper.prepend(roundElement)
        roundWrapper.append(buttonsWrapper)
        roundsInfoWrapper.append(roundWrapper)
    })

    wrapper.append(roundsInfoWrapper)
}


function setLocalStorage(key: string, value: string) {
    if (value) {
        localStorage.setItem(key, value)
    } else {
        localStorage.removeItem(key)
    }
}