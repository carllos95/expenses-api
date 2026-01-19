const Joi = require("joi");
const groupParticipantService = require("../services/groupParticipant.service");

const createSchema = Joi.object({
  groupId: Joi.number().integer().required(),
  participantId: Joi.number().integer().required()
});

const updateSchema = Joi.object({
  groupId: Joi.number().integer().required(),
  participantId: Joi.number().integer().required()
});

async function register(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await groupParticipantService.registerLink(
      req.user.id,
      value.groupId,
      value.participantId
    );

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({ message: "Group or participant not found" });
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

    const result = await groupParticipantService.listLinks(req.user.id, groupId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const oldGroupId = Number(req.params.groupId);
    const oldParticipantId = Number(req.params.participantId);

    if (!oldGroupId || !oldParticipantId) {
      return res
        .status(400)
        .json({ message: "Invalid groupId or participantId" });
    }

    const { value, error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await groupParticipantService.updateLink(
      req.user.id,
      oldGroupId,
      oldParticipantId,
      value.groupId,
      value.participantId
    );

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({ message: "Group or participant not found" });
    }

    if (!result.updated) {
      return res.status(404).json({ message: "Link not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const groupId = Number(req.params.groupId);
    const participantId = Number(req.params.participantId);

    if (!groupId || !participantId) {
      return res
        .status(400)
        .json({ message: "Invalid groupId or participantId" });
    }

    const result = await groupParticipantService.deleteLink(
      req.user.id,
      groupId,
      participantId
    );

    if (result.error === "NOT_FOUND") {
      return res.status(404).json({ message: "Group or participant not found" });
    }

    if (!result.deleted) {
      return res.status(404).json({ message: "Link not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, list, update, remove };
