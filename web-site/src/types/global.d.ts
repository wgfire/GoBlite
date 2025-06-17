/**
 * 全局类型定义文件
 * 用于定义全局接口扩展和类型
 */

/**
 * Window 接口扩展
 * 添加原生应用交互接口
 */
interface Window {
  /**
   * 获取当前APP页面的header信息
   * @param callback 回调函数，接收header信息对象
   */
  getHeader?: (callback: (data: Record<string, unknown>) => void) => void;

  // 可以添加其他原生应用接口
}
