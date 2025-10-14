const connection = require('../config/database'); // your MySQL connection

exports.getAllContest = (req, res) => {
    const now = new Date();
    const ongoingQuery = `
        SELECT contests.*, 
            TIMESTAMPDIFF(SECOND, ?, contests.ending_time) AS ending_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url
        FROM contests
        JOIN users ON users.id = contests.organizer_id
        WHERE contests.start_time <= ? AND contests.ending_time >= ?
    `;
    const upcomingQuery = `
        SELECT contests.*, 
            TIMESTAMPDIFF(SECOND, ?, contests.start_time) AS starting_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url
        FROM contests
        JOIN users ON users.id = contests.organizer_id
        WHERE contests.start_time > ?
    `;

    connection.query(ongoingQuery, [now, now, now], (err, ongoingResults) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        connection.query(upcomingQuery, [now, now], (err, upcomingResults) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }
            res.json({
                ongoing: ongoingResults,
                upcoming: upcomingResults
            });
        });
    });
};
