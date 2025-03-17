import type { TemplateMetadata } from '@vite-goblite/core';

// 导入模板数据
import vueTemplate from './templates/vue-template';
import reactTemplate from './templates/react-template';

// 所有模板的集合
const templates: TemplateMetadata[] = [
  vueTemplate.metadata,
  reactTemplate.metadata
];

/**
 * 获取所有模板元数据
 * @returns 模板元数据数组
 */
export function getAll(): TemplateMetadata[] {
  return templates;
}

/**
 * 获取特定模板的元数据
 * @param templateName 模板名称
 * @returns 模板元数据，如果不存在则返回null
 */
export function getTemplate(templateName: string): TemplateMetadata | null {
  const template = templates.find(t => t.name === templateName);
  return template || null;
}

/**
 * 获取特定模板的文件内容
 * @param templateName 模板名称
 * @returns 文件内容的对象，键为文件路径，值为文件内容
 */
export function getFiles(templateName: string): Record<string, string> | null {
  if (templateName === 'Vue 3 Template') {
    return vueTemplate.files;
  } else if (templateName === 'React Template') {
    return reactTemplate.files;
  }
  return null;
}

// 默认导出
export default {
  getAll,
  getTemplate,
  getFiles
};
