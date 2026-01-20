const participantRepository = require("../repositories/participant.repository");
const groupRepository = require("../repositories/group.repository");

async function registerParticipants(userId, participants) {
  const groupIds = [
    ...new Set(participants.map((participant) => Number(participant.groupId)))
  ];

  const validGroupIds = await groupRepository.findIdsByUserId(userId, groupIds);

  if (validGroupIds.length !== groupIds.length) {
    return { error: "GROUP_NOT_FOUND" };
  }

  const createdCount = await participantRepository.createMany(participants);

  return { message: `${createdCount} participants registered successfully.` };
}

async function listParticipants(userId, groupId) {
  const participants = await participantRepository.findAllByUserId(
    userId,
    groupId
  );
  return { participants };
}

async function updateParticipant(userId, participantId, data) {
  const affectedRows = await participantRepository.updateById(
    userId,
    participantId,
    data
  );

  return { updated: affectedRows > 0 };
}

async function deleteParticipant(userId, participantId) {
  const affectedRows = await participantRepository.deleteById(
    userId,
    participantId
  );

  return { deleted: affectedRows > 0 };
}

module.exports = {
  registerParticipants,
  listParticipants,
  updateParticipant,
  deleteParticipant
};
