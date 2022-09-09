export const getEspnFantasyData = async (year) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/1101603?view=mMatchup&view=mMatchupScore&view=mRoster&view=mScoreboard&view=mSettings&view=mStatus&view=mTeam&view=modular&view=mNav`, requestOptions)
    return response.json()
}

const getCurrentScoreForPlayer = player => player?.rosterForMatchupPeriod?.appliedStatTotal || 0;
const getProjectedScoreForPlayer = player => player?.totalProjectedPointsLive || 0;
const getTeamName = team => `${team?.location} ${team?.nickname}`
const getGamesThisWeek = fantasyData => fantasyData.schedule.filter(game => game.matchupPeriodId === fantasyData.status.currentMatchupPeriod && game.away)
const teamToPlayerMap = team => (team.rosterForMatchupPeriod?.entries || []).map(p => p.playerPoolEntry).reduce((acc, val) => {
    acc[val.player.id] = val;
    return acc;
}, {});

const getInPlayCount = team => team?.rosterForMatchupPeriod.entries.length || 0;

const diffPlayersScores = (oldPlayers, newPlayers) => Object.values(newPlayers).map(player => {
    const id = player.id;
    return {
        id: id,
        player: newPlayers[id],
        diff: (newPlayers[id]?.appliedStatTotal || 0) - (oldPlayers[id]?.appliedStatTotal || 0)
    }
});

const generatePlayerUpdates = (oldGame, newGame, homeOrAway) => diffPlayersScores(teamToPlayerMap(oldGame.full[homeOrAway]), teamToPlayerMap(newGame[homeOrAway]))
        .filter(d => d.diff !== 0)
        .map(d => {
            return {
                ...d,
                team: oldGame[homeOrAway].name,
                name: d.player.player.fullName,
                score: d.player.appliedStatTotal.toFixed(2),
                diff: d.diff.toFixed(2),
            }
        });

const generatePlayerDeltas = (oldGame, newGame) => {
    if (oldGame) {
        return ['home', 'away'].flatMap(a => generatePlayerUpdates(oldGame, newGame, a));
    } else {
        return []
    }
}

export const getWeekScores = async (oldGames, year) => {

    const fantasyData = await getEspnFantasyData(year);
    const teams = listWithIdsToObjectById(fantasyData.teams);
    const previousScores = listWithIdsToObjectById(oldGames || []);

    const generateGameScore = (game) => {
        const prevGame = previousScores[game.id];
        return {
            id: game.id,
            full: game,
            deltas: oldGames ? generatePlayerDeltas(prevGame, game) : {},
            home: {
                name: getTeamName(teams[game.home.teamId]),
                actual: getCurrentScoreForPlayer(game.home).toFixed(2),
                projected: getProjectedScoreForPlayer(game.home).toFixed(2),
                inPlay: getInPlayCount(game.home),
                change: previousScores[game.id] ? (getCurrentScoreForPlayer(game?.home)?.toFixed(2) || 0) - (previousScores[game.id]?.home.actual || 0) : 0
            },
            away: {
                name: getTeamName(teams[game.away.teamId]),
                actual: getCurrentScoreForPlayer(game.away).toFixed(2),
                projected: getProjectedScoreForPlayer(game.away).toFixed(2),
                inPlay: getInPlayCount(game.away),
                change: previousScores[game.id] ? (getCurrentScoreForPlayer(game?.away)?.toFixed(2) || 0) - (previousScores[game.id]?.away.actual || 0) : 0
            },
        }
    }

    const results = getGamesThisWeek(fantasyData).map(generateGameScore);
    return results;
}

const listWithIdsToObjectById = (list) => {
    return list.reduce((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {})
}

export const getMatchups = async (year) => {
    const lineupSlotsById = {
        2: 'RB',
        4: 'WR',
        0: 'QB',
        23: 'FLEX',
        6: 'TE',
        16: 'D/ST',
        17: 'K'
    }

    const fantasyData = await getEspnFantasyData(year)
    const games = getGamesThisWeek(fantasyData);

    console.log(games, lineupSlotsById);
};
