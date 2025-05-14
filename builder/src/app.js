require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./utils/logger");
const buildRoutes = require("./routes/build");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // 允许较大的 schema JSON
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("combined", { stream: { write: message => logger.info(message.trim()) } }));

// Routes
app.use("/api/build", buildRoutes);

// Serve build logs (optional, for direct access if needed)
app.use("/logs", express.static(path.join(__dirname, "..", "logs")));

// Basic error handler
app.use((err, req, res) => {
  logger.error(`Unhandled application error: ${err.message}`);
  logger.error(err.stack);
  res.status(500).send({ message: "Something broke!", error: err.message });
});

app.listen(PORT, () => {
  logger.info(`Builder backend server running on http://localhost:${PORT}`);
  logger.info(`Vite template directory: ${process.env.VITE_TEMPLATE_DIR}`);
  logger.info(`Build output directory: ${process.env.BUILD_OUTPUT_DIR}`);
});
