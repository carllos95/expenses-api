const express = require("express");
const participantController = require("../controllers/participant.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @openapi
 * /participants/register:
 *   post:
 *     summary: Register participants (batch)
 *     tags:
 *       - Participants
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required: [name, phone]
 *               properties:
 *                 name: { type: string }
 *                 phone: { type: string }
 *     responses:
 *       201:
 *         description: Participants created
 */
router.post("/register", authMiddleware, participantController.register);

/**
 * @openapi
 * /participants:
 *   get:
 *     summary: List participants
 *     tags:
 *       - Participants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Participants list
 */
router.get("/", authMiddleware, participantController.list);

/**
 * @openapi
 * /participants/{id}:
 *   put:
 *     summary: Update participant
 *     tags:
 *       - Participants
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
 *             required: [name, phone]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: Participant updated
 */
router.put("/:id", authMiddleware, participantController.update);

/**
 * @openapi
 * /participants/{id}:
 *   delete:
 *     summary: Delete participant
 *     tags:
 *       - Participants
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
 *         description: Participant deleted
 */
router.delete("/:id", authMiddleware, participantController.remove);

module.exports = router;
