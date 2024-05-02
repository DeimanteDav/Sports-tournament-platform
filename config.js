export const WIN_POINTS = 3;
export const DRAW_POINTS = 1;
export const LOSE_POINTS = 0;
export const TEAM_NAMES = [
  "Bears",
  "Lions",
  "Eagles",
  "Jaguars",
  "Hawks",
  "Falcons",
  "Ravens",
  "Wolves",
  "Sharks",
  "Cobras",
];

export const SPORTS = {
  football: {
    id: 1,
    name: 'Football',
    points: {
      win: 3,
      draw: 1,
      loss: 0
    }
  },
  basketball: {
    id: 2,
    name: 'Basketball',
    points: {
      win: 2,
      loss: 1,
      tecnhicalLoss: 0,
    }
  }
}


function generateHeadItem(text, title, selector) {
  return { text, title, selector }
}


export const MODERN_TABLE_HEAD_ITEMS = {
  [SPORTS.football.id]: (position) => [
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
  ],
  [SPORTS.basketball.id]:  (position) => [
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
    generateHeadItem('H', 'Home Games', {prop: 'homeGames', inside:['won', 'lost']}),
    generateHeadItem('A', 'Away Games', {prop: 'awayGames', inside:['won', 'lost']}),
    generateHeadItem('OT', 'Overtime', {prop: 'overtime', inside:['scored', 'missed']}),
  ]
}