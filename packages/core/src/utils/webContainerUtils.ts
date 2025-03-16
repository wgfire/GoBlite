import { FileSystemTree, BuildProcessInfo, BuildStatus, EventType } from '../types';
import { eventBus } from './eventBus';

// 在实际项目中导入 WebContainer API
// 这里模拟一些接口，实际实现中需要使用正确的导入
type WebContainerInstance = any;
type WebContainerProcess = any;
type WebContainerFile = any;

/**
 * WebContainer 工具类
 * 负责管理 WebContainer 环境
 */
export class WebContainerUtils {
  private static instance: WebContainerUtils | null = null;
  private webcontainerInstance: WebContainerInstance | null = null;
  private serverUrl: string | null = null;
  private buildInfo: BuildProcessInfo = {
    status: BuildStatus.IDLE,
    logs: []
  };
  private terminal: any | null = null;

  private constructor() {
    // 私有构造函数，防止直接实例化
  }

  /**
   * 获取 WebContainerUtils 实例
   * @returns WebContainerUtils 单例
   */
  public static getInstance(): WebContainerUtils {
    if (!WebContainerUtils.instance) {
      WebContainerUtils.instance = new WebContainerUtils();
    }
    return WebContainerUtils.instance;
  }

  /**
   * 初始化 WebContainer
   * 在真实环境中，需要导入并初始化 WebContainer API
   */
  public async initialize(): Promise<void> {
    try {
      if (this.webcontainerInstance) {
        return; // 已经初始化
      }

      this.updateBuildStatus(BuildStatus.IDLE, '初始化 WebContainer...');

      // 在实际实现中，这里应该使用实际的 WebContainer API
      // this.webcontainerInstance = await WebContainer.boot();
      
      // 模拟初始化
      this.webcontainerInstance = {
        mount: async (files: FileSystemTree) => {
          console.log('Mounting files to WebContainer:', files);
          return true;
        },
        fs: {
          readFile: async (path: string) => {
            console.log(`Reading file: ${path}`);
            return 'File content';
          },
          writeFile: async (path: string, content: string) => {
            console.log(`Writing file: ${path}`);
            return true;
          }
        },
        spawn: async (command: string, args: string[]) => {
          console.log(`Spawning command: ${command} ${args.join(' ')}`);
          return {
            output: {
              pipeTo: async (writable: any) => {
                console.log('Piping output');
              }
            },
            exit: Promise.resolve(0)
          };
        }
      };

      this.updateBuildStatus(BuildStatus.IDLE, 'WebContainer 初始化完成');
      console.log('WebContainer initialized');
    } catch (error) {
      this.updateBuildStatus(BuildStatus.FAILED, `WebContainer 初始化失败: ${error}`);
      console.error('Failed to initialize WebContainer:', error);
      throw error;
    }
  }

  /**
   * 加载文件到 WebContainer
   * @param files 文件系统树
   */
  public async loadFiles(files: FileSystemTree): Promise<void> {
    try {
      if (!this.webcontainerInstance) {
        await this.initialize();
      }

      this.updateBuildStatus(BuildStatus.IDLE, '加载文件到 WebContainer...');
      await this.webcontainerInstance.mount(files);
      this.updateBuildStatus(BuildStatus.IDLE, '文件加载完成');
    } catch (error) {
      this.updateBuildStatus(BuildStatus.FAILED, `文件加载失败: ${error}`);
      console.error('Failed to load files to WebContainer:', error);
      throw error;
    }
  }

  /**
   * 安装依赖
   */
  public async installDependencies(): Promise<void> {
    try {
      if (!this.webcontainerInstance) {
        throw new Error('WebContainer not initialized');
      }

      this.updateBuildStatus(BuildStatus.INSTALLING, '安装依赖...');

      // 在实际实现中，这里应该使用实际的 WebContainer 命令执行
      const installProcess = await this.webcontainerInstance.spawn('npm', ['install']);
      
      // 设置终端
      if (this.terminal) {
        await installProcess.output.pipeTo(this.terminal.writable);
      }

      const installExitCode = await installProcess.exit;
      
      if (installExitCode !== 0) {
        throw new Error(`安装依赖失败，退出代码: ${installExitCode}`);
      }

      this.updateBuildStatus(BuildStatus.IDLE, '依赖安装完成');
      eventBus.emit(EventType.DEPENDENCIES_INSTALLED, {});
    } catch (error) {
      this.updateBuildStatus(BuildStatus.FAILED, `依赖安装失败: ${error}`);
      console.error('Failed to install dependencies:', error);
      throw error;
    }
  }

