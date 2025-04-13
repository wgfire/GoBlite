    // 获取环境变量（如果可用）
    export const getEnvVar = (key: string): string => {
      // 检查是否在Node.js环境中（有process对象）
      if (typeof window === "undefined" && typeof process !== "undefined" && process.env) {
        return process.env[key] || "";
      }
      // 检查Vite环境变量
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[`VITE_${key}`]) {
        return import.meta.env[`VITE_${key}`];
      }
      // 浏览器环境中没有process.env
      return "";
    };