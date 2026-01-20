const { prisma } = require("../config/prisma");

async function create(userId, name, date) {
  const group = await prisma.group.create({
    data: {
      userId,
      name,
      date
    }
  });

  return group.id;
}

async function findAllByUserId(userId) {
  return prisma.group.findMany({
    where: { userId, situation: 1 },
    select: {
      id: true,
      name: true,
      date: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

async function updateById(userId, groupId, data) {
  const result = await prisma.group.updateMany({
    where: { id: groupId, userId, situation: 1 },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.date ? { date: data.date } : {})
    }
  });

  return result.count;
}

async function deleteById(userId, groupId) {
  const result = await prisma.group.updateMany({
    where: { id: groupId, userId, situation: 1 },
    data: { situation: 2 }
  });

  return result.count;
}

module.exports = { create, findAllByUserId, updateById, deleteById };
