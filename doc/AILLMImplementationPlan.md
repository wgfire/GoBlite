# AI LLM 功能实现计划

## 1. 核心组件设计

### 1.1 AI服务 (AIService)

**功能描述**：
- 提供AI模型接口调用
- 处理代码生成和图像生成请求
- 管理提示词模板
- 处理AI响应并转换为文件系统可用格式

**实现进度**：
- [ ] 基础服务结构设计 (0%)
- [ ] API接口封装 (0%)
- [ ] 错误处理机制 (0%)
- [ ] 响应解析器 (0%)

**测试用例**：
- [ ] 测试基本API调用
- [ ] 测试错误处理
- [ ] 测试响应解析
- [ ] 测试与文件系统集成

### 1.2 AI钩子 (useAIService)

**功能描述**：
- 提供React组件使用的AI功能钩子
- 管理AI请求状态
- 处理AI响应并更新UI
- 与文件系统和WebContainer集成

**实现进度**：
- [ ] 基础钩子结构 (0%)
- [ ] 状态管理 (0%)
- [ ] 与文件系统集成 (0%)
- [ ] 与WebContainer集成 (0%)

**测试用例**：
- [ ] 测试状态管理
- [ ] 测试请求处理
- [ ] 测试文件生成
- [ ] 测试与其他钩子的集成

### 1.3 提示词管理器 (PromptManager)

**功能描述**：
- 管理和存储提示词模板
- 根据模板和用户输入生成完整提示词
- 提供提示词优化功能
- 支持多语言和多模型提示词

**实现进度**：
- [ ] 基础结构设计 (0%)
- [ ] 模板管理 (0%)
- [ ] 提示词生成 (0%)
- [ ] 提示词优化 (0%)

**测试用例**：
- [ ] 测试模板加载
- [ ] 测试提示词生成
- [ ] 测试提示词优化
- [ ] 测试多语言支持

### 1.4 AI与模板集成 (AITemplateIntegration)

**功能描述**：
- 将模板系统与AI服务集成
- 根据模板参数生成AI提示词
- 处理AI生成的内容并应用到模板
- 支持模板的自定义和扩展

**实现进度**：
- [ ] 基础集成结构 (0%)
- [ ] 模板参数处理 (0%)
- [ ] AI响应应用 (0%)
- [ ] 模板扩展支持 (0%)

**测试用例**：
- [ ] 测试模板参数处理
- [ ] 测试AI响应应用
- [ ] 测试模板扩展
- [ ] 测试完整流程

### 1.5 文件系统集成 (AIFileSystemIntegration)

**功能描述**：
- 将AI生成的内容同步到文件系统
- 监听文件变更并触发相应操作
- 处理文件冲突和错误
- 支持批量文件操作

**实现进度**：
- [ ] 基础集成结构 (0%)
- [ ] 文件同步机制 (0%)
- [ ] 冲突处理 (0%)
- [ ] 批量操作支持 (0%)

**测试用例**：
- [ ] 测试文件同步
- [ ] 测试冲突处理
- [ ] 测试批量操作
- [ ] 测试错误恢复

## 2. 接口设计

### 2.1 AIService 接口

```typescript
interface AIServiceConfig {
  apiKey: string;
  baseUrl: string;
  modelName: string;
  timeout?: number;
}

interface AIRequestOptions {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  systemPrompt?: string;
}

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface CodeGenerationResult {
  success: boolean;
  files?: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
  error?: string;
}

interface ImageGenerationResult {
  success: boolean;
  images?: Array<{
    url: string;
    alt?: string;
    width: number;
    height: number;
  }>;
  error?: string;
}

interface AIService {
  initialize(config: AIServiceConfig): Promise<boolean>;
  generateCode(options: AIRequestOptions): Promise<CodeGenerationResult>;
  generateImage(prompt: string, options?: any): Promise<ImageGenerationResult>;
  optimizePrompt(prompt: string): Promise<string>;
  getError(): string | null;
}
```

### 2.2 useAIService 钩子接口

