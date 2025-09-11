const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required!" });
  }
  try {
    // Hash passwd and Insert in Db
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hashed],
    );
    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === "23505") {
      //violation of unique
      res.status(409).json({ error: "Email already exists!" });
    }
    console.error(err);
    res.status(500).json({ error: "Server Error!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required!" });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "We don't have you in our system. Please register." });
    }
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials!" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials!" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error!" });
  }
};

module.exports = { register, login };
