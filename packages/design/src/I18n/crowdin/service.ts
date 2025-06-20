import crowdin from "@crowdin/crowdin-api-client";
import { CrowdinConfig, defaultConfig } from "./config";

/**
 * Crowdin服务类，提供与Crowdin API交互的方法
 */
export class CrowdinService {
  private uploadStorageApi: any;
  private sourceFilesApi: any;
  private translationsApi: any;
  private languagesApi: any;
  private projectsGroupsApi: any;
  private config: CrowdinConfig;

  /**
   * 构造函数
   * @param config Crowdin配置，如果不提供则使用默认配置
   */
  constructor(config: CrowdinConfig = defaultConfig) {
    this.config = config;

    // 初始化Crowdin API客户端
    const clientOptions: any = {
      token: config.apiToken,
      organization: config.organizationName
    };

    // 如果提供了自定义API基础URL，则添加到选项中
    if (config.baseUrl) {
      clientOptions.baseUrl = config.baseUrl;
    }

    const client = new crowdin(clientOptions);

    // 获取各个API实例
    this.uploadStorageApi = client.uploadStorageApi;
    this.sourceFilesApi = client.sourceFilesApi;
    this.translationsApi = client.translationsApi;
    this.languagesApi = client.languagesApi;
    this.projectsGroupsApi = client.projectsGroupsApi;
  }

  /**
   * 上传翻译文件到Crowdin
   * @param fileName 文件名
   * @param fileContent 文件内容
   * @param storageId 可选的存储ID
   * @returns 上传结果
   */
  async uploadTranslationFile(fileName: string, fileContent: string, storageId?: number): Promise<any> {
    try {
      // 如果没有提供storageId，先创建存储
      if (!storageId) {
        const storageResponse = await this.uploadStorageApi.addStorage(fileName, fileContent);
        storageId = storageResponse.data.id;
      }

      // 检查文件是否已存在
      const files = await this.sourceFilesApi.listProjectFiles(this.config.projectId);
      const existingFile = files.data.find((file: any) => file.data.name === fileName);

      if (existingFile) {
        // 更新已存在的文件
        return await this.sourceFilesApi.updateOrRestoreFile(this.config.projectId, existingFile.data.id, {
          storageId: storageId
        });
      } else {
        // 添加新文件
        return await this.sourceFilesApi.createFile(this.config.projectId, {
          name: fileName,
          storageId: storageId,
          type: "json"
        });
      }
    } catch (error) {
      console.error("上传翻译文件失败:", error);
      throw error;
    }
  }

  /**
   * 下载特定语言的翻译
   * @param languageId 语言ID (如 'zh-CN', 'en', 'ja')
   * @param fileId 可选的文件ID，如果不提供则下载所有文件
   * @returns 翻译内容
   */
  async downloadTranslation(languageId: string, _fileId?: number): Promise<any> {
    try {
      // 获取构建ID
      const buildsResponse = await this.translationsApi.buildProjectTranslation(this.config.projectId, {
        targetLanguageIds: [languageId],
        skipUntranslatedStrings: false,
        exportApprovedOnly: false
      });

      const buildId = buildsResponse.data.id;

      // 等待构建完成
      let buildStatus = await this.translationsApi.checkBuildStatus(buildId);
      while (buildStatus.data.status === "inProgress") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        buildStatus = await this.translationsApi.checkBuildStatus(buildId);
      }

      if (buildStatus.data.status === "failed") {
        throw new Error("翻译构建失败");
      }

      // 下载翻译
      const downloadResponse = await this.translationsApi.downloadTranslations(buildId);

      // 返回下载链接
      return downloadResponse.data.url;
    } catch (error) {
      console.error("下载翻译失败:", error);
      throw error;
    }
  }

  /**
   * 获取项目支持的所有语言
   * @returns 语言列表
   */
  async getProjectLanguages(): Promise<any> {
    try {
      const response = await this.languagesApi.listSupportedLanguages();
      return response.data;
    } catch (error) {
      console.error("获取项目语言失败:", error);
      throw error;
    }
  }
}