  /**
   * 启动开发服务器
   */
  public async startDevServer(): Promise<string> {
    try {
      if (!this.webcontainerInstance) {
        throw new Error('WebContainer not initialized');
      }

      this.updateBuildStatus(BuildStatus.BUILDING, '启动开发服务器...');

      // 在实际实现中，这里应该使用实际的 WebContainer 命令执行
      const serverProcess = await this.webcontainerInstance.spawn('npm', ['run', 'dev']);
      
      // 设置终端
      if (this.terminal) {
        await serverProcess.output.pipeTo(this.terminal.writable);
      }

      // 在实际实现中，这里应该等待服务器启动并获取 URL
      // 这里模拟返回一个 URL
      this.serverUrl = 'http://localhost:5173';
      
      this.updateBuildStatus(BuildStatus.RUNNING, '开发服务器已启动', this.serverUrl);
      eventBus.emit(EventType.SERVER_STARTED, { url: this.serverUrl });

      return this.serverUrl;
    } catch (error) {
      this.updateBuildStatus(BuildStatus.FAILED, `启动开发服务器失败: ${error}`);
      console.error('Failed to start dev server:', error);
      throw error;
    }
  }

  /**
   * 构建项目
   */
  public async buildProject(): Promise<void> {
    try {
      if (!this.webcontainerInstance) {
        throw new Error('WebContainer not initialized');
      }

      this.updateBuildStatus(BuildStatus.BUILDING, '构建项目...');
      eventBus.emit(EventType.BUILD_STARTED, {});

      // 在实际实现中，这里应该使用实际的 WebContainer 命令执行
      const buildProcess = await this.webcontainerInstance.spawn('npm', ['run', 'build']);
      
      // 设置终端
      if (this.terminal) {
        await buildProcess.output.pipeTo(this.terminal.writable);
      }

      const buildExitCode = await buildProcess.exit;
      
      if (buildExitCode !== 0) {
        throw new Error(`构建失败，退出代码: ${buildExitCode}`);
      }

      this.updateBuildStatus(BuildStatus.IDLE, '构建完成');
      eventBus.emit(EventType.BUILD_COMPLETED, {});
    } catch (error) {
      this.updateBuildStatus(BuildStatus.FAILED, `构建失败: ${error}`);
      console.error('Failed to build project:', error);
      eventBus.emit(EventType.BUILD_FAILED, { error });
      throw error;
    }
  }

  /**
   * 重启开发服务器
   * 用于修改代码后重新启动
   */
  public async restartDevServer(): Promise<string> {
    try {
      // 在实际实现中，可能需要先停止之前的服务器进程
      // 这里简化处理，直接重新启动
      return await this.startDevServer();
    } catch (error) {
      this.updateBuildStatus(BuildStatus.FAILED, `重启开发服务器失败: ${error}`);
      console.error('Failed to restart dev server:', error);
      throw error;
    }
  }

  /**
   * 获取构建状态信息
   * @returns 构建状态信息
   */
  public getBuildInfo(): BuildProcessInfo {
    return { ...this.buildInfo };
  }

  /**
   * 设置终端实例
   * 用于将命令输出重定向到UI终端
   * @param terminal 终端实例
   */
  public setTerminal(terminal: any): void {
    this.terminal = terminal;
  }

  /**
   * 更新构建状态
   * @param status 构建状态
   * @param message 日志消息
   * @param serverUrl 服务器URL（可选）
   */
  private updateBuildStatus(status: BuildStatus, message?: string, serverUrl?: string): void {
    this.buildInfo.status = status;
    if (message) {
      this.buildInfo.logs.push(`[${new Date().toISOString()}] ${message}`);
    }
    if (serverUrl) {
      this.buildInfo.serverUrl = serverUrl;
    }
    if (status === BuildStatus.FAILED) {
      this.buildInfo.error = message;
    } else {
      this.buildInfo.error = undefined;
    }
  }
}

// 导出单例实例
export const webContainerUtils = WebContainerUtils.getInstance();
