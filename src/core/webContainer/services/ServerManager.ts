import { WebContainer } from '@webcontainer/api';

/**
 * 服务器状态枚举
 */
export enum ServerStatus {
  STOPPED = 'stopped',
  STARTING = 'starting',
  RUNNING = 'running',
  ERROR = 'error'
}

/**
 * 服务器管理类
 * 
 * 负责管理WebContainer中的开发服务器，提供启动、停止、URL检测等功能
 */
export class ServerManager {
  private webcontainerInstance: WebContainer | null = null;
  private serverUrl: string = '';
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
      throw new Error('WebContainer未初始化');
    }
    
    try {
      this.status = ServerStatus.STARTING;
      this.notifyOutput('正在启动开发服务器...');
      
      // 创建一个Promise，当服务器准备好时解析
      const serverReadyPromise = new Promise<string>((resolve) => {
        // 监听server-ready事件
        this.webcontainerInstance!.on('server-ready', (port, url) => {
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
            reject(new Error('等待服务器启动超时'));
          }
        }, 30000); // 30秒超时
      });
      
      // 启动开发服务器
      this.serverProcess = await this.webcontainerInstance.spawn('npm', ['run', 'dev']);
      
      // 监听命令输出（用于日志，不再用于检测URL）
      this.serverProcess.output.pipeTo(
        new WritableStream({
          write: (data: string) => {
            this.notifyOutput(data);
          }
        })
      );
      
      // 等待服务器准备好或超时
      this.serverUrl = await Promise.race([serverReadyPromise, timeoutPromise]);
      
      // 如果没有获取到URL，但进程仍在运行，尝试使用默认URL
      if (!this.serverUrl && this.serverProcess) {
        // 对于Vite项目，默认端口通常是5173
        this.serverUrl = 'http://localhost:5173';
        this.status = ServerStatus.RUNNING;
        this.notifyOutput(`未能自动检测到URL，使用默认WebContainer内部服务URL: ${this.serverUrl}`);
      }
      
      return this.serverUrl;
    } catch (err) {
      this.status = ServerStatus.ERROR;
      this.error = err instanceof Error ? err.message : '启动开发服务器失败';
      this.notifyOutput(`错误: ${this.error}`);
      
      // 如果超时但进程仍在运行，尝试使用默认URL
      if (this.serverProcess && !this.serverUrl) {
        this.serverUrl = 'http://localhost:5173';
        this.status = ServerStatus.RUNNING;
        this.notifyOutput(`超时后使用默认WebContainer内部服务URL: ${this.serverUrl}`);
        return this.serverUrl;
      }
      
      throw err;
    }
  }
  
  /**
   * 停止开发服务器
   */
  public async stopServer(): Promise<void> {
    if (this.serverProcess) {
      try {
        // 尝试终止进程
        await this.serverProcess.kill();
      } catch (err) {
        console.error('停止服务器失败:', err);
      }
    }
    
    this.serverProcess = null;
    this.serverUrl = '';
    this.status = ServerStatus.STOPPED;
    this.notifyOutput('服务器已停止');
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
    this.outputListeners.forEach(listener => {
      try {
        listener(output);
      } catch (err) {
        console.error('输出监听器执行失败:', err);
      }
    });
  }
}
