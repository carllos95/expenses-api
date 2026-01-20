const https = require("https");
const env = require("../config/env");

function sendMail(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const request = https.request(
      {
        hostname: "api.mailersend.com",
        path: "/v1/email",
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.mailerSend.apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }
          reject(
            new Error(
              `MailerSend error: ${res.statusCode} ${body || "unknown"}`
            )
          );
        });
      }
    );

    request.on("error", reject);
    request.write(data);
    request.end();
  });
}

async function sendResetCodeEmail(email, code) {
  if (!env.mailerSend.apiKey) {
    throw new Error("MAILERSEND_API_KEY is required");
  }
  if (!env.mailerSend.fromEmail) {
    throw new Error("MAILERSEND_FROM_EMAIL is required");
  }

  const payload = {
    from: {
      email: env.mailerSend.fromEmail,
      name: env.mailerSend.fromName
    },
    to: [{ email }],
    subject: "Codigo de recuperacao",
    text: `Seu codigo de recuperacao: ${code}`,
    html: `<p>Seu codigo de recuperacao: <strong>${code}</strong></p>`
  };

  await sendMail(payload);
}

module.exports = { sendResetCodeEmail };
