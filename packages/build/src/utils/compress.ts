import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import { Logger } from "../monitoring/logger";

export interface CompressOptions {
  /**
   * 压缩级别 (0-9)
   */
  level?: number;
  /**
   * 基础目录名称，如果为空则不创建基础目录
   */
  baseDir?: string;
  /**
   * 输出目录
   */
  outputDir?: string;
}

export class Compressor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * 压缩指定目录为zip文件
   * @param sourceDir 源目录
   * @param buildId 构建ID
   * @param options 压缩选项
   * @returns 压缩文件路径
   */
  async compressDirectory(sourceDir: string, buildId: string, options: CompressOptions = {}): Promise<string> {
    const { level = 9, baseDir = "", outputDir = path.join(process.cwd(), "builds") } = options;

    try {
      // 确保输出目录存在
      await fs.ensureDir(outputDir);

      // 创建zip文件
      const zipPath = path.join(outputDir, `${buildId}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level } });

      // 监听压缩事件
      archive.on("error", err => {
        this.logger.log(buildId, `Compression error: ${err.message}`, "error");
        throw err;
      });

      archive.on("progress", progress => {
        if (progress.entries.total % 100 === 0) {
          this.logger.log(
            buildId,
            `Compressing: ${progress.entries.processed}/${progress.entries.total} files`,
            "info"
          );
        }
      });

      // 将输出目录添加到压缩文件
      // 如果 baseDir 为空字符串，则不创建基础目录
      archive.directory(sourceDir, baseDir || false);

      // 完成压缩
      archive.pipe(output);
      await archive.finalize();

      this.logger.log(buildId, `Successfully compressed to ${zipPath}`, "info");
      return zipPath;
    } catch (error) {
      this.logger.log(
        buildId,
        `Failed to compress directory: ${error instanceof Error ? error.message : String(error)}`,
        "error"
      );
      throw error;
    }
  }

  /**
   * 清理压缩文件
   * @param zipPath 压缩文件路径
   */
  async cleanup(zipPath: string): Promise<void> {
    try {
      await fs.remove(zipPath);
    } catch (error) {
      console.error("Error cleaning up zip file:", error);
    }
  }
}
