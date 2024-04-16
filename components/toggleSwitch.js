export default function toggleSwitch(switchHandler, dropoutsChanged) {
    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.classList.add('toggle')

    toggle.addEventListener('change', (e) => {
        switchHandler(e.target.checked)
    })

    if (dropoutsChanged) {
        dropoutsChanged = false
        switchHandler(2)
    }

    return toggle
}