const { prisma } = require("../config/prisma");

async function createMany(userId, participants) {
  const values = participants.map((participant) => [
    Number(userId),
    participant.name,
    participant.phone
  ]);

  console.log("Creating participants with values:", values);
  const result = await prisma.participant.createMany({
    data: values.map(([userId, name, phone]) => ({ userId, name, phone }))
  });

  return result.count;
}

async function findAllByUserId(userId) {
  return prisma.participant.findMany({
    where: { userId: Number(userId) },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

async function updateById(userId, participantId, data) {
  const result = await prisma.participant.updateMany({
    where: { id: participantId, userId: Number(userId) },
    data: {
      name: data.name,
      phone: data.phone
    }
  });

  return result.count;
}

async function deleteById(userId, participantId) {
  const result = await prisma.participant.deleteMany({
    where: { id: participantId, userId: Number(userId) }
  });

  return result.count;
}

module.exports = { createMany, findAllByUserId, updateById, deleteById };
