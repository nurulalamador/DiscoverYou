// controllers/emotions.controller.js
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

// POST /api/experiences/:id/emotions
exports.addEmotionEntry = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const experienceId = req.params.id;
    const { label, intensity, note = null, audio_url = null, video_url = null, text_transcript = null } = req.body;

    if (!label || intensity === undefined || intensity === null) {
      return res.status(400).json({ message: "label and intensity are required" });
    }
    const intVal = Number(intensity);
    if (Number.isNaN(intVal) || intVal < 0 || intVal > 10) {
      return res.status(400).json({ message: "intensity must be 0..10" });
    }

    // ensure experience belongs to user (MVP rule)
    const check = await q(`SELECT id FROM experiences WHERE id = ? AND user_id = ? LIMIT 1`, [
      experienceId,
      userId,
    ]);
    if (!check.length) return res.status(403).json({ message: "Forbidden" });

    const id = uuidv4();

    const sql = `
      INSERT INTO emotion_entries
      (id, experience_id, user_id, label, intensity, note, audio_url, video_url, text_transcript)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await q(sql, [id, experienceId, userId, label, intVal, note, audio_url, video_url, text_transcript]);

    return res.status(201).json({ message: "Emotion entry added", id });
  } catch (e) {
    console.error("addEmotionEntry error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/experiences/:id/emotions
exports.getEmotionEntries = async (req, res) => {
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
      SELECT id, label, intensity, note, audio_url, video_url, created_at
      FROM emotion_entries
      WHERE experience_id = ?
      ORDER BY created_at DESC
      `,
      [experienceId]
    );

    return res.json({ data: rows });
  } catch (e) {
    console.error("getEmotionEntries error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
