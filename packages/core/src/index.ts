// 导出类型定义
export * from './types';

// 导出工具类
export { eventBus, EventBus } from './utils/eventBus';
export { FileSystemUtils } from './utils/fileSystemUtils';
export { webContainerUtils, WebContainerUtils } from './utils/webContainerUtils';

// 导出服务
export { templateService, TemplateService } from './services/templateService';

// 版本信息
export const VERSION = '0.1.0';
