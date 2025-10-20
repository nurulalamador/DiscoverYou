const connection = require('../config/database'); // your MySQL connection

exports.getAllCommunities = (req, res) => {
    const userId = req.userId;

    connection.query(
        `SELECT c.id, c.name, c.description, c.category, c.creator_id, u.full_name AS creator_name,
                CASE 
                    WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                    ELSE NULL
                END AS creator_profile_picture_url
        FROM communities AS c
        JOIN users AS u
        ON c.creator_id = u.id
        WHERE NOT EXISTS (
            SELECT 1
            FROM community_members cm
            WHERE cm.community_id = c.id
            AND cm.member_id = ?
        );`,
        [userId],
        function (err, exploreCommunityResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            connection.query(
                `SELECT c.id, c.name, c.description, c.category, c.creator_id, u.full_name AS creator_name,
                        CASE 
                            WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                            ELSE NULL
                        END AS creator_profile_picture_url
                FROM communities AS c
                JOIN users AS u
                ON c.creator_id = u.id
                WHERE EXISTS (
                    SELECT 1
                    FROM community_members cm
                    WHERE cm.community_id = c.id
                    AND cm.member_id = ?
                );`,
                [userId],
                function (err, joinedCommunityResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        exploreCommunities: exploreCommunityResults,
                        joinedCommunities: joinedCommunityResults
                    });
                }
            );
        }
    );
};



exports.getCommunityMessages = (req, res) => {
    const communityId = req.params.id;
    const userId = req.userId;

    connection.query(
        `
        SELECT id, name, category, description
        FROM communities
        WHERE id = ?;
        `,
        [communityId],
        function (err, communityResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            connection.query(
                `
                        SELECT 
                            m.id,
                            m.content,
                            m.sent_at,
                            m.sender_id,
                            (m.sender_id = ?) AS sent_by_me,
                            u.full_name AS sender_name,
                            CASE 
                                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                                ELSE NULL
                            END AS sender_profile_picture_url
                        FROM community_messages AS m
                        JOIN users AS u ON m.sender_id = u.id
                        WHERE m.community_id = ?
                        ORDER BY m.sent_at ASC;
                        `,
                [userId, communityId],
                function (err, messageResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        community: communityResults[0],
                        messages: messageResults
                    });
                }
            );
        }
    );
};


exports.sendMessage = (req, res) => {
    const { communityId, content } = req.body;
    const senderId = req.userId;

    if (!communityId || !content) {
        return res.status(400).json({
            success: false,
            message: "Communitiy ID and content are required."
        });
    }

    connection.query(
        `
        INSERT INTO community_messages (sender_id, community_id, content)
        VALUES (?, ?, ?);
        `,
        [senderId, communityId, content],
        function (err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            res.status(201).json({
                success: true,
                message: "Message sent successfully.",
                messageId: result.insertId
            });
        }
    );
}

exports.joinCommunity = (req, res) => {
    const { communityId } = req.body;
    const memberId = req.userId;

    if (!communityId) {
        return res.status(400).json({
            success: false,
            message: "Community ID is required."
        });
    }

    // Check that community exists
    connection.query(
        `SELECT id FROM communities WHERE id = ?;`,
        [communityId],
        function (err, communityResults) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err
                });
            }

            if (!communityResults || communityResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Community not found."
                });
            }

            // Check if already a member
            connection.query(
                `SELECT 1 FROM community_members WHERE community_id = ? AND member_id = ? LIMIT 1;`,
                [communityId, memberId],
                function (err, memberCheckResults) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error.",
                            error: err
                        });
                    }

                    if (memberCheckResults && memberCheckResults.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: "User is already a member of this community."
                        });
                    }

                    // Insert membership
                    connection.query(
                        `INSERT INTO community_members (community_id, member_id) VALUES (?, ?);`,
                        [communityId, memberId],
                        function (err, insertResult) {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Database error.",
                                    error: err
                                });
                            }

                            res.status(201).json({
                                success: true,
                                message: "Joined community successfully.",
                                membershipId: insertResult.insertId
                            });
                        }
                    );
                }
            );
        }
    );
};