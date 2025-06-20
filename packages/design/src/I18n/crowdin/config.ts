/**
 * Crowdin API配置
 */
export interface CrowdinConfig {
  apiToken: string;
  projectId?: number;
  organizationName?: string;
  baseUrl?: string;
}

/**
 * 默认配置
 */
export const defaultConfig: CrowdinConfig = {
  apiToken: "0e5f1c7e0a2f4a4a9a9b9c9d9e9f9g9h", // 测试用token，实际使用时应从环境变量或配置文件中获取
  baseUrl: "https://yuanqu-tech.crowdin.com/api/v2" // 企业版Crowdin API地址
};
