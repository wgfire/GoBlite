import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模板元数据接口
interface TemplateMetadata {
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
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  version?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 文件信息接口
interface FileInfo {
  type: 'file' | 'directory';
  contents?: string;
  children?: Record<string, FileInfo>;
}

// 文件系统树类型
type FileSystemTree = Record<string, FileInfo>;

// 打包后的模板数据结构
interface PackagedTemplate {
  // 模板元数据
  metadata: TemplateMetadata;
  // WebContainer 格式的文件系统树
  files: FileSystemTree;
}

// 导出包的数据结构
interface TemplatePackage {
  // 所有模板的映射
  templates: Record<string, PackagedTemplate>;
  // 模板版本
  version: string;
  // 打包时间
  buildTime: string;
}

/**
 * 将普通对象格式转换为WebContainer所需的文件系统格式
 * @param files 文件对象，格式为 { [path]: contents }
 * @returns WebContainer格式的文件系统树
 */
function toWebContainerFormat(files: Record<string, string>): FileSystemTree {
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
 * 递归获取目录下所有文件路径及内容
 * @param dir 目录路径
 * @param basePath 基础路径
 * @returns 文件路径和内容的映射
 */
async function getAllFiles(dir: string, basePath: string = ''): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, relativePath);
      Object.assign(files, subFiles);
    } else {
      // 读取文件内容
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        files[relativePath] = content;
      } catch (error) {
        console.error(`读取文件 ${fullPath} 失败:`, error);
      }
    }
  }
  
  return files;
}

/**
 * 构建模板包
 * @param templatesDir 模板目录路径
 * @param outputPath 输出文件路径
 */
async function buildTemplates(templatesDir: string, outputPath: string): Promise<void> {
  console.log(`开始构建模板包，模板目录: ${templatesDir}`);
  
  const templatePackage: TemplatePackage = {
    templates: {},
    version: '1.0.0',
    buildTime: new Date().toISOString()
  };
  
  // 读取模板目录
  const dirs = await fs.readdir(templatesDir);
  
  for (const dir of dirs) {
    // 跳过builder目录和非目录文件
    if (dir === 'builder') continue;
    
    const templatePath = path.join(templatesDir, dir);
    const stat = await fs.stat(templatePath);
    
    // 确保是目录
    if (stat.isDirectory()) {
      try {
        console.log(`处理模板: ${dir}`);
        
        // 读取template.json
        const templateJsonPath = path.join(templatePath, 'template.json');
        const templateJsonContent = await fs.readFile(templateJsonPath, 'utf-8');
        const templateMetadata = JSON.parse(templateJsonContent) as TemplateMetadata;
        
        // 读取所有文件内容
        const filesContent = await getAllFiles(templatePath);
        
        // 转换为WebContainer格式
        const filesTree = toWebContainerFormat(filesContent);
        
        // 添加到模板包
        templatePackage.templates[templateMetadata.name] = {
          metadata: templateMetadata,
          files: filesTree
        };
        
        console.log(`模板 ${templateMetadata.name} 处理完成，包含 ${Object.keys(filesContent).length} 个文件`);
      } catch (error) {
        console.error(`处理模板 ${dir} 失败:`, error);
      }
    }
  }
  
  // 写入输出文件
  try {
    // 创建输出目录（如果不存在）
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    // 写入文件
    await fs.writeFile(
      outputPath, 
      `export default ${JSON.stringify(templatePackage, null, 2)};`
    );
    
    console.log(`模板包构建完成，输出文件: ${outputPath}`);
    console.log(`共处理 ${Object.keys(templatePackage.templates).length} 个模板`);
  } catch (error) {
    console.error('写入输出文件失败:', error);
  }
}

// 主函数
async function main() {
  // 模板目录路径
  const templatesDir = path.resolve(__dirname, '..');
  
  // 输出文件路径
  const outputPath = path.resolve(__dirname, '../../packages/core/src/templates/index.ts');
  
  // 构建模板包
  await buildTemplates(templatesDir, outputPath);
}

// 执行主函数
main().catch(error => {
  console.error('构建模板包失败:', error);
  process.exit(1);
});
