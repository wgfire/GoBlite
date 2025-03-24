export enum FileItemType {
  FILE = 'file',
  FOLDER = 'folder'
}

export interface FileItem {
  name: string;
  path: string;
  type: FileItemType;
  content?: string;
  children?: FileItem[];
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'rename';
  path: string;
  content?: string;
  newPath?: string; // for rename operations
  isFolder?: boolean;
}
