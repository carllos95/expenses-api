const Joi = require("joi");
const authService = require("../services/auth.service");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(30).required(),
  password: Joi.string().min(6).required()
});

async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await authService.login(value.email, value.password);

    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function register(req, res, next) {
  try {
    const { value, error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await authService.register(value);

    if (result.error === "EMAIL_EXISTS") {
      return res.status(409).json({ message: "Email already in use" });
    }

    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, register, me };
