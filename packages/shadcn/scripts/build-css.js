import fs from "fs";
import path from "path";
import { globby } from "globby";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindConfig from "../tailwind.config.ts";

async function generateBaseCSS() {
  // 读取基础样式文件
  const baseStylePath = path.join(process.cwd(), "src", "style", "index.css");
  const baseStyle = fs.readFileSync(baseStylePath, "utf8");

  const outputDir = "dist/components";
  const outputFile = path.join(outputDir, "style.css");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result = await postcss([tailwindcss(tailwindConfig), autoprefixer]).process(baseStyle, { from: undefined });

  fs.writeFileSync(outputFile, result.css);
  console.log(`生成了基础 CSS 文件：${outputFile}`);
}

async function generateComponentCSS(componentFile) {
  const componentName = path.basename(componentFile, ".tsx");
  const outputDir = `dist/components/ui/${componentName}`;
  const outputFile = path.join(outputDir, "index.css");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const componentContent = fs.readFileSync(componentFile, "utf8");

  const cssContent = `
	  @tailwind components;
	  @tailwind utilities;
	`;

  const result = await postcss([
    tailwindcss({
      ...tailwindConfig, // 导入配置的主题
      content: [{ raw: componentContent, extension: "tsx" }]
    }),
    autoprefixer
  ]).process(cssContent, { from: componentFile });

  // 移除空行和只包含空白字符的行
  const cleanedCSS = result.css.replace(/^\s*[\r\n]/gm, "").trim();

  if (cleanedCSS) {
    fs.writeFileSync(outputFile, cleanedCSS);
    console.log(`生成了组件 CSS 文件：${outputFile}`);
  } else {
    console.log(`组件 ${componentName} 没有生成 CSS，跳过文件创建。`);
  }
}

export async function generateAllCSS() {
  await generateBaseCSS();
  const componentFiles = await globby("src/components/ui/*.tsx");
  for (const file of componentFiles) {
    await generateComponentCSS(file);
  }
}
