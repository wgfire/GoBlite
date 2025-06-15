/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileItem } from "../core/fileSystem/types";

export interface TemplateFile {
  path: string;
  content: string;
}

export interface FieldItem {
  type: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: {
    label: string;
    value: any;
  }[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  fields: FieldItem[];
  files?: Record<string, string>;
}

export interface TemplateLoadResult {
  success: boolean;
  files?: FileItem[];
  error?: string;
}
