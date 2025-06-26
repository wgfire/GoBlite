import { toast } from "@go-blite/shadcn/hooks";

// toast 配置类型
export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  timeout?: number; // 自动关闭时间，单位毫秒，0 表示不自动关闭
}

/**
 * 带超时自动关闭功能的 toast hook
 * @returns 返回一个函数，用于显示 toast 并在指定时间后自动关闭
 */
export const useToastWithTimeout = () => {
  /**
   * 显示 toast 并在指定时间后自动关闭
   * @param options toast 配置选项
   * @returns toast 实例
   */
  const showToast = (options: ToastOptions) => {
    const { timeout = 3000, ...toastOptions } = options;

    // 创建 toast
    const toastInstance = toast({
      ...toastOptions,
      // 如果 timeout 为 0，添加自定义属性防止自动关闭
      duration: timeout === 0 ? Number.MAX_SAFE_INTEGER : undefined
    });

    // 设置自动关闭定时器
    if (timeout > 0) {
      setTimeout(() => {
        toastInstance.dismiss();
      }, timeout);
    }

    return toastInstance;
  };

  return showToast;
};
