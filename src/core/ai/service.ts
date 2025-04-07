/**
 * AI服务实现
 */

import {
  AIServiceConfig,
  AIRequestOptions,
  AIResponse,
  CodeGenerationResult,
  ImageGenerationResult,
  AIServiceStatus
} from './types';

/**
 * AI服务类
 * 提供AI模型接口调用、代码生成和图像生成功能
 */
export class AIService {
  private static instance: AIService | null = null;
  private config: AIServiceConfig | null = null;
  private status: AIServiceStatus = AIServiceStatus.UNINITIALIZED;
  private error: string | null = null;
  private abortController: AbortController | null = null;

  /**
   * 私有构造函数，使用单例模式
   */
  private constructor() {}

  /**
   * 获取AIService实例
   * @returns AIService实例
   */
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * 初始化AI服务
   * @param config 服务配置
   * @returns 是否初始化成功
   */
  public async initialize(config: AIServiceConfig): Promise<boolean> {
    try {
      this.status = AIServiceStatus.INITIALIZING;
      this.config = config;
      
      // 验证API密钥和配置
      const isValid = await this.validateConfig();
      
      if (isValid) {
        this.status = AIServiceStatus.READY;
        this.error = null;
        return true;
      } else {
        this.status = AIServiceStatus.ERROR;
        this.error = "配置验证失败";
        return false;
      }
    } catch (err) {
      this.status = AIServiceStatus.ERROR;
      this.error = err instanceof Error ? err.message : "初始化失败";
      return false;
    }
  }

  /**
   * 验证配置
   * @returns 配置是否有效
   */
  private async validateConfig(): Promise<boolean> {
    if (!this.config) return false;
    if (!this.config.apiKey || !this.config.baseUrl || !this.config.modelName) {
      this.error = "配置缺少必要参数";
      return false;
    }

    // TODO: 实现实际的API验证
    // 这里可以发送一个简单的请求来验证API密钥和URL是否有效
    
    return true;
  }

  /**
   * 发送AI请求
   * @param options 请求选项
   * @returns AI响应
   */
  public async sendRequest(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.config) {
      return {
        success: false,
        error: "服务未初始化"
      };
    }

    if (this.status !== AIServiceStatus.READY) {
      return {
        success: false,
        error: `服务状态不正确: ${this.status}`
      };
    }

    try {
      this.status = AIServiceStatus.PROCESSING;
      this.abortController = new AbortController();
      
      const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.modelName,
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: options.prompt }
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
          stop: options.stopSequences
        }),
        signal: this.abortController.signal,
        ...(this.config.timeout ? { timeout: this.config.timeout } : {})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      this.status = AIServiceStatus.READY;
      return {
        success: true,
        content: data.choices[0]?.message?.content,
        usage: data.usage
      };
    } catch (err) {
      this.status = AIServiceStatus.ERROR;
      this.error = err instanceof Error ? err.message : "请求失败";
      
      return {
        success: false,
        error: this.error
      };
    } finally {
      this.abortController = null;
    }
  }

  /**
   * 生成代码
   * @param options 请求选项
   * @returns 代码生成结果
   */
  public async generateCode(options: AIRequestOptions): Promise<CodeGenerationResult> {
    try {
      // 添加代码生成相关的系统提示词
      const systemPrompt = options.systemPrompt || 
        "你是一个专业的代码生成助手。请根据用户的需求生成代码。" +
        "返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。" +
        "例如: ```filepath:src/index.js\nconsole.log('Hello');\n```";
      
      const response = await this.sendRequest({
        ...options,
        systemPrompt
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error
        };
      }

      // 解析响应中的代码文件
      const files = this.parseCodeFromResponse(response.content || "");
      
      return {
        success: true,
        files
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "代码生成失败"
      };
    }
  }

  /**
   * 从响应中解析代码文件
   * @param content 响应内容
   * @returns 解析出的文件列表
   */
  private parseCodeFromResponse(content: string): Array<{path: string, content: string, language?: string}> {
    const files: Array<{path: string, content: string, language?: string}> = [];
    
    // 匹配markdown代码块: ```language:filepath ... ```
    const codeBlockRegex = /```(?:([\w-]+):)?([^\n]+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1];
      const filepath = match[2] || "";
      const code = match[3];
      
      // 如果找到了文件路径和代码内容
      if (filepath && code) {
        // 清理文件路径
        const cleanPath = filepath.replace(/^filepath:/, '').trim();
        
        files.push({
          path: cleanPath,
          content: code,
          language
        });
      }
    }
    
    return files;
  }

  /**
   * 生成图像
   * @param prompt 提示词
   * @param options 选项
   * @returns 图像生成结果
   */
  public async generateImage(prompt: string, options: any = {}): Promise<ImageGenerationResult> {
    if (!this.config) {
      return {
        success: false,
        error: "服务未初始化"
      };
    }

    try {
      this.status = AIServiceStatus.PROCESSING;
      this.abortController = new AbortController();
      
      // 这里使用图像生成API，例如OpenAI的DALL-E API
      const response = await fetch(`${this.config.baseUrl}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          n: options.count || 1,
          size: options.size || "1024x1024",
          response_format: "url"
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `图像生成请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      this.status = AIServiceStatus.READY;
      return {
        success: true,
        images: data.data.map((img: any) => ({
          url: img.url,
          width: 1024, // 根据实际返回调整
          height: 1024
        }))
      };
    } catch (err) {
      this.status = AIServiceStatus.ERROR;
      this.error = err instanceof Error ? err.message : "图像生成失败";
      
      return {
        success: false,
        error: this.error
      };
    } finally {
      this.abortController = null;
    }
  }

  /**
   * 优化提示词
   * @param prompt 原始提示词
   * @returns 优化后的提示词
   */
  public async optimizePrompt(prompt: string): Promise<string> {
    try {
      const response = await this.sendRequest({
        prompt: `请优化以下提示词，使其更清晰、更具体，以便AI能更好地理解和执行：\n\n${prompt}`,
        systemPrompt: "你是一个专业的提示词优化助手。请帮助用户优化他们的提示词，使其更加清晰、具体和有效。只返回优化后的提示词，不要包含任何解释或其他内容。"
      });

      if (!response.success || !response.content) {
        return prompt; // 如果优化失败，返回原始提示词
      }

      return response.content.trim();
    } catch (err) {
      console.error("提示词优化失败:", err);
      return prompt; // 出错时返回原始提示词
    }
  }

  /**
   * 取消当前请求
   */
  public cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      this.status = AIServiceStatus.READY;
    }
  }

  /**
   * 获取当前状态
   * @returns 服务状态
   */
  public getStatus(): AIServiceStatus {
    return this.status;
  }

  /**
   * 获取错误信息
   * @returns 错误信息
   */
  public getError(): string | null {
    return this.error;
  }

  /**
   * 重置服务状态
   */
  public reset(): void {
    this.cancelRequest();
    this.error = null;
    this.status = this.config ? AIServiceStatus.READY : AIServiceStatus.UNINITIALIZED;
  }
}
