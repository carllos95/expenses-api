const { prisma } = require("../config/prisma");

async function createMany(participants) {
  const result = await prisma.participant.createMany({
    data: participants.map((participant) => ({
      groupId: Number(participant.groupId),
      name: participant.name
    }))
  });

  return result.count;
}

async function findAllByUserId(userId, groupId) {
  return prisma.participant.findMany({
    where: {
      situation: 1,
      ...(groupId ? { groupId: Number(groupId) } : {}),
      group: { userId: Number(userId), situation: 1 }
    },
    select: {
      id: true,
      groupId: true,
      name: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

async function updateById(userId, participantId, data) {
  const result = await prisma.participant.updateMany({
    where: {
      id: participantId,
      situation: 1,
      group: { userId: Number(userId), situation: 1 }
    },
    data: {
      name: data.name
    }
  });

  return result.count;
}

async function deleteById(userId, participantId) {
  const result = await prisma.participant.updateMany({
    where: {
      id: participantId,
      situation: 1,
      group: { userId: Number(userId), situation: 1 }
    },
    data: { situation: 2 }
  });

  return result.count;
}

module.exports = { createMany, findAllByUserId, updateById, deleteById };
