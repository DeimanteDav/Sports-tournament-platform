import { Container } from "../config.js";
import sportTypeForm from "../functions/initialForms/sportTypeForm.js";

function resetDataBtn(container: Container) {
    const resetBtn = document.createElement('button')
    resetBtn.type = 'button'
    resetBtn.id = 'reset-btn'
    resetBtn.textContent = 'RESET all data'


    resetBtn.addEventListener('click', (e) => {
        localStorage.clear()
        container.innerHTML = ''
        
        sportTypeForm(container)
    })

    container.append(resetBtn)
}

export default resetDataBtn