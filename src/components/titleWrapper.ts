import { Container } from "../config.js";
import resetDataBtn from "./resetDataBtn.js";
import sportTitle from "./sportTitle.js";

function titleWrapper(container: Container) {
    const titleWrapper = document.createElement('div')
    titleWrapper.classList.add('title-wrapper')
    
    sportTitle(titleWrapper)
    resetDataBtn(titleWrapper)

    container.append(titleWrapper)
}

export default titleWrapper