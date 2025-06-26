import { Router } from "express";
import { crowdinService } from "../services/crowdinService.js";

const router = Router();

/**
 * @route   POST /api/crowdin/translations
 * @desc    上传翻译到指定语言，或创建/更新源文件
 * @access  Public
 */
router.post("/translations", async (req, res) => {
  const { projectId, languageId, fileName, content } = req.body;

  if (!projectId || !languageId || !fileName || !content) {
    return res.status(400).json({ msg: "请提供projectId, languageId, fileName和content" });
  }

  try {
    const result = await crowdinService.uploadTranslation(projectId, languageId, fileName, content);
    res.json({ msg: "文件处理成功", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "服务器错误", error: error.message });
  }
});

/**
 * @route   GET /api/crowdin/languages
 * @desc    获取项目支持的语言列表
 * @access  Public
 */
router.get("/languages", async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    return res.status(400).json({ message: "缺少 projectId" });
  }

  try {
    const languages = await crowdinService.getProjectLanguages(projectId);
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: `获取项目语言失败: ${error.message}` });
  }
});

/**
 * @route   GET /api/crowdin/translations/:fileName/:languageId
 * @desc    获取单个文件特定语言的翻译的下载链接
 * @access  Public
 */
router.get("/translations/:fileName/:languageId", async (req, res) => {
  const { projectId } = req.query;
  const { fileName, languageId } = req.params;

  if (!projectId || !fileName || !languageId) {
    return res.status(400).json({ msg: "Please provide projectId, fileName, and languageId" });
  }

  try {
    const translation = await crowdinService.downloadFileTranslation(projectId, fileName, languageId);
    res.json(translation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default router;
