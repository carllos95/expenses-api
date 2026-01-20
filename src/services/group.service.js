const groupRepository = require("../repositories/group.repository");

async function createGroup(userId, name, date) {
  const groupId = await groupRepository.create(userId, name, date);
  return { id: groupId };
}

async function listGroups(userId) {
  const groups = await groupRepository.findAllByUserId(userId);
  return { groups };
}

async function updateGroup(userId, groupId, data) {
  const affectedRows = await groupRepository.updateById(userId, groupId, data);
  return { updated: affectedRows > 0 };
}

async function deleteGroup(userId, groupId) {
  const affectedRows = await groupRepository.deleteById(userId, groupId);
  return { deleted: affectedRows > 0 };
}

module.exports = { createGroup, listGroups, updateGroup, deleteGroup };
