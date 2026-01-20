const express = require("express");
const expenseController = require("../controllers/expense.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @openapi
 * /expenses/register:
 *   post:
 *     summary: Create expense
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, name, value]
 *             properties:
 *               groupId: { type: integer }
 *               name: { type: string }
 *               value: { type: number, format: float }
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post("/register", authMiddleware, expenseController.register);

/**
 * @openapi
 * /expenses:
 *   get:
 *     summary: List expenses
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expenses list
 */
router.get("/", authMiddleware, expenseController.list);

/**
 * @openapi
 * /expenses/{id}:
 *   put:
 *     summary: Update expense
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId: { type: integer }
 *               name: { type: string }
 *               value: { type: number, format: float }
 *     responses:
 *       200:
 *         description: Expense updated
 */
router.put("/:id", authMiddleware, expenseController.update);

/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete("/:id", authMiddleware, expenseController.remove);

module.exports = router;
