/**
 * 提示词管理器
 * 负责管理和处理AI提示词模板
 */

import { PromptTemplate } from '../types';
import { AIService } from '../service';

/**
 * 默认提示词模板
 */
const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-generation',
    name: '代码生成',
    template: '请根据以下需求生成代码：\n\n{{requirement}}\n\n技术栈：{{stack}}',
    variables: ['requirement', 'stack'],
    description: '根据需求和技术栈生成代码',
    category: 'development',
    modelType: 'code'
  },
  {
    id: 'image-generation',
    name: '图像生成',
    template: '生成一张{{style}}风格的图片，内容是：{{content}}',
    variables: ['style', 'content'],
    description: '根据内容和风格生成图像',
    category: 'design',
    modelType: 'image'
  },
  {
    id: 'landing-page',
    name: '落地页生成',
    template: '请为{{product}}创建一个落地页，包含以下部分：\n- 标题和副标题\n- 产品特点\n- 价格信息\n- 行动号召\n\n目标受众：{{audience}}\n风格：{{style}}',
    variables: ['product', 'audience', 'style'],
    description: '生成产品落地页代码',
    category: 'marketing',
    modelType: 'code'
  }
];

/**
 * 提示词管理器类
 */
export class PromptManager {
  private static instance: PromptManager | null = null;
  private templates: PromptTemplate[] = [];
  private aiService: AIService;

  /**
   * 私有构造函数，使用单例模式
   */
  private constructor() {
    this.templates = [...DEFAULT_TEMPLATES];
    this.aiService = AIService.getInstance();
  }

  /**
   * 获取PromptManager实例
   * @returns PromptManager实例
   */
  public static getInstance(): PromptManager {
    if (!PromptManager.instance) {
      PromptManager.instance = new PromptManager();
    }
    return PromptManager.instance;
  }

  /**
   * 初始化提示词管理器
   * @returns 是否初始化成功
   */
  public async initialize(): Promise<boolean> {
    try {
      // 从本地存储加载自定义模板
      await this.loadCustomTemplates();
      return true;
    } catch (err) {
      console.error('初始化提示词管理器失败:', err);
      return false;
    }
  }

  /**
   * 从本地存储加载自定义模板
   */
  private async loadCustomTemplates(): Promise<void> {
    try {
      const customTemplatesJson = localStorage.getItem('customPromptTemplates');
      if (customTemplatesJson) {
        const customTemplates = JSON.parse(customTemplatesJson) as PromptTemplate[];
        // 合并自定义模板，避免重复
        this.templates = [
          ...DEFAULT_TEMPLATES,
          ...customTemplates.filter(ct => !DEFAULT_TEMPLATES.some(dt => dt.id === ct.id))
        ];
      }
    } catch (err) {
      console.error('加载自定义模板失败:', err);
    }
  }

  /**
   * 获取所有模板
   * @returns 提示词模板列表
   */
  public async getTemplates(): Promise<PromptTemplate[]> {
    return this.templates;
  }

  /**
   * 根据ID获取模板
   * @param id 模板ID
   * @returns 提示词模板或null
   */
  public async getTemplateById(id: string): Promise<PromptTemplate | null> {
    const template = this.templates.find(t => t.id === id);
    return template || null;
  }

  /**
   * 根据模板创建提示词
   * @param template 模板对象或模板ID
   * @param variables 变量值
   * @returns 生成的提示词
   */
  public createPrompt(template: PromptTemplate | string, variables: Record<string, string>): string {
    // 如果传入的是模板ID，查找对应的模板
    const templateObj = typeof template === 'string' 
      ? this.templates.find(t => t.id === template) 
      : template;
    
    if (!templateObj) {
      throw new Error(`模板不存在: ${typeof template === 'string' ? template : template.id}`);
    }
    
    // 替换模板中的变量
    let prompt = templateObj.template;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    // 检查是否还有未替换的变量
    const unreplacedVariables = prompt.match(/{{[^{}]+}}/g);
    if (unreplacedVariables) {
      console.warn('提示词中存在未替换的变量:', unreplacedVariables);
    }
    
    return prompt;
  }

  /**
   * 优化提示词
   * @param prompt 原始提示词
   * @returns 优化后的提示词
   */
  public async optimizePrompt(prompt: string): Promise<string> {
    return this.aiService.optimizePrompt(prompt);
  }

  /**
   * 保存模板
   * @param template 提示词模板
   * @returns 是否保存成功
   */
  public async saveTemplate(template: PromptTemplate): Promise<boolean> {
    try {
      // 检查是否已存在相同ID的模板
      const existingIndex = this.templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        // 更新现有模板
        this.templates[existingIndex] = template;
      } else {
        // 添加新模板
        this.templates.push(template);
      }
      
      // 保存自定义模板到本地存储
      await this.saveCustomTemplates();
      return true;
    } catch (err) {
      console.error('保存模板失败:', err);
      return false;
    }
  }

  /**
   * 删除模板
   * @param id 模板ID
   * @returns 是否删除成功
   */
  public async deleteTemplate(id: string): Promise<boolean> {
    try {
      // 检查是否为默认模板
      const isDefaultTemplate = DEFAULT_TEMPLATES.some(t => t.id === id);
      if (isDefaultTemplate) {
        throw new Error('不能删除默认模板');
      }
      
      // 删除模板
      this.templates = this.templates.filter(t => t.id !== id);
      
      // 保存自定义模板到本地存储
      await this.saveCustomTemplates();
      return true;
    } catch (err) {
      console.error('删除模板失败:', err);
      return false;
    }
  }

  /**
   * 保存自定义模板到本地存储
   */
  private async saveCustomTemplates(): Promise<void> {
    try {
      // 过滤出自定义模板（非默认模板）
      const customTemplates = this.templates.filter(
        t => !DEFAULT_TEMPLATES.some(dt => dt.id === t.id)
      );
      
      // 保存到本地存储
      localStorage.setItem('customPromptTemplates', JSON.stringify(customTemplates));
    } catch (err) {
      console.error('保存自定义模板失败:', err);
      throw err;
    }
  }
}
