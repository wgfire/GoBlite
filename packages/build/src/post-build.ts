import { readFileSync, writeFileSync } from "fs";
import * as cheerio from "cheerio";
// import CleanCSS from "clean-css";

export interface BuildConfig {
  type: "email" | "activity" | "landPage";
  scripts?: string[];
  inlineStyles?: boolean;
  removeExternalResources?: boolean;
}

export class PostBuildProcessor {
  private config: BuildConfig;

  constructor(config: BuildConfig) {
    this.config = config;
  }

  async process(htmlPath: string): Promise<void> {
    const html = readFileSync(htmlPath, "utf-8");
    const $ = cheerio.load(html);

    if (this.config.type === "email") {
      await this.processEmailTemplate($);
    } else {
      await this.processWebPage($);
    }

    writeFileSync(htmlPath, $.html());
  }

  private async processEmailTemplate($: cheerio.CheerioAPI): Promise<void> {
    // 内联所有CSS
    // const styles = $("link[rel='stylesheet']")
    //   .map((_, el) => {
    //     const href = $(el).attr("href");
    //     if (href) {
    //       const css = readFileSync(href, "utf-8");
    //       return css;
    //     }
    //     return "";
    //   })
    //   .get();

    // // 合并并压缩CSS
    // const cleanCss = new CleanCSS();
    // const inlinedCss = cleanCss.minify(styles.join("\n")).styles;

    // // 添加内联样式
    // $("head").append(`<style>${inlinedCss}</style>`);

    // 移除所有外部资源引用
    $("script").remove();
    $("link[rel='stylesheet']").remove();
  }

  private async processWebPage($: cheerio.CheerioAPI): Promise<void> {
    if (this.config.scripts) {
      // 注入自定义脚本
      this.config.scripts.forEach(script => {
        $("body").append(`<script src="${script}"></script>`);
      });
    }
  }
}
