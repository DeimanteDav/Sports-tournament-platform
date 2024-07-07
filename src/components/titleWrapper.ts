import { Container } from "../types.js";
import resetDataBtn from "./resetDataBtn.js";
import sportTitle from "./sportTitle.js";

function titleWrapper(container: Container) {
    const titleWrapper = document.createElement('div')
    titleWrapper.classList.add('title-wrapper')
    
    sportTitle(titleWrapper)
    resetDataBtn(container, titleWrapper)

    container.prepend(titleWrapper)
}

export default titleWrapper