const { prisma } = require("../config/prisma");

async function groupExistsForUser(userId, groupId) {
  const group = await prisma.group.findFirst({
    where: { id: groupId, userId, situation: 1 },
    select: { id: true }
  });

  return Boolean(group);
}

async function create(groupId, data) {
  const expense = await prisma.expense.create({
    data: {
      groupId,
      name: data.name,
      value: data.value
    }
  });

  return expense.id;
}

async function findAllByUserId(userId, groupId) {
  return prisma.expense.findMany({
    where: {
      situation: 1,
      ...(groupId ? { groupId } : {}),
      group: { userId, situation: 1 }
    },
    select: {
      id: true,
      groupId: true,
      name: true,
      value: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

async function updateById(userId, expenseId, data) {
  const result = await prisma.expense.updateMany({
    where: {
      id: expenseId,
      situation: 1,
      group: { userId, situation: 1 }
    },
    data
  });

  return result.count;
}

async function deleteById(userId, expenseId) {
  const result = await prisma.expense.updateMany({
    where: {
      id: expenseId,
      situation: 1,
      group: { userId, situation: 1 }
    },
    data: { situation: 2 }
  });

  return result.count;
}

module.exports = {
  groupExistsForUser,
  create,
  findAllByUserId,
  updateById,
  deleteById
};
