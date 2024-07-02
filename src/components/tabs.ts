import Playoffs from "../classes/Playoffs"
import RegularSeason from "../classes/RegularSeason"

export default function tabs(container: HTMLDivElement, regularSeasonData: RegularSeason, playoffsData: Playoffs) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('tabs-wrapper')
    const list = document.createElement('ul')

    const renderAll = () => {
        regularSeasonData.renderHtml(container)
        playoffsData.renderHtml(container)
    }

    const items = [
        {
            text: 'All',
            func: renderAll
        },
        {
            text: 'Regular Season',
            func: () => regularSeasonData.renderHtml(container)
        },
        {
            text: 'Playoffs',
            func: () => playoffsData.renderHtml(container)
        }
    ]


    items.forEach(item => {
        const {text, func} = item

        const listItem = document.createElement('li')
        listItem.textContent = text

        listItem.addEventListener('click', () => {
            const wrappers = document.querySelectorAll('.season-wrapper')
            wrappers.forEach(wrapper => wrapper.remove())

            func()
        })

        list.append(listItem)
    })

    wrapper.append(list)
    container.prepend(wrapper)
}