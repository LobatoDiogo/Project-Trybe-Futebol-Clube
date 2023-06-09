const getAwayTeams = `SELECT
tfc.team_name AS name,
CAST(SUM(points) AS UNSIGNED) AS totalPoints,
COUNT(*) AS totalGames,
COUNT(CASE
    WHEN points = 3 THEN 1
END) AS totalVictories,
COUNT(CASE
    WHEN points = 1 THEN 1
END) AS totalDraws,
COUNT(CASE
    WHEN points = 0 THEN 1
END) AS totalLosses,
CAST(SUM(golFavor) AS UNSIGNED) AS goalsFavor,
CAST(SUM(golContra) AS UNSIGNED) AS goalsOwn,
CAST(SUM(golFavor) - SUM(golContra) AS SIGNED) AS goalsBalance,
ROUND((SUM(points) / (COUNT(*) * 3)) * 100, 2) AS efficiency
FROM
(SELECT
    away_team_id AS a_team_id,
        CASE
            WHEN away_team_goals > home_team_goals THEN 3
            WHEN away_team_goals < home_team_goals THEN 0
            ELSE 1
        END AS points,
        away_team_goals AS golFavor,
        home_team_goals AS golContra
FROM
    TRYBE_FUTEBOL_CLUBE.matches
WHERE
    matches.in_progress = 0) AS points_table
    JOIN
TRYBE_FUTEBOL_CLUBE.teams AS tfc ON points_table.a_team_id = tfc.id
GROUP BY tfc.team_name
ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC;`;

export default getAwayTeams;
