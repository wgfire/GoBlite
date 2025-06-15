/**
 * 模板代理相关提示词
 * 专注于基于模板的微调和增强，而非完全重写
 */

/**
 * 模板信息分析提示词
 * 用于理解模板结构和用户意图
 */
export function getTemplateAnalysisPrompt(formatInstructions: string, templateSummary?: string): string {
  return `你是一个专业的前端模板分析专家。你的任务是分析用户请求和模板信息，判断用户意图。

## 核心原则
- **保持模板完整性**：不要完全重写模板，只做必要的微调和增强
- **理解用户意图**：区分是想了解模板还是基于模板进行开发
- **结构化分析**：提供清晰的分析结果

## 模板处理策略
1. **TEMPLATE_INFO**: 用户想了解模板功能、结构、使用方法
2. **CODE_GENERATION**: 用户想基于模板进行微调、增强或扩展
3. **CLARIFY**: 需要更多信息才能确定用户意图

${templateSummary ? `
## 当前模板概要
${templateSummary}

请基于此模板信息进行分析，重点关注用户想要的具体改动。
` : ''}

${formatInstructions}`;
}

/**
 * 基于模板的代码生成提示词
 * 强调微调而非重写
 */
export function getTemplateBasedCodeGenerationPrompt(
  formatInstructions: string, 
  templateStructure?: string,
  userRequirements?: string
): string {
  return `你是一个专业的前端代码微调专家。你的任务是基于现有模板进行精确的代码调整。

## 重要原则
🔒 **保持模板核心结构不变**
🎯 **只修改用户明确要求的部分**
📝 **提供清晰的修改说明**
⚡ **确保修改后代码的完整性和可用性**

## 操作策略
1. **分析现有模板结构**
2. **识别需要修改的具体部分**
3. **进行最小化、精确的修改**
4. **保持其他部分完全不变**

## 修改类型
- **update**: 修改现有文件的特定部分
- **create**: 添加新的文件或组件
- **delete**: 移除不需要的文件（谨慎使用）

${templateStructure ? `
## 现有模板结构
${templateStructure}

请基于此结构进行精确修改，不要改变核心架构。
` : ''}

${userRequirements ? `
## 用户具体需求
${userRequirements}

请只针对这些具体需求进行修改。
` : ''}

## 输出要求
- 每个文件操作必须说明修改原因
- 提供修改前后的对比说明
- 确保修改的最小化和精确性

${formatInstructions}`;
}

/**
 * 模板结构提取器
 * 从文档内容中提取关键结构信息，而非全部内容
 */
export function extractTemplateStructure(documents: any[]): {
  summary: string;
  structure: string;
  keyFiles: string[];
} {
  if (!documents || documents.length === 0) {
    return {
      summary: "无可用模板信息",
      structure: "未知结构",
      keyFiles: []
    };
  }

  const keyFiles: string[] = [];
  const structureInfo: string[] = [];
  
  documents.forEach(doc => {
    const source = doc.metadata?.source || "未知文件";
    const content = doc.pageContent || "";
    
    keyFiles.push(source);
    
    // 提取关键结构信息，而非全部内容
    const lines = content.split('\n').slice(0, 10); // 只取前10行了解结构
    const preview = lines.join('\n');
    
    structureInfo.push(`${source}: ${preview.length > 200 ? preview.substring(0, 200) + '...' : preview}`);
  });

  return {
    summary: `包含 ${keyFiles.length} 个文件的前端模板`,
    structure: structureInfo.join('\n\n---\n\n'),
    keyFiles
  };
}

/**
 * 用户需求分析器
 * 从用户消息中提取具体的修改需求
 */
export function extractUserRequirements(messages: any[]): string {
  const userMessages = messages
    .filter(msg => msg.getType() === 'human')
    .map(msg => msg.content)
    .slice(-3); // 只取最近3条用户消息

  return userMessages.join('\n\n');
}
