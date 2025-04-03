  // 初始化时只在debug模式下输出日志
  const isDebug = true; // 设置为false可禁用调试日志

  // 条件日志输出
  export const logDebug = (message: string, ...args: unknown[]) => {
    if (isDebug) {
      console.log(message, ...args);
    }
  };