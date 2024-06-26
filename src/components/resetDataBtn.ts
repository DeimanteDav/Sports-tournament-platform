import { Container } from "../types.js";
import sportTypeForm from "../functions/initialForms/sportTypeForm.js";

function resetDataBtn(container: Container, wrapper: HTMLElement) {
    const resetBtn = document.createElement('button')
    resetBtn.type = 'button'
    resetBtn.id = 'reset-btn'
    resetBtn.textContent = 'RESET all data'


    resetBtn.addEventListener('click', (e) => {
        localStorage.clear()
        container.innerHTML = ''
        
        sportTypeForm(container)
    })

    wrapper.append(resetBtn)
}

export default resetDataBtn