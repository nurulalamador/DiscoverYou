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


exports.getLeaderboard = async (req, res) => {
    connection.query(
        `SELECT u.id, u.full_name, u.email, u.username, u.gender, u.date_of_birth, u.mobile_no, u.points,
            CASE 
                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                ELSE NULL
            END AS profile_picture_url
        FROM users AS u
        ORDER BY points DESC;`,
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
                leaderboard: results
            });
        }
    );
};

// Home data aggregator: upcoming contests, upcoming webinars, enrolled courses,
// browsing courses (limit 5), top hiring (limit 5), top showcase posts by likes (limit 5)
exports.getHomeData = (req, res) => {
    const userId = req.userId;
    const now = new Date();
    const promises = {};

    // Upcoming contests (start_time > now)
    promises.upcomingContests = new Promise((resolve, reject) => {
        const q = `
            SELECT contests.*, 
                TIMESTAMPDIFF(SECOND, ?, contests.start_time) AS starting_in,
                users.full_name AS organizer_name,
                CASE 
                    WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                    ELSE NULL
                END AS organizer_profile_picture_url
            FROM contests
            JOIN users ON users.id = contests.organizer_id
            WHERE contests.start_time > ?`;
        connection.query(q, [now, now], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Upcoming webinars (start_time > now)
    promises.upcomingWebinars = new Promise((resolve, reject) => {
        const q = `
            SELECT webinars.*, 
                TIMESTAMPDIFF(SECOND, ?, webinars.start_time) AS starting_in,
                users.full_name AS organizer_name,
                CASE 
                    WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                    ELSE NULL
                END AS organizer_profile_picture_url
            FROM webinars
            JOIN users ON users.id = webinars.organizer_id
            WHERE webinars.start_time > ?`;
        connection.query(q, [now, now], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Enrolled courses (reuse enrolled query from course.controller)
    promises.enrolledCourses = new Promise((resolve, reject) => {
        const q = `SELECT c.id, c.name, c.description, c.category, u.full_name AS instructor_name,
                    CASE 
                        WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
                        ELSE NULL
                    END AS cover_image_url,
                    CASE 
                        WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                        ELSE NULL
                    END AS profile_picture_url,
                    CASE 
                        WHEN (SELECT COUNT(*) FROM course_materials cm WHERE cm.course_id = c.id) = 0 
                        THEN 0
                        ELSE (
                            (
                                SELECT COUNT(*) 
                                FROM course_material_completed cmc
                                JOIN course_materials cm ON cmc.material_id = cm.id
                                WHERE cm.course_id = c.id
                                    AND cmc.participant_id = ?
                            ) * 100.0
                            /
                            (SELECT COUNT(*) FROM course_materials cm WHERE cm.course_id = c.id)
                        )
                    END AS completed
                FROM courses AS c
                JOIN users AS u
                ON c.instructor_id = u.id
                WHERE EXISTS (
                    SELECT 1
                    FROM course_participants cp
                    WHERE cp.course_id = c.id
                    AND cp.participant_id = ?
                )
                ORDER BY completed
                LIMIT 1;`;
        connection.query(q, [userId, userId], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Browsing courses (not enrolled) - limit 5
    promises.browseCourses = new Promise((resolve, reject) => {
        const q = `SELECT c.id, c.name, c.description, c.category, c.instructor_id, u.full_name AS instructor_name,
                    CASE 
                        WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
                        ELSE NULL
                    END AS cover_image_url,
                    CASE 
                        WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                        ELSE NULL
                    END AS profile_picture_url
            FROM courses AS c
            JOIN users AS u
            ON c.instructor_id = u.id
            WHERE NOT EXISTS (
                SELECT 1
                FROM course_participants cp
                WHERE cp.course_id = c.id
                AND cp.participant_id = ?
            )
            LIMIT 5;`;
        connection.query(q, [userId], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Top hiring (by number of applicants) - limit 5
    promises.topHiring = new Promise((resolve, reject) => {
        const q = `
            SELECT 
                h.id,
                h.name,
                h.company,
                h.category,
                h.description,
                h.type,
                h.work_location,
                h.salary,
                h.hirer_id,
                h.last_date,
                u.full_name AS hirer_name,
                CASE 
                    WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                    ELSE NULL
                END AS hirer_profile_picture_url,
                (SELECT COUNT(*) 
                    FROM hiring_applicants ha 
                    WHERE ha.hiring_id = h.id) AS total_applicants
            FROM hiring AS h
            JOIN users AS u ON h.hirer_id = u.id
            ORDER BY total_applicants DESC
            LIMIT 2;`;
        connection.query(q, (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Top showcase posts by likes (reactions) - limit 5
    promises.topShowcase = new Promise((resolve, reject) => {
        const q = `
            SELECT 
                sp.id,
                sp.content,
                sp.category,
                sp.creator_id,
                sp.created_at,
                u.full_name AS creator_name,
                CASE 
                    WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                    ELSE NULL
                END AS creator_profile_picture_url,
                GROUP_CONCAT(
                    CASE 
                        WHEN spm.id IS NOT NULL THEN CONCAT('/showcase/media/', spm.id)
                        ELSE NULL
                    END
                ) AS media_urls,
                GROUP_CONCAT(
                    CASE
                        WHEN spm.media_type IS NOT NULL THEN spm.media_type
                        ELSE NULL
                    END
                ) AS media_types,
                (SELECT COUNT(*) 
                    FROM showcase_post_reactions spr 
                    WHERE spr.post_id = sp.id) AS total_reactions,
                (SELECT COUNT(*) 
                    FROM showcase_post_comments spc 
                    WHERE spc.post_id = sp.id) AS total_comments,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM showcase_post_reactions spr 
                        WHERE spr.post_id = sp.id
                        AND spr.reactor_id = ?
                    )
                    THEN TRUE
                    ELSE FALSE
                END AS is_reacted
            FROM showcase_posts AS sp
            JOIN users AS u ON sp.creator_id = u.id
            LEFT JOIN showcase_post_media AS spm ON sp.id = spm.post_id
            WHERE spm.id IS NOT NULL
            GROUP BY sp.id
            ORDER BY total_reactions DESC
            LIMIT 5;`;
        connection.query(q, [userId], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // get current user's position (rank) in leaderboard (1 = top)
    promises.currentPosition = new Promise((resolve, reject) => {
        const q = `
            SELECT 1 + (
                SELECT COUNT(*) FROM users u2
                WHERE (u2.points > u.points)
                   OR (u2.points = u.points AND u2.id < u.id)
            ) AS position
            FROM users u
            WHERE u.id = ?
            LIMIT 1;
        `;
        connection.query(q, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows && rows.length ? rows[0].position : null);
        });
    });

    Promise.all([
        promises.upcomingContests,
        promises.upcomingWebinars,
        promises.enrolledCourses,
        promises.browseCourses,
        promises.topHiring,
        promises.topShowcase,
        promises.currentPosition
    ])
        .then(([upcomingContests, upcomingWebinars, enrolledCourses, browseCourses, topHiring, topShowcase, currentPosition]) => {
            // transform media fields for showcase posts similar to getAllPosts logic
            const posts = (topShowcase || []).map(post => {
                let media = [];
                if (post.media_urls) {
                    const urls = post.media_urls.split(',');
                    const types = post.media_types ? post.media_types.split(',') : [];
                    media = urls.map((url, i) => ({ url, type: types[i] }));
                }
                return Object.assign({}, post, { media });
            });

            res.status(200).json({
                success: true,
                upcomingContests,
                upcomingWebinars,
                enrolledCourses,
                browseCourses,
                topHiring,
                topShowcase: posts,
                currentPosition
            });
        })
        .catch(err => {
            console.error('getHomeData error:', err);
            res.status(500).json({ success: false, message: 'Database error.', error: err });
        });
};

exports.getNotifications = (req, res) => {
    const userId = req.userId;
    connection.query(
        `SELECT * FROM notifications n
            WHERE n.receiver_id = ? 
            ORDER BY n.sent_at DESC`,
        [userId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }
            connection.query(
                `UPDATE notifications SET is_seen = 1
                WHERE receiver_id = ?`,
                [userId],
                function (err, resultsNew) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }
                    res.status(200).json({
                        success: true,
                        notifications: results
                    });
                }
            );
        }
    );
};

exports.getSearchData = (req, res) => {
    const userId = req.userId;
    const now = new Date();
    const promises = {};
    let { query, category } = req.body;

    if (category == "All Category") {
        category = "";
    }
    // Upcoming contests (start_time > now)
    promises.contests = new Promise((resolve, reject) => {
        const q = `
            SELECT contests.*, 
                TIMESTAMPDIFF(SECOND, ?, contests.start_time) AS starting_in,
                users.full_name AS organizer_name,
                CASE 
                    WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                    ELSE NULL
                END AS organizer_profile_picture_url
            FROM contests
            JOIN users ON users.id = contests.organizer_id
            WHERE contests.name LIKE '%${query}%' AND contests.category LIKE '%${category}%'`;
        connection.query(q, [now], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Upcoming webinars (start_time > now)
    promises.webinars = new Promise((resolve, reject) => {
        const q = `
            SELECT webinars.*, 
                TIMESTAMPDIFF(SECOND, ?, webinars.start_time) AS starting_in,
                users.full_name AS organizer_name,
                CASE 
                    WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                    ELSE NULL
                END AS organizer_profile_picture_url
            FROM webinars
            JOIN users ON users.id = webinars.organizer_id
            WHERE webinars.name LIKE '%${query}%' AND webinars.category LIKE '%${category}%'`;
        connection.query(q, [now], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Browsing courses (not enrolled) - limit 5
    promises.courses = new Promise((resolve, reject) => {
        const q = `SELECT c.id, c.name, c.description, c.category, c.instructor_id, u.full_name AS instructor_name,
                    CASE 
                        WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
                        ELSE NULL
                    END AS cover_image_url,
                    CASE 
                        WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                        ELSE NULL
                    END AS profile_picture_url
            FROM courses AS c
            JOIN users AS u
            ON c.instructor_id = u.id
            WHERE c.name LIKE '%${query}%' AND c.category LIKE '%${category}%';`;
        connection.query(q, [userId], (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Top hiring (by number of applicants) - limit 5
    promises.hiring = new Promise((resolve, reject) => {
        const q = `
            SELECT 
                h.id,
                h.name,
                h.company,
                h.category,
                h.description,
                h.type,
                h.work_location,
                h.salary,
                h.hirer_id,
                h.last_date,
                u.full_name AS hirer_name,
                CASE 
                    WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                    ELSE NULL
                END AS hirer_profile_picture_url,
                (SELECT COUNT(*) 
                    FROM hiring_applicants ha 
                    WHERE ha.hiring_id = h.id) AS total_applicants
            FROM hiring AS h
            JOIN users AS u ON h.hirer_id = u.id
            WHERE h.name LIKE '%${query}%' AND h.category LIKE '%${category}%'
            ORDER BY total_applicants DESC;`;
        connection.query(q, (err, rows) => err ? reject(err) : resolve(rows));
    });

    // Top showcase posts by likes (reactions) - limit 5
    promises.showcase = new Promise((resolve, reject) => {
        const q = `
            SELECT 
                sp.id,
                sp.content,
                sp.category,
                sp.creator_id,
                sp.created_at,
                u.full_name AS creator_name,
                CASE 
                    WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                    ELSE NULL
                END AS creator_profile_picture_url,
                GROUP_CONCAT(
                    CASE 
                        WHEN spm.id IS NOT NULL THEN CONCAT('/showcase/media/', spm.id)
                        ELSE NULL
                    END
                ) AS media_urls,
                GROUP_CONCAT(
                    CASE
                        WHEN spm.media_type IS NOT NULL THEN spm.media_type
                        ELSE NULL
                    END
                ) AS media_types,
                (SELECT COUNT(*) 
                    FROM showcase_post_reactions spr 
                    WHERE spr.post_id = sp.id) AS total_reactions,
                (SELECT COUNT(*) 
                    FROM showcase_post_comments spc 
                    WHERE spc.post_id = sp.id) AS total_comments,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM showcase_post_reactions spr 
                        WHERE spr.post_id = sp.id
                        AND spr.reactor_id = ?
                    )
                    THEN TRUE
                    ELSE FALSE
                END AS is_reacted
            FROM showcase_posts AS sp
            JOIN users AS u ON sp.creator_id = u.id
            LEFT JOIN showcase_post_media AS spm ON sp.id = spm.post_id
            WHERE sp.content LIKE '%${query}%' AND sp.category LIKE '%${category}%'
            GROUP BY sp.id
            ORDER BY total_reactions DESC;`;
        connection.query(q, [userId], (err, rows) => err ? reject(err) : resolve(rows));
    });

    Promise.all([
        promises.contests,
        promises.webinars,
        promises.courses,
        promises.hiring,
        promises.showcase
    ])
        .then(([contests, webinars, courses, hiring, showcase]) => {
            // transform media fields for showcase posts similar to getAllPosts logic
            const posts = (showcase || []).map(post => {
                let media = [];
                if (post.media_urls) {
                    const urls = post.media_urls.split(',');
                    const types = post.media_types ? post.media_types.split(',') : [];
                    media = urls.map((url, i) => ({ url, type: types[i] }));
                }
                return Object.assign({}, post, { media });
            });

            res.status(200).json({
                success: true,
                contests,
                webinars,
                courses,
                hiring,
                showcase: posts
            });
        })
        .catch(err => {
            console.error('getHomeData error:', err);
            res.status(500).json({ success: false, message: 'Database error.', error: err });
        });
};
