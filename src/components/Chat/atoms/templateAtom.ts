/**
 * 模板相关原子
 */
/**
 * 模板相关原子
 * 管理聊天中使用的模板状态
 */
import { atom } from "jotai";
import { Template, TemplateLoadResult } from "@/template/types";

// 当前选中的模板
export const selectedTemplateAtom = atom<Template | null>(null);

// 是否显示模板表单
export const showTemplateFormAtom = atom<boolean>(false);

// 模板处理状态
export const isProcessingTemplateAtom = atom<boolean>(false);

// 模板处理错误信息
export const templateErrorAtom = atom<string | null>(null);

// 加载的模板内容 包含文件和表单信息
export const templateContextAtom = atom<{ loadResult: TemplateLoadResult; formData?: Record<string, unknown> } | null>(null);
