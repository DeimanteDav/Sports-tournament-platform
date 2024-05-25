import { Container } from "../../types.js"
import teamNamesForm from "./teamNamesForm.js"

function teamsAmountForm(container: Container) {
    const form = document.createElement('form')
    form.classList.add('form')

    const wrapper = document.createElement('div')
    const text = document.createElement('p')
    text.textContent = 'How many teams in tournament?'
    const input = document.createElement('input')
    input.name = 'amount'
    input.type = 'number'
    input.min = '2'
    input.max = '40'

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
        if (e.target) {
            const amount = (e.target as HTMLFormElement).amount.value
            form.remove()

            teamNamesForm(container, Number(amount))
        } else {
            form.classList.add('error')
        }
    })
}

export default teamsAmountForm