import { SPORTS } from "../../config.js"

function getModernTableHeadItems(sportId: number, position: boolean = false) {
  if (sportId === SPORTS.football.id) {
    return [
      generateHeadItem('#', null, 'currentPlace'),
      generateHeadItem('Team', null, 'team'),
      ...(position ? [
        generateHeadItem('Highest', null, 'maxPlace'),
        generateHeadItem('Lowest', null, 'minPlace')
      ] : []),
      generateHeadItem('PL', 'Played Matches', 'playedGames'),
      generateHeadItem('W', 'Wins', 'wins'),
      generateHeadItem('D', 'Draws', 'draws'),
      generateHeadItem('L', 'Losses', 'losses'),
      generateHeadItem('F', 'Goals For', 'goals'),
      generateHeadItem('A', 'Goals Against', 'goalsMissed'),
      generateHeadItem('GD', 'Goal Difference', 'goalDifference'),
      generateHeadItem('P', 'Points', 'points')
    ]
  } else {
    return [
      generateHeadItem('#', null, 'currentPlace'),
      generateHeadItem('Team', null, 'team'),
      ...(position ? [
        generateHeadItem('Highest', null, 'maxPlace'),
        generateHeadItem('Lowest', null, 'minPlace')
      ] : []),
      generateHeadItem('GP', 'Games Played', 'playedGames'),
      generateHeadItem('W', 'Wins', 'wins'),
      generateHeadItem('L', 'Losses', 'losses'),
      generateHeadItem('Win%', 'Winning Percentage', 'winPerc'),
      generateHeadItem('PTS+', 'Points Scored', 'goals'),
      generateHeadItem('PTS-', 'Points Lost', 'goalsMissed'),
      generateHeadItem('+/-', 'Points Difference', 'goalDifference'),
      generateHeadItem('H', 'Home Games', 'homeGames'),
      generateHeadItem('A', 'Away Games', 'awayGames'),
      generateHeadItem('OT', 'Overtime', 'overtime'),
      ]
  }
}

export default getModernTableHeadItems

function generateHeadItem(text: string, title: string | null, selector: string) {
    return { text, title, selector }
  }
  