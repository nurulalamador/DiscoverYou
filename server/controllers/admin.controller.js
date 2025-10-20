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






const db = require('../config/database'); // Adjust path to your DB config

// Helper function to promisify queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await query('SELECT COUNT(*) as count FROM users');
    
    // Total Communities
    const totalCommunities = await query('SELECT COUNT(*) as count FROM communities');
    
    // Total Courses
    const totalCourses = await query('SELECT COUNT(*) as count FROM courses');
    
    // Total Contests
    const totalContests = await query('SELECT COUNT(*) as count FROM contests');
    
    // Total Webinars
    const totalWebinars = await query('SELECT COUNT(*) as count FROM webinars');
    
    // Total Job Posts
    const totalJobs = await query('SELECT COUNT(*) as count FROM hiring');
    
    // Total Showcase Posts
    const totalPosts = await query('SELECT COUNT(*) as count FROM showcase_posts');
    
    // Active Communities (with messages in last 7 days)
    const activeCommunities = await query(`
      SELECT COUNT(DISTINCT community_id) as count 
      FROM community_messages 
      WHERE sent_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    
    // Course Enrollments
    const totalEnrollments = await query('SELECT COUNT(*) as count FROM course_participants');
    
    // Total Revenue (from courses)
    const totalRevenue = await query(`
      SELECT COALESCE(SUM(c.price), 0) as revenue 
      FROM course_participants cp 
      JOIN courses c ON cp.course_id = c.id
    `);

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers[0].count,
        totalCommunities: totalCommunities[0].count,
        totalCourses: totalCourses[0].count,
        totalContests: totalContests[0].count,
        totalWebinars: totalWebinars[0].count,
        totalJobs: totalJobs[0].count,
        totalPosts: totalPosts[0].count,
        activeCommunities: activeCommunities[0].count,
        totalEnrollments: totalEnrollments[0].count,
        totalRevenue: parseFloat(totalRevenue[0].revenue || 0)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get User Growth Data (Last 12 months)
exports.getUserGrowth = async (req, res) => {
  try {
    const growth = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as users
      FROM communities
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({ success: true, data: growth });
  } catch (error) {
    console.error('User growth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Platform Activity (Last 30 days)
exports.getPlatformActivity = async (req, res) => {
  try {
    const activity = await query(`
      SELECT 
        DATE(date) as date,
        SUM(posts) as posts,
        SUM(messages) as messages,
        SUM(submissions) as submissions
      FROM (
        SELECT DATE(created_at) as date, COUNT(*) as posts, 0 as messages, 0 as submissions
        FROM showcase_posts
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        
        UNION ALL
        
        SELECT DATE(sent_at) as date, 0 as posts, COUNT(*) as messages, 0 as submissions
        FROM community_messages
        WHERE sent_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(sent_at)
        
        UNION ALL
        
        SELECT DATE(submitted_at) as date, 0 as posts, 0 as messages, COUNT(*) as submissions
        FROM contest_submissions
        WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(submitted_at)
      ) as combined
      GROUP BY date
      ORDER BY date ASC
    `);

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Platform activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Top Communities
exports.getTopCommunities = async (req, res) => {
  try {
    const communities = await query(`
      SELECT 
        c.id,
        c.name,
        c.category,
        COUNT(DISTINCT cm.member_id) as members,
        COUNT(DISTINCT msg.id) as messages
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id AND cm.status = 'active'
      LEFT JOIN community_messages msg ON c.id = msg.community_id
      GROUP BY c.id, c.name, c.category
      ORDER BY members DESC, messages DESC
      LIMIT 10
    `);

    res.json({ success: true, data: communities });
  } catch (error) {
    console.error('Top communities error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Course Performance
exports.getCoursePerformance = async (req, res) => {
  try {
    const courses = await query(`
      SELECT 
        c.id,
        c.name,
        c.category,
        c.price,
        COUNT(DISTINCT cp.participant_id) as enrollments,
        COALESCE(c.price * COUNT(DISTINCT cp.participant_id), 0) as revenue
      FROM courses c
      LEFT JOIN course_participants cp ON c.id = cp.course_id
      GROUP BY c.id, c.name, c.category, c.price
      ORDER BY enrollments DESC
      LIMIT 10
    `);

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Course performance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Category Distribution
exports.getCategoryDistribution = async (req, res) => {
  try {
    const distribution = await query(`
      SELECT 'Communities' as type, category, COUNT(*) as count FROM communities GROUP BY category
      UNION ALL
      SELECT 'Courses' as type, category, COUNT(*) as count FROM courses GROUP BY category
      UNION ALL
      SELECT 'Contests' as type, category, COUNT(*) as count FROM contests GROUP BY category
      UNION ALL
      SELECT 'Webinars' as type, category, COUNT(*) as count FROM webinars GROUP BY category
      UNION ALL
      SELECT 'Posts' as type, category, COUNT(*) as count FROM showcase_posts GROUP BY category
      UNION ALL
      SELECT 'Jobs' as type, category, COUNT(*) as count FROM hiring GROUP BY category
    `);

    res.json({ success: true, data: distribution });
  } catch (error) {
    console.error('Category distribution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Engagement Metrics
exports.getEngagementMetrics = async (req, res) => {
  try {
    // Posts with reactions
    const postEngagement = await query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_posts,
        COUNT(DISTINCT r.post_id) as posts_with_reactions,
        COUNT(DISTINCT c.post_id) as posts_with_comments,
        COUNT(r.post_id) as total_reactions,
        COUNT(c.id) as total_comments
      FROM showcase_posts p
      LEFT JOIN showcase_post_reactions r ON p.id = r.post_id
      LEFT JOIN showcase_post_comments c ON p.id = c.post_id
    `);

    // Contest participation rate
    const contestEngagement = await query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_contests,
        COUNT(DISTINCT cp.participant_id) as total_participants,
        COUNT(DISTINCT cs.participant_id) as total_submissions,
        COALESCE(AVG(participant_count), 0) as avg_participants_per_contest
      FROM contests c
      LEFT JOIN contest_participants cp ON c.id = cp.contest_id
      LEFT JOIN contest_submissions cs ON c.id = cs.contest_id
      LEFT JOIN (
        SELECT contest_id, COUNT(DISTINCT participant_id) as participant_count
        FROM contest_participants
        GROUP BY contest_id
      ) pc ON c.id = pc.contest_id
    `);

    // Webinar attendance
    const webinarEngagement = await query(`
      SELECT 
        COUNT(DISTINCT w.id) as total_webinars,
        COUNT(DISTINCT wp.participant_id) as total_registered,
        SUM(CASE WHEN wp.participated = 1 THEN 1 ELSE 0 END) as total_attended
      FROM webinars w
      LEFT JOIN webinar_participants wp ON w.id = wp.webinar_id
    `);

    res.json({
      success: true,
      data: {
        posts: postEngagement[0],
        contests: contestEngagement[0],
        webinars: webinarEngagement[0]
      }
    });
  } catch (error) {
    console.error('Engagement metrics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Recent Activity
exports.getRecentActivity = async (req, res) => {
  try {
    const activity = await query(`
      SELECT * FROM (
        SELECT 
          'New User' as type, 
          CONCAT(COALESCE(full_name, username), ' joined') as description,
          id as timestamp
        FROM users
        ORDER BY id DESC
        LIMIT 5
      ) as users
      
      UNION ALL
      
      SELECT * FROM (
        SELECT 
          'New Community' as type,
          CONCAT(name, ' created') as description,
          created_at as timestamp
        FROM communities
        ORDER BY created_at DESC
        LIMIT 5
      ) as communities
      
      UNION ALL
      
      SELECT * FROM (
        SELECT 
          'New Course' as type,
          CONCAT(name, ' published') as description,
          created_at as timestamp
        FROM courses
        ORDER BY created_at DESC
        LIMIT 5
      ) as courses
      
      UNION ALL
      
      SELECT * FROM (
        SELECT 
          'New Contest' as type,
          CONCAT(name, ' started') as description,
          created_at as timestamp
        FROM contests
        ORDER BY created_at DESC
        LIMIT 5
      ) as contests
      
      ORDER BY timestamp DESC
      LIMIT 20
    `);

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Revenue Analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const monthlyRevenue = await query(`
      SELECT 
        DATE_FORMAT(cp.participated_at, '%Y-%m') as month,
        SUM(c.price) as revenue,
        COUNT(DISTINCT cp.participant_id) as enrollments
      FROM course_participants cp
      JOIN courses c ON cp.course_id = c.id
      WHERE cp.participated_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(cp.participated_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Top revenue generating courses
    const topCourses = await query(`
      SELECT 
        c.name,
        c.price,
        COUNT(cp.participant_id) as enrollments,
        (c.price * COUNT(cp.participant_id)) as revenue
      FROM courses c
      LEFT JOIN course_participants cp ON c.id = cp.course_id
      GROUP BY c.id, c.name, c.price
      ORDER BY revenue DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        monthlyRevenue,
        topCourses
      }
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get User Demographics
exports.getUserDemographics = async (req, res) => {
  try {
    const genderDist = await query(`
      SELECT 
        COALESCE(gender, 'Not Specified') as gender,
        COUNT(*) as count
      FROM users
      GROUP BY COALESCE(gender, 'Not Specified')
    `);

    const roleDist = await query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    res.json({
      success: true,
      data: {
        gender: genderDist,
        role: roleDist
      }
    });
  } catch (error) {
    console.error('User demographics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};