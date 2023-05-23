const getHomeTeams = `SELECT 
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
    home_team_id AS team_id,
        CASE
            WHEN home_team_goals > away_team_goals THEN 3
            WHEN home_team_goals < away_team_goals THEN 0
            ELSE 1
        END AS points,
        home_team_goals AS golFavor,
        away_team_goals AS golContra
FROM
    TRYBE_FUTEBOL_CLUBE.matches
WHERE
    matches.in_progress = 0) AS points_table
    JOIN
TRYBE_FUTEBOL_CLUBE.teams AS tfc ON points_table.team_id = tfc.id
GROUP BY tfc.team_name
ORDER BY totalPoints DESC , totalVictories DESC , goalsBalance DESC , goalsFavor DESC;`;

export default getHomeTeams;
