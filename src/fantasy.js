

export const getEspnFantasyData = async () => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch("https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1101603?view=mMatchup&view=mMatchupScore&view=mRoster&view=mScoreboard&view=mSettings&view=mStatus&view=mTeam&view=modular&view=mNav", requestOptions)
    return response.json()
}

const getCurrentScoreForPlayer = player => player.rosterForMatchupPeriod.appliedStatTotal || 0;
const getTeamName = team => `${team?.location} ${team?.nickname}`

export const getWeekScores = async () => {
    const fantasyData = await getEspnFantasyData();
    const teams = fantasyData.teams.reduce((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {})

    const generateGameScore = (game) => {
        return {
            home: {
                name: getTeamName(teams[game.home.teamId]),
                score: getCurrentScoreForPlayer(game.home).toFixed(2)
            },
            away: {
                name: getTeamName(teams[game.away.teamId]),
                score: getCurrentScoreForPlayer(game.away).toFixed(2)
            },
        }
    }

    const currentMatchup = fantasyData.status.currentMatchupPeriod;
    return fantasyData.schedule
        .filter(game => game.matchupPeriodId === currentMatchup)
        .map(generateGameScore)
}
export const tester = async () => {
    await getWeekScores()
}
