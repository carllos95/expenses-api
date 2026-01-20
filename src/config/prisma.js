const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function verifyConnection() {
  await prisma.$connect();
}

module.exports = { prisma, verifyConnection };
