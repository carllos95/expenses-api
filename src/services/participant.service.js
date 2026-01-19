const participantRepository = require("../repositories/participant.repository");

async function registerParticipants(userId, participants) {
  const createdCount = await participantRepository.createMany(
    userId,
    participants
  );

  return { message: `${createdCount} participants registered successfully.` };
}

async function listParticipants(userId) {
  const participants = await participantRepository.findAllByUserId(userId);
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
