/**
 * AI与模板系统集成
 * 处理AI生成内容与模板系统的交互
 */

import { Template } from "@/template/types";
import { AIGenerationType } from "../types";
import { useLangChainService } from "../hooks/useLangChainService";
import { PromptManager } from "../prompts/promptManager";

/**
 * 模板集成类
 */
export class TemplateIntegration {
  private static langChainService = useLangChainService();
  private static promptManager = PromptManager.getInstance();

  /**
   * 根据模板和表单数据生成提示词
   * @param template 模板
   * @param formData 表单数据
   * @param generationType 生成类型
   * @returns 生成的提示词
   */
  public static generatePromptFromTemplate(template: Template, formData: Record<string, any>, generationType: AIGenerationType = AIGenerationType.CODE): string {
    // 基础提示词
    let prompt = `请为我创建一个${template.name}，具有以下特点：\n\n`;

    // 添加表单数据
    for (const field of template.fields) {
      const value = formData[field.id];
      if (value !== undefined && value !== null && value !== "") {
        prompt += `- ${field.name}: ${value}\n`;
      }
    }

    // 根据生成类型添加特定指令
    if (generationType === AIGenerationType.CODE || generationType === AIGenerationType.MIXED) {
      prompt += "\n请生成所有必要的HTML、CSS和JavaScript代码。代码应该是完整的、可运行的，并且符合现代Web开发标准。";
      prompt += "\n请使用以下文件结构：";
      prompt += "\n- index.html (主HTML文件)";
      prompt += "\n- styles/main.css (主CSS文件)";
      prompt += "\n- scripts/main.js (主JavaScript文件)";
      prompt += "\n- assets/images/ (图像文件目录)";
    }

    if (generationType === AIGenerationType.IMAGE || generationType === AIGenerationType.MIXED) {
      prompt += "\n请描述需要生成的图像，包括风格、内容和布局。图像应该与网页主题匹配，并且具有专业的外观。";
    }

    return prompt;
  }

  /**
   * 根据模板类型生成系统提示词
   * @param template 模板
   * @param generationType 生成类型
   * @returns 系统提示词
   */
  public static generateSystemPrompt(template: Template, generationType: AIGenerationType): string {
    let systemPrompt = "";

    // 基础系统提示词
    systemPrompt = "你是一个专业的Web开发和设计助手。";

    // 根据生成类型添加特定指令
    if (generationType === AIGenerationType.CODE || generationType === AIGenerationType.MIXED) {
      systemPrompt += " 你擅长生成高质量的HTML、CSS和JavaScript代码。";
      systemPrompt += " 请确保代码是完整的、可运行的，并且符合现代Web开发标准。";
      systemPrompt += " 返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。";
      systemPrompt += " 例如: ```filepath:src/index.js\nconsole.log('Hello');\n```";
    }

    if (generationType === AIGenerationType.IMAGE || generationType === AIGenerationType.MIXED) {
      systemPrompt += " 你还擅长提供详细的图像描述，用于AI图像生成。";
      systemPrompt += " 对于图像描述，请提供详细的风格、内容和布局信息，以便生成高质量的图像。";
    }

    return systemPrompt;
  }

  /**
   * 处理模板特定的代码生成
   * @param template 模板
   * @param formData 表单数据
   * @returns 处理后的代码
   */
  public static processTemplateSpecificCode(template: Template, formData: Record<string, any>, generatedCode: string): string {
    // 根据模板ID进行特定处理
    switch (template.id) {
      case "landing-page":
        // 处理落地页特定代码
        return this.processLandingPageCode(formData, generatedCode);

      case "blog":
        // 处理博客特定代码
        return this.processBlogCode(formData, generatedCode);

      default:
        // 默认不做特殊处理
        return generatedCode;
    }
  }

  /**
   * 处理落地页特定代码
   * @param formData 表单数据
   * @param generatedCode 生成的代码
   * @returns 处理后的代码
   */
  private static processLandingPageCode(formData: Record<string, any>, generatedCode: string): string {
    let processedCode = generatedCode;

    // 处理风险提示
    if (formData.footerRisk === "yes") {
      // 添加底部风险提示
      const riskFooter = `<footer class="risk-disclaimer">
  <div class="container">
    <p>风险提示：投资有风险，入市需谨慎。过往业绩不代表未来表现。</p>
  </div>
</footer>`;

      // 在</body>前插入风险提示
      processedCode = processedCode.replace("</body>", `${riskFooter}\n</body>`);
    }

    // 处理水印
    if (formData.watermark === "yes") {
      // 添加水印样式
      const watermarkStyle = `<style>
  .watermark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    background: url('assets/images/watermark.png') repeat;
    opacity: 0.1;
  }
</style>`;

      // 添加水印元素
      const watermarkElement = `<div class="watermark"></div>`;

      // 在</head>前插入水印样式
      processedCode = processedCode.replace("</head>", `${watermarkStyle}\n</head>`);

      // 在<body>后插入水印元素
      processedCode = processedCode.replace("<body>", `<body>\n${watermarkElement}`);
    }

    return processedCode;
  }

  /**
   * 处理博客特定代码
   * @param formData 表单数据
   * @param generatedCode 生成的代码
   * @returns 处理后的代码
   */
  private static processBlogCode(formData: Record<string, any>, generatedCode: string): string {
    let processedCode = generatedCode;

    // 处理头部风险提示
    if (formData.headerRisk === "yes") {
      // 添加头部风险提示
      const riskHeader = `<div class="risk-header">
  <div class="container">
    <p>风险提示：本博客内容仅供参考，不构成任何投资建议。</p>
  </div>
</div>`;

      // 在<header>后插入风险提示
      processedCode = processedCode.replace("<header", `${riskHeader}\n<header`);
    }

    return processedCode;
  }

  /**
   * 根据模板生成图像提示词
   * @param template 模板
   * @param formData 表单数据
   * @returns 图像提示词
   */
  public static generateImagePrompt(template: Template, formData: Record<string, any>): string {
    // 基础图像提示词
    let imagePrompt = `为${template.name}生成一张专业的图像，`;

    // 根据模板类型添加特定描述
    switch (template.id) {
      case "landing-page":
        imagePrompt += "作为网站的主视觉元素。图像应该具有吸引力，能够传达产品或服务的核心价值。";
        if (formData.product) {
          imagePrompt += ` 图像应该展示${formData.product}，`;
        }
        break;

      case "blog":
        imagePrompt += "作为博客的封面图像。图像应该与博客主题相关，具有吸引读者的视觉效果。";
        break;

      case "restaurant":
        imagePrompt += "展示餐厅的环境或特色菜品。图像应该能够激发食欲，展现餐厅的特色。";
        if (formData.specialDish) {
          imagePrompt += ` 图像应该展示特色菜品${formData.specialDish}，`;
        }
        break;

      default:
        imagePrompt += "作为网站的主要视觉元素。图像应该专业、现代，与网站主题匹配。";
    }

    // 添加风格描述
    if (formData.style) {
      imagePrompt += ` 风格应该是${formData.style}，`;
    } else {
      imagePrompt += " 风格应该是现代、专业的，";
    }

    // 添加通用要求
    imagePrompt += " 分辨率高，色彩鲜明，构图平衡。不要包含任何文字或标志。";

    return imagePrompt;
  }
}
