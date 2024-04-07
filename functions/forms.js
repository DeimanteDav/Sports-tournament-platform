import { TEAM_NAMES } from "../config.js"
import generateTeams from "./generate.js"

export function teamsAmountForm(container) {
    const form = document.createElement('form')
    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many teams in tournament?'
    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = 2
    input.max = 10

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
    
    const text = document.createElement('p')
    text.textContent = `Set Teams' names`

    const namesWrapper = document.createElement('div')

    const generateWrapper = document.createElement('div')
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
        roundsAmountForm(container)
        localStorage.setItem('team-names', JSON.stringify(teamNames))
    })
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