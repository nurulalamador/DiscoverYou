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
    const postId = req.params.id;

    const userId = req.userId;

    connection.query(
        `
        SELECT 
            h.id,
            h.content,
            h.category,
            h.creator_id,
            h.created_at,
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
            WHERE spr.post_id = h.id) AS total_reactions,
            (SELECT COUNT(*) 
            FROM showcase_post_comments spc 
            WHERE spc.post_id = h.id) AS total_comments,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM showcase_post_reactions spr 
                    WHERE spr.post_id = h.id
                    AND spr.reactor_id = ?
                )
                THEN TRUE
                ELSE FALSE
            END AS is_reacted
        FROM showcase_posts AS sp
        JOIN users AS u ON h.creator_id = u.id
        LEFT JOIN showcase_post_media AS spm ON h.id = spm.post_id
        WHERE h.id = ?
        GROUP BY h.id;
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
                    media
                }
            });
        }
    );
};

