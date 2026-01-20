const { prisma } = require("../config/prisma");

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

async function findById(id) {
  return prisma.user.findUnique({
    where: { id }
  });
}

async function create({ name, email, phone, password }) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password
    }
  });

  return user.id;
}

async function updatePassword(id, password) {
  await prisma.user.update({
    where: { id },
    data: { password }
  });
}

module.exports = { findByEmail, findById, create, updatePassword };
