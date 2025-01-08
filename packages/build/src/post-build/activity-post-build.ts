import fs from "fs-extra";
import path from "path";
import { JSDOM } from "jsdom";
import { BuildContext, BuildResult } from "../types";
import { BasePostBuildStrategy } from "./post-build-strategy";

export class ActivityPostBuildStrategy extends BasePostBuildStrategy {
  private readonly defaultScripts = [
    "https://cdn.example.com/activity-tracker.js",
    "https://cdn.example.com/analytics.js"
  ];

  async process(context: BuildContext, buildResult: BuildResult): Promise<BuildResult> {
    if (!buildResult.success || !buildResult.outputPath) {
      return buildResult;
    }

    try {
      // 处理每个HTML文件
      if (buildResult.assets?.html) {
        for (const htmlFile of buildResult.assets.html) {
          const filePath = path.join(buildResult.outputPath, htmlFile);
          await this.processHtmlFile(filePath, context.config.assets?.scripts);
        }
      }

      // 注入默认和配置的资源
      await this.injectAssets(buildResult, {
        scripts: [...(context.config.assets?.scripts || []), ...this.defaultScripts]
      });

      return buildResult;
    } catch (error) {
      console.error("Activity post-build processing failed:", error);
      throw error;
    }
  }

  private async processHtmlFile(filePath: string, additionalScripts?: string[]): Promise<void> {
    const html = await fs.readFile(filePath, "utf-8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 注入默认脚本
    const head = document.querySelector("head");
    if (head) {
      // 注入默认脚本
      this.defaultScripts.forEach(scriptUrl => {
        const script = document.createElement("script");
        script.src = scriptUrl;
        head.appendChild(script);
      });

      // 注入额外配置的脚本
      if (additionalScripts) {
        additionalScripts.forEach(scriptUrl => {
          const script = document.createElement("script");
          script.src = scriptUrl;
          head.appendChild(script);
        });
      }
    }

    // 添加活动页面特定的meta标签
    const meta = document.createElement("meta");
    meta.setAttribute("name", "page-type");
    meta.setAttribute("content", "activity");
    document.head.appendChild(meta);

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
