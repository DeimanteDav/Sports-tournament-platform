import { ANIMAL_NAMES, Container } from "../../config.js"
import tournamentType from "./tournamentType.js"

function teamNamesForm(container: Container, teamsAmount: number) {
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
        optionElement.value = option.value.toString()
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
                inputs[i].value = number.toString()
            })
        } else {
            ANIMAL_NAMES.sort(() => Math.random() - 0.5).slice(0,teamsAmount).forEach((name, i) => {
                inputs[i].value = name
            })
        }
    })



    
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const teamNamesElements = [...document.querySelectorAll('input')]
        const teamNames = teamNamesElements.map(teamNameElement => teamNameElement.value)

        const uniqueNames = new Set()
        for (let i = 0; i < teamNames.length; i++) {
            const name = teamNames[i];
            uniqueNames.add(name)
        }

        if (uniqueNames.size === teamNames.length) {
            form.remove()
            tournamentType(container, teamsAmount)
            localStorage.setItem('team-names', JSON.stringify(teamNames))
        } else {
            form.classList.add('error')
        }
    })
}

export default teamNamesForm