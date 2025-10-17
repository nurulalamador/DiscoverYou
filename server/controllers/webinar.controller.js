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

exports.getPreviousWebinar = (req, res) => {
    const now = new Date();
    const previousQuery = `
        SELECT webinars.*, 
            TIMESTAMPDIFF(SECOND, ?, webinars.ending_time) AS ending_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url
        FROM webinars
        JOIN users ON users.id = webinars.organizer_id
        WHERE webinars.ending_time < ?
    `;

    connection.query(previousQuery, [now, now], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json({
            success: true,
            webinars: results,
        });
    });
};

exports.getSingleWebinar = (req, res) => {
    const userId = req.userId; // Retrieved from verifyToken middleware
    const webinarId = req.params.id;

    const now = new Date();
    const webinarQuery = `
        SELECT webinars.*, 
            TIMESTAMPDIFF(SECOND, NOW(), webinars.ending_time) AS ending_in,
            TIMESTAMPDIFF(SECOND, NOW(), webinars.start_time) AS starting_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url,
            CASE
                WHEN webinars.start_time <= NOW() AND webinars.ending_time >= NOW() THEN 'ongoing'
                WHEN webinars.start_time > NOW() THEN 'upcoming'
                ELSE 'previous'
            END AS type,
            (SELECT COUNT(*) FROM webinar_participants wp WHERE wp.webinar_id = webinars.id) AS total_participants,
            (SELECT EXISTS(
                SELECT 1 FROM webinar_participants wp2 
                WHERE wp2.webinar_id = webinars.id AND wp2.participant_id = ?
            )) AS is_participated
        FROM webinars
        JOIN users ON users.id = webinars.organizer_id
        WHERE webinars.id = ?
    `;

    const participantsQuery = `
        SELECT users.id, users.full_name, users.points,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS profile_picture_url
        FROM webinar_participants wp
        JOIN users ON users.id = wp.participant_id
        WHERE wp.webinar_id = ?
    `;

    connection.query(webinarQuery, [userId, webinarId], (err, webinarResults) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (webinarResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found'
            });
        }

        connection.query(participantsQuery, [webinarId], (err2, participantResults) => {
            if (err2) {
                return res.status(500).json({ error: 'Database error', details: err2 });
            }

            console.log(webinarResults[0]);

            res.json({
                success: true,
                webinar: webinarResults[0],
                participants: participantResults
            });
        });
    });
};


exports.toggleRegister = (req, res) => {
    const userId = req.userId;        // reactor_id
    const { webinarId } = req.body;      // post_id sent from frontend


    const checkQuery = `
        SELECT 1 
        FROM webinar_participants 
        WHERE webinar_id = ? AND participant_id = ?;
    `;

    connection.query(checkQuery, [webinarId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error.",
                error: err
            });
        }

        if (results.length > 0) {
            // Reaction exists → delete it
            const deleteQuery = `
                DELETE FROM webinar_participants 
                WHERE webinar_id = ? AND participant_id = ?
            `;
            connection.query(deleteQuery, [webinarId, userId], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err2
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "unregistered"
                });
            });
        } else {
            // Reaction does not exist → insert it
            const insertQuery = `
                INSERT INTO webinar_participants (webinar_id, participant_id) 
                VALUES (?, ?)
            `;
            connection.query(insertQuery, [webinarId, userId], (err3) => {
                if (err3) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err3
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "registered"
                });
            });
        }
    });
};