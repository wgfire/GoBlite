import { TemplateMetadata, FileSystemTree } from '../types';
import { FileSystemUtils } from '../utils/fileSystemUtils';

/**
 * 模板服务
 * 负责管理和加载应用模板
 */
export class TemplateService {
  private static instance: TemplateService;
  private templatesCache: Map<string, TemplateMetadata>;
  private apiBaseUrl: string;
  
  private constructor() {
    this.templatesCache = new Map();
    this.apiBaseUrl = 'http://localhost:3001/api'; // 默认API地址
  }
  
  /**
   * 获取模板服务单例
   */
  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }
  
  /**
   * 设置API基础URL
   * @param url API基础URL
   */
  public setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }
  
  /**
   * 加载所有可用模板的元数据
   * @returns 模板元数据数组
   */
  public async loadTemplates(): Promise<TemplateMetadata[]> {
    try {
      // 从API获取模板列表
      const response = await fetch(`${this.apiBaseUrl}/templates`);
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.statusText}`);
      }
      
      const templates = await response.json() as TemplateMetadata[];
      
      // 缓存模板数据
      templates.forEach(template => {
        this.templatesCache.set(template.name, template);
      });
      
      return templates;
    } catch (error) {
      console.error('加载模板失败:', error);
      return [];
    }
  }
  
  /**
   * 获取单个模板的元数据
   * @param templateName 模板名称
   * @returns 模板元数据，如果不存在则返回null
   */
  public getTemplateMetadata(templateName: string): TemplateMetadata | null {
    return this.templatesCache.get(templateName) || null;
  }
  
  /**
   * 通过标签筛选模板
   * @param tags 标签数组
   * @returns 符合标签条件的模板元数据数组
   */
  public filterTemplatesByTags(tags: string[]): TemplateMetadata[] {
    const results: TemplateMetadata[] = [];
    
    this.templatesCache.forEach(template => {
      // 检查模板是否包含所有指定标签
      const hasAllTags = tags.every(tag => template.tags.includes(tag));
      if (hasAllTags) {
        results.push(template);
      }
    });
    
    return results;
  }
  
  /**
   * 通过框架类型筛选模板
   * @param framework 框架类型
   * @returns 符合框架类型的模板元数据数组
   */
  public filterTemplatesByFramework(framework: string): TemplateMetadata[] {
    const results: TemplateMetadata[] = [];
    
    this.templatesCache.forEach(template => {
      if (template.framework === framework) {
        results.push(template);
      }
    });
    
    return results;
  }
  
  /**
   * 加载模板文件内容
   * @param templateName 模板名称
   * @returns 文件系统树对象，如果模板不存在则返回null
   */
  public async loadTemplateFiles(templateName: string): Promise<FileSystemTree | null> {
    const template = this.getTemplateMetadata(templateName);
    if (!template) return null;
    
    try {
      // 获取模板文件列表
      const filesListResponse = await fetch(`${this.apiBaseUrl}/templates/${encodeURIComponent(templateName)}/files`);
      if (!filesListResponse.ok) {
        throw new Error(`获取文件列表失败: ${filesListResponse.statusText}`);
      }
      
      const filesList = await filesListResponse.json() as string[];
      const files: Record<string, string> = {};
      
      // 按需获取文件内容
      for (const filePath of filesList) {
        const fileResponse = await fetch(`${this.apiBaseUrl}/templates/${encodeURIComponent(templateName)}/files/${encodeURIComponent(filePath)}`);
        if (fileResponse.ok) {
          files[filePath] = await fileResponse.text();
        }
      }
      
      // 转换为WebContainer格式
      return FileSystemUtils.toWebContainerFormat(files);
    } catch (error) {
      console.error(`加载模板 ${templateName} 文件失败:`, error);
      return null;
    }
  }
}

// 导出单例实例
export const templateService = TemplateService.getInstance();
