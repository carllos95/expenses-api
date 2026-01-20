const expenseRepository = require("../repositories/expense.repository");

async function createExpense(userId, data) {
  const groupOk = await expenseRepository.groupExistsForUser(
    userId,
    data.groupId
  );

  if (!groupOk) {
    return { error: "GROUP_NOT_FOUND" };
  }

  const expenseId = await expenseRepository.create(data.groupId, data);
  return { id: expenseId };
}

async function listExpenses(userId, groupId) {
  const expenses = await expenseRepository.findAllByUserId(userId, groupId);
  return { expenses };
}

async function updateExpense(userId, expenseId, data) {
  if (data.groupId) {
    const groupOk = await expenseRepository.groupExistsForUser(
      userId,
      data.groupId
    );

    if (!groupOk) {
      return { error: "GROUP_NOT_FOUND" };
    }
  }

  const affectedRows = await expenseRepository.updateById(
    userId,
    expenseId,
    data
  );

  return { updated: affectedRows > 0 };
}

async function deleteExpense(userId, expenseId) {
  const affectedRows = await expenseRepository.deleteById(userId, expenseId);
  return { deleted: affectedRows > 0 };
}

module.exports = { createExpense, listExpenses, updateExpense, deleteExpense };
