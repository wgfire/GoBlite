/**
 * 响应验证工具
 * 用于验证AI响应的结构
 */

/**
 * 统一响应结构
 */
export interface UnifiedResponse {
  intent: {
    isInfoRequest: boolean;
    isCodeRequest: boolean;
    isTemplateRequest: boolean;
  };
  fileOperations: Array<{
    path: string;
    content: string;
    action: 'create' | 'update' | 'delete';
  }>;
  preview: {
    shouldStartPreview: boolean;
  };
  response: {
    text: string;
  };
}

/**
 * 验证统一响应结构
 * @param response 响应对象
 * @returns 是否有效
 */
export function validateUnifiedResponse(response: any): boolean {
  try {
    // 检查基本结构
    if (!response || typeof response !== 'object') return false;
    
    // 检查intent字段
    if (!response.intent || typeof response.intent !== 'object') return false;
    if (typeof response.intent.isInfoRequest !== 'boolean') return false;
    if (typeof response.intent.isCodeRequest !== 'boolean') return false;
    if (typeof response.intent.isTemplateRequest !== 'boolean') return false;
    
    // 检查fileOperations字段
    if (!Array.isArray(response.fileOperations)) return false;
    for (const op of response.fileOperations) {
      if (!op.path || typeof op.path !== 'string') return false;
      if (typeof op.content !== 'string') return false;
      if (!['create', 'update', 'delete'].includes(op.action)) return false;
    }
    
    // 检查preview字段
    if (!response.preview || typeof response.preview !== 'object') return false;
    if (typeof response.preview.shouldStartPreview !== 'boolean') return false;
    
    // 检查response字段
    if (!response.response || typeof response.response !== 'object') return false;
    if (!response.response.text || typeof response.response.text !== 'string') return false;
    
    return true;
  } catch (error) {
    console.error("验证响应结构时出错:", error);
    return false;
  }
}

/**
 * 创建默认的统一响应
 * @param text 响应文本
 * @returns 默认响应
 */
export function createDefaultUnifiedResponse(text: string): UnifiedResponse {
  return {
    intent: {
      isInfoRequest: true,
      isCodeRequest: false,
      isTemplateRequest: false
    },
    fileOperations: [],
    preview: {
      shouldStartPreview: false
    },
    response: {
      text
    }
  };
}

/**
 * 从文本中提取JSON
 * @param text 包含JSON的文本
 * @returns 提取的JSON对象或null
 */
export function extractJsonFromText(text: string): any | null {
  try {
    // 尝试直接解析整个文本
    try {
      return JSON.parse(text);
    } catch (e) {
      // 如果直接解析失败，尝试提取JSON部分
    }

    // 尝试从代码块中提取JSON
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      return JSON.parse(jsonBlockMatch[1]);
    }

    // 尝试从文本中提取JSON对象
    const jsonMatch = text.match(/(\{[\s\S]*\})/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }

    return null;
  } catch (error) {
    console.error("从文本中提取JSON时出错:", error);
    return null;
  }
}
