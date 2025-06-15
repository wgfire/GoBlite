/**
 * 模板管理钩子
 * 提供模板选择、表单处理等功能，并使用jotai管理状态
 */
import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { Template, TemplateLoadResult } from "@/template/types";
import { selectedTemplateAtom, showTemplateFormAtom, templateErrorAtom, templateContextAtom } from "../atoms/templateAtom";
import { useTemplate } from "@/template/useTemplate";
import { TemplateService } from "@/template/templateService";
import { toast } from "@/components/ui/use-toast";
import { Message, MessageRole } from "@core/ai/types";
import { DocumentLoadResult } from "@/core/ai";
import useMemoizedFn from "@/hooks/useMemoizedFn";
import { useLangChainDoc } from "@/core/ai/hooks/useLangChainDoc";
import { useConversation } from "@/core/ai/langgraph/hooks/useConversation";

export const useTemplates = () => {
  // 使用jotai原子状态
  const [selectedTemplate, setSelectedTemplate] = useAtom(selectedTemplateAtom);
  const [showTemplateForm, setShowTemplateForm] = useAtom(showTemplateFormAtom);
  const [templateError, setTemplateError] = useAtom(templateErrorAtom);
  const [templateContext, setTemplateContext] = useAtom(templateContextAtom);

  // 使用useMemo创建templateService，避免每次渲染都创建新实例
  const templateService = useMemo(() => new TemplateService(), []);
  const { loadTemplateContent } = useTemplate(templateService);

  // 使用LangChain处理模板内容
  const { loadTemplateDocuments, clearTemplateContext: clearLangChainContext } = useLangChainDoc();

  // 使用会话管理钩子
  const conversation = useConversation();

  /**
   * 更新会话的模板上下文
   * @param conversationId 会话ID
   * @param templateContext 模板上下文
   */
  const updateConversationTemplateContext = useMemoizedFn(
    async (
      conversationId: string,
      templateContext: {
        templateId: string;
        templateName: string;
        loadResult?: TemplateLoadResult;
        langChainResult?: DocumentLoadResult;
      }
    ) => {
      try {
        // 获取当前会话
        const currentConversation = conversation.conversations[conversationId];
        if (!currentConversation) {
          console.error(`找不到会话: ${conversationId}`);
          return false;
        }

        conversation.updateConversationTemplateContext(conversationId, templateContext);

        console.log(`已更新会话 ${conversationId} 的模板上下文`);
        return true;
      } catch (error) {
        console.error("更新会话模板上下文失败:", error);
        return false;
      }
    }
  );

  /**
   * 选择模板
   * @param template 选择的模板
   * @returns 包含模板相关消息的数组，用于在Chat组件中显示
   */
  const handleTemplateSelect = useMemoizedFn(async (template: Template): Promise<Message[]> => {
    try {
      // 切换模板前清空之前的上下文
      clearLangChainContext();

      setSelectedTemplate(template);
      setTemplateError(null);

      // 创建模板选择消息
      const templateSelectMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.ASSISTANT,
        content: `已选择模板: ${template.name}\n${template.description || ""}`,
        metadata: {
          timestamp: Date.now(),
        },
      };

      // 使用useTemplate钩子加载模板内容
      const loadResult = await loadTemplateContent(template.id);

      if (loadResult.success && loadResult.files) {
        // 使用LangChain处理模板内容
        const langChainResult = await loadTemplateDocuments(template, loadResult.files);

        // 创建助手消息
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.ASSISTANT,
          content: `我已经加载了 ${template.name} 模板的代码。请描述您对这个模板的需求，我将根据您的需求提供帮助。`,
          metadata: {
            timestamp: Date.now(),
          },
        };
        const templateContext = {
          templateId: template.id,
          templateName: template.name,
          loadResult: loadResult,
          langChainResult: langChainResult,
        };

        // 更新模板上下文，包含LangChain处理结果
        setTemplateContext(templateContext);

        // 更新当前会话的模板上下文
        const currentConversationId = conversation.currentConversationId;
        if (currentConversationId) {
          // 更新会话的模板上下文
          await updateConversationTemplateContext(currentConversationId, templateContext);
          console.log(`已更新会话 ${currentConversationId} 的模板上下文为 ${template.name}`);
        }

        // 返回消息数组，由Chat组件负责将这些消息添加到会话中
        return [templateSelectMessage, aiMessage];
      } else {
        setShowTemplateForm(false);
        return [templateSelectMessage];
      }
    } catch (error) {
      console.error("加载模板失败:", error);
      setTemplateError(error instanceof Error ? error.message : "加载模板失败");

      toast({
        title: "加载模板失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "default",
      });
      setShowTemplateForm(false);

      // 返回错误消息
      return [
        {
          id: crypto.randomUUID(),
          role: MessageRole.ASSISTANT,
          content: `加载模板失败: ${error instanceof Error ? error.message : "未知错误"}`,
          metadata: {
            timestamp: Date.now(),
          },
        },
      ];
    }
  });

  /**
   * 处理模板表单提交
   * @param data 表单数据
   * @returns 包含用户消息和AI响应的数组
   */
  const handleTemplateFormSubmit = useCallback(
    async (data: Record<string, unknown>): Promise<Message[]> => {
      if (!selectedTemplate) return [];

      setShowTemplateForm(false);
      setTemplateError(null);
      setTemplateContext((prev) => {
        if (prev && prev.loadResult) {
          return {
            ...prev,
            formData: data,
          };
        }
        return prev;
      });
      return [];
    },
    [selectedTemplate, setShowTemplateForm, setTemplateError, setTemplateContext]
  );

  /**
   * 关闭模板表单
   */
  const handleTemplateFormClose = useCallback(() => {
    setShowTemplateForm(false);
    setSelectedTemplate(null);
  }, [setShowTemplateForm, setSelectedTemplate]);

  /**
   * 清空模板上下文
   * 在切换模板或重置状态时调用
   */
  const clearTemplateContext = useCallback(() => {
    clearLangChainContext();
    setTemplateContext(null);
    setSelectedTemplate(null);
    return { success: true };
  }, [clearLangChainContext, setTemplateContext, setSelectedTemplate]);

  /**
   * 获取当前会话的模板上下文
   * 如果当前会话没有模板上下文，则返回null
   */
  const getCurrentConversationTemplateContext = useCallback(() => {
    const currentConversation = conversation.currentConversation;
    if (!currentConversation) return null;

    // 首先检查会话元数据中是否有模板上下文
    if (currentConversation.metadata?.templateContext) {
      return currentConversation.metadata.templateContext;
    }
    return null;
  }, [conversation.currentConversation]);

  /**
   * 初始化模板上下文
   * 当切换会话时调用，从会话中加载模板上下文
   */
  const initTemplateContextFromConversation = useMemoizedFn(() => {
    // 获取当前会话的模板上下文
    const templateContextFromConversation = getCurrentConversationTemplateContext();
    if (templateContextFromConversation) {
      console.log("从会话中初始化模板上下文:", templateContextFromConversation);

      // 如果当前没有选择模板，或者选择的模板与会话中的不同，则更新
      if (!selectedTemplate || selectedTemplate.id !== templateContextFromConversation.templateId) {
        // 设置为当前选中的模板
        setSelectedTemplate({
          id: templateContextFromConversation.templateId,
          name: templateContextFromConversation.templateName,
          fields: [],
        });

        // 更新模板上下文
        if (templateContextFromConversation.langChainResult) {
          setTemplateContext({
            loadResult: templateContextFromConversation.loadResult || { success: true },
            langChainResult: templateContextFromConversation.langChainResult,
            templateId: templateContextFromConversation.templateId,
            templateName: templateContextFromConversation.templateName
          });
        }
      }
    } else {
      // 如果当前会话没有模板上下文，清空模板状态
      clearTemplateContext();
    }
  });

  return {
    // 状态
    selectedTemplate,
    showTemplateForm,
    templateContext,
    templateError,

    // 设置状态
    setSelectedTemplate,
    setShowTemplateForm,

    // 方法
    handleTemplateSelect,
    handleTemplateFormSubmit,
    handleTemplateFormClose,
    clearTemplateContext,
    updateConversationTemplateContext,
    getCurrentConversationTemplateContext,
    initTemplateContextFromConversation,
  };
};
