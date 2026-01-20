const app = require("./app");
const env = require("./config/env");
const { verifyConnection } = require("./config/prisma");

async function start() {
  await verifyConnection();

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
