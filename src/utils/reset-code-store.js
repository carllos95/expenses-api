const CODE_TTL_MS = 10 * 60 * 1000;
const codes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createResetCode(email) {
  const code = generateCode();
  codes.set(email, { code, expiresAt: Date.now() + CODE_TTL_MS });
  return code;
}

function verifyResetCode(email, code) {
  const entry = codes.get(email);

  if (!entry) {
    return false;
  }

  if (Date.now() > entry.expiresAt) {
    codes.delete(email);
    return false;
  }

  return entry.code === code;
}

function consumeResetCode(email, code) {
  const isValid = verifyResetCode(email, code);

  if (isValid) {
    codes.delete(email);
  }

  return isValid;
}

module.exports = { createResetCode, verifyResetCode, consumeResetCode };
