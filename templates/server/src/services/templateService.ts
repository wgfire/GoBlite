import fs from 'fs/promises';
import path from 'path';

export interface TemplateMetadata {
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  framework: string;
  language: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  files: string[];
}

export class TemplateService {
  /**
   * 获取所有模板元数据
   * @param templatesDir 模板目录路径
   */
  async getTemplates(templatesDir: string): Promise<TemplateMetadata[]> {
    const templates: TemplateMetadata[] = [];
    
    // 读取模板目录
    const dirs = await fs.readdir(templatesDir);
    
    for (const dir of dirs) {
      // 跳过server目录和非目录文件
      if (dir === 'server') continue;
      
      const templatePath = path.join(templatesDir, dir);
      const stat = await fs.stat(templatePath);
      
      // 确保是目录
      if (stat.isDirectory()) {
        try {
          // 读取template.json
          const templateJsonPath = path.join(templatePath, 'template.json');
          const templateJsonContent = await fs.readFile(templateJsonPath, 'utf-8');
          const templateMetadata = JSON.parse(templateJsonContent) as TemplateMetadata;
          
          templates.push(templateMetadata);
        } catch (error) {
          console.error(`读取模板 ${dir} 元数据失败:`, error);
        }
      }
    }
    
    return templates;
  }
  
  /**
   * 获取模板文件内容
   * @param templatesDir 模板目录路径
   * @param templateName 模板名称
   * @param filePath 文件路径
   */
  async getTemplateFile(templatesDir: string, templateName: string, filePath: string): Promise<string> {
    // 查找模板目录
    const dirs = await fs.readdir(templatesDir);
    
    for (const dir of dirs) {
      if (dir === 'server') continue;
      
      const templatePath = path.join(templatesDir, dir);
      const templateJsonPath = path.join(templatePath, 'template.json');
      
      try {
        const templateJsonContent = await fs.readFile(templateJsonPath, 'utf-8');
        const templateMetadata = JSON.parse(templateJsonContent) as TemplateMetadata;
        
        if (templateMetadata.name === templateName) {
          // 找到匹配的模板，读取文件内容
          const fullFilePath = path.join(templatePath, filePath);
          return await fs.readFile(fullFilePath, 'utf-8');
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`模板 ${templateName} 或文件 ${filePath} 不存在`);
  }
  
  /**
   * 获取模板文件列表
   * @param templatesDir 模板目录路径
   * @param templateName 模板名称
   */
  async getTemplateFiles(templatesDir: string, templateName: string): Promise<string[]> {
    // 查找模板目录
    const dirs = await fs.readdir(templatesDir);
    
    for (const dir of dirs) {
      if (dir === 'server') continue;
      
      const templatePath = path.join(templatesDir, dir);
      const templateJsonPath = path.join(templatePath, 'template.json');
      
      try {
        const templateJsonContent = await fs.readFile(templateJsonPath, 'utf-8');
        const templateMetadata = JSON.parse(templateJsonContent) as TemplateMetadata;
        
        if (templateMetadata.name === templateName) {
          // 找到匹配的模板，递归获取所有文件路径
          return this.getAllFiles(templatePath);
        }
      } catch (error) {
        continue;
      }
    }
    
    return [];
  }
  
  /**
   * 递归获取目录下所有文件路径
   * @param dir 目录路径
   * @param basePath 基础路径
   */
  private async getAllFiles(dir: string, basePath: string = ''): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = path.join(basePath, entry.name);
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath, relativePath));
      } else {
        files.push(relativePath);
      }
    }
    
    return files;
  }
}
