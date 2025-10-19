const connection = require('../config/database'); // Make sure you have a db.js that exports your mysql2 pool/connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.index = async (req, res) => {
    const userId = req.userId;

    connection.query(
        `SELECT u.id, u.full_name, u.email, u.username, u.gender, u.date_of_birth, u.mobile_no, u.points,
            CASE 
                WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                ELSE NULL
            END AS profile_picture_url,
            GROUP_CONCAT(ui.interest) AS interests
        FROM users AS u
        LEFT JOIN user_interests ui ON ui.user_id = u.id
        WHERE u.id = ?`,
        [userId],
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
                isAuthenticate: true,
                message: "User is authenticated.",
                user: userData
            });
        }
    );
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        connection.query(
            `SELECT u.id, u.full_name, u.email, u.username, u.gender, u.date_of_birth, u.mobile_no, u.password, u.points,
                CASE 
                    WHEN u.profile_picture IS NOT NULL THEN CONCAT('/profile/picture/', u.id)
                    ELSE NULL
                END AS profile_picture_url,
                GROUP_CONCAT(ui.interest) AS interests
            FROM users AS u
            LEFT JOIN user_interests AS ui 
            ON ui.user_id = u.id
            WHERE u.email = ? OR u.username = ?
            GROUP BY u.id;`,
            [email, email],
            async (err, results) => {
                if (err) {
                    // throw err;
                    return res.status(500).json({
                        success: false,
                        message: "Cannot connect to database 2.",
                        error: err
                    });
                }

                if (results.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Account not found."
                    });
                }

                const user = results[0];

                // Compare password
                bcrypt.compare(password, user.password, function (err, match) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Error comparing passwords.",
                            error: err
                        });
                    }
                    if (!match) {
                        return res.status(401).json({
                            success: false,
                            message: "Password is incorrect."
                        });
                    }

                    const token = jwt.sign(
                        { id: user.id, username: user.username, email: user.email, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: '1d' }
                    );
                    res.cookie(process.env.COOKIE_NAME, token, {
                        httpOnly: true,
                        // secure: process.env.NODE_ENV === 'production',
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000 // 1 day
                    });

                    // Authentication successful
                    res.status(200).json({
                        success: true,
                        message: "Login successful.",
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            full_name: user.full_name,
                            profile_picture_url: user.profile_picture_url,
                            gender: user.gender,
                            date_of_birth: user.date_of_birth,
                            mobile_no: user.mobile_no,
                            points: user.points,
                            interests: user.interests ? user.interests.split(',') : []
                        }
                    });
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message
        });
    }
};


exports.signup = async (req, res) => {
    try {
        const { username, email, fullName, gender, dateOfBirth, password } = req.body;

        // Insert user into MySQL database
        const saltRounds = 10;

        // Hash the password before saving
        bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                    error: err
                });
            }

            connection.query(
                'INSERT INTO users (username, email, full_name, gender, date_of_birth, password) VALUES (?, ?, ?, ?, ?, ?)',
                [username, email, fullName, gender, dateOfBirth, hashedPassword],
                function (err, result) {
                    if (err) {
                        // console.error('Error inserting user:', err);
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(500).json({
                                success: false,
                                message: "Email or username already exists.",
                                error: err
                            });
                        }
                        else {
                            console.log("err1")
                            console.log(err);
                            return res.status(500).json({
                                success: false,
                                message: "Failed to register user.",
                                error: err
                            });
                        }
                    }
                    res.status(201).json({
                        success: true,
                        message: "User registered successfully.",
                        user: {
                            id: result.insertId,
                            username,
                            email
                        }
                    });
                }
            );
        });
    } catch (error) {
                            console.log("err2")
                            console.log(error);
        res.status(500).json({
            status: "Error",
            message: "Failed to register user.",
            error: error.message
        });
    }
};


exports.logout = (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.status(200).json({
        success: true,
        message: "Logout successful."
    });
};