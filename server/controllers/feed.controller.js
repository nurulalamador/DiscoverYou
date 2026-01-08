// controllers/feed.controller.js
const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

function getUserId(req) {
  return req.user?.id || req.user?.userId || req.userId || req.user?.uid;
}

function q(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// GET /api/feed
exports.getPublicFeed = async (req, res) => {
  try {
    const rows = await q(
      `
      SELECT id, title, event_date, category, summary, perceived_wrongness, created_at
      FROM experiences
      WHERE visibility = 'public_anonymous'
      ORDER BY created_at DESC
      LIMIT 50
      `
    );
    return res.json({ data: rows });
  } catch (e) {
    console.error("getPublicFeed error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/feed/:id
exports.getPublicExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await q(
      `
      SELECT id, title, event_date, category, summary, perceived_wrongness, created_at
      FROM experiences
      WHERE id = ? AND visibility = 'public_anonymous'
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: "Not found" });
    return res.json({ data: rows[0] });
  } catch (e) {
    console.error("getPublicExperience error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/feed/:id/view  (learning signal)
exports.logView = async (req, res) => {
  try {
    const viewerId = getUserId(req) || null;
    const experienceId = req.params.id;

    // ensure it's public
    const check = await q(
      `SELECT id FROM experiences WHERE id = ? AND visibility = 'public_anonymous' LIMIT 1`,
      [experienceId]
    );
    if (!check.length) return res.status(404).json({ message: "Not found" });

    const { dwell_seconds = 0, did_learn = false, empathy_rating = 0, note = null } = req.body;

    const id = uuidv4();

    await q(
      `
      INSERT INTO experience_views
      (id, experience_id, viewer_user_id, dwell_seconds, did_learn, empathy_rating, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        experienceId,
        viewerId,
        Number(dwell_seconds) || 0,
        did_learn ? 1 : 0,
        Number(empathy_rating) || 0,
        note,
      ]
    );

    return res.status(201).json({ message: "View logged", id });
  } catch (e) {
    console.error("logView error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};