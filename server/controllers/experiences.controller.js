// controllers/experiences.controller.js
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

// POST /api/experiences
exports.createExperience = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      title,
      event_date = null,
      category = "other",
      summary,
      details = null,
      response_taken = null,
      perceived_wrongness = 0,
      visibility = "private",
    } = req.body;

    if (!title || !summary) {
      return res.status(400).json({ message: "title and summary are required" });
    }

    const id = uuidv4();

    const sql = `
      INSERT INTO experiences
      (id, user_id, title, event_date, category, summary, details, response_taken, perceived_wrongness, visibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await q(sql, [
      id,
      userId,
      title,
      event_date,
      category,
      summary,
      details,
      response_taken,
      perceived_wrongness,
      visibility,
    ]);

    return res.status(201).json({ message: "Experience created", id });
  } catch (e) {
    console.error("createExperience error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/experiences/mine
exports.getMyExperiences = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const sql = `
      SELECT id, title, event_date, category, summary, perceived_wrongness, visibility, created_at
      FROM experiences
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const rows = await q(sql, [userId]);
    return res.json({ data: rows });
  } catch (e) {
    console.error("getMyExperiences error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/experiences/:id  (owner can see details, others only if public)
exports.getExperienceById = async (req, res) => {
  try {
    const userId = getUserId(req); // may be null if you allow public without token
    const { id } = req.params;

    const sql = `
      SELECT id, user_id, title, event_date, category, summary, details,
             response_taken, perceived_wrongness, visibility, created_at
      FROM experiences
      WHERE id = ?
      LIMIT 1
    `;
    const rows = await q(sql, [id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });

    const exp = rows[0];

    const isOwner = userId && exp.user_id === userId;
    const isPublic = exp.visibility === "public_anonymous";

    if (!isOwner && !isPublic) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // if viewer is not owner and it's public -> hide sensitive fields
    if (!isOwner && isPublic) {
      delete exp.details;
      delete exp.response_taken;
      // do not expose user_id for anonymity
      delete exp.user_id;
    }

    return res.json({ data: exp });
  } catch (e) {
    console.error("getExperienceById error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
