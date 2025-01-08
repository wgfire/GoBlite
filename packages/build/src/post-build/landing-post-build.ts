import fs from "fs-extra";
import path from "path";
import { JSDOM } from "jsdom";
import { BuildContext, BuildResult } from "../types";
import { BasePostBuildStrategy } from "./post-build-strategy";

export class LandingPostBuildStrategy extends BasePostBuildStrategy {
  private readonly defaultScripts = [
    "https://cdn.example.com/landing-tracker.js",
    "https://cdn.example.com/conversion.js"
  ];

  private readonly defaultStyles = ["https://cdn.example.com/landing-theme.css"];

  async process(context: BuildContext, buildResult: BuildResult): Promise<BuildResult> {
    if (!buildResult.success || !buildResult.outputPath) {
      return buildResult;
    }

    try {
      // 处理每个HTML文件
      if (buildResult.assets?.html) {
        for (const htmlFile of buildResult.assets.html) {
          const filePath = path.join(buildResult.outputPath, htmlFile);
          await this.processHtmlFile(filePath, {
            scripts: context.config.assets?.scripts,
            styles: context.config.assets?.styles
          });
        }
      }

      // 注入默认和配置的资源
      await this.injectAssets(buildResult, {
        scripts: [...(context.config.assets?.scripts || []), ...this.defaultScripts],
        styles: [...(context.config.assets?.styles || []), ...this.defaultStyles]
      });

      return buildResult;
    } catch (error) {
      console.error("Landing page post-build processing failed:", error);
      throw error;
    }
  }

  private async processHtmlFile(filePath: string, assets?: { scripts?: string[]; styles?: string[] }): Promise<void> {
    const html = await fs.readFile(filePath, "utf-8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const head = document.querySelector("head");
    if (head) {
      // 注入默认脚本
      this.defaultScripts.forEach(scriptUrl => {
        const script = document.createElement("script");
        script.src = scriptUrl;
        head.appendChild(script);
      });

      // 注入默认样式
      this.defaultStyles.forEach(styleUrl => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleUrl;
        head.appendChild(link);
      });

      // 注入额外配置的资源
      if (assets?.scripts) {
        assets.scripts.forEach(scriptUrl => {
          const script = document.createElement("script");
          script.src = scriptUrl;
          head.appendChild(script);
        });
      }

      if (assets?.styles) {
        assets.styles.forEach(styleUrl => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = styleUrl;
          head.appendChild(link);
        });
      }
    }

    // 添加落地页特定的meta标签
    const meta = document.createElement("meta");
    meta.setAttribute("name", "page-type");
    meta.setAttribute("content", "landing");
    document.head.appendChild(meta);

    // 添加SEO优化的meta标签
    const description = document.createElement("meta");
    description.setAttribute("name", "description");
    description.setAttribute("content", "Landing page description");
    document.head.appendChild(description);

    const keywords = document.createElement("meta");
    keywords.setAttribute("name", "keywords");
    keywords.setAttribute("content", "landing,page,keywords");
    document.head.appendChild(keywords);

    // 保存处理后的HTML
    await fs.writeFile(filePath, dom.serialize());
  }

  async validate(context: BuildContext): Promise<boolean> {
    // 验证输出目录是否存在
    if (!context.outputDir || !(await fs.pathExists(context.outputDir))) {
      return false;
    }

    return true;
  }
}
