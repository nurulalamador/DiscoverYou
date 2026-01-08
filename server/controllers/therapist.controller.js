// controllers/therapist.controller.js
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

// POST /api/therapist/experiences/:id/note
exports.addTherapistNote = async (req, res) => {
  try {
    const therapistId = getUserId(req);
    if (!therapistId) return res.status(401).json({ message: "Unauthorized" });

    const experienceId = req.params.id;
    const { note } = req.body;

    if (!note) return res.status(400).json({ message: "note is required" });

    // MVP: allow note for any experience id that exists
    const exp = await q(`SELECT id FROM experiences WHERE id = ? LIMIT 1`, [experienceId]);
    if (!exp.length) return res.status(404).json({ message: "Experience not found" });

    const id = uuidv4();
    await q(
      `
      INSERT INTO therapist_notes (id, experience_id, therapist_user_id, note)
      VALUES (?, ?, ?, ?)
      `,
      [id, experienceId, therapistId, note]
    );

    return res.status(201).json({ message: "Therapist note added", id });
  } catch (e) {
    console.error("addTherapistNote error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
