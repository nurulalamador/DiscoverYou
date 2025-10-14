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

            res.status(200).json({
                success: true,
                hiring: results
            });
        }
    );
};

exports.getSingleHiring = (req, res) => {
    const hiringId = req.params.id;

    connection.query(
        `
        SELECT 
            h.id,
            h.name,
            h.company,
            h.category,
            h.description,
            h.type,
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
        JOIN users AS u ON h.hirer_id = u.id
        WHERE h.id = ?;
        `,
        [hiringId],
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
