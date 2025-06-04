export {}; // 确保此文件被视为模块，以便正确地进行全局声明合并

declare global {
  interface Window {
    openH5Detail?: (options: { url: string }) => void;
  }
}
