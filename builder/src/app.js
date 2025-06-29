import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "./utils/logger.js";
import buildRoutes from "./routes/build.js";
import crowdinRoutes from "./routes/crowdin.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

console.log("VITE_TEMPLATE_DIR", process.env.VITE_TEMPLATE_DIR);
console.log("BUILD_OUTPUT_DIR", process.env.BUILD_OUTPUT_DIR);
console.log("TEMP_SCHEMA_DIR", process.env.TEMP_SCHEMA_DIR);
console.log("process.env.PORT", process.env.PORT);
console.log("CROWDIN_API_TOKEN", process.env.CROWDIN_API_TOKEN);

app.use(cors());
app.use(express.json({ limit: "50mb" })); // 允许较大的 schema JSON
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("combined", { stream: { write: message => logger.info(message.trim()) } }));

app.use("/api/build", buildRoutes);
app.use("/api/crowdin", crowdinRoutes);

app.use("/logs", express.static(path.join(__dirname, "..", "logs")));

app.use((err, req, res, _next) => {
  logger.error(`Unhandled application error: ${err.message}`);
  logger.error(err.stack);
  res.status(500).send({ message: "Something broke!", error: err.message });
});

app.listen(PORT, () => {
  logger.info(`Builder backend server running on http://localhost:${PORT}`);
  logger.info(`Vite template directory: ${process.env.VITE_TEMPLATE_DIR}`);
  logger.info(`Build output directory: ${process.env.BUILD_OUTPUT_DIR}`);
});
