export default function accordion(btnText, panelDisplay, panelClassName) {
    const accordionWrapper = document.createElement('div')

    const accordionBtn = document.createElement('button')
    accordionBtn.classList.add('accordion')
    accordionBtn.type = 'button'
    accordionBtn.textContent = btnText

    const panel = document.createElement('div')
    panel.classList.add('panel')
    panelClassName && panel.classList.add(panelClassName)

    accordionBtn.addEventListener('click', (e) => {
        e.target.classList.toggle('active')

        if (panel.style.display === panelDisplay) {
            panel.style.display = "none";
        } else {
            panel.style.display = panelDisplay;
        }
    })

    accordionWrapper.append(accordionBtn, panel)

    return accordionWrapper
}