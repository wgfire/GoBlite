import express from 'express';
import cors from 'cors';
import path from 'path';
import { TemplateService } from './services/templateService';

const app = express();
const port = process.env.PORT || 3001;
// 使用相对路径，更容易部署
const templatesDir = path.resolve(__dirname, '../../');
const templateService = new TemplateService();

app.use(cors());

// 获取所有模板元数据
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await templateService.getTemplates(templatesDir);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: '获取模板列表失败' });
  }
});

// 获取模板文件列表
app.get('/api/templates/:name/files', async (req, res) => {
  try {
    const files = await templateService.getTemplateFiles(templatesDir, req.params.name);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: '获取模板文件列表失败' });
  }
});

// 获取模板文件内容
app.get('/api/templates/:name/files/:file(*)', async (req, res) => {
  try {
    const content = await templateService.getTemplateFile(templatesDir, req.params.name, req.params.file);
    res.send(content);
  } catch (error) {
    res.status(404).json({ error: '文件不存在' });
  }
});

app.listen(port, () => {
  console.log(`模板服务器运行在 http://localhost:${port}`);
});
