const e = require('express');
const connection = require('../config/database'); // your MySQL connection

exports.getCourseImage = (req, res) => {
    const courseId = req.params.id;

    connection.query(
        'SELECT cover_image FROM courses WHERE id = ?',
        [courseId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length === 0 || !results[0].cover_image) {
                return res.status(404).json({
                    success: false,
                    message: "Image not found."
                });
            }

            // Assuming cover_image is stored as BLOB or binary
            const image = results[0].cover_image;

            res.writeHead(200, {
                'Content-Type': 'image/jpeg', // adjust based on actual image type
                'Content-Length': image.length
            });
            res.end(image);
        }
    );
};

exports.getMaterial = (req, res) => {
    const { courseId, materialId, userId } = req.params;

    connection.query(
        'SELECT media_blob, media_type FROM course_materials WHERE id = ?',
        [materialId],
        function (err, results) {
            if (err) {
                throw err;
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length === 0 || !results[0].media_blob) {
                return res.status(404).json({
                    success: false,
                    message: "Material not found."
                });
            }

            // Check if entry exists in course_material_completed
            connection.query(
                'SELECT 1 FROM course_material_completed WHERE participant_id = ? AND material_id = ?',
                [userId, materialId],
                function (err, completedResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    // If not completed, insert entry
                    if (completedResults.length === 0) {
                        connection.query(
                            'INSERT INTO course_material_completed (participant_id, material_id, course_id) VALUES (?, ?, ?)',
                            [userId, materialId, courseId],
                            function (err) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Database error.",
                                        error: err
                                    });
                                }
                                // Send media after marking as completed
                                const material = results[0].media_blob;
                                res.writeHead(200, {
                                    'Content-Type': results[0].media_type,
                                    'Content-Length': material.length
                                });
                                res.end(material);
                            }
                        );
                    } else {
                        // Already completed, just send media
                        const material = results[0].media_blob;
                        res.writeHead(200, {
                            'Content-Type': results[0].media_type,
                            'Content-Length': material.length
                        });
                        res.end(material);
                    }
                }
            );
        }
    );
};

exports.getAllCourses = (req, res) => {
    const userId = req.userId;

    connection.query(
        `SELECT c.id, c.name, c.description, c.category, c.instructor_id, u.full_name AS instructor_name,
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
        );`,
        [userId],
        function (err, exploreCourseResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            connection.query(
                `SELECT c.id, c.name, c.description, c.category, u.full_name AS instructor_name,
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
                );`,
                [userId, userId],
                function (err, enrolledCourseResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        exploreCourses: exploreCourseResults,
                        enrolledCourses: enrolledCourseResults
                    });
                }
            );
        }
    );
};

exports.getSingleCourse = (req, res) => {
    const courseId = req.params.id;
    const userId = req.userId;

    connection.query(
        `SELECT c.id, c.name, c.description, c.price, c.category, c.instructor_id, u.full_name AS instructor_name,
            CASE 
                WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
                ELSE NULL
            END AS cover_image_url,
            CASE 
                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                ELSE NULL
            END AS profile_picture_url,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM course_participants cp
                    WHERE cp.course_id = c.id
                    AND cp.participant_id = ?
                )
                THEN TRUE
                ELSE FALSE
            END AS is_enrolled,
            (SELECT COUNT(*) 
            FROM course_participants cp2 
            WHERE cp2.course_id = c.id) AS total_participants,
            (SELECT COUNT(*) 
            FROM course_materials cm 
            WHERE cm.course_id = c.id) AS total_materials
        FROM courses AS c
        JOIN users AS u
        ON c.instructor_id = u.id
        WHERE c.id = ?;`,
        [userId, courseId],
        function (err, courseResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            connection.query(
                `SELECT cm.id, cm.course_id, cm.name, cm.media_type,
                    CASE 
                        WHEN cm.media_blob IS NOT NULL THEN CONCAT('/course/material/', cm.id)
                        ELSE NULL
                    END AS material_url,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM course_material_completed cmc
                            WHERE cmc.material_id = cm.id
                            AND cmc.participant_id = ?
                        )
                        THEN TRUE
                        ELSE FALSE
                    END AS is_completed
                FROM course_materials AS cm
                WHERE cm.course_id = ?;`,
                [userId, courseId],
                function (err, materialResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        course: courseResults[0],
                        materials: materialResults
                    });
                }
            );
        }
    );
};

exports.enrollInCourse = (req, res) => {
    const userId = req.userId;
    const courseId = req.body.courseId;

    connection.query(
        'SELECT 1 FROM course_participants WHERE participant_id = ? AND course_id = ?',
        [userId, courseId],
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


// exports.getEnrolledCourses = (req, res) => {
//     const userId = req.userId;

//     connection.query(
//         `SELECT c.id, c.name, c.description, c.category, u.full_name AS instructor_name,
//                 CASE 
//                     WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
//                     ELSE NULL
//                 END AS cover_image_url,
//                 CASE 
//                     WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
//                     ELSE NULL
//                 END AS profile_picture_url
//         FROM courses AS c
//         JOIN users AS u
//         ON c.instructor_id = u.id
//         WHERE EXISTS (
//             SELECT 1
//             FROM course_participants cp
//             WHERE cp.course_id = c.id
//             AND cp.participant_id = ?
//         );`,
//         [userId],
//         function (err, results) {
//             if (err) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "Database error.",
//                     error: err
//                 });
//             }

//             res.status(200).json({
//                 success: true,
//                 courses: results
//             });
//         }
//     );
// };