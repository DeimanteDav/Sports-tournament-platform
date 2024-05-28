import { SPORTS } from "../../config.js"
import teamsAmountForm from "./teamsAmountForm.js"

function sportTypeForm(container: HTMLDivElement) {
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

    let selectedSport: null | Object = null

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

            localStorage.setItem('sport-type', JSON.stringify(selectedSport))

            teamsAmountForm(container)
        } else {
            form.classList.add('error')
        }
    })
}

export default sportTypeForm