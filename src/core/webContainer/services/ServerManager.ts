import { WebContainer } from "@webcontainer/api";

/**
 * 服务器状态枚举
 */
export enum ServerStatus {
  STOPPED = "stopped",
  STARTING = "starting",
  RUNNING = "running",
  ERROR = "error",
}

/**
 * 服务器管理类
 *
 * 负责管理WebContainer中的开发服务器，提供启动、停止、URL检测等功能
 */
export class ServerManager {
  private webcontainerInstance: WebContainer | null = null;
  private serverUrl: string = "";
  private serverProcess: any = null;
  private status: ServerStatus = ServerStatus.STOPPED;
  private error: string | null = null;
  private outputListeners: ((output: string) => void)[] = [];

  /**
   * 构造函数
   * @param webcontainer WebContainer实例
   */
  constructor(webcontainer: WebContainer | null) {
    this.webcontainerInstance = webcontainer;
  }

  /**
   * 设置WebContainer实例
   * @param webcontainer WebContainer实例
   */
  public setWebContainer(webcontainer: WebContainer): void {
    this.webcontainerInstance = webcontainer;
  }

  /**
   * 启动开发服务器
   * @returns Promise<string> 服务器URL
   */
  public async startServer(): Promise<string> {
    if (!this.webcontainerInstance) {
      throw new Error("WebContainer未初始化");
    }

    try {
      this.status = ServerStatus.STARTING;
      this.notifyOutput("正在启动开发服务器...");

      // 创建一个Promise，当服务器准备好时解析
      const serverReadyPromise = new Promise<string>((resolve) => {
        // 监听server-ready事件
        this.webcontainerInstance!.on("server-ready", (port, url) => {
          this.notifyOutput(`WebContainer服务已准备就绪，端口: ${port}, URL: ${url}`);
          this.serverUrl = url;
          this.status = ServerStatus.RUNNING;
          resolve(url);
        });
      });

      // 设置超时
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => {
          if (this.status !== ServerStatus.RUNNING) {
            reject(new Error("等待服务器启动超时"));
          }
        }, 30000); // 30秒超时
      });

      // 启动开发服务器
      this.serverProcess = await this.webcontainerInstance.spawn("npm", ["run", "dev"]);

      // 监听命令输出（用于日志，不再用于检测URL）
      this.serverProcess.output.pipeTo(
        new WritableStream({
          write: (data: string) => {
            this.notifyOutput(data);
          },
        })
      );

      // 等待服务器准备好或超时
      this.serverUrl = await Promise.race([serverReadyPromise, timeoutPromise]);

      // 如果没有获取到URL，但进程仍在运行，尝试使用默认URL
      if (!this.serverUrl && this.serverProcess) {
        // 对于Vite项目，默认端口通常是5173
        this.serverUrl = "http://localhost:5173";
        this.status = ServerStatus.RUNNING;
        this.notifyOutput(`未能自动检测到URL，使用默认WebContainer内部服务URL: ${this.serverUrl}`);
      }

      return this.serverUrl;
    } catch (err) {
      this.status = ServerStatus.ERROR;
      this.error = err instanceof Error ? err.message : "启动开发服务器失败";
      this.notifyOutput(`错误: ${this.error}`);

      // 如果超时但进程仍在运行，尝试使用默认URL
      if (this.serverProcess && !this.serverUrl) {
        this.serverUrl = "http://localhost:5173";
        this.status = ServerStatus.RUNNING;
        this.notifyOutput(`超时后使用默认WebContainer内部服务URL: ${this.serverUrl}`);
        return this.serverUrl;
      }

      throw err;
    }
  }

  /**
   * 停止开发服务器
   * 确保彻底清理端口占用
   */
  public async stopServer(): Promise<void> {
    if (this.serverProcess) {
      try {
        // 尝试发送SIGINT信号终止进程
        this.notifyOutput("正在停止服务器进程...");

        // 尝试终止进程
        await this.serverProcess.kill();

        // 执行额外的清理命令，确保端口被释放
        if (this.webcontainerInstance) {
          try {
            // 查找占用端口的进程
            this.notifyOutput("检查并清理端口占用...");

            // 使用多种方法确保端口释放
            const cleanup1 = await this.webcontainerInstance.spawn("sh", ["-c", 'pkill -f "node.*dev" || true']);
            await cleanup1.exit;

            // 特别检查并杀死3000端口的进程
            const cleanup2 = await this.webcontainerInstance.spawn("sh", ["-c", "fuser -k 3000/tcp || true"]);
            await cleanup2.exit;

            // 再次确认端口释放
            const cleanup3 = await this.webcontainerInstance.spawn("sh", [
              "-c",
              "lsof -i:3000 | grep LISTEN | awk '{print $2}' | xargs kill -9 || true",
            ]);
            await cleanup3.exit;

            // 等待端口完全释放
            await new Promise((resolve) => setTimeout(resolve, 1000));

            this.notifyOutput("服务器进程已终止，端口已释放");
          } catch (err) {
            // 忽略清理命令错误
            this.notifyOutput(`清理命令执行失败: ${err}`);
          }
        }
      } catch (err) {
        console.error("停止服务器失败:", err);
        this.notifyOutput(`停止服务器失败: ${err}`);
      }
    }

    this.serverProcess = null;
    this.serverUrl = "";
    this.status = ServerStatus.STOPPED;
    this.notifyOutput("服务器已停止");
  }

  /**
   * 获取服务器URL
   */
  public getServerUrl(): string {
    return this.serverUrl;
  }

  /**
   * 获取服务器状态
   */
  public getStatus(): ServerStatus {
    return this.status;
  }

  /**
   * 获取错误信息
   */
  public getError(): string | null {
    return this.error;
  }

  /**
   * 添加输出监听器
   * @param listener 监听器函数
   */
  public addOutputListener(listener: (output: string) => void): void {
    if (!this.outputListeners.includes(listener)) {
      this.outputListeners.push(listener);
    }
  }

  /**
   * 移除输出监听器
   * @param listener 监听器函数
   */
  public removeOutputListener(listener: (output: string) => void): void {
    const index = this.outputListeners.indexOf(listener);
    if (index !== -1) {
      this.outputListeners.splice(index, 1);
    }
  }

  /**
   * 通知所有输出监听器
   * @param output 输出内容
   */
  private notifyOutput(output: string): void {
    this.outputListeners.forEach((listener) => {
      try {
        listener(output);
      } catch (err) {
        console.error("输出监听器执行失败:", err);
      }
    });
  }
}
