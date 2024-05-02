import toggleSwitch from "../components/toggleSwitch.js"
import { SPORTS, TEAM_NAMES } from "../config.js"
import generateTeams from "./generate.js"

export function sportTypeForm(container) {
    localStorage.clear()

    const form = document.createElement('form')
    form.classList.add('form')

    const text = document.createElement('p')
    text.textContent = 'Select sport'

    const buttonsWrapper = document.createElement('div')
    buttonsWrapper.classList.add('btn-wrapper')

    const basketBallBtn = document.createElement('button')
    basketBallBtn.type = 'button'
    basketBallBtn.textContent = 'Basketball'

    const footballBtn = document.createElement('button')
    footballBtn.type = 'button'
    footballBtn.textContent = 'Football'
    

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.textContent = 'OK'

    buttonsWrapper.append(basketBallBtn, footballBtn)
    form.append(text, buttonsWrapper, submitBtn)
    container.append(form)

    let selectedSport = null

    basketBallBtn.addEventListener('click', () => {
        form.classList.remove('error')

        selectedSport = SPORTS.basketball
        basketBallBtn.classList.add('clicked')
        footballBtn.classList.remove('clicked')
    })
    footballBtn.addEventListener('click', () => {
        form.classList.remove('error')

        selectedSport = SPORTS.football
        footballBtn.classList.add('clicked')
        basketBallBtn.classList.remove('clicked')
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (selectedSport) {
            form.classList.remove('error')
            form.remove()
            localStorage.setItem('sport', JSON.stringify(selectedSport))

            teamsAmountForm(container)
        } else {
            form.classList.add('error')
        }
    })
}

