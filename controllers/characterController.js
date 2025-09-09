const pool = require("../db");
const axios = require("axios");

const getAll = async (req, res) => {
  try {
    const q = `SELECT c.*, u.email as created_by_email
               FROM characters c
               LEFT JOIN users u ON c.created_by = u.id
               ORDER BY created_at DESC`;
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const q = `SELECT c.*, u.email as created_by_email
               FROM characters c
               LEFT JOIN users u ON c.created_by = u.id
               WHERE c.id = $1`;
    const result = await pool.query(q, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const create = async (req, res) => {
  const { name, species, status, gender, origin, image, backstory } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ error: "name required" });

  try {
    const q = `INSERT INTO characters
               (name, species, status, gender, origin, image, backstory, created_by)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
               RETURNING *`;
    const result = await pool.query(q, [
      name,
      species || null,
      status || null,
      gender || null,
      origin || null,
      image || null,
      backstory || null,
      userId,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const { name, species, status, gender, origin, image, backstory } = req.body;

  try {
    // fetch existing
    const existingRes = await pool.query(
      "SELECT * FROM characters WHERE id = $1",
      [id],
    );
    if (existingRes.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    const existing = existingRes.rows[0];
    if (existing.created_by !== userId)
      return res.status(403).json({ error: "Not allowed" });

    const q = `UPDATE characters
               SET name=$1, species=$2, status=$3, gender=$4, origin=$5, image=$6, backstory=$7
               WHERE id=$8
               RETURNING *`;
    const params = [
      name || existing.name,
      species !== undefined ? species : existing.species,
      status !== undefined ? status : existing.status,
      gender !== undefined ? gender : existing.gender,
      origin !== undefined ? origin : existing.origin,
      image !== undefined ? image : existing.image,
      backstory !== undefined ? backstory : existing.backstory,
      id,
    ];
    const result = await pool.query(q, params);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const ownerCheck = await pool.query(
      "SELECT created_by FROM characters WHERE id = $1",
      [id],
    );
    if (ownerCheck.rowCount === 0)
      return res.status(404).json({ error: "Not found" });
    if (ownerCheck.rows[0].created_by !== userId)
      return res.status(403).json({ error: "Not allowed" });
    await pool.query("DELETE FROM characters WHERE id = $1", [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAll, getById, create, update, remove };
