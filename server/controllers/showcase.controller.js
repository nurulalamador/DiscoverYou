const connection = require('../config/database');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadMiddleware = upload.array("media", 5);

exports.addPost = (req, res) => {
    const { content, category } = req.body;
    const userId = req.userId;

    // 1️⃣ Insert the post
    connection.query(
        'INSERT INTO showcase_posts (content, creator_id, category) VALUES (?, ?, ?)',
        [content, userId, category],
        function (err, results) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error while inserting post.",
                    error: err
                });
            }

            const postId = results.insertId;

            // 2️⃣ If no media uploaded, return success
            if (!req.files || req.files.length === 0) {
                return res.status(200).json({
                    success: true,
                    postId: postId
                });
            }

            // 3️⃣ Insert media into showcase_post_media
            const mediaInserts = req.files.map(file => {
                return [
                    postId,
                    file.buffer,          // binary data from multer
                    file.mimetype         // e.g. "image/png", "video/mp4", "audio/mpeg"
                ];
            });

            connection.query(
                'INSERT INTO showcase_post_media (post_id, media_blob, media_type) VALUES ?',
                [mediaInserts],
                function (mediaErr) {
                    if (mediaErr) {
                        console.log(mediaErr);
                        return res.status(500).json({
                            success: false,
                            message: "Database error while inserting media.",
                            error: mediaErr
                        });
                    }

                    res.status(200).json({
                        success: true,
                        postId: postId
                    });
                }
            );
        }
    );
};

exports.getPostMedia = (req, res) => {
    const mediaId = req.params.id;

    connection.query(
        "SELECT media_blob, media_type FROM showcase_post_media WHERE id = ?",
        [mediaId],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (results.length === 0 || !results[0].media_blob) {
                return res.status(404).json({
                    success: false,
                    message: "Meidia not found."
                });
            }

            // Assuming cover_image is stored as BLOB or binary
            const media = results[0];

            res.writeHead(200, {
                'Content-Type': media.media_type, // adjust based on actual image type
                'Content-Length': media.media_blob.length
            });
            res.end(media.media_blob);
        }
    );
};

exports.getAllPosts = (req, res) => {
    const userId = req.userId;

    connection.query(
        `
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
        GROUP BY sp.id
        ORDER BY sp.id DESC;
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

            // Transform media_urls and media_types into an array of objects for easier frontend use
            const posts = results.map(post => {
                let media = [];
                if (post.media_urls) {
                    const urls = post.media_urls.split(",");
                    const types = post.media_types.split(",");
                    media = urls.map((url, i) => ({
                        url,
                        type: types[i]
                    }));
                }
                return {
                    id: post.id,
                    content: post.content,
                    category: post.category,
                    creator_id: post.creator_id,
                    creator_name: post.creator_name,
                    created_at: post.created_at,
                    total_reactions: post.total_reactions,
                    total_comments: post.total_comments,
                    is_reacted: post.is_reacted,
                    creator_profile_picture_url: post.creator_profile_picture_url,
                    media
                };
            });

            res.status(200).json({
                success: true,
                posts
            });
        }
    );
};

exports.addComment = (req, res) => {
    const userId = req.userId;
    const { postId, content } = req.body;


    if (!postId || !content) {
        return res.status(400).json({
            success: false,
            message: "postId and comment are required."
        });
    }

    connection.query(
        'INSERT INTO showcase_post_comments (post_id, commenter_id, content) VALUES (?, ?, ?)',
        [postId, userId, content],
        function (err, results) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error while adding comment.",
                    error: err
                });
            }

            res.status(200).json({
                success: true,
                commentId: results.insertId
            });
        }
    );
};


exports.getSinglePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    // 1. Get the post and its media
    connection.query(
        `
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
        WHERE sp.id = ?
        GROUP BY sp.id;
        `,
        [userId, postId],
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
                    message: "Post not found."
                });
            }

            let post = results[0];
            let media = [];

            if (post.media_urls) {
                const urls = post.media_urls.split(",");
                const types = post.media_types.split(",");
                media = urls.map((url, i) => ({
                    url,
                    type: types[i]
                }));
            }

            // 2. Get comments for the post, including commenter info
            connection.query(
                `
                SELECT 
                    spc.id,
                    spc.content,
                    spc.commented_at,
                    spc.commenter_id,
                    u.full_name AS commenter_name,
                    CASE 
                        WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                        ELSE NULL
                    END AS commenter_profile_picture_url
                FROM showcase_post_comments spc
                JOIN users u ON spc.commenter_id = u.id
                WHERE spc.post_id = ?
                ORDER BY spc.commented_at ASC
                `,
                [postId],
                function (cErr, comments) {
                    if (cErr) {
                        console.log(cErr);
                        return res.status(500).json({
                            success: false,
                            message: "Database error while fetching comments.",
                            error: cErr
                        });
                    }

                    res.status(200).json({
                        success: true,
                        post: {
                            id: post.id,
                            content: post.content,
                            category: post.category,
                            creator_id: post.creator_id,
                            creator_name: post.creator_name,
                            created_at: post.created_at,
                            total_reactions: post.total_reactions,
                            total_comments: post.total_comments,
                            is_reacted: post.is_reacted,
                            creator_profile_picture_url: post.creator_profile_picture_url,
                            media,
                            comments: comments || []
                        }
                    });
                }
            );
        }
    );
};


exports.togglePostReaction = (req, res) => {
    const userId = req.userId;        // reactor_id
    const { postId } = req.body;      // post_id sent from frontend


    const checkQuery = `
        SELECT 1 
        FROM showcase_post_reactions 
        WHERE post_id = ? AND reactor_id = ? 
        LIMIT 1
    `;

    connection.query(checkQuery, [postId, userId], (err, results) => {
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
                DELETE FROM showcase_post_reactions 
                WHERE post_id = ? AND reactor_id = ?
            `;
            connection.query(deleteQuery, [postId, userId], (err2) => {
                if (err2) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err2
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "unliked"
                });
            });
        } else {
            // Reaction does not exist → insert it
            const insertQuery = `
                INSERT INTO showcase_post_reactions (post_id, reactor_id) 
                VALUES (?, ?)
            `;
            connection.query(insertQuery, [postId, userId], (err3) => {
                if (err3) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err3
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "liked"
                });
            });
        }
    });
};
