const connection = require('../config/database'); // your MySQL connection

exports.getProfile = async (req, res) => {
    const userId = req.userId;
    const personId = req.params.id;

    connection.query(
        `SELECT u.id, u.full_name, u.email, u.username, u.gender, u.date_of_birth, u.mobile_no, u.points,
            CASE 
                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                ELSE NULL
            END AS profile_picture_url,
            GROUP_CONCAT(ui.interest) AS interests,
                (
                    SELECT COUNT(*) 
                    FROM user_followers uf 
                    WHERE uf.user_id = u.id
                ) AS followers,
                (
                    SELECT COUNT(*) 
                    FROM user_followers uf2 
                    WHERE uf2.follower_id = u.id
                ) AS following,
                (
                    SELECT 
                        CASE 
                            WHEN COUNT(*) > 0 THEN TRUE 
                            ELSE FALSE 
                        END 
                    FROM user_followers uf3 
                    WHERE uf3.user_id = u.id AND uf3.follower_id = ?
                ) AS is_followed
        FROM users AS u
        LEFT JOIN user_interests ui ON ui.user_id = u.id
        WHERE u.id = ?`,
        [userId, personId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            const userData = results[0];
            userData.interests = userData.interests
                ? userData.interests.split(',')
                : [];

            res.status(200).json({
                success: true,
                user: userData
            });
        }
    );
};

exports.toggleFollow = (req, res) => {
    const personId = req.body.personId; // The user to be followed/unfollowed
    const userId = req.userId;  // The user performing the action

    if (!userId || !personId || userId === personId) {
        return res.status(400).json({
            success: false,
            message: "Invalid user IDs."
        });
    }

    connection.query(
        'SELECT * FROM user_followers WHERE user_id = ? AND follower_id = ?',
        [personId, userId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length > 0) {
                connection.query(
                    'DELETE FROM user_followers WHERE user_id = ? AND follower_id = ?',
                    [personId, userId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Database error while unfollowing.",
                                error: err
                            });
                        }
                        res.status(200).json({
                            success: true,
                            status: "unfollowed",
                            message: "Unfollowed successfully."
                        });
                    }
                );
            } else {
                // Not following, so follow (insert)
                connection.query(
                    'INSERT INTO user_followers (user_id, follower_id) VALUES (?, ?)',
                    [personId, userId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Database error while following.",
                                error: err
                            });
                        }
                        res.status(201).json({
                            success: true,
                            status: "followed",
                            message: "Followed successfully."
                        });
                    }
                );
            }
        }
    );
};

exports.getProfileImage = (req, res) => {
    const userId = req.params.id;

    connection.query(
        'SELECT profile_picture FROM users WHERE id = ?',
        [userId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length === 0 || !results[0].profile_picture) {
                return res.status(404).json({
                    success: false,
                    message: "Image not found."
                });
            }

            // Assuming cover_image is stored as BLOB or binary
            const image = results[0].profile_picture;

            res.writeHead(200, {
                'Content-Type': 'image/jpeg', // adjust based on actual image type
                'Content-Length': image.length
            });
            res.end(image);
        }
    );
};

exports.addUserInterests = (req, res) => {
    const userId = req.userId;
    const interests = req.body.interests; // expects an array

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid interests input"
        });
    }

    // Step 1: Remove previous interests
    connection.query(
        'DELETE FROM user_interests WHERE user_id = ?',
        [userId],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error while deleting interests",
                    error: err
                });
            }

            // Step 2: Insert all new interests
            const insertPromises = interests.map(interest => {
                return new Promise((resolve, reject) => {
                    connection.query(
                        'INSERT INTO user_interests (user_id, interest) VALUES (?, ?)',
                        [userId, interest],
                        function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            });

            Promise.all(insertPromises)
                .then(() => {
                    res.status(201).json({
                        success: true,
                        message: "User interests updated successfully"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        message: "Database error while adding interests",
                        error: err
                    });
                });
        }
    );
};
exports.getInitialData = (req, res) => {
    const userId = req.userId;

    connection.query(
        `SELECT COUNT(*) AS total_unseen_messages
        FROM messages m
        WHERE m.receiver_id = ? AND m.is_seen = 0`,
        [userId],
        function (err, unseenMessageResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }
            connection.query(
                `SELECT COUNT(*) AS total_unseen_notifications
                FROM notifications n
                WHERE n.receiver_id = ? AND n.is_seen = 0`,
                [userId],
                function (err, unseenNotificationResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }
                    res.status(200).json({
                        success: true,
                        total_unseen_messages: unseenMessageResults[0].total_unseen_messages,
                        total_unseen_notifications: unseenNotificationResults[0].total_unseen_notifications
                    });
                }
            );
        }
    );
}
