export default function toggleSwitch(switchHandler) {
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.classList.add('toggle')

    input.addEventListener('change', (e) => {
        switchHandler(e.target.checked)
    })

    return input
}