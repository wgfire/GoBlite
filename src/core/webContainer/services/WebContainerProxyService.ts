/**
 * WebContainer代理服务
 *
 * 负责处理WebContainer内部URL在外部窗口中的访问
 */
export class WebContainerProxyService {
  private static instance: WebContainerProxyService | null = null;
  private proxyWindows: Map<string, Window> = new Map();
  private messageHandlers: Map<string, (event: MessageEvent) => void> = new Map();

  /**
   * 获取单例实例
   */
  public static getInstance(): WebContainerProxyService {
    if (!WebContainerProxyService.instance) {
      WebContainerProxyService.instance = new WebContainerProxyService();
    }
    return WebContainerProxyService.instance;
  }

  /**
   * 私有构造函数，确保单例模式
   */
  private constructor() {
    // 当页面关闭时清理所有代理窗口
    window.addEventListener("beforeunload", () => {
      this.closeAllProxyWindows();
    });
  }

  /**
   * 在新窗口中打开WebContainer内部URL
   * @param url WebContainer内部URL
   * @returns 是否成功打开
   */
  public openInNewWindow(url: string): boolean {
    try {
      // 创建唯一ID用于标识此代理窗口
      const proxyId = `proxy_${Date.now()}`;

      // 创建代理URL
      const proxyUrl = new URL("/webcontainer-preview.html", window.location.origin);
      proxyUrl.searchParams.set("url", url);
      proxyUrl.searchParams.set("origin", window.location.origin);
      proxyUrl.searchParams.set("id", proxyId);

      // 打开代理页面 - 不使用noopener，以确保可以通过window.opener通信
      const proxyWindow = window.open(proxyUrl.toString(), "_blank");

      if (!proxyWindow) {
        console.error("无法打开新窗口，可能被浏览器拦截");
        return false;
      }

      // 保存代理窗口引用
      this.proxyWindows.set(proxyId, proxyWindow);

      // 创建消息处理函数
      const messageHandler = this.createMessageHandler(proxyId, url, proxyWindow);

      // 保存消息处理函数引用，以便后续可以移除
      this.messageHandlers.set(proxyId, messageHandler);

      // 添加消息监听器
      window.addEventListener("message", messageHandler);

      // 主动尝试发送就绪消息，而不等待代理页面请求
      setTimeout(() => {
        if (proxyWindow && !proxyWindow.closed) {
          try {
            proxyWindow.postMessage(
              {
                type: "WEBCONTAINER_PREVIEW_READY",
                data: { url },
              },
              window.location.origin
            );
            console.log("主动发送就绪消息到代理窗口");
          } catch (err) {
            console.error("发送就绪消息失败:", err);
          }
        }
      }, 1000);

      return true;
    } catch (err) {
      console.error("打开代理窗口失败:", err);
      return false;
    }
  }

  /**
   * 创建消息处理函数
   * @param proxyId 代理窗口ID
   * @param url WebContainer内部URL
   * @param proxyWindow 代理窗口引用
   * @returns 消息处理函数
   */
  private createMessageHandler(proxyId: string, url: string, proxyWindow: Window): (event: MessageEvent) => void {
    return (event: MessageEvent) => {
      // 验证消息来源
      if (event.origin !== window.location.origin) return;

      const { type, data } = event.data || {};

      // 确保消息包含正确的代理ID
      if (data?.proxyId && data.proxyId !== proxyId) return;

      switch (type) {
        case "WEBCONTAINER_PREVIEW_CONNECT":
          // 处理连接请求
          this.handleConnectRequest(proxyWindow, url);
          break;

        case "WEBCONTAINER_PREVIEW_CLOSED":
          // 处理代理窗口关闭
          this.cleanupProxyWindow(proxyId);
          break;
      }
    };
  }

  /**
   * 处理连接请求
   * @param proxyWindow 代理窗口引用
   * @param url WebContainer内部URL
   */
  private handleConnectRequest(proxyWindow: Window, url: string): void {
    if (proxyWindow && !proxyWindow.closed) {
      try {
        // 通知代理窗口WebContainer已准备就绪
        proxyWindow.postMessage(
          {
            type: "WEBCONTAINER_PREVIEW_READY",
            data: { url },
          },
          window.location.origin
        );
        console.log("响应连接请求，发送就绪消息到代理窗口");

        // 再次尝试发送，确保消息被接收
        setTimeout(() => {
          if (proxyWindow && !proxyWindow.closed) {
            proxyWindow.postMessage(
              {
                type: "WEBCONTAINER_PREVIEW_READY",
                data: { url },
              },
              window.location.origin
            );
            console.log("再次发送就绪消息到代理窗口");
          }
        }, 500);
      } catch (err) {
        console.error("发送就绪消息失败:", err);
      }
    }
  }

  /**
   * 清理代理窗口资源
   * @param proxyId 代理窗口ID
   */
  private cleanupProxyWindow(proxyId: string): void {
    // 移除消息监听器
    const messageHandler = this.messageHandlers.get(proxyId);
    if (messageHandler) {
      window.removeEventListener("message", messageHandler);
      this.messageHandlers.delete(proxyId);
    }

    // 移除窗口引用
    this.proxyWindows.delete(proxyId);
  }

  /**
   * 关闭所有代理窗口
   */
  public closeAllProxyWindows(): void {
    // 关闭所有代理窗口
    for (const [proxyId, proxyWindow] of this.proxyWindows.entries()) {
      if (proxyWindow && !proxyWindow.closed) {
        proxyWindow.close();
      }
      this.cleanupProxyWindow(proxyId);
    }
  }

  /**
   * 关闭特定代理窗口
   * @param proxyId 代理窗口ID
   */
  public closeProxyWindow(proxyId: string): void {
    const proxyWindow = this.proxyWindows.get(proxyId);
    if (proxyWindow && !proxyWindow.closed) {
      proxyWindow.close();
    }
    this.cleanupProxyWindow(proxyId);
  }
}
