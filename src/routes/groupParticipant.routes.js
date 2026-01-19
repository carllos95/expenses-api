const express = require("express");
const groupParticipantController = require("../controllers/groupParticipant.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @openapi
 * /groups-participants/register:
 *   post:
 *     summary: Link participant to group
 *     tags:
 *       - GroupsParticipants
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, participantId]
 *             properties:
 *               groupId: { type: integer }
 *               participantId: { type: integer }
 *     responses:
 *       201:
 *         description: Link created
 */
router.post("/register", authMiddleware, groupParticipantController.register);

/**
 * @openapi
 * /groups-participants:
 *   get:
 *     summary: List group participants
 *     tags:
 *       - GroupsParticipants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Links list
 */
router.get("/", authMiddleware, groupParticipantController.list);

/**
 * @openapi
 * /groups-participants/{groupId}/{participantId}:
 *   put:
 *     summary: Update group participant link
 *     tags:
 *       - GroupsParticipants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, participantId]
 *             properties:
 *               groupId: { type: integer }
 *               participantId: { type: integer }
 *     responses:
 *       200:
 *         description: Link updated
 */
router.put(
  "/:groupId/:participantId",
  authMiddleware,
  groupParticipantController.update
);

/**
 * @openapi
 * /groups-participants/{groupId}/{participantId}:
 *   delete:
 *     summary: Delete group participant link
 *     tags:
 *       - GroupsParticipants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Link deleted
 */
router.delete(
  "/:groupId/:participantId",
  authMiddleware,
  groupParticipantController.remove
);

module.exports = router;
