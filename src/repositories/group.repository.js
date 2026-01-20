const { prisma } = require("../config/prisma");

async function create(userId, name) {
  const group = await prisma.group.create({
    data: {
      userId,
      name
    }
  });

  return group.id;
}

async function findAllByUserId(userId) {
  return prisma.group.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

async function updateById(userId, groupId, name) {
  const result = await prisma.group.updateMany({
    where: { id: groupId, userId },
    data: { name }
  });

  return result.count;
}

async function deleteById(userId, groupId) {
  const result = await prisma.group.deleteMany({
    where: { id: groupId, userId }
  });

  return result.count;
}

module.exports = { create, findAllByUserId, updateById, deleteById };
