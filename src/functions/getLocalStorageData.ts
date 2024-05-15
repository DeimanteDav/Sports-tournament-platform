function getLocalStorageData(container: HTMLDivElement) {
    let teamsData =  localStorage.getItem('teams-data') ? JSON.parse(localStorage.getItem('teams-data') || '') : null

    const gamesData = JSON.parse(localStorage.getItem('league-games-data') || '') 
    console.log(teamsData, gamesData);
}

export default getLocalStorageData