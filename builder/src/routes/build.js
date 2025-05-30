import express from "express";
const router = express.Router();
import { buildProject, getBuildStatus } from "../services/viteBuilder.js";
import logger from "../utils/logger.js";
import path from "path";
import fs from "fs-extra";

// POST /api/build - 启动构建
router.post("/", async (req, res) => {
  const { projectName, schema } = req.body;

  if (!projectName || !schema) {
    return res.status(400).json({ message: "projectName and schema are required." });
  }

  try {
    logger.info(`Received build request for project: ${projectName}`);
    // 异步启动构建，立即返回 buildId
    const { buildId } = await buildProject(projectName, schema);
    res.status(202).json({
      message: "Build process started.",
      buildId: buildId,
      statusUrl: `/api/build/status/${buildId}`,
      downloadUrl: `/api/build/download/${buildId}` // 预期的下载链接
    });
  } catch (error) {
    logger.error(`Error initiating build for ${projectName}: ${error.message}`);
    res.status(500).json({ message: "Failed to start build process.", error: error.message });
  }
});

// GET /api/build/status/:buildId - 查询构建状态
router.get("/status/:buildId", (req, res) => {
  const { buildId } = req.params;
  const status = getBuildStatus(buildId);

  if (!status) {
    return res.status(404).json({ message: "Build ID not found." });
  }
  res.json(status);
});

// GET /api/build/download/:buildId - 下载构建产物
router.get("/download/:buildId", async (req, res) => {
  const { buildId } = req.params;
  const status = getBuildStatus(buildId);

  if (!status) {
    return res.status(404).json({ message: "Build ID not found." });
  }

  if (status.status !== "completed" || !status.zipPath) {
    return res
      .status(400)
      .json({ message: "Build is not completed or zip file not available.", status: status.status });
  }

  if (!(await fs.pathExists(status.zipPath))) {
    logger.error(`[Download ${buildId}] Zip file not found at path: ${status.zipPath}`);
    return res.status(404).json({ message: "Build artifact (zip) not found on server." });
  }

  const fileName = path.basename(status.zipPath);
  res.download(status.zipPath, fileName, err => {
    if (err) {
      logger.error(`[Download ${buildId}] Error sending file ${fileName}: ${err.message}`);
      // 避免在已发送头部后再次发送响应
      if (!res.headersSent) {
        res.status(500).send({ message: "Could not download the file." });
      }
    } else {
      logger.info(`[Download ${buildId}] File ${fileName} sent successfully.`);
      // 可选：下载后删除 zip 文件以节省空间
      fs.remove(status.zipPath).catch(removeErr =>
        logger.error(`Failed to remove zip after download: ${removeErr.message}`)
      );
    }
  });
});

export default router;
