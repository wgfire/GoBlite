import { FileInfo, FileSystemTree } from '../types';
import { eventBus } from './eventBus';
import { EventType } from '../types';

/**
 * 文件系统工具类
 * 提供文件系统操作的工具函数
 */
export class FileSystemUtils {
  /**
   * 将普通对象格式转换为WebContainer所需的文件系统格式
   * @param files 文件对象，格式为 { [path]: contents }
   * @returns WebContainer格式的文件系统树
   */
  public static toWebContainerFormat(files: Record<string, string>): FileSystemTree {
    const result: FileSystemTree = {};
    
    // 遍历所有文件路径
    Object.entries(files).forEach(([path, contents]) => {
      // 分割路径，处理嵌套目录
      const parts = path.split('/').filter(Boolean);
      const fileName = parts.pop()!;
      
      // 创建或获取父目录树
      let current = result;
      for (const part of parts) {
        if (!current[part]) {
          current[part] = { type: 'directory', children: {} };
        }
        current = (current[part] as FileInfo).children!;
      }
      
      // 添加文件
      current[fileName] = { type: 'file', contents };
    });
    
    return result;
  }
  
  /**
   * 获取目录树结构
   * @param tree WebContainer格式的文件系统树
   * @param basePath 基础路径
   * @returns 目录树结构
   */
  public static getDirectoryTree(tree: FileSystemTree, basePath = ''): string[] {
    const paths: string[] = [];
    
    Object.entries(tree).forEach(([name, info]) => {
      const currentPath = basePath ? `${basePath}/${name}` : name;
      
      if (info.type === 'file') {
        paths.push(currentPath);
      } else if (info.type === 'directory' && info.children) {
        const childPaths = this.getDirectoryTree(info.children, currentPath);
        paths.push(...childPaths);
      }
    });
    
    return paths;
  }
  
  /**
   * 创建一个新文件或更新现有文件
   * @param tree 文件系统树引用
   * @param path 文件路径
   * @param contents 文件内容
   */
  public static writeFile(tree: FileSystemTree, path: string, contents: string): void {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop()!;
    
    // 创建或获取父目录树
    let current = tree;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = { type: 'directory', children: {} };
      }
      current = (current[part] as FileInfo).children!;
    }
    
    // 添加或更新文件
    const fileExists = current[fileName] && current[fileName].type === 'file';
    current[fileName] = { type: 'file', contents };
    
    // 触发文件变更事件
    eventBus.emit(EventType.FILE_CHANGED, { path, isNew: !fileExists });
  }
  
  /**
   * 读取文件内容
   * @param tree 文件系统树
   * @param path 文件路径
   * @returns 文件内容，如果文件不存在则返回null
   */
  public static readFile(tree: FileSystemTree, path: string): string | null {
    const parts = path.split('/').filter(Boolean);
    let current: any = tree;
    
    // 遍历路径找到文件
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) return null;
      
      if (i === parts.length - 1) {
        // 最后一部分应该是文件
        return current[part].type === 'file' ? current[part].contents : null;
      }
      
      // 不是最后一部分，应该是目录
      if (current[part].type !== 'directory') return null;
      current = current[part].children;
    }
    
    return null;
  }
  
  /**
   * 删除文件或目录
   * @param tree 文件系统树
   * @param path 文件或目录路径
   * @returns 是否成功删除
   */
  public static delete(tree: FileSystemTree, path: string): boolean {
    const parts = path.split('/').filter(Boolean);
    const name = parts.pop()!;
    
    let current: any = tree;
    
    // 遍历到父级目录
    for (const part of parts) {
      if (!current[part] || current[part].type !== 'directory') return false;
      current = current[part].children;
    }
    
    // 删除文件或目录
    if (current[name]) {
      delete current[name];
      return true;
    }
    
    return false;
  }
  
  /**
   * 创建目录
   * @param tree 文件系统树
   * @param path 目录路径
   * @returns 是否成功创建
   */
  public static mkdir(tree: FileSystemTree, path: string): boolean {
    const parts = path.split('/').filter(Boolean);
    
    let current = tree;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = { type: 'directory', children: {} };
      } else if (current[part].type !== 'directory') {
        return false; // 路径中存在非目录项
      }
      
      current = (current[part] as FileInfo).children!;
    }
    
    return true;
  }
}
