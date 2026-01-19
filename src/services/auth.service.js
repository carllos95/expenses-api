const userRepository = require("../repositories/user.repository");
const { comparePassword, hashPassword } = require("../utils/hash");
const { signToken } = require("../utils/jwt");

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

module.exports = { login, getMe, register };
