const express = require("express");
const authRoutes = require("./routes/auth.routes");
const participantRoutes = require("./routes/participant.routes");
const groupRoutes = require("./routes/group.routes");
const groupParticipantRoutes = require("./routes/groupParticipant.routes");
const errorHandler = require("./middlewares/error.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/participants", participantRoutes);
app.use("/groups", groupRoutes);
app.use("/groups-participants", groupParticipantRoutes);

app.use(errorHandler);

module.exports = app;
