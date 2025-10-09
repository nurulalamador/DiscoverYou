const connection = require('../config/database');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.array("media", 5);

exports.getInboxMessages = (req, res) => {
    const userId = req.userId;

    connection.query(
        `
        SELECT 
            m.id,
            m.content,
            m.send_at,
            m.updated_at,
            m.is_seen,
            (m.sender_id = ?) AS sent_by_me,
            u.id AS person_id,
            u.full_name AS person_name,
            CASE 
                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                ELSE NULL
            END AS person_profile_picture_url
        FROM messages AS m
        INNER JOIN (
            SELECT 
                CASE 
                    WHEN sender_id = ? THEN receiver_id
                    ELSE sender_id
                END AS person_id,
                MAX(send_at) AS latest_time
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY person_id
        ) AS latest
        ON (
            ( (m.sender_id = ? AND m.receiver_id = latest.person_id)
            OR (m.receiver_id = ? AND m.sender_id = latest.person_id) )
            AND m.send_at = latest.latest_time
        )
        JOIN users AS u 
            ON u.id = latest.person_id
        ORDER BY m.send_at DESC;
        `,
        [userId, userId, userId, userId, userId, userId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            res.status(200).json({
                success: true,
                messages: results
            });
        }
    );
};


exports.getSingleMessages = (req, res) => {
    const personId = req.params.id;
    const userId = req.userId;

    connection.query(
        `
        SELECT id, full_name, username,
            CASE 
                WHEN profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', id)
                ELSE NULL
            END AS profile_picture_url
        FROM users
        WHERE id = ?;
        `,
        [personId],
        function (err, personResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            connection.query(
                `
                SELECT 
                    m.id,
                    m.content,
                    m.send_at,
                    m.is_seen,
                    (m.sender_id = ?) AS sent_by_me
                FROM messages AS m
                WHERE 
                    (m.sender_id = ? AND m.receiver_id = ?)
                    OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.send_at ASC;
                `,
                [userId, userId, personId, personId, userId],
                function (err, messageResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        person: personResults[0],
                        messages: messageResults
                    });
                }
            );
        }
    );
};


exports.sendMessage = (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.userId;

    if (!receiverId || !content) {
        return res.status(400).json({
            success: false,
            message: "Receiver ID and content are required."
        });
    }

    connection.query(
        `
        INSERT INTO messages (sender_id, receiver_id, content, send_at, is_seen)
        VALUES (?, ?, ?, NOW(), FALSE);
        `,
        [senderId, receiverId, content],
        function (err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }
            res.status(201).json({
                success: true,
                message: "Message sent successfully.",
                messageId: result.insertId
            });
        }
    );
}