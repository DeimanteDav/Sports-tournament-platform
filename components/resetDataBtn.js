import { teamsAmountForm } from "../functions/forms.js"

export default function resetDataBtn(container) {
    const resetBtn = document.createElement('button')
    resetBtn.type = 'button'
    resetBtn.id = 'reset-btn'
    resetBtn.textContent = 'RESET all data'


    resetBtn.addEventListener('click', (e) => {
        localStorage.clear()
        container.innerHTML = ''
        
        teamsAmountForm(container)
    })

    container.append(resetBtn)
}