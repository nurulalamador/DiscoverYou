const connection = require('../config/database');

exports.getAllHiring = (req, res) => {
    const userId = req.userId;

    connection.query(
        `
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
            FROM  hiring_applicants ha 
            WHERE ha.hiring_id = h.id) AS total_applicants
        FROM hiring AS h
        JOIN users AS u ON h.hirer_id = u.id;
        `,
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            connection.query(
                `
                SELECT COUNT(*) AS applied_count
                FROM hiring_applicants
                WHERE applicant_id = ? AND status = 'pending';
                `,
                [userId],
                function (err2, appliedResults) {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err2
                        });
                    }

                    res.status(200).json({
                        success: true,
                        hirings: results,
                        pending: appliedResults[0].applied_count
                    });
                }
            );
        }
    );
};


exports.getPendingHiring = (req, res) => {
    const userId = req.userId;

    connection.query(
        `
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
            WHERE ha.hiring_id = h.id) AS total_applicants,
            ha.status AS application_status
        FROM hiring AS h
        JOIN users AS u ON h.hirer_id = u.id
        JOIN hiring_applicants ha ON ha.hiring_id = h.id
        WHERE ha.applicant_id = ?;
        `,
        [userId],
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
                hirings: results
            });
        }
    );
};

exports.getSingleHiring = (req, res) => {
    const hiringId = req.params.id;
    const userId = req.userId;

    connection.query(
        `
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
            FROM  hiring_applicants ha 
            WHERE ha.hiring_id = h.id) AS total_applicants,
            EXISTS (
                SELECT 1 
                FROM hiring_applicants ha2 
                WHERE ha2.hiring_id = h.id AND ha2.applicant_id = ?
            ) AS is_applied,
            (
                SELECT status 
                FROM hiring_applicants ha3 
                WHERE ha3.hiring_id = h.id AND ha3.applicant_id = ?
            ) AS application_status
        FROM hiring AS h
        JOIN users AS u ON h.hirer_id = u.id
        WHERE h.id = ?;
        `,
        [userId, userId, hiringId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Hiring not found."
                });
            }
            res.status(200).json({
                success: true,
                hiring: results[0]
            });
        }
    );
};


exports.applyHiring = (req, res) => {
    const userId = req.userId;
    const hiringId = req.body.hiringId;

    connection.query(
        'SELECT 1 FROM hiring_applicants WHERE applicant_id = ? AND hiring_id = ?',
        [userId, hiringId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Already enrolled in this course."
                });
            }

            connection.query(
                'INSERT INTO course_participants (participant_id, course_id) VALUES (?, ?)',
                [userId, courseId],
                function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message: "Successfully enrolled in the course."
                    });
                }
            );
        }
    );
};


exports.toggleApply = (req, res) => {
    const userId = req.userId;        // reactor_id
    const { hiringId } = req.body;      // post_id sent from frontend


    const checkQuery = `
        SELECT 1 
        FROM hiring_applicants 
        WHERE hiring_id = ? AND applicant_id = ?;
    `;

    connection.query(checkQuery, [hiringId, userId], (err, results) => {
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
                DELETE FROM hiring_applicants 
                WHERE hiring_id = ? AND applicant_id = ?
            `;
            connection.query(deleteQuery, [hiringId, userId], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err2
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "unapplied"
                });
            });
        } else {
            // Reaction does not exist → insert it
            const insertQuery = `
                INSERT INTO hiring_applicants (hiring_id, applicant_id) 
                VALUES (?, ?)
            `;
            connection.query(insertQuery, [hiringId, userId], (err3) => {
                if (err3) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err3
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "applied"
                });
            });
        }
    });
};