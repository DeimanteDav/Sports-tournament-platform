function sportTitle(wrapper: HTMLElement) {
    const sport = JSON.parse(localStorage.getItem('sport-type') || '')

    const title = document.createElement('h1')
    title.textContent = sport.name

    wrapper.append(title)
}

export default sportTitle