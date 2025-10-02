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

exports.getAllCourses = (req, res) => {
    connection.query(
        `SELECT c.id, c.name, c.description, c.category, u.full_name AS instructor_name,
                CASE 
                    WHEN c.cover_image IS NOT NULL THEN CONCAT('/course/image/', c.id)
                    ELSE NULL
                END AS cover_image_url
         FROM courses AS c
         JOIN users AS u
         ON c.instructor_id = u.id`,
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
                courses: results
            });
        }
    );
};
