const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "app",
    password: process.env.DB_PASSWORD || "app",
    name: process.env.DB_NAME || "expenses"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "eWOMkVeGL5hB2DFZObwU3le/01AZHgkSS25X5fLri23n+EHYCyrnf4jG6y9XpXGftCYYI2aw2ymoCEfoZN6fOA==",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  },
  mailerSend: {
    apiKey: process.env.MAILERSEND_API_KEY || "",
    fromEmail: process.env.MAILERSEND_FROM_EMAIL || "",
    fromName: process.env.MAILERSEND_FROM_NAME || "RateioForte"
  }
};

if (!env.jwt.secret) {
  throw new Error("JWT_SECRET is required");
}

module.exports = env;
