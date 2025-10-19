const connection = require('../config/database');

exports.getAllUser = async (req, res) => {
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
                ) AS following
        FROM users AS u
        LEFT JOIN user_interests ui ON ui.user_id = u.id
        WHERE u.role = 'student' OR u.role = 'hirer'
        GROUP BY u.id;`,
        [],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            const userData = results;
            userData.forEach(u => {
                u.interests = u.interests
                    ? u.interests.split(',').map(i => i.trim()).filter(Boolean)
                    : [];
            });

            res.status(200).json({
                success: true,
                users: userData
            });
        }
    );
};

exports.getAllWebinar = (req, res) => {

    const query = `
        SELECT webinars.*, 
            TIMESTAMPDIFF(SECOND, NOW(), webinars.ending_time) AS ending_in,
            TIMESTAMPDIFF(SECOND, NOW(), webinars.start_time) AS starting_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url,
            CASE
                WHEN webinars.start_time <= NOW() AND webinars.ending_time >= NOW() THEN 'Ongoing'
                WHEN webinars.start_time > NOW() THEN 'Upcoming'
                ELSE 'Over'
            END AS type,
            (SELECT COUNT(*) FROM webinar_participants wp WHERE wp.webinar_id = webinars.id) AS total_participants
        FROM webinars
        JOIN users ON users.id = webinars.organizer_id;
    `;

    connection.query(
        query,
        [],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }

            res.json({
                success: true,
                webinars: results
            });
        });
};

exports.getAllContest = (req, res) => {

    const query = `
        SELECT contests.*, 
            TIMESTAMPDIFF(SECOND, NOW(), contests.ending_time) AS ending_in,
            TIMESTAMPDIFF(SECOND, NOW(), contests.start_time) AS starting_in,
            users.full_name AS organizer_name,
            CASE 
                WHEN users.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', users.id)
                ELSE NULL
            END AS organizer_profile_picture_url,
            CASE
                WHEN contests.start_time <= NOW() AND contests.ending_time >= NOW() THEN 'Ongoing'
                WHEN contests.start_time > NOW() THEN 'Upcoming'
                ELSE 'Over'
            END AS type,
            (SELECT COUNT(*) FROM contest_participants wp WHERE wp.contest_id = contests.id) AS total_participants
        FROM contests
        JOIN users ON users.id = contests.organizer_id;
    `;

    connection.query(
        query,
        [],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }

            res.json({
                success: true,
                contests: results
            });
        });
};


exports.getAllCourse = (req, res) => {
    connection.query(
        `SELECT c.id, c.name, c.description, c.price, c.category, c.instructor_id, u.full_name AS instructor_name,
            CASE 
                WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
                ELSE NULL
            END AS cover_image_url,
            CASE 
                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                ELSE NULL
            END AS instructor_profile_picture_url,
            (SELECT COUNT(*) 
            FROM course_participants cp2 
            WHERE cp2.course_id = c.id) AS total_participants,
            (SELECT COUNT(*) 
            FROM course_materials cm 
            WHERE cm.course_id = c.id) AS total_materials
        FROM courses AS c
        JOIN users AS u
        ON c.instructor_id = u.id;`,
        [],
        function (err, courseResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            res.status(200).json({
                success: true,
                courses: courseResults
            });
        }
    );
};