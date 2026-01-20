const { prisma } = require("../config/prisma");

async function create(userId, name, date, participants = null) {
  const groupId = await prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        userId: Number(userId),
        name,
        date
      }
    });

    if (Array.isArray(participants) && participants.length) {
      await tx.participant.createMany({
        data: participants.map((participant) => ({
          groupId: group.id,
          name: participant.name
        }))
      });
    }

    return group.id;
  });

  return groupId;
}

async function findById(userId, groupId) {
  return prisma.group.findFirst({
    where: { id: groupId, userId: Number(userId), situation: 1 },
    select: { id: true }
  });
}

async function findAllByUserId(userId) {
  const groups = await prisma.group.findMany({
    where: { userId: Number(userId), situation: 1 },
    select: {
      id: true,
      name: true,
      date: true,
      participants: {
        where: { situation: 1 },
        select: {
          id: true,
          name: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      },
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  const withTotals = await Promise.all(
    groups.map(async (group) => {
      const totalResult = await prisma.expense.aggregate({
        where: {
          groupId: group.id,
          situation: 1,
          group: { userId: Number(userId), situation: 1 }
        },
        _sum: { value: true }
      });
      const totalValue = Number(totalResult._sum.value || 0);
      const participantCount = group.participants.length;
      const perParticipant = participantCount ? totalValue / participantCount : 0;

      return {
        ...group,
        totalValue,
        perParticipant
      };
    })
  );

  return withTotals;
}

async function updateById(userId, groupId, data) {
  const result = await prisma.group.updateMany({
    where: { id: groupId, userId: Number(userId), situation: 1 },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.date ? { date: data.date } : {})
    }
  });

  return result.count;
}

async function deleteById(userId, groupId) {
  const result = await prisma.group.updateMany({
    where: { id: groupId, userId: Number(userId), situation: 1 },
    data: { situation: 2 }
  });

  return result.count;
}

async function findWithExpenses(userId, groupId) {
  const group = await prisma.group.findFirst({
    where: { id: groupId, userId: Number(userId), situation: 1 },
    select: {
      id: true,
      name: true,
      date: true,
      participants: {
        where: { situation: 1 },
        select: {
          id: true,
          name: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      },
      createdAt: true,
      expenses: {
        where: { situation: 1 },
        select: {
          id: true,
          name: true,
          value: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!group) {
    return null;
  }

  const totalResult = await prisma.expense.aggregate({
    where: {
      groupId,
      situation: 1,
      group: { userId, situation: 1 }
    },
    _sum: { value: true }
  });

  const participantCount = group.participants.length;
  const totalValue = Number(totalResult._sum.value || 0);

  return {
    ...group,
    totalValue,
    perParticipant: participantCount ? totalValue / participantCount : 0
  };
}

async function findIdsByUserId(userId, groupIds) {
  if (!groupIds.length) {
    return [];
  }

  const rows = await prisma.group.findMany({
    where: {
      userId: Number(userId),
      situation: 1,
      id: { in: groupIds }
    },
    select: { id: true }
  });

  return rows.map((row) => row.id);
}

module.exports = {
  create,
  findById,
  findAllByUserId,
  updateById,
  deleteById,
  findWithExpenses,
  findIdsByUserId
};
