import { Container } from "../config"

function sportTitle(wrapper: HTMLElement) {
    const sport = JSON.parse(localStorage.getItem('sport') || '')

    const title = document.createElement('h1')
    title.textContent = sport.name

    wrapper.append(title)
}

export default sportTitle