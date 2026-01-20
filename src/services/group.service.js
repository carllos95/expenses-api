const groupRepository = require("../repositories/group.repository");

async function createGroup(userId, data) {
  const groupId = await groupRepository.create(
    userId,
    data.name,
    data.date,
    data.participants || []
  );
  return { id: groupId };
}

async function listGroups(userId) {
  const groups = await groupRepository.findAllByUserId(userId);
  return { groups };
}

async function updateGroup(userId, groupId, data) {
  const group = await groupRepository.findById(userId, groupId);

  if (!group) {
    return { error: "GROUP_NOT_FOUND" };
  }

  if (!data.name && !data.date) {
    return { updated: false };
  }

  const affectedRows = await groupRepository.updateById(userId, groupId, data);
  return { updated: affectedRows > 0 };
}

async function deleteGroup(userId, groupId) {
  const affectedRows = await groupRepository.deleteById(userId, groupId);
  return { deleted: affectedRows > 0 };
}

async function getGroupWithExpenses(userId, groupId) {
  const group = await groupRepository.findWithExpenses(userId, groupId);
  return group;
}

module.exports = {
  createGroup,
  listGroups,
  updateGroup,
  deleteGroup,
  getGroupWithExpenses
};
