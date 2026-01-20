const Joi = require("joi");
const expenseService = require("../services/expense.service");

const expenseCreateSchema = Joi.object({
  groupId: Joi.number().integer().required(),
  name: Joi.string().min(2).max(160).required(),
  value: Joi.number().precision(2).required()
});

const expenseUpdateSchema = Joi.object({
  groupId: Joi.number().integer().optional(),
  name: Joi.string().min(2).max(160).optional(),
  value: Joi.number().precision(2).optional()
}).min(1);

async function register(req, res, next) {
  try {
    const { value, error } = expenseCreateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await expenseService.createExpense(req.user.id, value);

    if (result.error === "GROUP_NOT_FOUND") {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const groupId = req.query.groupId ? Number(req.query.groupId) : null;

    if (req.query.groupId && !groupId) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    const result = await expenseService.listExpenses(req.user.id, groupId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const expenseId = Number(req.params.id);

    if (!expenseId) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const { value, error } = expenseUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await expenseService.updateExpense(
      req.user.id,
      expenseId,
      value
    );

    if (result.error === "GROUP_NOT_FOUND") {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!result.updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const expenseId = Number(req.params.id);

    if (!expenseId) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const result = await expenseService.deleteExpense(req.user.id, expenseId);

    if (!result.deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, list, update, remove };
