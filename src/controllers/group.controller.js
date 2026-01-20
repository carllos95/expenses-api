const Joi = require("joi");
const groupService = require("../services/group.service");

const participantsSchema = Joi.array()
  .items(
    Joi.object({
      name: Joi.string().min(2).max(120).required(),
    })
  )
  .min(1);

const groupCreateSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  date: Joi.date().iso().required(),
  participants: participantsSchema.optional()
});

const groupUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  date: Joi.date().iso().optional()
}).min(1);

async function register(req, res, next) {
  try {
    const { value, error } = groupCreateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await groupService.createGroup(req.user.id, {
      name: value.name,
      date: new Date(value.date),
      participants: value.participants || []
    });

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

    const { value, error } = groupUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await groupService.updateGroup(req.user.id, groupId, {
      ...(value.name ? { name: value.name } : {}),
      ...(value.date ? { date: new Date(value.date) } : {})
    });

    if (result.error === "GROUP_NOT_FOUND") {
      return res.status(404).json({ message: "Group not found" });
    }


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

async function getWithExpenses(req, res, next) {
  try {
    const groupId = Number(req.params.id);

    if (!groupId) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    const group = await groupService.getGroupWithExpenses(
      req.user.id,
      groupId
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.json({ group });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, list, update, remove, getWithExpenses };
