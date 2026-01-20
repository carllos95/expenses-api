const userRepository = require("../repositories/user.repository");
const { comparePassword, hashPassword } = require("../utils/hash");
const { signToken } = require("../utils/jwt");
const {
  createResetCode,
  verifyResetCode,
  consumeResetCode
} = require("../utils/reset-code-store");
const { sendResetCodeEmail } = require("./mail.service");

async function login(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return null;
  }

  const token = signToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    }
  };
}

async function getMe(userId) {
  return userRepository.findById(userId);
}

async function register({ name, email, phone, password }) {
  const existing = await userRepository.findByEmail(email);

  if (existing) {
    return { error: "EMAIL_EXISTS" };
  }

  const hashedPassword = await hashPassword(password);
  const userId = await userRepository.create({
    name,
    email,
    phone,
    password: hashedPassword
  });

  const token = signToken(userId);
  const user = await userRepository.findById(userId);

  return { token, user };
}

async function requestPasswordReset(email) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return { error: "EMAIL_NOT_FOUND" };
  }

  const code = createResetCode(email);
  try {
    await sendResetCodeEmail(email, code);
  } catch (error) {
    return { error: "EMAIL_SEND_FAILED" };
  }

  return { ok: true };
}

async function verifyPasswordResetCode(email, code) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return { error: "EMAIL_NOT_FOUND" };
  }

  const isValid = verifyResetCode(email, code);

  return { valid: isValid };
}

async function resetPassword(email, code, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return { error: "EMAIL_NOT_FOUND" };
  }

  const isValid = consumeResetCode(email, code);

  if (!isValid) {
    return { error: "INVALID_CODE" };
  }

  const hashedPassword = await hashPassword(password);
  await userRepository.updatePassword(user.id, hashedPassword);

  return { ok: true };
}

module.exports = {
  login,
  getMe,
  register,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword
};
