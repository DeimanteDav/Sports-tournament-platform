export default function toggleSwitch(switchHandler) {
    const label = document.createElement('label')
    label.classList.add('switch')

    const input = document.createElement('input')
    input.type = 'checkbox'
    const span = document.createElement('span')
    span.classList.add('slider')

    label.append(input, span)
    let checked = false

    label.addEventListener('change', (e) => {
        checked = !checked

        switchHandler(checked)
    })

    return label
}