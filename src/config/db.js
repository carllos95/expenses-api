const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: "Z"
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function verifyConnection(retries = 10, delayMs = 2000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      return;
    } catch (error) {
      lastError = error;
      await delay(delayMs);
    }
  }

  throw lastError;
}

module.exports = { pool, verifyConnection };