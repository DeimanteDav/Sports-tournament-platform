import toggleSwitch from "../components/toggleSwitch.js"
import { TEAM_NAMES } from "../config.js"
import generateTeams from "./generate.js"

export function teamsAmountForm(container) {
    localStorage.clear()
    const form = document.createElement('form')
    form.classList.add('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many teams in tournament?'
    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 2
    input.max = 40

    wrapper.append(text, input)
    
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    form.append(wrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = e.target.amount.value
    
        if (amount) {
            form.remove()
            teamNamesForm(container, Number(amount))
        }
    })
}

export function teamNamesForm(container, teamsAmount) {
    const form = document.createElement('form')
    form.classList.add('form')

    const text = document.createElement('p')
    text.textContent = `Set Teams' names`

    const namesWrapper = document.createElement('div')
    namesWrapper.classList.add('inputs')


    const generateWrapper = document.createElement('div')
    generateWrapper.classList.add('select-form')

    const select = document.createElement('select')
    const options = [
        {
            title: 'Alphabetized',
            value: 1
        }, 
        {
            title: 'Numbered',
            value: 2,
        },
        {
            title: 'Animals',
            value: 3,
        }
    ]


    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionElement = document.createElement('option')
        optionElement.textContent = option.title
        optionElement.value = option.value
        optionElement.id = `generate-names-${option.value}`

        select.append(optionElement)
    }

    const generateNamesBtn = document.createElement('button')
    generateNamesBtn.type = 'button'
    generateNamesBtn.textContent = 'Generate'

    generateWrapper.append(select, generateNamesBtn)

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    for (let i = 0; i < teamsAmount; i++) {
        const div = document.createElement('div')
        const number = document.createElement('span')
        number.textContent = `${i+1}.`
        const input = document.createElement('input')
        input.type = 'text'
        input.required = true

        div.append(number, input)
        namesWrapper.append(div)
    }


    form.append(text, generateWrapper, namesWrapper, submitBtn)
    container.append(form)

    // select.addEventListener('change', (e) => {
    //     const allOptions = [...select.children]
    //     allOptions.forEach(option => {
    //         option.classList.remove('selected')
    //     })
    //     const selectedOption = document.getElementById(`generate-names-${e.target.value}`)
    //     selectedOption.classList.add('selected')
    // })

    generateNamesBtn.addEventListener('click', (e) => {
        const optionValue = select.value
        console.log(e.target);
        const inputs = [...namesWrapper.querySelectorAll('input')]

        if (optionValue === '1') {
            const alphabet = Array.from({ length: teamsAmount }, (_, i) => String.fromCharCode(65 + i))

            alphabet.forEach((letter, i) => {
                inputs[i].value = letter
            })
        } else if (optionValue === '2') {
            const numbers = Array.from({ length: teamsAmount }, (_, i) => i + 1)

            numbers.forEach((number, i) => {
                inputs[i].value = number
            })
        } else {
            TEAM_NAMES.sort(() => Math.random() - 0.5).slice(0,teamsAmount).forEach((name, i) => {
                inputs[i].value = name
            })
        }
    })

    
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const teamNamesElements = [...document.querySelectorAll('input')]
        const teamNames = teamNamesElements.map(teamNameElement => teamNameElement.value)

        form.remove()
        tournamentType(container, teamsAmount)
        localStorage.setItem('team-names', JSON.stringify(teamNames))
    })
}


