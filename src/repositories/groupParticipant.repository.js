const { prisma } = require("../config/prisma");

async function groupExistsForUser(userId, groupId) {
  const group = await prisma.group.findFirst({
    where: { id: groupId, userId, situation: 1 },
    select: { id: true }
  });

  return Boolean(group);
}

async function participantExistsForUser(userId, participantId) {
  const participant = await prisma.participant.findFirst({
    where: { id: participantId, userId, situation: 1 },
    select: { id: true }
  });

  return Boolean(participant);
}

async function createLink(groupId, participantId) {
  await prisma.groupParticipant.create({
    data: {
      groupId,
      participantId
    }
  });

  return 1;
}

async function listLinks(userId, groupId) {
  const links = await prisma.groupParticipant.findMany({
    where: {
      ...(groupId ? { groupId } : {}),
      situation: 1,
      group: { userId, situation: 1 }
    },
    select: {
      groupId: true,
      participant: {
        select: {
          id: true,
          name: true,
          phone: true,
          createdAt: true,
          situation: true
        }
      }
    },
    orderBy: {
      participant: {
        name: "asc"
      }
    }
  });

  return links
    .filter((link) => link.participant.situation === 1)
    .map((link) => ({
      groupId: link.groupId,
      participantId: link.participant.id,
      name: link.participant.name,
      phone: link.participant.phone,
      createdAt: link.participant.createdAt
    }));
}

async function updateLink(oldGroupId, oldParticipantId, newGroupId, newParticipantId) {
  const result = await prisma.groupParticipant.updateMany({
    where: {
      groupId: oldGroupId,
      participantId: oldParticipantId,
      situation: 1
    },
    data: {
      groupId: newGroupId,
      participantId: newParticipantId
    }
  });

  return result.count;
}

async function deleteLink(groupId, participantId) {
  const result = await prisma.groupParticipant.updateMany({
    where: { groupId, participantId, situation: 1 },
    data: { situation: 2 }
  });

  return result.count;
}

module.exports = {
  groupExistsForUser,
  participantExistsForUser,
  createLink,
  listLinks,
  updateLink,
  deleteLink
};