```typescript
interface UseAIServiceOptions {
  fileSystem: ReturnType<typeof useFileSystem>;
  webContainer?: ReturnType<typeof useWebContainer>;
  template?: ReturnType<typeof useTemplate>;
}

interface UseAIServiceResult {
  // 状态
  isLoading: boolean;
  error: string | null;
  
  // 代码生成
  generateCode: (prompt: string, options?: any) => Promise<boolean>;
  
  // 图像生成
  generateImage: (prompt: string, options?: any) => Promise<boolean>;
  
  // 模板处理
  processTemplate: (template: Template, formData: Record<string, any>) => Promise<boolean>;
  
  // 提示词优化
  optimizePrompt: (prompt: string) => Promise<string>;
  
  // 取消当前请求
  cancelRequest: () => void;
  
  // 重置状态
  reset: () => void;
}
```

### 2.3 PromptManager 接口

```typescript
interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  description?: string;
  category?: string;
  modelType?: string;
}

interface PromptManager {
  getTemplates(): Promise<PromptTemplate[]>;
  getTemplateById(id: string): Promise<PromptTemplate | null>;
  createPrompt(template: PromptTemplate, variables: Record<string, string>): string;
  optimizePrompt(prompt: string): Promise<string>;
  saveTemplate(template: PromptTemplate): Promise<boolean>;
  deleteTemplate(id: string): Promise<boolean>;
}
```

## 3. 实现步骤

### 3.1 基础架构搭建

1. **创建AI服务目录结构**
   - 创建 `src/core/ai` 目录
   - 创建基础文件: `types.ts`, `service.ts`, `hooks/useAIService.ts`
   - 创建提示词管理: `prompts/promptManager.ts`

2. **定义基础类型和接口**
   - 在 `types.ts` 中定义所有AI相关接口
   - 确保与现有文件系统和模板接口兼容

3. **实现AI服务基础类**
   - 在 `service.ts` 中实现 `AIService` 类
   - 实现基础API调用功能
   - 实现错误处理机制

### 3.2 AI钩子实现

1. **实现useAIService钩子**
   - 在 `hooks/useAIService.ts` 中实现钩子
   - 集成文件系统钩子
   - 实现状态管理

2. **实现与模板系统的集成**
   - 创建 `integration/templateIntegration.ts`
   - 实现模板参数处理
   - 实现AI响应应用到模板

3. **实现与文件系统的集成**
   - 创建 `integration/fileSystemIntegration.ts`
   - 实现文件同步机制
   - 实现冲突处理

### 3.3 聊天组件增强

1. **增强Chat组件**
   - 更新 `src/components/Chat/index.tsx`
   - 集成AI服务钩子
   - 实现模板选择和处理

2. **增强模板表单**
   - 更新 `src/components/TemplateForm/index.tsx`
   - 集成AI服务
   - 实现表单数据处理

3. **实现AI响应处理**
   - 创建 `src/components/Chat/AIResponseHandler.tsx`
   - 实现代码和图像显示
   - 实现文件系统操作UI

### 3.4 WebContainer集成

1. **实现文件同步机制**
   - 增强 `src/core/webContainer/hooks/useWebContainer.ts`
   - 实现AI生成文件的自动同步
   - 实现构建触发机制

2. **实现预览增强**
   - 更新预览组件
   - 实现实时预览
   - 实现错误显示

## 4. 测试计划

### 4.1 单元测试

1. **AI服务测试**
   - 测试API调用
   - 测试错误处理
   - 测试响应解析

2. **钩子测试**
   - 测试状态管理
   - 测试与其他钩子集成
   - 测试错误处理

3. **集成测试**
   - 测试完整流程
   - 测试边缘情况
   - 测试性能

### 4.2 端到端测试

1. **用户流程测试**
   - 测试从模板选择到预览的完整流程
   - 测试错误恢复
   - 测试用户交互

2. **性能测试**
   - 测试大型项目生成
   - 测试并发请求
   - 测试资源使用

## 5. 部署计划

1. **开发环境部署**
   - 实现本地开发环境配置
   - 实现测试API密钥管理
   - 实现开发工具集成

2. **生产环境部署**
   - 实现生产环境配置
   - 实现API密钥安全管理
   - 实现监控和日志

## 6. 文档计划

1. **开发文档**
   - API接口文档
   - 钩子使用文档
   - 集成指南

2. **用户文档**
   - 功能使用指南
   - 模板创建指南
   - 故障排除指南
