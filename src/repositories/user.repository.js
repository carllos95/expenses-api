const { pool } = require("../config/db");

async function findByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, password, createdAt FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, createdAt FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
}

async function create({ name, email, phone, password }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
    [name, email, phone, password]
  );

  return result.insertId;
}

module.exports = { findByEmail, findById, create };
