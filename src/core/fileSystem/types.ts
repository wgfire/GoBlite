export enum FileItemType {
  FILE = "file",
  FOLDER = "folder",
}

export interface FileMetadata {
  createdAt: number; // 创建时间戳
  updatedAt: number; // 修改时间戳
  size?: number; // 文件大小（字节）
}

export interface FileItem {
  name: string;
  path: string;
  type: FileItemType;
  content?: string;
  children?: FileItem[];
  metadata?: FileMetadata;
}

export enum FileOperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  RENAME = "rename",
}

export interface FileOperation {
  type: "create" | "update" | "delete" | "rename";
  path: string;
  content?: string;
  newPath?: string; // for rename operations
  isFolder?: boolean;
  timestamp?: number; // 操作时间戳
}
