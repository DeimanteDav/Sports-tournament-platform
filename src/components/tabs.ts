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


    items.forEach((item, i) => {
        const {text, func} = item

        const listItem = document.createElement('li')
        listItem.classList.add('tab-item')
        listItem.textContent = text

        if (i === 0) {
            listItem.classList.add('active')
        }

        listItem.addEventListener('click', () => {
            const wrappers = document.querySelectorAll('.season-wrapper')
            wrappers.forEach(wrapper => wrapper.remove())

            const listItems = document.querySelectorAll('.tab-item')

            listItems.forEach(item => item.classList.remove('active'))
            listItem.classList.add('active')
            func()
        })

        list.append(listItem)
    })

    wrapper.append(list)
    container.prepend(wrapper)
}