export function teamsAmountForm(container) {
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

    input.addEventListener('input', (e) => {
        if ([...form.classList].includes('error')) {
            form.classList.remove('error')
        }
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const amount = e.target.amount.value
    
        if (amount) {

            form.remove()
            teamNamesForm(container, Number(amount))
        } else {
            form.classList.add('error')
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

    generateNamesBtn.addEventListener('click', (e) => {
        const optionValue = select.value
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
    leagueText.textContent = 'Regular Season'

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

    
            const relegationWrapper = document.createElement('relegation')

            const relegationText = document.createElement('p')
            relegationText.textContent = 'Relegation'
            const relegationAmountInput = document.createElement('input')
            relegationAmountInput.type = 'number'
            relegationAmountInput.placeholder = 'Amount'
    
            const relegationBtn = document.createElement('button')
            relegationBtn.type = 'button'
            relegationBtn.textContent = 'Add'

            relegationBtn.addEventListener('click', (e) => {
                const amount = +relegationAmountInput.value
                const oldAmount = localStorage.getItem('relegation')

                if (amount > 0 && !oldAmount) {
                    relegationBtn.textContent = 'Remove'
                    relegationAmountInput.setAttribute('disabled', true)
                    localStorage.setItem('relegation', amount)
                } else {
                    relegationBtn.textContent = 'Add'
                    relegationAmountInput.removeAttribute('disabled')

                    localStorage.removeItem('relegation')
                }

            })


            
            const conditionsWrapper = document.createElement('div')
            const conditionsText = document.createElement('p')
            conditionsText.textContent = 'Conditions'
            let addedConditions = []

            const addConditionWrapper = document.createElement('div')
            const conditionTitleInput = document.createElement('input')
            conditionTitleInput.type = 'text'
            conditionTitleInput.placeholder = 'Condition'

            const amountOfTeamsWrapper = document.createElement('div')
            const teamsFromInput = document.createElement('input')
            teamsFromInput.type = 'number'
            teamsFromInput.placeholder = 'From'
            
            const teamsToInput = document.createElement('input')
            teamsToInput.type = 'number'
            teamsToInput.placeholder = 'To'


            const conditionTypesWrapper = document.createElement('div')
            const conditionTypes = [
                {name: 'positive', checked: true},
                {name: 'negative', checked: false}
            ]
            for (const type of conditionTypes) {
                const typeWrapper = document.createElement('div')
                const typeLabel = document.createElement('label')
                typeLabel.htmlFor = type.name
                typeLabel.textContent = type.name

                const typeInput = document.createElement('input')
                typeInput.type = 'radio'
                typeInput.id = type.name
                typeInput.value = type.name
                typeInput.checked = type.checked
                typeInput.name = 'type'

                typeInput.addEventListener('click', (e) => {
                    const selectedCondition = conditionTypes.find(condition => condition.name === e.target.value)
                    const otherCondition = conditionTypes.find(condition => condition.name !== e.target.value)

                    selectedCondition.checked = true
                    otherCondition.checked = false
                })

                typeWrapper.append(typeInput, typeLabel)
                conditionTypesWrapper.append(typeWrapper)
            }

            const conditionBtn = document.createElement('button')
            conditionBtn.type = 'button'
            conditionBtn.textContent = 'Add'

            const conditionsList = document.createElement('ul')

            conditionBtn.addEventListener('click', (e) => {
                const selectedCondition = conditionTypes.find(type => type.checked)

                const fromTeams = +teamsFromInput.value
                const toTeams = +teamsToInput.value

                if (conditionTitleInput && fromTeams > 0 && toTeams > 0) {
                    if (selectedCondition.name === 'positive' && fromTeams > toTeams || selectedCondition.name === 'negative' && toTeams > fromTeams) {
                        amountOfTeamsWrapper.classList.add('error')
                    } else {
                        const newCondition = {
                            title: conditionTitleInput.value,
                            teamsFrom: fromTeams,
                            teamsTo: toTeams,
                            positive: selectedCondition.name === 'positive' ? true : false,
                            id: addedConditions.length
                        }
                        conditionTitleInput.value = ''
                        teamsFromInput.value = ''
                        teamsToInput.value = ''
                        
              
                        const conditionItem = document.createElement('li')
                        conditionItem.id = addedConditions.length
                        const conditionText = document.createElement('span')
                        conditionText.textContent = newCondition.title

                        const teamsAmountElement = document.createElement('span')                        
                        teamsAmountElement.textContent = `${newCondition.teamsFrom} - ${newCondition.teamsTo}`

                        const deleteBtn = document.createElement('button')
                        deleteBtn.type = 'button'
                        deleteBtn.textContent = 'x'

                        addedConditions.push(newCondition)

                        localStorage.setItem('conditions', JSON.stringify(addedConditions))


                        deleteBtn.addEventListener('click', () => {
                            addedConditions = addedConditions.filter(condition => +condition.id !== +conditionItem.id)

                            conditionItem.remove()
                            localStorage.setItem('conditions', JSON.stringify(addedConditions))
                        })

                        conditionItem.append(conditionText, teamsAmountElement, deleteBtn)
                        conditionsList.append(conditionItem)

                        amountOfTeamsWrapper.classList.remove('error')
                        addConditionWrapper.classList.remove('error')
                    }
                } else {
                    addConditionWrapper.classList.add('error')

                }
            })

            // conditions.forEach(condition => {
            //     const conditionWrapper = document.createElement('div')

            //     const text = document.createElement('p')
            //     text.textContent = condition

            //     const amountInput = document.createElement('input')
            //     amountInput.type = 'number'
            //     amountInput.placeholder = 'Amount'

            //     const titleInput = document.createElement('input')
            //     if (condition === 'Custom') {
            //         titleInput.type = 'text'
            //         titleInput.placeholder = 'Title'
            //         conditionWrapper.append(titleInput)
            //     }

            //     const addBtn = document.createElement('button')
            //     addBtn.type = 'button'
            //     addBtn.textContent = 'Add'

                
            //     conditionWrapper.prepend(text)
            //     conditionWrapper.append(amountInput, addBtn)
            //     conditionsWrapper.append(conditionWrapper)


            //     addBtn.addEventListener('click', (e) => {
            //         if (+amountInput.value > 0 || (condition === 'Custom' && titleInput === '')) {
                        // const conditionItem = document.createElement('li')
                        // const conditionText = document.createElement('span')
                        // conditionText.textContent = titleInput.value || condition
                        // const deleteBtn = document.createElement('button')
                        // deleteBtn.type = 'button'
                        // deleteBtn.textContent = 'x'

                        // conditionItem.append(conditionText, deleteBtn)
                        // conditionsList.append(conditionItem)

            //             const newCondition = {
            //                 condition: titleInput.value || condition,
            //                 amount: +amountInput.value,
            //                 // positive: condition === 'Relegation' ? false : 
            //             }

            //             addedConditions.push(newCondition)
            //             localStorage.setItem('conditions', JSON.stringify(addedConditions))

            //             amountInput.value = ''
            //             titleInput.value = ''
    
            //             if (condition === 'Relegation') {
            //                 conditionWrapper.style.display = 'none'
            //             }
    
            //             deleteBtn.addEventListener('click', (e) => {
            //                 if (condition === 'Relegation') {
            //                     conditionWrapper.style.display = 'block'
            //                 }
            //                 const filteredConditions = addedConditions.filter(data => data.condition !== conditionText.value)
            //                 localStorage.setItem('conditions', JSON.stringify(filteredConditions))
            //                 conditionItem.remove()
            //             })
            //         } else {
            //             conditionWrapper.classList.add('error')
            //         }
            //     })
            // })

            // conditionButton.addEventListener('click', (e) => {
            //     const condition = conditionInput.value

            //     if (condition) {
            //         const conditionItem = document.createElement('li')
            //         const text = document.createElement('p')
            //         text.textContent = condition
            //         const deleteBtn = document.createElement('button')
            //         deleteBtn.type = 'button'
            //         deleteBtn.textContent = 'x'

            //         deleteBtn.addEventListener('click', (e) => {
            //             conditionItem.remove()
            //         })

            //         conditionItem.append(text, deleteBtn)
            //         conditionsList.append(conditionItem)

            //         conditionInput.value = ''
            //     }
            // })


            roundsAmountWrapper.append(roundsText, roundsAmountInput)

            relegationWrapper.append(relegationText, relegationAmountInput, relegationBtn)

            amountOfTeamsWrapper.append(teamsFromInput, teamsToInput)

            addConditionWrapper.append(conditionTitleInput, amountOfTeamsWrapper, conditionTypesWrapper, conditionBtn)
            conditionsWrapper.append(conditionsText, addConditionWrapper, conditionsList)

            leagueInfoWrapper.append(roundsAmountWrapper,relegationWrapper, conditionsWrapper)
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
            const relegationTeamsAmount = +localStorage.getItem('relegation')
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

    playoffsData.roundsData = {}
    roundsInfo.forEach(gamesAmount => {
        const property = gamesAmount === 1 ? 'final' : `1/${gamesAmount}`
        playoffsData.roundsData[property] = {}
        playoffsData.roundsData[property].gamesAmount = gamesAmount
        playoffsData.roundsData[property].knockouts = 1
    })
    localStorage.setItem('playoffs-data', JSON.stringify(playoffsData))

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
        buttonsWrapper.classList.add('btn-wrapper')

        const singleKnockoutBtn = document.createElement('button')
        singleKnockoutBtn.type = 'button'
        singleKnockoutBtn.textContent = 'single'
        const doubleKnockoutBtn = document.createElement('button')
        doubleKnockoutBtn.type = 'button'
        doubleKnockoutBtn.textContent = 'double'

        singleKnockoutBtn.classList.add('clicked')


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