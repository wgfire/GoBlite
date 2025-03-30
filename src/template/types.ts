import { FileItem } from "../core/fileSystem/types";

export interface TemplateFile {
  path: string;
  content: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  files: Record<string, string>;
}

export interface TemplateLoadResult {
  success: boolean;
  files?: FileItem[];
  error?: string;
}
