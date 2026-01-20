const Joi = require("joi");
const authService = require("../services/auth.service");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const forgotSchema = Joi.object({
  email: Joi.string().email().required()
});

const verifyCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
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

async function forgot(req, res, next) {
  try {
    const { value, error } = forgotSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await authService.requestPasswordReset(value.email);

    if (result.error === "EMAIL_NOT_FOUND") {
      return res.status(404).json({ message: "Email nao encontrado" });
    }

    return res.json({ message: "Codigo enviado" });
  } catch (err) {
    return next(err);
  }
}

async function verifyCode(req, res, next) {
  try {
    const { value, error } = verifyCodeSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await authService.verifyPasswordResetCode(
      value.email,
      value.code
    );

    if (result.error === "EMAIL_NOT_FOUND") {
      return res.status(404).json({ message: "Email nao encontrado" });
    }

    if (!result.valid) {
      return res.status(400).json({ message: "Codigo invalido ou expirado" });
    }

    return res.json({ valid: true });
  } catch (err) {
    return next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { value, error } = resetPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await authService.resetPassword(
      value.email,
      value.code,
      value.password
    );

    if (result.error === "EMAIL_NOT_FOUND") {
      return res.status(404).json({ message: "Email nao encontrado" });
    }

    if (result.error === "INVALID_CODE") {
      return res.status(400).json({ message: "Codigo invalido ou expirado" });
    }

    return res.json({ message: "Senha atualizada" });
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

module.exports = {
  login,
  register,
  forgot,
  verifyCode,
  resetPassword,
  me
};
