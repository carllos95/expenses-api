const { pool } = require("../config/db");

async function create(userId, name) {
  const [result] = await pool.query(
    "INSERT INTO user_groups (userId, name) VALUES (?, ?)",
    [userId, name]
  );

  return result.insertId;
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT id, name, createdAt FROM user_groups WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );

  return rows;
}

async function updateById(userId, groupId, name) {
  const [result] = await pool.query(
    "UPDATE user_groups SET name = ? WHERE id = ? AND userId = ?",
    [name, groupId, userId]
  );

  return result.affectedRows;
}

async function deleteById(userId, groupId) {
  const [result] = await pool.query(
    "DELETE FROM user_groups WHERE id = ? AND userId = ?",
    [groupId, userId]
  );

  return result.affectedRows;
}

module.exports = { create, findAllByUserId, updateById, deleteById };
