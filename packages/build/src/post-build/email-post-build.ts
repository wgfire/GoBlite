import fs from "fs-extra";
import path from "path";
import { JSDOM } from "jsdom";
import { BuildContext, BuildResult } from "../types";
import { BasePostBuildStrategy } from "./post-build-strategy";

export class EmailPostBuildStrategy extends BasePostBuildStrategy {
  async process(context: BuildContext, buildResult: BuildResult): Promise<BuildResult> {
    if (!buildResult.success || !buildResult.outputPath) {
      return buildResult;
    }

    try {
      // 处理每个HTML文件
      if (buildResult.assets?.html) {
        for (const htmlFile of buildResult.assets.html) {
          const filePath = path.join(buildResult.outputPath, htmlFile);
          await this.processHtmlFile(filePath);
        }
      }

      // 清理不需要的资源文件
      await this.cleanupAssets(buildResult);

      // 清除资源引用
      buildResult.assets = {
        ...buildResult.assets,
        js: [],
        css: []
      };

      return buildResult;
    } catch (error) {
      console.error("Email post-build processing failed:", error);
      throw error;
    }
  }

  private async processHtmlFile(filePath: string): Promise<void> {
    const html = await fs.readFile(filePath, "utf-8");
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const prefix = "'link[rel=\"stylesheet\"]'";

    // 内联外部样式表
    const styleSheets = document.querySelectorAll(prefix);
    for (const styleSheet of styleSheets) {
      const href = styleSheet.getAttribute("href");
      if (href) {
        const cssPath = path.join(path.dirname(filePath), href);
        try {
          const css = await fs.readFile(cssPath, "utf-8");
          const styleElement = document.createElement("style");
          styleElement.textContent = css;
          styleSheet.parentNode?.replaceChild(styleElement, styleSheet);
        } catch (error) {
          console.warn(`Failed to inline stylesheet ${href}:`, error);
        }
      }
    }

    // 移除所有脚本标签
    const scripts = document.querySelectorAll("script");
    scripts.forEach(script => script.remove());

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
