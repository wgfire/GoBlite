/**
 * 文件相关原子
 * 管理聊天中上传的文件状态
 */
import { atom } from "jotai";
import { UploadedFile } from "../types";

// 存储上传的文件列表
export const uploadedFilesAtom = atom<UploadedFile[]>([]);

// 是否正在处理文件的状态
export const isProcessingFilesAtom = atom<boolean>(false);

// 最近一次文件上传错误信息
export const fileUploadErrorAtom = atom<string | null>(null);
