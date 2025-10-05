const connection = require('../config/database'); // your MySQL connection

exports.addPost = (req, res) => {
    const { content, category } = req.body;
    const userId = req.userId;

    connection.query(
        'INSERT INTO showcase_posts (content, creator_id, category) VALUES (?, ?, ?)',
        [content, userId, category],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }
            res.status(200).json({
                success: true
            });
        }
    );
};

