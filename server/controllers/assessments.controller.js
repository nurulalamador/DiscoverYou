// controllers/assessments.controller.js
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

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// POST /api/experiences/:id/assessments
exports.createAssessment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const experienceId = req.params.id;

    // ensure owner
    const check = await q(`SELECT id FROM experiences WHERE id = ? AND user_id = ? LIMIT 1`, [
      experienceId,
      userId,
    ]);
    if (!check.length) return res.status(403).json({ message: "Forbidden" });

    const { type = "self_checkin" } = req.body;

    // compute placeholder scores:
    // - avg intensity from emotion_entries
    const emotions = await q(
      `SELECT AVG(intensity) AS avg_intensity FROM emotion_entries WHERE experience_id = ?`,
      [experienceId]
    );
    const avgIntensity = Number(emotions[0]?.avg_intensity ?? 0); // 0..10
    const base = clamp(Math.round((avgIntensity / 10) * 100), 0, 100);

    // simple split for demo
    const depression_score = clamp(Math.round(base * 0.8), 0, 100);
    const stress_score = clamp(Math.round(base * 0.9), 0, 100);
    const emotional_damage_score = clamp(Math.round(base * 1.0), 0, 100);

    const explanation =
      "MVP score is computed from your logged emotion intensity (placeholder). Later this will be replaced by ML model.";

    const id = uuidv4();

    const sql = `
      INSERT INTO assessments
      (id, experience_id, user_id, type, depression_score, stress_score, emotional_damage_score, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await q(sql, [
      id,
      experienceId,
      userId,
      type,
      depression_score,
      stress_score,
      emotional_damage_score,
      explanation,
    ]);

    return res.status(201).json({
      message: "Assessment created",
      data: { id, depression_score, stress_score, emotional_damage_score, explanation },
    });
  } catch (e) {
    console.error("createAssessment error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/experiences/:id/assessments
exports.getAssessments = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const experienceId = req.params.id;

    // owner only (MVP)
    const check = await q(`SELECT id FROM experiences WHERE id = ? AND user_id = ? LIMIT 1`, [
      experienceId,
      userId,
    ]);
    if (!check.length) return res.status(403).json({ message: "Forbidden" });

    const rows = await q(
      `
      SELECT id, type, depression_score, stress_score, emotional_damage_score, explanation, created_at
      FROM assessments
      WHERE experience_id = ?
      ORDER BY created_at DESC
      `,
      [experienceId]
    );

    return res.json({ data: rows });
  } catch (e) {
    console.error("getAssessments error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
