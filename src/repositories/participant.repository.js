const { pool } = require("../config/db");

async function createMany(userId, participants) {
  const values = participants.map((participant) => [
    userId,
    participant.name,
    participant.phone
  ]);

  const [result] = await pool.query(
    "INSERT INTO participants (userId, name, phone) VALUES ?",
    [values]
  );

  return result.affectedRows;
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT id, name, phone, createdAt FROM participants WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );

  return rows;
}

async function updateById(userId, participantId, data) {
  const [result] = await pool.query(
    "UPDATE participants SET name = ?, phone = ? WHERE id = ? AND userId = ?",
    [data.name, data.phone, participantId, userId]
  );

  return result.affectedRows;
}

async function deleteById(userId, participantId) {
  const [result] = await pool.query(
    "DELETE FROM participants WHERE id = ? AND userId = ?",
    [participantId, userId]
  );

  return result.affectedRows;
}

module.exports = { createMany, findAllByUserId, updateById, deleteById };
