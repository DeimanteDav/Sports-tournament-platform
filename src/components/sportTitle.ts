import { Container } from "../config"

function sportTitle(container: Container) {
    const sport = JSON.parse(localStorage.getItem('sport') || '')

    const title = document.createElement('h1')
    title.textContent = sport.name

    container.append(title)
}

export default sportTitle