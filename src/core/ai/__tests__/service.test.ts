/**
 * AI服务测试
 */

import { AIService } from "../service";
import { ServiceStatus } from "../types";

// 模拟fetch
global.fetch = jest.fn();

describe("AIService", () => {
  let service: AIService;

  beforeEach(() => {
    // 重置模拟
    jest.clearAllMocks();

    // 获取服务实例
    service = AIService.getInstance();
  });

  describe("初始化", () => {
    it("应该成功初始化服务", async () => {
      // 模拟成功的API验证
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      const result = await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });

      expect(result).toBe(true);
      expect(service.getStatus()).toBe(ServiceStatus.READY);
      expect(service.getError()).toBeNull();
    });

    it("缺少必要参数时应该初始化失败", async () => {
      const result = await service.initialize({
        apiKey: "",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });

      expect(result).toBe(false);
      expect(service.getStatus()).toBe(ServiceStatus.ERROR);
      expect(service.getError()).not.toBeNull();
    });
  });

  describe("发送请求", () => {
    beforeEach(async () => {
      // 初始化服务
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });
    });

    it("应该成功发送请求并返回响应", async () => {
      // 模拟成功的API响应
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: "Test response",
              },
            },
          ],
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30,
          },
        }),
      });

      const response = await service.sendRequest({
        prompt: "Test prompt",
      });

      expect(response.success).toBe(true);
      expect(response.content).toBe("Test response");
      expect(response.usage).toEqual({
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      });
      expect(service.getStatus()).toBe(ServiceStatus.READY);
    });

    it("API错误时应该返回错误信息", async () => {
      // 模拟API错误
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: {
            message: "API error",
          },
        }),
      });

      const response = await service.sendRequest({
        prompt: "Test prompt",
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe("API error");
      expect(service.getStatus()).toBe(ServiceStatus.ERROR);
    });

    it("网络错误时应该返回错误信息", async () => {
      // 模拟网络错误
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      const response = await service.sendRequest({
        prompt: "Test prompt",
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe("Network error");
      expect(service.getStatus()).toBe(ServiceStatus.ERROR);
    });
  });

  describe("生成代码", () => {
    beforeEach(async () => {
      // 初始化服务
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });
    });

    it("应该成功生成代码文件", async () => {
      // 模拟成功的API响应
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: '```javascript:src/index.js\nconsole.log("Hello");\n```\n\n```html:src/index.html\n<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello</h1>\n</body>\n</html>\n```',
              },
            },
          ],
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30,
          },
        }),
      });

      const result = await service.generateCode({
        prompt: "Generate a simple web page",
      });

      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(2);
      expect(result.files?.[0]).toEqual({
        path: "src/index.js",
        content: 'console.log("Hello");',
        language: "javascript",
      });
      expect(result.files?.[1]).toEqual({
        path: "src/index.html",
        content: "<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello</h1>\n</body>\n</html>",
        language: "html",
      });
    });

    it("API错误时应该返回错误信息", async () => {
      // 模拟API错误
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: {
            message: "API error",
          },
        }),
      });

      const result = await service.generateCode({
        prompt: "Generate a simple web page",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("API error");
    });
  });

  describe("生成图像", () => {
    beforeEach(async () => {
      // 初始化服务
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });
    });

    it("应该成功生成图像", async () => {
      // 模拟成功的API响应
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              url: "https://example.com/image1.png",
            },
            {
              url: "https://example.com/image2.png",
            },
          ],
        }),
      });

      const result = await service.generateImage("Generate a landscape image");

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(2);
      expect(result.images?.[0]).toEqual({
        url: "https://example.com/image1.png",
        width: 1024,
        height: 1024,
      });
      expect(result.images?.[1]).toEqual({
        url: "https://example.com/image2.png",
        width: 1024,
        height: 1024,
      });
    });

    it("API错误时应该返回错误信息", async () => {
      // 模拟API错误
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: {
            message: "API error",
          },
        }),
      });

      const result = await service.generateImage("Generate a landscape image");

      expect(result.success).toBe(false);
      expect(result.error).toBe("API error");
    });
  });

  describe("优化提示词", () => {
    beforeEach(async () => {
      // 初始化服务
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });
    });

    it("应该成功优化提示词", async () => {
      // 模拟成功的API响应
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: "Optimized prompt",
              },
            },
          ],
        }),
      });

      const result = await service.optimizePrompt("Original prompt");

      expect(result).toBe("Optimized prompt");
    });

    it("API错误时应该返回原始提示词", async () => {
      // 模拟API错误
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: {
            message: "API error",
          },
        }),
      });

      const result = await service.optimizePrompt("Original prompt");

      expect(result).toBe("Original prompt");
    });
  });

  describe("取消请求", () => {
    beforeEach(async () => {
      // 初始化服务
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });
    });

    it("应该成功取消请求", async () => {
      // 创建模拟的AbortController
      const mockAbort = jest.fn();
      global.AbortController = jest.fn().mockImplementation(() => ({
        signal: {},
        abort: mockAbort,
      }));

      // 开始一个请求但不等待它完成
      const requestPromise = service.sendRequest({
        prompt: "Test prompt",
      });

      // 取消请求
      service.cancelRequest();

      // 验证abort被调用
      expect(mockAbort).toHaveBeenCalled();
      expect(service.getStatus()).toBe(ServiceStatus.READY);
    });
  });

  describe("重置服务", () => {
    beforeEach(async () => {
      // 初始化服务
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await service.initialize({
        apiKey: "test-api-key",
        baseUrl: "https://api.test.com",
        modelName: "test-model",
      });
    });

    it("应该成功重置服务状态", async () => {
      // 设置错误状态
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

      try {
        await service.sendRequest({
          prompt: "Test prompt",
        });
      } catch (error) {
        // 忽略错误
      }

      // 验证服务处于错误状态
      expect(service.getStatus()).toBe(ServiceStatus.ERROR);
      expect(service.getError()).not.toBeNull();

      // 重置服务
      service.reset();

      // 验证服务已重置
      expect(service.getStatus()).toBe(ServiceStatus.READY);
      expect(service.getError()).toBeNull();
    });
  });
});
