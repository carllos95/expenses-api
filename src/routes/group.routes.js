const express = require("express");
const groupController = require("../controllers/group.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @openapi
 * /groups/register:
 *   post:
 *     summary: Create group
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, date]
 *             properties:
 *               name: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Group created
 */
router.post("/register", authMiddleware, groupController.register);

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: List groups
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Groups list
 */
router.get("/", authMiddleware, groupController.list);

/**
 * @openapi
 * /groups/{id}:
 *   put:
 *     summary: Update group
 *     tags:
 *       - Groups
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
 *               name: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Group updated
 */
router.put("/:id", authMiddleware, groupController.update);

/**
 * @openapi
 * /groups/{id}:
 *   delete:
 *     summary: Delete group
 *     tags:
 *       - Groups
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
 *         description: Group deleted
 */
router.delete("/:id", authMiddleware, groupController.remove);

module.exports = router;
