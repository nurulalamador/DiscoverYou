const connection = require('../config/database'); // your MySQL connection
const multer = require('multer');

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


exports.getPreviousContest = (req, res) => {
    const now = new Date();
    const previousQuery = `
        SELECT contests.*, 
            TIMESTAMPDIFF(SECOND, ?, contests.ending_time) AS ending_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url
        FROM contests
        JOIN users ON users.id = contests.organizer_id
        WHERE contests.ending_time < ?
    `;

    connection.query(previousQuery, [now, now], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json({
            success: true,
            contests: results,
        });
    });
};


exports.getSingleContest = (req, res) => {
    const userId = req.userId; // Retrieved from verifyToken middleware
    const contestId = req.params.id;

    const now = new Date();
    const contestQuery = `
        SELECT contests.*, 
            TIMESTAMPDIFF(SECOND, NOW(), contests.ending_time) AS ending_in,
            TIMESTAMPDIFF(SECOND, NOW(), contests.start_time) AS starting_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url,
            CASE
                WHEN contests.start_time <= NOW() AND contests.ending_time >= NOW() THEN 'ongoing'
                WHEN contests.start_time > NOW() THEN 'upcoming'
                ELSE 'previous'
            END AS type,
            (SELECT COUNT(*) FROM contest_participants wp WHERE wp.contest_id = contests.id) AS total_participants,
            (SELECT EXISTS(
                SELECT 1 FROM contest_participants wp2 
                WHERE wp2.contest_id = contests.id AND wp2.participant_id = ?
            )) AS is_participated
            ,
            (SELECT EXISTS(
                SELECT 1 FROM contest_submissions cs
                WHERE cs.contest_id = contests.id AND cs.participant_id = ?
            )) AS is_submitted
        FROM contests
        JOIN users ON users.id = contests.organizer_id
        WHERE contests.id = ?
    `;

    const participantsQuery = `
        SELECT users.id, users.full_name, users.points,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS profile_picture_url
        FROM contest_participants wp
        JOIN users ON users.id = wp.participant_id
        WHERE wp.contest_id = ?
        ORDER BY wp.score DESC
    `;

    connection.query(contestQuery, [userId, userId, contestId], (err, contestResults) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (contestResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contest not found'
            });
        }

        connection.query(participantsQuery, [contestId], (err2, participantResults) => {
            if (err2) {
                return res.status(500).json({ error: 'Database error', details: err2 });
            }

            res.json({
                success: true,
                contest: contestResults[0],
                participants: participantResults
            });
        });
    });
};


exports.toggleRegister = (req, res) => {
    const userId = req.userId;        // reactor_id
    const { contestId } = req.body;      // post_id sent from frontend


    const checkQuery = `
        SELECT 1 
        FROM contest_participants 
        WHERE contest_id = ? AND participant_id = ?;
    `;

    connection.query(checkQuery, [contestId, userId], (err, results) => {
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
                DELETE FROM contest_participants 
                WHERE contest_id = ? AND participant_id = ?
            `;
            connection.query(deleteQuery, [contestId, userId], (err2) => {
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
                INSERT INTO contest_participants (contest_id, participant_id) 
                VALUES (?, ?)
            `;
            connection.query(insertQuery, [contestId, userId], (err3) => {
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

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit (adjust as needed)
});

exports.uploadContestMedia = [
    upload.single('media'), // expect field name "media"
    (req, res) => {
        const participantId = req.userId; // from verifyToken middleware
        const contestId = req.body.contestId || req.body.contest_id;

        if (!contestId) {
            return res.status(400).json({ success: false, message: 'contestId is required' });
        }
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ success: false, message: 'media file is required' });
        }

        const mediaType = req.file.mimetype;
        const mediaBlob = req.file.buffer;

        const insertQuery = `
            INSERT INTO contest_submissions (contest_id, participant_id, media_type, media_blob)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(insertQuery, [contestId, participantId, mediaType, mediaBlob], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }
            res.status(200).json({
                success: true,
                message: 'Media uploaded',
                submissionId: result.insertId
            });
        });
    }
];
