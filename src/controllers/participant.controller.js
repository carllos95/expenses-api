const Joi = require("joi");
const participantService = require("../services/participant.service");

const participantsSchema = Joi.array()
  .items(
    Joi.object({
      groupId: Joi.number().integer().required(),
      name: Joi.string().min(2).max(120).required(),
    })
  )
  .min(1)
  .required();

const participantSchema = Joi.object({
  name: Joi.string().min(2).max(120).required()
});

async function register(req, res, next) {
  try {
    const { value, error } = participantsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await participantService.registerParticipants(
      req.user.id,
      value
    );

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

    const result = await participantService.listParticipants(
      req.user.id,
      groupId
    );
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const participantId = Number(req.params.id);

    if (!participantId) {
      return res.status(400).json({ message: "Invalid participant id" });
    }

    const { value, error } = participantSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await participantService.updateParticipant(
      req.user.id,
      participantId,
      value
    );

    if (!result.updated) {
      return res.status(404).json({ message: "Participant not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const participantId = Number(req.params.id);

    if (!participantId) {
      return res.status(400).json({ message: "Invalid participant id" });
    }

    const result = await participantService.deleteParticipant(
      req.user.id,
      participantId
    );

    if (!result.deleted) {
      return res.status(404).json({ message: "Participant not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, list, update, remove };
