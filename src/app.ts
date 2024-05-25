import { Container } from "./types.js";
import getLocalStorageData from "./functions/getLocalStorageData.js";

const container = document.querySelector('.container') as Container
getLocalStorageData(container)