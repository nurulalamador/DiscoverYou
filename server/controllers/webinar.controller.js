const connection = require('../config/database'); // your MySQL connection

exports.getAllWebinar = (req, res) => {
    const now = new Date();
    const ongoingQuery = `
        SELECT webinars.*, 
            TIMESTAMPDIFF(SECOND, ?, webinars.ending_time) AS ending_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url
        FROM webinars
        JOIN users ON users.id = webinars.organizer_id
        WHERE webinars.start_time <= ? AND webinars.ending_time >= ?
    `;
    const upcomingQuery = `
        SELECT webinars.*, 
            TIMESTAMPDIFF(SECOND, ?, webinars.start_time) AS starting_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url
        FROM webinars
        JOIN users ON users.id = webinars.organizer_id
        WHERE webinars.start_time > ?
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
