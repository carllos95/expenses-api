const groupParticipantRepository = require("../repositories/groupParticipant.repository");

async function registerLink(userId, groupId, participantId) {
  const groupOk = await groupParticipantRepository.groupExistsForUser(
    userId,
    groupId
  );
  const participantOk =
    await groupParticipantRepository.participantExistsForUser(
      userId,
      participantId
    );

  if (!groupOk || !participantOk) {
    return { error: "NOT_FOUND" };
  }

  const affected = await groupParticipantRepository.createLink(
    groupId,
    participantId
  );

  return { created: affected > 0 };
}

async function listLinks(userId, groupId) {
  const links = await groupParticipantRepository.listLinks(userId, groupId);
  return { links };
}

async function updateLink(
  userId,
  oldGroupId,
  oldParticipantId,
  newGroupId,
  newParticipantId
) {
  const groupOk = await groupParticipantRepository.groupExistsForUser(
    userId,
    newGroupId
  );
  const participantOk =
    await groupParticipantRepository.participantExistsForUser(
      userId,
      newParticipantId
    );

  if (!groupOk || !participantOk) {
    return { error: "NOT_FOUND" };
  }

  const affected = await groupParticipantRepository.updateLink(
    oldGroupId,
    oldParticipantId,
    newGroupId,
    newParticipantId
  );

  return { updated: affected > 0 };
}

async function deleteLink(userId, groupId, participantId) {
  const groupOk = await groupParticipantRepository.groupExistsForUser(
    userId,
    groupId
  );
  const participantOk =
    await groupParticipantRepository.participantExistsForUser(
      userId,
      participantId
    );

  if (!groupOk || !participantOk) {
    return { error: "NOT_FOUND" };
  }

  const affected = await groupParticipantRepository.deleteLink(
    groupId,
    participantId
  );

  return { deleted: affected > 0 };
}

module.exports = { registerLink, listLinks, updateLink, deleteLink };