function tournamentType(container, teamsAmount) {
    const form = document.createElement('form')
    form.classList.add('form')

    const leagueTitleWrapper = document.createElement('div')
    leagueTitleWrapper.classList.add('title')

    const leagueWrapper = document.createElement('div')
    leagueWrapper.classList.add('form-control')
    const leagueText = document.createElement('p')
    leagueText.textContent = 'League Game'

    const leagueSwitchHandler = (checked) => {
        if (checked) {
            const leagueInfoWrapper = document.createElement('div')
            leagueInfoWrapper.id = 'league-info'
            leagueInfoWrapper.classList.add('games-info')
    
            const roundsAmountWrapper = document.createElement('div')

            const roundsText = document.createElement('p')
            roundsText.textContent = 'Rounds amount'

            const roundsAmountInput = document.createElement('input')
            roundsAmountInput.name = 'amount'
            roundsAmountInput.type = 'number'
            roundsAmountInput.min = 1
            roundsAmountInput.max = 5

            roundsAmountInput.value = 1
            localStorage.setItem('rounds-amount', 1)

            roundsAmountInput.addEventListener('change', (e) => {
                const amount = e.target.value
    
                if (amount) {
                    localStorage.setItem('rounds-amount', amount)
                }
            })


            const dropoutAmountWrapper = document.createElement('div')

            const dropoutText = document.createElement('p')
            dropoutText.textContent = 'Dropout amount'

            const dropoutAmountInput = document.createElement('input')
            dropoutAmountInput.name = 'amount'
            dropoutAmountInput.type = 'number'
            dropoutAmountInput.min = 0
            dropoutAmountInput.max = 3

            dropoutAmountInput.value = 0
            localStorage.setItem('dropout-amount', 0)

            dropoutAmountInput.addEventListener('change', (e) => {
                const amount = e.target.value
    
                if (amount) {
                    localStorage.setItem('dropout-amount', amount)
                }
            })


            const conditionsWrapper = document.createElement('div')
            const conditionInput = document.createElement('input')
            conditionInput.type = 'text'
            const conditionButton = document.createElement('button')
            conditionButton.textContent = 'Add Condition'
            conditionButton.type = 'button'

            const conditionsList = document.createElement('ul')

            conditionButton.addEventListener('click', (e) => {
                const condition = conditionInput.value

                if (condition) {
                    const conditionItem = document.createElement('li')
                    const text = document.createElement('p')
                    text.textContent = condition
                    const deleteBtn = document.createElement('button')
                    deleteBtn.type = 'button'
                    deleteBtn.textContent = 'x'

                    deleteBtn.addEventListener('click', (e) => {
                        conditionItem.remove()
                    })

                    conditionItem.append(text, deleteBtn)
                    conditionsList.append(conditionItem)

                    conditionInput.value = ''
                }
            })

            
            roundsAmountWrapper.append(roundsText, roundsAmountInput)
            dropoutAmountWrapper.append(dropoutText, dropoutAmountInput)
            conditionsWrapper.append(conditionInput, conditionButton, conditionsList)

            leagueInfoWrapper.append(roundsAmountWrapper, dropoutAmountWrapper, conditionsWrapper)
            leagueWrapper.append(leagueInfoWrapper)
        } else {
            const oldLeagueInfoWrapper = document.getElementById('league-info')
            oldLeagueInfoWrapper.remove()
            localStorage.removeItem('rounds-amount')
        }
    }

    const legueSwitch = toggleSwitch(leagueSwitchHandler)

    leagueTitleWrapper.prepend(leagueText, legueSwitch)
    leagueWrapper.append(leagueTitleWrapper)

    const playoffsTitleWrapper = document.createElement('div')
    playoffsTitleWrapper.classList.add('title')

    const playoffsWrapper = document.createElement('div')
    playoffsWrapper.classList.add('form-control')
    const playoffsText = document.createElement('p')
    playoffsText.textContent = 'Playoffs'

    const playoffsSwitchHandler = (checked) => {
        if (checked) {
            const playoffsData = {
                teamsAmount: 0,
                roundsData: {},
            }

            const playoffsInfoWrapper = document.createElement('div')
            playoffsInfoWrapper.id = 'playoffs-info'
            playoffsInfoWrapper.classList.add('games-info')
    
            const teamsAmountWrapper = document.createElement('div')

            const teamsAmountText = document.createElement('p')
            teamsAmountText.textContent = 'How many teams play in Playoffs?'
    
            const possibleAmounts = []
            const dropoutTeamsAmount = +localStorage.getItem('dropout-amount')
            teamsAmount = teamsAmount - Number(dropoutTeamsAmount)
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
                console.log(i, possibleAmount);
                const option = document.createElement('option')       

                option.textContent = possibleAmount
                option.value = possibleAmount

                possibleAmountsSelect.append(option)
            }

            teamsAmountWrapper.append(teamsAmountText, possibleAmountsSelect)
        
            playoffsInfoWrapper.append(teamsAmountWrapper)
            
            generatePlayoffsData(playoffsInfoWrapper, 2, playoffsData)
            possibleAmountsSelect.addEventListener('change', (e) => {
                const amount = Number(e.target.value)

                generatePlayoffsData(playoffsInfoWrapper, amount, playoffsData)
              
            })

     
            playoffsWrapper.append(playoffsInfoWrapper)
        } else {
            const oldPlayoffsInfoWrapper = document.getElementById('playoffs-info')
            oldPlayoffsInfoWrapper.remove()
            localStorage.removeItem('playoffs-data')
        }
    }

    const playoffsSwitch = toggleSwitch(playoffsSwitchHandler)
       
    playoffsTitleWrapper.prepend(playoffsText, playoffsSwitch)

    playoffsWrapper.append(playoffsTitleWrapper)

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'SUBMIT'

    form.append(leagueWrapper, playoffsWrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const leagueData = localStorage.getItem('rounds-amount')
        const playoffsData = localStorage.getItem('playoffs-data')
        
        console.log(leagueData, playoffsData);
        if (leagueData || playoffsData) {
            form.remove()
            generateTeams(container)
        }
    })
}

