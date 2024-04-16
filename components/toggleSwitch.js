export default function toggleSwitch(switchHandler) {
    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.classList.add('toggle')

    toggle.addEventListener('change', (e) => {
        switchHandler(e.target.checked)
    })

    return toggle
}