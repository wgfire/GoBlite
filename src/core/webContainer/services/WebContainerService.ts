import { FileItem, FileItemType } from "@core/fileSystem/types";
import { WebContainer, type FileSystemTree } from "@webcontainer/api";
import { DependencyCache } from "../cache/DependencyCache";
import { ServerManager } from "./ServerManager";

/**
 * WebContainer服务类
 *
 * 负责与WebContainer API交互，提供文件同步、初始化、启动开发服务器等功能
 */
export class WebContainerService {
  private static instance: WebContainerService | null = null;
  private webcontainerInstance: WebContainer | null = null;
  private error: string | null = null;
  private terminalOutputListeners: ((output: string) => void)[] = [];
  private serverUrl: string = "";
  private isRunning: boolean = false;
  private dependencyCache: DependencyCache = DependencyCache.getInstance();
  private currentPackageJsonHash: string = "";
  private serverManager: ServerManager | null = null;
  private serverStarted: boolean = false;

  /**
   * 获取WebContainerService实例（单例模式）
   */
  public static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService();
    }
    return WebContainerService.instance;
  }

  /**
   * 初始化WebContainer
   * @returns Promise<boolean> 初始化是否成功
   */
  public async initialize(): Promise<boolean> {
    try {
      if (this.webcontainerInstance) {
        return true;
      }

      // 初始化WebContainer实例
      this.webcontainerInstance = await WebContainer.boot();
      this.isRunning = true;
      this.error = null;

      // 初始化服务器管理器
      this.serverManager = new ServerManager(this.webcontainerInstance);
      this.serverManager.addOutputListener((output) => {
        this.notifyTerminalOutput(output);
      });

      // 通知终端输出监听器
      this.notifyTerminalOutput("WebContainer 初始化成功");

      return true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "初始化WebContainer失败";
      console.error("初始化WebContainer失败:", err);
      this.isRunning = false;
      return false;
    }
  }

  /**
   * 同步文件到WebContainer
   * @param files 文件列表
   */
  public async syncFiles(files: FileItem[]): Promise<void> {
    if (!this.webcontainerInstance) {
      throw new Error("WebContainer未初始化");
    }

    try {
      // 将FileItem格式转换为WebContainer所需的格式
      const webcontainerFiles = this.convertToWebContainerFiles(files);

      // 查找package.json并计算哈希
      const packageJsonFile = files.find((file) => file.name === "package.json");
      if (packageJsonFile && packageJsonFile.content) {
        this.currentPackageJsonHash = this.dependencyCache.generateCacheKey(packageJsonFile.content);
      }

      // 将文件写入WebContainer
      await this.webcontainerInstance.mount(webcontainerFiles);

      // 通知终端输出监听器
      this.notifyTerminalOutput("文件同步完成");
    } catch (err) {
      this.error = err instanceof Error ? err.message : "同步文件失败";
      console.error("同步文件失败:", err);
      throw err;
    }
  }

  /**
   * 安装依赖
   * 根据package.json的变化决定是否需要重新安装依赖
   */
  public async installDependencies(): Promise<void> {
    if (!this.webcontainerInstance) {
      throw new Error("WebContainer未初始化");
    }

    try {
      // 检查是否有package.json文件
      const packageJsonContent = await this.webcontainerInstance.fs.readFile("package.json", "utf-8");
      if (!packageJsonContent) {
        throw new Error("未找到package.json文件");
      }

      // 计算当前package.json的哈希值
      const currentHash = this.dependencyCache.generateCacheKey(packageJsonContent);

      // 检查package.json是否发生变化
      const hasPackageJsonChanged = currentHash !== this.currentPackageJsonHash;

      // 如果package.json没有变化，且存在缓存，直接使用缓存
      if (!hasPackageJsonChanged && this.dependencyCache.hasCache(this.currentPackageJsonHash)) {
        this.notifyTerminalOutput("package.json未变化，使用缓存的依赖...");

        // 从缓存获取node_modules
        const cachedData = this.dependencyCache.getCache(this.currentPackageJsonHash);
        if (!cachedData || !cachedData.nodeModulesSnapshot) {
          this.notifyTerminalOutput("缓存的依赖无效，将重新安装依赖...");
          return;
        }

        try {
          // 确保node_modules目录存在
          try {
            await this.webcontainerInstance.fs.readdir("node_modules");
          } catch {
            // 如果node_modules不存在，创建它
            await this.webcontainerInstance.fs.mkdir("node_modules");
          }

          // 挂载缓存的node_modules
          await this.webcontainerInstance.mount({
            node_modules: cachedData.nodeModulesSnapshot,
          });
          this.notifyTerminalOutput("依赖加载完成（从缓存）");
          return;
        } catch (mountError) {
          console.error("挂载缓存的node_modules失败:", mountError);
          this.notifyTerminalOutput("缓存的依赖加载失败，将重新安装依赖...");
        }
      }

      // 如果package.json发生变化或没有缓存，重新安装依赖
      this.notifyTerminalOutput(hasPackageJsonChanged ? "package.json已更新，重新安装依赖..." : "开始安装依赖...");

      // 执行npm install命令
      const installProcess = await this.webcontainerInstance.spawn("npm", ["install"]);

      // 监听命令输出
      installProcess.output.pipeTo(
        new WritableStream({
          write: (data) => {
            this.notifyTerminalOutput(data);
          },
        })
      );

      // 等待命令执行完成
      const installExitCode = await installProcess.exit;

      if (installExitCode !== 0) {
        throw new Error(`安装依赖失败，退出码: ${installExitCode}`);
      }

      this.notifyTerminalOutput("依赖安装完成");

      // 更新package.json哈希值并缓存新的node_modules
      this.currentPackageJsonHash = currentHash;

      // 等待一段时间确保node_modules目录已经创建完成
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        // 检查node_modules目录是否存在
        const nodeModulesExists = await this.webcontainerInstance.fs
          .readdir("node_modules")
          .then(() => true)
          .catch(() => false);

        if (!nodeModulesExists) {
          throw new Error("node_modules目录不存在");
        }

        // 获取node_modules内容进行缓存
        const nodeModulesDir = await this.webcontainerInstance.fs.readdir("node_modules", {
          withFileTypes: true,
        });

        if (!nodeModulesDir || !Array.isArray(nodeModulesDir)) {
          throw new Error("获取node_modules目录内容失败");
        }

        // 缓存node_modules
        this.dependencyCache.setCache(this.currentPackageJsonHash, nodeModulesDir);
        this.notifyTerminalOutput("依赖已缓存，下次将更快");
      } catch (cacheErr) {
        console.error("缓存依赖失败:", cacheErr);
        // 缓存失败不影响主流程，只记录错误
        this.notifyTerminalOutput("依赖安装完成，但缓存失败，下次将重新安装");
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : "安装依赖失败";
      console.error("安装依赖失败:", err);
      throw err;
    }
  }

  /**
   * 启动开发服务器
   * 增加端口冲突检查和处理
   * @returns Promise<string> 服务器URL
   */
  public async startDevServer(): Promise<string> {
    if (!this.webcontainerInstance) {
      throw new Error("WebContainer未初始化");
    }

    try {
      // 首先检查是否有服务正在运行，确保清理环境
      if (this.serverStarted) {
        this.notifyTerminalOutput("检测到已有服务在运行，正在清理...");

        // 如果服务器管理器可用，停止服务器
        if (this.serverManager) {
          await this.serverManager.stopServer();
        }

        // 额外检查常见端口，确保它们被释放
        try {
          const ports = [3000, 5173, 8080, 4000];
          for (const port of ports) {
            const checkProcess = await this.webcontainerInstance.spawn("sh", ["-c", `lsof -i:${port} | grep LISTEN || echo "No process on port ${port}"`]);

            // 收集输出
            const outputStream = new WritableStream({
              write: (data) => {
                if (data.includes("LISTEN")) {
                  this.notifyTerminalOutput(`检测到端口 ${port} 被占用，尝试释放...`);
                  // 尝试终止进程
                  setTimeout(async () => {
                    try {
                      const killProcess = await this.webcontainerInstance!.spawn("sh", ["-c", `fuser -k ${port}/tcp || true`]);
                      await killProcess.exit;
                    } catch (err) {
                      console.error(`释放端口 ${port} 失败:`, err);
                    }
                  }, 0);
                }
              },
            });

            checkProcess.output.pipeTo(outputStream);
            await checkProcess.exit;
          }

          // 等待端口释放完成
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (err) {
          console.error("检查端口占用失败:", err);
          // 继续执行，不中断主流程
        }

        // 重置服务状态
        this.serverStarted = false;
        this.serverUrl = "";
      }

      // 检查package.json是否存在
      try {
        await this.webcontainerInstance.fs.readFile("package.json", "utf-8");
      } catch (err) {
        console.error("检查package.json失败:", err);
        throw new Error("未找到package.json文件，请确保项目文件完整");
      }

      // 检查node_modules是否存在
      try {
        await this.webcontainerInstance.fs.readdir("node_modules");
      } catch (err) {
        console.error("检查node_modules失败:", err);
        this.notifyTerminalOutput("未找到node_modules，需要安装依赖...");
        await this.installDependencies();
      }

      // 使用服务器管理器启动服务器
      if (this.serverManager) {
        this.serverUrl = await this.serverManager.startServer();
        this.serverStarted = true;
        return this.serverUrl;
      }

      // 如果服务器管理器不可用，使用原始方法
      this.notifyTerminalOutput("正在启动开发服务器...");

      // 启动开发服务器
      const serverProcess = await this.webcontainerInstance.spawn("npm", ["run", "dev"]);

      // 监听命令输出
      serverProcess.output.pipeTo(
        new WritableStream({
          write: (data) => {
            this.notifyTerminalOutput(data);

            // 从输出中提取服务器URL
            if (data.includes("Local:") && !this.serverUrl) {
              const match = data.match(/Local:\s+(https?:\/\/\S+)/);
              if (match && match[1]) {
                this.serverUrl = match[1];
                this.serverStarted = true;
                this.notifyTerminalOutput(`服务器URL: ${this.serverUrl}`);
              }
            }
          },
        })
      );

      // 等待服务器启动（最多等待20秒）
      let attempts = 0;
      while (!this.serverStarted && attempts < 200) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (!this.serverUrl) {
        // 如果没有找到URL，尝试检测WebContainer内部常见端口
        const ports = [5173, 3000, 8080, 4000];
        for (const port of ports) {
          try {
            // 尝试访问WebContainer内部服务
            this.notifyTerminalOutput(`尝试检测WebContainer内部服务: 端口${port}`);

            // 使用WebContainer的webcontainerInstance.fs来检查是否有服务在运行
            // 这里我们通过尝试向特定端口发送请求来检测
            const probeProcess = await this.webcontainerInstance.spawn("curl", [`http://localhost:${port}`]);
            const exitCode = await probeProcess.exit;

            if (exitCode === 0) {
              this.serverUrl = `http://localhost:${port}`;
              this.serverStarted = true;
              this.notifyTerminalOutput(`检测到WebContainer内部服务URL: ${this.serverUrl}`);
              break;
            }
          } catch {
            // 忽略错误，继续尝试下一个端口
          }
        }

        // 如果仍然没有找到URL，使用默认URL
        if (!this.serverUrl) {
          // 对于Vite项目，默认端口通常是5173
          this.serverUrl = "http://localhost:5173";
          this.notifyTerminalOutput(`未能自动检测到URL，使用默认WebContainer内部服务URL: ${this.serverUrl}`);
        }
      }

      return this.serverUrl;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "启动开发服务器失败";
      console.error("启动开发服务器失败:", err);
      throw err;
    }
  }

  /**
   * 执行命令
   * @param command 要执行的命令
   */
  public async executeCommand(command: string): Promise<void> {
    if (!this.webcontainerInstance) {
      throw new Error("WebContainer未初始化");
    }

    try {
      // 解析命令和参数
      const [cmd, ...args] = command.trim().split(/\s+/);

      // 执行命令
      const process = await this.webcontainerInstance.spawn(cmd, args);

      // 监听命令输出
      process.output.pipeTo(
        new WritableStream({
          write: (data) => {
            this.notifyTerminalOutput(data);
          },
        })
      );

      // 等待命令执行完成
      const exitCode = await process.exit;

      if (exitCode !== 0) {
        this.notifyTerminalOutput(`命令执行失败，退出码: ${exitCode}`);
      } else {
        this.notifyTerminalOutput(`命令执行完成`);
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : "执行命令失败";
      console.error("执行命令失败:", err);
      this.notifyTerminalOutput(`错误: ${this.error}`);
      throw err;
    }
  }

  /**
   * 停止WebContainer
   */
  public stop(): void {
    // 停止服务器
    if (this.serverManager) {
      this.serverManager.stopServer();
    }

    // 清理资源
    if (this.webcontainerInstance) {
      try {
        // 尝试杀死所有仍在运行的进程
        this.notifyTerminalOutput("正在清理WebContainer资源...");

        // 在WebContainer中运行清理命令
        setTimeout(async () => {
          if (this.webcontainerInstance) {
            try {
              // 尝试杀死所有Node进程
              const cleanup = await this.webcontainerInstance.spawn("sh", ["-c", "pkill -f node || true"]);
              await cleanup.exit;
            } catch (err) {
              // 忽略清理错误
              console.error("清理进程失败:", err);
            }
          }
        }, 100);
      } catch (err) {
        console.error("清理WebContainer资源失败:", err);
      }
    }

    // 目前WebContainer API不提供直接停止的方法
    // 但我们可以重置状态
    this.isRunning = false;
    this.serverUrl = "";
    this.serverStarted = false;
    this.notifyTerminalOutput("WebContainer 已停止");
    this.notifyTerminalOutput("服务器已停止");
  }

  /**
   * 获取错误信息
   */
  public getError(): string | null {
    return this.error;
  }

  /**
   * 注册终端输出监听器
   * @param listener 监听器函数
   */
  public onTerminalOutput(listener: (output: string) => void): void {
    if (!this.terminalOutputListeners.includes(listener)) {
      this.terminalOutputListeners.push(listener);
    }
  }

  /**
   * 移除终端输出监听器
   * @param listener 监听器函数
   */
  public offTerminalOutput(listener: (output: string) => void): void {
    const index = this.terminalOutputListeners.indexOf(listener);
    if (index !== -1) {
      this.terminalOutputListeners.splice(index, 1);
    }
  }

  /**
   * 通知所有终端输出监听器
   * @param output 输出内容
   */
  private notifyTerminalOutput(output: string): void {
    this.terminalOutputListeners.forEach((listener) => {
      try {
        listener(output);
      } catch (err) {
        console.error("终端输出监听器执行失败:", err);
      }
    });
  }

  /**
   * 将FileItem格式转换为WebContainer所需的格式
   * @param files 文件列表
   * @returns WebContainer文件格式
   */
  private convertToWebContainerFiles(files: FileItem[]): FileSystemTree {
    const result: FileSystemTree = {};

    // 递归构建文件树
    const buildFileTree = (tree: FileSystemTree, path: string[], file: FileItem) => {
      // 如果路径为空，直接处理当前文件/文件夹
      if (path.length === 0) {
        if (file.type === FileItemType.FOLDER) {
          tree[file.name] = { directory: {} };

          // 递归处理子文件/文件夹
          if (file.children && file.children.length > 0) {
            file.children.forEach((child) => {
              buildFileTree((tree[file.name] as { directory: FileSystemTree }).directory, [], child);
            });
          }
        } else {
          tree[file.name] = { file: { contents: file.content || "" } };
        }
        return;
      }

      // 处理路径中的下一个部分
      const segment = path[0];
      const remaining = path.slice(1);

      // 如果当前段不存在，创建一个目录
      if (!tree[segment]) {
        tree[segment] = { directory: {} };
      }

      // 递归处理剩余路径
      buildFileTree((tree[segment] as { directory: FileSystemTree }).directory, remaining, file);
    };

    // 处理所有文件
    for (const file of files) {
      // 规范化路径：移除开头的斜杠，分割路径
      const normalizedPath = file.path.startsWith("/") ? file.path.substring(1) : file.path;
      const pathSegments = normalizedPath.split("/");

      // 文件/文件夹名是路径的最后一部分
      const fileName = pathSegments.pop() || "";

      // 创建一个新的FileItem，确保name是文件名而不是完整路径
      const processedFile: FileItem = {
        ...file,
        name: fileName,
      };

      // 构建文件树
      buildFileTree(result, pathSegments, processedFile);
    }

    console.log("转换后的WebContainer文件结构:", JSON.stringify(result, null, 2));
    return result;
  }
  public getRunning() {
    return this.isRunning;
  }
}
