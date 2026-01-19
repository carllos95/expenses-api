const { pool } = require("../config/db");

async function groupExistsForUser(userId, groupId) {
  const [rows] = await pool.query(
    "SELECT id FROM user_groups WHERE id = ? AND userId = ? LIMIT 1",
    [groupId, userId]
  );

  return Boolean(rows[0]);
}

async function participantExistsForUser(userId, participantId) {
  const [rows] = await pool.query(
    "SELECT id FROM participants WHERE id = ? AND userId = ? LIMIT 1",
    [participantId, userId]
  );

  return Boolean(rows[0]);
}

async function createLink(groupId, participantId) {
  const [result] = await pool.query(
    "INSERT INTO groups_participants (groupId, participantId) VALUES (?, ?)",
    [groupId, participantId]
  );

  return result.affectedRows;
}

async function listLinks(userId, groupId) {
  const params = [userId];
  let sql = `
    SELECT gp.groupId, p.id AS participantId, p.name, p.phone, p.createdAt
    FROM groups_participants gp
    INNER JOIN participants p ON p.id = gp.participantId
    INNER JOIN user_groups g ON g.id = gp.groupId
    WHERE g.userId = ?
  `;

  if (groupId) {
    sql += " AND gp.groupId = ?";
    params.push(groupId);
  }

  sql += " ORDER BY p.name ASC";

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function updateLink(oldGroupId, oldParticipantId, newGroupId, newParticipantId) {
  const [result] = await pool.query(
    "UPDATE groups_participants SET groupId = ?, participantId = ? WHERE groupId = ? AND participantId = ?",
    [newGroupId, newParticipantId, oldGroupId, oldParticipantId]
  );

  return result.affectedRows;
}

async function deleteLink(groupId, participantId) {
  const [result] = await pool.query(
    "DELETE FROM groups_participants WHERE groupId = ? AND participantId = ?",
    [groupId, participantId]
  );

  return result.affectedRows;
}

module.exports = {
  groupExistsForUser,
  participantExistsForUser,
  createLink,
  listLinks,
  updateLink,
  deleteLink
};
