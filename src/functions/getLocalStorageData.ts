import Playoffs from "../classes/Playoffs.js";
import RegularSeason from "../classes/RegularSeason.js";
import leagueTournament from "../components/league/leagueTournament.js";
import playoffsForm from "../components/playoffs/playoffsForm.js";
import titleWrapper from "../components/titleWrapper.js";
import { Container } from "../types.js";
import sportTypeForm from "./initialForms/sportTypeForm.js"

function getLocalStorageData(container: Container) {
    const regularSeason = RegularSeason.getData()
    const playoffs = Playoffs.getData()

    if (regularSeason || playoffs) {
       titleWrapper(container)

        if (regularSeason) {
            leagueTournament(container)
        }
        if (playoffs) {
            playoffsForm(container)
        }

    } else {
        sportTypeForm(container)
    }
}

export default getLocalStorageData