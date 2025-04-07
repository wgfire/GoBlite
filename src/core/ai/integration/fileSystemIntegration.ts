/**
 * AI与文件系统集成
 * 处理AI生成内容与文件系统的交互
 */

import { FileItem, FileItemType } from '@/core/fileSystem/types';
import { CodeGenerationResult, ImageGenerationResult } from '../types';

/**
 * 文件系统集成类
 */
export class FileSystemIntegration {
  /**
   * 将代码生成结果转换为文件项
   * @param result 代码生成结果
   * @returns 文件项数组
   */
  public static codeResultToFileItems(result: CodeGenerationResult): FileItem[] {
    if (!result.success || !result.files || result.files.length === 0) {
      return [];
    }
    
    const now = Date.now();
    const fileItems: FileItem[] = [];
    
    // 处理每个生成的文件
    for (const file of result.files) {
      // 创建文件项
      const fileItem: FileItem = {
        name: file.path.split('/').pop() || 'unnamed',
        path: file.path,
        type: FileItemType.FILE,
        content: file.content,
        metadata: {
          createdAt: now,
          updatedAt: now,
          size: new Blob([file.content]).size
        }
      };
      
      fileItems.push(fileItem);
    }
    
    return fileItems;
  }
  
  /**
   * 将图像生成结果转换为文件项
   * @param result 图像生成结果
   * @param basePath 基础路径
   * @returns 文件项数组
   */
  public static async imageResultToFileItems(
    result: ImageGenerationResult,
    basePath: string = 'assets/images'
  ): Promise<FileItem[]> {
    if (!result.success || !result.images || result.images.length === 0) {
      return [];
    }
    
    const now = Date.now();
    const fileItems: FileItem[] = [];
    
    // 处理每个生成的图像
    for (let i = 0; i < result.images.length; i++) {
      const image = result.images[i];
      
      try {
        // 下载图像
        const response = await fetch(image.url);
        const blob = await response.blob();
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        
        // 创建文件名和路径
        const fileName = `image-${i + 1}.png`;
        const filePath = `${basePath}/${fileName}`;
        
        // 创建文件项
        const fileItem: FileItem = {
          name: fileName,
          path: filePath,
          type: FileItemType.FILE,
          content,
          metadata: {
            createdAt: now,
            updatedAt: now,
            size: blob.size
          }
        };
        
        fileItems.push(fileItem);
      } catch (err) {
        console.error('处理图像文件失败:', err);
      }
    }
    
    return fileItems;
  }
  
  /**
   * 确保目录结构存在
   * @param fileSystem 文件系统钩子返回值
   * @param path 文件路径
   */
  public static ensureDirectoryExists(
    fileSystem: any,
    path: string
  ): void {
    // 获取目录路径
    const dirPath = path.split('/').slice(0, -1).join('/');
    if (!dirPath) return;
    
    // 检查目录是否存在
    const dirExists = fileSystem.findItem(fileSystem.files, dirPath);
    if (dirExists) return;
    
    // 创建目录结构
    const dirs = dirPath.split('/');
    let currentPath = '';
    
    for (const dir of dirs) {
      const newPath = currentPath ? `${currentPath}/${dir}` : dir;
      const exists = fileSystem.findItem(fileSystem.files, newPath);
      
      if (!exists) {
        fileSystem.createFolder(currentPath, {
          name: dir,
          path: newPath,
          type: FileItemType.FOLDER,
          children: []
        });
      }
      
      currentPath = newPath;
    }
  }
  
  /**
   * 将文件项添加到文件系统
   * @param fileSystem 文件系统钩子返回值
   * @param fileItems 文件项数组
   * @returns 是否成功
   */
  public static async addFilesToFileSystem(
    fileSystem: any,
    fileItems: FileItem[]
  ): Promise<boolean> {
    try {
      // 处理每个文件项
      for (const fileItem of fileItems) {
        // 确保目录存在
        this.ensureDirectoryExists(fileSystem, fileItem.path);
        
        // 获取父目录路径
        const parentPath = fileItem.path.split('/').slice(0, -1).join('/');
        
        // 创建文件
        fileSystem.createFile(parentPath, fileItem);
      }
      
      return true;
    } catch (err) {
      console.error('添加文件到文件系统失败:', err);
      return false;
    }
  }
  
  /**
   * 处理文件冲突
   * @param fileSystem 文件系统钩子返回值
   * @param path 文件路径
   * @returns 新的不冲突的路径
   */
  public static resolveFileConflict(
    fileSystem: any,
    path: string
  ): string {
    // 检查文件是否存在
    const fileExists = fileSystem.findItem(fileSystem.files, path);
    if (!fileExists) return path;
    
    // 分解路径
    const pathParts = path.split('/');
    const fileName = pathParts.pop() || '';
    const dirPath = pathParts.join('/');
    
    // 分解文件名
    const dotIndex = fileName.lastIndexOf('.');
    const baseName = dotIndex > 0 ? fileName.substring(0, dotIndex) : fileName;
    const extension = dotIndex > 0 ? fileName.substring(dotIndex) : '';
    
    // 尝试添加数字后缀
    let counter = 1;
    let newPath = '';
    
    do {
      const newFileName = `${baseName}-${counter}${extension}`;
      newPath = dirPath ? `${dirPath}/${newFileName}` : newFileName;
      counter++;
    } while (fileSystem.findItem(fileSystem.files, newPath));
    
    return newPath;
  }
}
