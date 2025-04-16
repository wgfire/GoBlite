import { FileItem, FileItemType } from "../core/fileSystem/types";
import { Template, TemplateLoadResult } from "./types";

export class TemplateService {
  private baseUrl: string;

  constructor(baseUrl: string = "/templates") {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取模板列表
   * @returns 模板列表
   */
  async getTemplates(): Promise<Template[]> {
    try {
      // 在开发环境中，我们只考虑react-template模板
      return [
        {
          id: "react-template",
          name: "React模板",
          description: "基础的React项目模板",
          fields: [],
          files: {},
        },
      ];
    } catch (error) {
      console.error("获取模板列表失败:", error);
      return [];
    }
  }

  /**
   * 加载模板内容
   * @param templateId 模板ID
   * @returns 加载结果
   */
  async loadTemplate(templateId: string): Promise<TemplateLoadResult> {
    try {
      console.log(`开始加载模板: ${templateId}`);

      // 加载manifest.json文件
      const manifestResponse = await fetch(`${this.baseUrl}/${templateId}/manifest.json`);
      if (!manifestResponse.ok) {
        throw new Error(`无法加载模板清单文件: ${manifestResponse.statusText}`);
      }

      const manifest = await manifestResponse.json();
      console.log("模板清单:", manifest);

      // 加载所有文件内容
      const filePromises: Promise<{ path: string; content: string }>[] = [];

      for (const [filePath, fileSource] of Object.entries(manifest.files)) {
        filePromises.push(
          fetch(`${this.baseUrl}/${templateId}/${fileSource}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`无法加载文件 ${fileSource}: ${response.statusText}`);
              }
              return response.text();
            })
            .then((content) => ({
              path: filePath,
              content,
            }))
        );
      }

      const fileContents = await Promise.all(filePromises);
      console.log(`已加载 ${fileContents.length} 个文件`);

      // 转换为FileItem格式
      const files = this.convertToFileItems(fileContents);

      return {
        success: true,
        files,
      };
    } catch (error) {
      console.error(`加载模板 ${templateId} 失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 将文件内容转换为FileItem格式
   * @param files 文件内容列表
   * @returns FileItem数组
   */
  private convertToFileItems(files: { path: string; content: string }[]): FileItem[] {
    const rootItems: FileItem[] = [];
    const folderMap: Record<string, FileItem> = {};

    // 首先创建所有文件夹结构
    files.forEach((file) => {
      const pathParts = file.path.split("/").filter(Boolean);
      let currentPath = "";

      // 创建文件路径上的所有文件夹
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;

        // 如果文件夹已存在，跳过
        if (folderMap[currentPath]) continue;

        const folderItem: FileItem = {
          name: part,
          path: currentPath,
          type: FileItemType.FOLDER,
          children: [],
        };

        folderMap[currentPath] = folderItem;

        // 将文件夹添加到父文件夹或根目录
        if (parentPath) {
          if (folderMap[parentPath]) {
            folderMap[parentPath].children = folderMap[parentPath].children || [];
            folderMap[parentPath].children!.push(folderItem);
          }
        } else {
          rootItems.push(folderItem);
        }
      }
    });

    // 然后添加所有文件
    files.forEach((file) => {
      const pathParts = file.path.split("/").filter(Boolean);
      const fileName = pathParts[pathParts.length - 1];
      const parentPath = pathParts.length > 1 ? `/${pathParts.slice(0, pathParts.length - 1).join("/")}` : "";

      const filePath = file.path.startsWith("/") ? file.path : `/${file.path}`;

      const fileItem: FileItem = {
        name: fileName,
        path: filePath,
        type: FileItemType.FILE,
        content: file.content,
      };

      // 将文件添加到父文件夹或根目录
      if (parentPath && folderMap[parentPath]) {
        folderMap[parentPath].children = folderMap[parentPath].children || [];
        folderMap[parentPath].children!.push(fileItem);
      } else {
        rootItems.push(fileItem);
      }
    });

    return rootItems;
  }
}
