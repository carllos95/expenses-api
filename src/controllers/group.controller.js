const Joi = require("joi");
const groupService = require("../services/group.service");

const groupSchema = Joi.object({
  name: Joi.string().min(2).max(120).required()
});

async function register(req, res, next) {
  try {
    const { value, error } = groupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await groupService.createGroup(req.user.id, value.name);

    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const result = await groupService.listGroups(req.user.id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const groupId = Number(req.params.id);

    if (!groupId) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const { value, error } = groupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await groupService.updateGroup(req.user.id, groupId, value.name);

    if (!result.updated) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const groupId = Number(req.params.id);

    if (!groupId) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const result = await groupService.deleteGroup(req.user.id, groupId);

    if (!result.deleted) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, list, update, remove };
