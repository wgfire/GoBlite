import express from "express";
import cors from "cors";

import path from "path";
import fs from "fs-extra";
import archiver from "archiver";
import { BuildManager } from "./build-manager";
import { BuildConfig } from "./types";
import { BuildMonitor } from "./monitoring/build-monitor";
import { Logger } from "./monitoring/logger";
import net from "net";

const app = express();
const buildManager = new BuildManager();
const buildMonitor = new BuildMonitor();
const logger = new Logger();

// 监听构建事件
buildMonitor.on("buildStart", event => {
  logger.logEvent(event);
});

buildMonitor.on("buildProgress", event => {
  logger.logEvent(event);
});

buildMonitor.on("buildComplete", event => {
  logger.logEvent(event);
});

buildMonitor.on("buildError", event => {
  logger.logEvent(event);
});

// Middleware
app.use(cors());
app.use(express.json());

// 获取可用构建类型
app.get("/api/build/types", (req, res) => {
  try {
    const types = ["email", "activity", "landing"];
    res.json({ types });
  } catch (error) {
    logger.log("system", "Error getting build types: " + error, "error");
    res.status(500).json({ error: "Failed to get build types" });
  }
});

// 获取构建进度
app.get("/api/build/:id/progress", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Build ID is required" });
  }

  try {
    const progress = buildManager.getBuildProgress(id);
    if (!progress) {
      return res.status(404).json({ error: "Build not found" });
    }
    res.json({
      progress,
      metrics: buildMonitor.getBuildMetrics(id),
      duration: buildMonitor.getBuildDuration(id)
    });
  } catch (error) {
    logger.log(id, "Error getting build progress: " + error, "error");
    res.status(500).json({ error: "Failed to get build progress" });
  }
});

// 获取构建日志
app.get("/api/build/:id/logs", async (req, res) => {
  const { id } = req.params;

  try {
    const logs = await logger.getLogFile(id);
    if (!logs) {
      return res.status(404).json({ error: "Logs not found" });
    }
    res.json({ logs });
  } catch (error) {
    logger.log(id, "Error getting build logs: " + error, "error");
    res.status(500).json({ error: "Failed to get build logs" });
  }
});

// 开始构建
app.post("/api/build", async (req, res) => {
  const buildConfig: BuildConfig = req.body;

  if (!buildConfig.id || !buildConfig.type) {
    return res.status(400).json({ error: "Invalid build configuration" });
  }

  try {
    // 开始监控构建
    buildMonitor.startBuild(buildConfig.id);
    logger.log(buildConfig.id, `Starting ${buildConfig.type} build`);

    // 开始构建
    const result = await buildManager.build(buildConfig);

    if (result.success && result.outputPath) {
      // 创建构建产物目录
      const buildsDir = path.join(process.cwd(), "builds");
      await fs.ensureDir(buildsDir);

      // 创建zip文件
      const zipPath = path.join(buildsDir, `${buildConfig.id}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        res.download(zipPath, `build-${buildConfig.id}.zip`, err => {
          if (err) {
            logger.log(buildConfig.id, "Error sending zip file: " + err, "error");
          }
          // 清理zip文件
          fs.unlink(zipPath, unlinkErr => {
            if (unlinkErr) {
              logger.log(buildConfig.id, "Error cleaning up zip file: " + unlinkErr, "error");
            }
          });
        });
      });

      archive.on("error", err => {
        logger.log(buildConfig.id, "Error creating archive: " + err, "error");
        throw err;
      });

      archive.pipe(output);
      archive.directory(result.outputPath, false);
      await archive.finalize();

      // 记录完成状态
      buildMonitor.completeBuild(buildConfig.id, result.metrics!);
    } else {
      res.json(result);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.log(buildConfig.id, `Build failed: ${errorMessage}`, "error");
    buildMonitor.errorBuild(buildConfig.id, error instanceof Error ? error : new Error(errorMessage));

    res.status(500).json({
      error: "Build failed",
      details: errorMessage
    });
  }
});

// 取消构建
app.post("/api/build/:id/cancel", async (req, res) => {
  const { id } = req.params;
  try {
    await buildManager.cancelBuild(id);
    logger.log(id, "Build cancelled");
    res.json({ success: true });
  } catch (error) {
    logger.log(id, "Error canceling build: " + error, "error");
    res.status(500).json({ error: "Failed to cancel build" });
  }
});

// 清理构建
app.delete("/api/build/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await buildManager.cancelBuild(id);
    await buildMonitor.cleanup(id);
    await logger.cleanup(id);
    res.json({ success: true });
  } catch (error) {
    logger.log(id, "Error cleaning up build: " + error, "error");
    res.status(500).json({ error: "Failed to cleanup build" });
  }
});

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 检查端口是否可用
const checkPort = (port: number): Promise<boolean> => {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once("error", () => {
      resolve(false);
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

// 获取可用端口
const getAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  while (!(await checkPort(port))) {
    port++;
    if (port > startPort + 100) {
      throw new Error("No available ports found");
    }
  }
  return port;
};

const startServer = async () => {
  try {
    const defaultPort = parseInt(process.env.PORT || "3001", 10);
    const port = await getAvailablePort(defaultPort);

    app.listen(port, () => {
      logger.log("system", `Build server running on port ${port}`);
      if (port !== defaultPort) {
        logger.log("system", `Note: Default port ${defaultPort} was in use, using port ${port} instead`);
        logger.log("system", `http://localhost:${port}`);
      }

      // 定期清理
      setInterval(
        () => {
          try {
            // 清理缓存
            const cacheManager = buildManager["cacheManager"];
            if (cacheManager) {
              cacheManager.cleanup();
            }

            // 清理旧日志
            logger.cleanupOldLogs();
          } catch (error) {
            logger.log("system", "Error in cleanup interval: " + error, "error");
          }
        },
        6 * 60 * 60 * 1000 // 每6小时
      );
    });
  } catch (error) {
    logger.log("system", `Failed to start server: ${error}`, "error");
    process.exit(1);
  }
};

startServer();
