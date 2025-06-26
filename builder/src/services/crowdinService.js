import pkg from "@crowdin/crowdin-api-client";
const CrowdinApiClient = pkg.default;

let client = null;

// 初始化Crowdin API客户端
const getClient = () => {
  if (!client) {
    console.log("Initializing Crowdin client...");
    const { CROWDIN_API_TOKEN } = process.env;
    if (!CROWDIN_API_TOKEN) {
      throw new Error("CROWDIN_API_TOKEN is not set in the environment variables.");
    }
    client = new CrowdinApiClient({
      token: CROWDIN_API_TOKEN,
      baseUrl: "https://yuanqu-tech.crowdin.com/api/v2"
    });
  }
  return client;
};

// 将JSON内容上传到Crowdin的存储中
const uploadJsonAsFile = async (fileName, content) => {
  try {
    const buffer = Buffer.from(JSON.stringify(content, null, 2), "utf8");
    const storage = await getClient().uploadStorageApi.addStorage(fileName, buffer);
    return storage.data;
  } catch (error) {
    console.error(`Failed to upload JSON for ${fileName}:`, error);
    throw error;
  }
};

// 获取项目源语言ID
const getProjectSourceLanguage = async projectId => {
  try {
    const project = await getClient().projectsGroupsApi.getProject(projectId);
    return project.data.sourceLanguageId;
  } catch (error) {
    console.error(`Failed to get project source language: ${error.message}`);
    throw error;
  }
};

// 上传翻译或创建/更新源文件
const uploadTranslation = async (projectId, languageId, fileName, content) => {
  try {
    const storage = await uploadJsonAsFile(fileName, content);
    const sourceLanguageId = await getProjectSourceLanguage(projectId);
    const files = await getClient().sourceFilesApi.listProjectFiles(projectId, { filter: fileName, recursion: 1 });
    const existingFile = files.data.find(f => f.data.name === fileName);
    let fileId;

    if (!existingFile) {
      if (languageId === sourceLanguageId) {
        const response = await getClient().sourceFilesApi.createFile(projectId, {
          storageId: storage.id,
          name: fileName
        });
        fileId = response.data.id;
      } else {
        throw new Error(`Cannot upload translation for '${languageId}'. Source file '${fileName}' not found.`);
      }
    } else {
      fileId = existingFile.data.id;
    }

    const response = await getClient().translationsApi.uploadTranslation(projectId, languageId, {
      storageId: storage.id,
      fileId: fileId,
      autoApproveImported: true
    });

    let message;
    if (languageId === sourceLanguageId) {
      message = existingFile ? "源语言文本更新成功。" : "源文件创建成功。";
    } else {
      message = languageId + "语言文本更新成功。";
    }

    return { ...response.data, message };
  } catch (error) {
    console.error(`Failed to process file '${fileName}' for language '${languageId}':`, error);
    throw error;
  }
};

// 匹配最合适的语言
const findBestMatchLanguage = (requestedLang, availableLangs) => {
  // 1. 完全匹配
  if (availableLangs.includes(requestedLang)) {
    return requestedLang;
  }

  // 2. 匹配主要语言 (e.g., 'en' from 'en-US')
  const primaryLang = requestedLang.split("-")[0];
  const match = availableLangs.find(lang => lang.split("-")[0] === primaryLang);
  if (match) {
    console.log(`Could not find exact match for '${requestedLang}', using primary language match '${match}'.`);
    return match;
  }

  throw new Error(
    `Language '${requestedLang}' or its primary variant is not supported. Available languages: [${availableLangs.join(", ")}]`
  );
};

// 下载单个文件的特定语言翻译
const downloadFileTranslation = async (projectId, fileName, languageId) => {
  try {
    // 步骤 1: 获取Crowdin项目所有支持的语言
    const availableLangs = await getProjectLanguages(projectId);

    // 步骤 2: 找到最佳匹配的语言ID
    const targetLanguageId = findBestMatchLanguage(languageId, availableLangs);

    // 步骤 3: 查找文件ID
    const files = await getClient().sourceFilesApi.listProjectFiles(projectId, { filter: fileName, recursion: 1 });
    const file = files.data.find(f => f.data.name === fileName);
    if (!file) {
      throw new Error(`Source file '${fileName}' not found in project ${projectId}.`);
    }
    const fileId = file.data.id;

    // 步骤 4: 使用匹配到的语言ID导出翻译
    console.log(`Exporting translation for file '${fileName}' with matched language '${targetLanguageId}'...`);
    const response = await getClient().translationsApi.exportProjectTranslation(projectId, {
      targetLanguageId: targetLanguageId,
      fileIds: [fileId],
      skipUntranslatedStrings: true
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to get download link for file: ${fileName}, lang: ${languageId}`, error);
    throw error;
  }
};

// 获取项目的所有语言（源语言 + 目标语言）
const getProjectLanguages = async projectId => {
  try {
    const project = await getClient().projectsGroupsApi.getProject(projectId);
    const { sourceLanguageId, targetLanguageIds } = project.data;
    return [sourceLanguageId, ...targetLanguageIds];
  } catch (error) {
    console.error(`Failed to get project languages: ${error.message}`);
    throw error;
  }
};

export const crowdinService = {
  uploadTranslation,
  downloadFileTranslation,
  getProjectLanguages,
  getProjectSourceLanguage
};
