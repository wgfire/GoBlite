import { useState, useCallback, useEffect } from "react";
import { Message, UploadedFile, HeaderTab } from "./types";
import { Template } from "@/template/types";
import { useLangChainAI, ModelType, AI_MODELS, AIMessageType, AIMessageContent } from "@/core/ai";
import { useTemplate } from "@/template/useTemplate";
import { TemplateService } from "@/template/templateService";
import { useFileSystem } from "@/core/fileSystem";
import { useWebContainer } from "@/core/webContainer";

import { toast } from "@/components/ui/use-toast";
import { useViewAtom } from "@/hooks/useViewAtom";
import useMemoizedFn from "@/hooks/useMemoizedFn";

export interface UseChatOptions {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const { setCurrentView } = useViewAtom();

  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<HeaderTab>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAPIKeyConfig, setShowAPIKeyConfig] = useState(false);
  const [apiKeyErrorShown, setApiKeyErrorShown] = useState(false);

  // 获取AI服务钩子
  const {
    error: aiError,
    status,
    isSending: aiIsSending,
    cancelRequest,
    selectedModelType,
    switchModelType,
    setApiKey,
    initialize,
    processTemplate,
    loadTemplateDocuments,
    clearTemplateContext,
    templateContext,
    model,
    memory,
    sendMessage,
  } = useLangChainAI({
    autoInit: true,
  });



  // 使用useTemplate钩子
  const templateService = useState(() => new TemplateService())[0];
  const { loadTemplateContent } = useTemplate(templateService);

  // 获取文件系统和WebContainer钩子
  const fileSystem = useFileSystem();
  const webContainer = useWebContainer();

  // 模型切换处理
  const handleModelChange = useMemoizedFn(async (modelType: ModelType) => {
    console.log("切换模型到", modelType);

    // 尝试切换模型
    if (switchModelType) {
      const success = await switchModelType(modelType);
      if (!success) {
        // 如果切换失败，重新初始化
        initialize();
      }
    } else {
      // 如果没有switchModelType方法，直接重新初始化
      initialize();
    }
  });

  // 监听AI错误
  useEffect(() => {
    if (aiError && !apiKeyErrorShown) {
      console.error("AI服务错误:", aiError);

      // 检查错误消息是否与初始化或API密钥相关
      const isApiKeyError =
        aiError.includes("API密钥") || aiError.includes("初始化") || aiError.includes("模型管理器") || aiError.includes("对话管理器");

      // 如果是API密钥相关错误，显示警告并提示配置
      if (isApiKeyError) {
        toast({
          title: "AI服务需要配置",
          description: "请点击设置图标配置API密钥以启用完整功能。",
          variant: "warning",
        });

        // 标记已经显示过API密钥错误，防止重复显示
        setApiKeyErrorShown(true);

        // 使用setTimeout避免在渲染周期内设置状态导致的循环
        setTimeout(() => {
          setShowAPIKeyConfig(true);
        }, 100);
      } else {
        // 其他错误正常显示
        toast({
          title: "AI服务错误",
          description: aiError,
          variant: "error",
        });
      }
    }
  }, [aiError, apiKeyErrorShown]);

  // 保存API密钥
  const handleSaveAPIKey = useMemoizedFn(async (modelType: ModelType, apiKey: string) => {
    try {
      // 获取模型提供商
      const provider = AI_MODELS[modelType]?.provider;
      if (!provider) {
        throw new Error(`不支持的模型类型: ${modelType}`);
      }

      console.log(`开始为 ${modelType} (提供商: ${provider}) 配置API密钥`);

      // 先在本地存储中设置API密钥
      if (setApiKey) {
        setApiKey(provider, apiKey);
        console.log(`已将API密钥保存到本地存储中`);
      }

      // 直接使用新的API密钥初始化模型
      // 这样可以确保使用最新的API密钥，而不是依赖于存储中的值
      console.log(`使用新的API密钥初始化模型，指定模型类型: ${modelType}`);
      // 初始化模型
      const initSuccess = await initialize(apiKey);

      // 如果初始化成功，切换到指定模型
      if (!initSuccess) {
        throw new Error("使用新API密钥初始化模型失败");
      }

      // 切换到指定模型
      console.log(`尝试切换到模型: ${modelType}`);
      if (switchModelType) {
        const switchSuccess = await switchModelType(modelType);
        if (!switchSuccess) {
          throw new Error(`切换到${modelType}模型失败`);
        }
        console.log(`成功切换到模型: ${modelType}`);
      }

      toast({
        title: "配置成功",
        description: `已成功配置${modelType}模型`,
      });

      // 重置错误标志，允许再次显示错误
      setApiKeyErrorShown(false);
      return true;
    } catch (error) {
      console.error("保存API密钥时出错:", error);
      toast({
        title: "配置失败",
        description: error instanceof Error ? error.message : "初始化模型失败",
        variant: "default",
      });
      return false;
    }
  });


  // 解析AI响应中的代码和图像
  const parseAIResponse = useCallback((text: string): AIMessageContent[] => {
    const contents: AIMessageContent[] = [];

    // 提取代码块
    const codeBlockRegex = /```([\w-]+)?\s*([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // 添加代码块前的文本
      if (match.index > lastIndex) {
        contents.push({
          type: AIMessageType.TEXT,
          content: text.substring(lastIndex, match.index).trim(),
        });
      }

      // 添加代码块
      contents.push({
        type: AIMessageType.CODE,
        content: match[2],
        language: match[1] || "plaintext",
      });

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      contents.push({
        type: AIMessageType.TEXT,
        content: text.substring(lastIndex).trim(),
      });
    }

    return contents;
  }, []);

  // 发送消息
  const handleSend = useMemoizedFn(async (prompt: string, files: UploadedFile[]) => {
    if (!prompt.trim() && files.length === 0) return;

    setIsSending(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: prompt,
      timestamp: Date.now(),
      files: files.length > 0 ? files : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 使用统一请求处理复杂输入
      const unifiedResponse = await sendMessage(
        prompt,
        model || undefined,
        memory || undefined,
        templateContext.documents ? JSON.stringify(templateContext.documents) : undefined
      );

      if (!unifiedResponse.success || !unifiedResponse.data) {
        // 即使请求失败，我们仍然可能有一个默认响应
        const responseText = unifiedResponse.data?.response.text || `抱歉，处理请求时出错: ${unifiedResponse.error || "未知错误"}`;

        const aiResponse: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: responseText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        return;
      }

      const responseData = unifiedResponse.data;

      // 处理文件操作
      if (responseData.fileOperations && responseData.fileOperations.length > 0) {
        console.log(`执行 ${responseData.fileOperations.length} 个文件操作`);

        for (const fileOp of responseData.fileOperations) {
          if (fileOp.action === "create" || fileOp.action === "update") {
            // 检查文件是否已存在
            const existingFile = fileSystem.files.find((f) => f.path === fileOp.path);

            if (existingFile) {
              console.log(`更新文件: ${fileOp.path}`);
              await fileSystem.writeFile(fileOp.path, fileOp.content);
            } else {
              console.log(`创建文件: ${fileOp.path}`);
              const dirPath = fileOp.path.split("/").slice(0, -1).join("/");
              await fileSystem.createDirectory(dirPath);
              await fileSystem.writeFile(fileOp.path, fileOp.content);
            }
          } else if (fileOp.action === "delete") {
            console.log(`删除文件: ${fileOp.path}`);
            // 使用正确的方法名称
            await fileSystem.deleteItem(fileOp.path);
          }
        }
      }

      // 处理预览
      if (responseData.preview && responseData.preview.shouldStartPreview) {
        console.log("启动WebContainer预览");
        setCurrentView("webcontainer");
        webContainer.startApp(fileSystem.files);
      }

      // 创建AI响应消息
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: responseData.response.text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      return;
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: `抱歉，处理请求时出错: ${error instanceof Error ? error.message : "未知错误"}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  });

  // 优化提示词
  const handleOptimizePrompt = useCallback(async (prompt: string) => {
    try {
      // 简单实现，返回原始提示词
      return prompt;
    } catch (error) {
      console.error("优化提示词失败:", error);
      return prompt; // 失败时返回原始提示词
    }
  }, []);

  // 选择模板
  const handleTemplateSelect = async (template: Template) => {
    try {
      // 清除之前的模板上下文
      if (templateContext?.template && templateContext.template.id !== template.id) {
        console.log("切换模板，清除之前的模板上下文");
        await clearTemplateContext();
      }

      setSelectedTemplate(template);

      // 创建模板选择消息
      const templateSelectMessage: Message = {
        id: crypto.randomUUID(),
        sender: "system",
        text: `已选择模板: ${template.name}\n${template.description || ""}`,
        timestamp: Date.now(),
      };

      setMessages([templateSelectMessage]);

      // 使用useTemplate钩子加载模板内容
      const loadResult = await loadTemplateContent(template.id);

      if (loadResult.success && loadResult.files) {
        // 加载模板文档
        await loadTemplateDocuments(template, loadResult.files);

        // 创建助手消息
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: `我已经加载了 ${template.name} 模板的代码。请描述您对这个模板的优化需求，我将根据您的需求生成优化后的代码。`,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // 加载失败，显示表单
        setShowTemplateForm(true);
      }
    } catch (error) {
      console.error("加载模板失败:", error);
      toast({
        title: "加载模板失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "error",
      });

      // 加载失败，显示表单
      setShowTemplateForm(true);
    }
  };

  // 提交模板表单
  const handleTemplateFormSubmit = async (data: Record<string, string>) => {
    if (!selectedTemplate) return;

    setShowTemplateForm(false);
    setIsSending(true);

    // 创建用户消息
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: `请使用${selectedTemplate.name}模板创建一个页面，参数如下：\n${Object.entries(data)
        .map(([key, value]) => {
          const field = selectedTemplate.fields?.find((f) => f.id === key);
          return field ? `${field.name}: ${value}` : `${key}: ${value}`;
        })
        .join("\n")}`,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 处理模板
      const result = await processTemplate({
        templateId: selectedTemplate.id,
        formData: data,
        businessContext: JSON.stringify({
          industry: data.industry || "通用",
          businessGoal: data.businessGoal || "展示产品或服务",
          targetAudience: data.targetAudience || "潜在客户",
          designStyle: data.designStyle || "现代简约",
        }),
      });

      if (result.success && result.files && result.files.length > 0) {
        // 成功处理模板
        let responseText = `我已根据${selectedTemplate.name}模板生成了以下文件：\n\n`;

        // 添加文件列表
        for (const file of result.files) {
          responseText += `- ${file.path}\n`;
        }

        // 添加预览信息
        responseText += "\n文件已添加到文件系统，并已启动预览。";

        // 同步到文件系统
        for (const file of result.files) {
          // 检查文件是否已存在
          const existingFile = fileSystem.files.find((f) => f.path === file.path);

          if (existingFile) {
            console.log(`更新现有文件: ${file.path}`);
            // 如果文件已存在，更新内容
            await fileSystem.writeFile(file.path, file.content);
          } else {
            console.log(`创建新文件: ${file.path}`);
            // 如果文件不存在，创建新文件
            const dirPath = file.path.split("/").slice(0, -1).join("/");
            await fileSystem.createDirectory(dirPath);
            await fileSystem.writeFile(file.path, file.content);
          }
        }

        setCurrentView("webcontainer");

        // 启动预览
        await webContainer.startApp(fileSystem.files);

        // 创建AI响应消息
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: responseText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // 处理失败
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: `处理模板时出错：${result.error || "未知错误"}`,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("处理模板失败:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "抱歉，处理模板时出错",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setSelectedTemplate(null);
    }
  };

  // 关闭模板表单
  const handleTemplateFormClose = () => {
    setSelectedTemplate(null);
    setShowTemplateForm(false);
  };

  // 取消AI请求
  const handleCancelRequest = () => {
    cancelRequest();
    setIsSending(false);
  };

  // 切换折叠状态
  const toggleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (options.onCollapseChange) {
      options.onCollapseChange(newCollapsedState);
    }
  }, [isCollapsed, options]);

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  return {
    // 状态
    messages,
    uploadedFiles,
    isSending: isSending || aiIsSending,
    activeTab,
    selectedTemplate,
    showTemplateForm,
    isCollapsed,
    showAPIKeyConfig,
    status,
    selectedModelType,

    // 设置状态
    setMessages,
    setUploadedFiles,
    setActiveTab,
    setShowAPIKeyConfig,
    setIsCollapsed,

    // 方法
    handleSend,
    handleOptimizePrompt,
    handleTemplateSelect,
    handleTemplateFormSubmit,
    handleTemplateFormClose,
    handleCancelRequest,
    handleModelChange,
    handleSaveAPIKey,
    toggleCollapse,
    parseAIResponse,
    handleFileUpload,
  };
}
