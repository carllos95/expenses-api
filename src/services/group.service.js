const groupRepository = require("../repositories/group.repository");

async function createGroup(userId, name) {
  const groupId = await groupRepository.create(userId, name);
  return { id: groupId };
}

async function listGroups(userId) {
  const groups = await groupRepository.findAllByUserId(userId);
  return { groups };
}

async function updateGroup(userId, groupId, name) {
  const affectedRows = await groupRepository.updateById(userId, groupId, name);
  return { updated: affectedRows > 0 };
}

async function deleteGroup(userId, groupId) {
  const affectedRows = await groupRepository.deleteById(userId, groupId);
  return { deleted: affectedRows > 0 };
}

module.exports = { createGroup, listGroups, updateGroup, deleteGroup };