function generatePlayoffsData(playoffsInfoWrapper, teamsAmount, playoffsData) {
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

    console.log(roundsInfo);
    playoffsData.roundsData = {}
    roundsInfo.forEach(gamesAmount => {
        const property = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`
        playoffsData.roundsData[property] = {}
        playoffsData.roundsData[property].gamesAmount = gamesAmount
        playoffsData.roundsData[property].knockouts = 1
    })
    localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))

    console.log(playoffsData);
    const prevRoundsInfoWrapper = document.getElementById('rounds-info-wrapper')
    prevRoundsInfoWrapper && prevRoundsInfoWrapper.remove()

    const roundsInfoWrapper = document.createElement('div')
    roundsInfoWrapper.id = 'rounds-info-wrapper'

    const roundsInfoTitle = document.createElement('p')
    roundsInfoTitle.textContent = 'Knockouts single/double?'

    roundsInfoWrapper.append(roundsInfoTitle)

    Object.keys(playoffsData.roundsData).forEach(round => {
        const roundWrapper = document.createElement('div')
        const roundElement = document.createElement('span')
        roundElement.textContent = round

        const buttonsWrapper = document.createElement('div')
        const singleKnockoutBtn = document.createElement('button')
        singleKnockoutBtn.type = 'button'
        singleKnockoutBtn.textContent = 'single'
        const doubleKnockoutBtn = document.createElement('button')
        doubleKnockoutBtn.type = 'button'
        doubleKnockoutBtn.textContent = 'double'

        singleKnockoutBtn.classList.add('clicked')

        console.log(playoffsData);

        singleKnockoutBtn.addEventListener('click', (e) => {
            doubleKnockoutBtn.classList.remove('clicked')
            singleKnockoutBtn.classList.add('clicked')

            playoffsData.roundsData[round].knockouts = 1
            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
        })

        doubleKnockoutBtn.addEventListener('click', (e) => {
            singleKnockoutBtn.classList.remove('clicked')
            doubleKnockoutBtn.classList.add('clicked')

            playoffsData.roundsData[round].knockouts = 2

            localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))
        })
        
        buttonsWrapper.append(singleKnockoutBtn, doubleKnockoutBtn)
        roundWrapper.prepend(roundElement, buttonsWrapper)
        roundsInfoWrapper.append(roundWrapper)
    })

    playoffsInfoWrapper.append(roundsInfoWrapper)
}

 
function roundsAmountForm(container) {
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many rounds in tournament?'

    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 1
    input.max = 5

    wrapper.append(text, input)
    
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    form.append(wrapper, submitBtn)
    container.append(form)

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = e.target.amount.value
    
        if (amount) {
            form.remove()
            localStorage.setItem('rounds-amount', amount)
            generateTeams(container, amount)
        }
    })
}