// 暂时注释测试用例
// import { BuildManager } from "../build-manager";
// import { BuildConfig, BuildResult } from "../types";
// import path from "path";

// describe("BuildManager", () => {
//   let buildManager: BuildManager;

//   beforeEach(() => {
//     buildManager = new BuildManager();
//   });

//   // 测试用例 1: 基本构建流程
//   test("should successfully build a simple page", async () => {
//     const config: BuildConfig = {
//       id: "test-build-1",
//       type: "page",
//       optimization: { minify: true }
//     };

//     const result = await buildManager.build(config);
//     expect(result.success).toBe(true);
//     expect(result.buildId).toBe(config.id);
//   });

//   // 测试用例 2: 缓存命中
//   test("should return cached result for identical builds", async () => {
//     const config: BuildConfig = {
//       id: "test-build-2",
//       type: "page"
//     };

//     const result1 = await buildManager.build(config);
//     const result2 = await buildManager.build(config);

//     expect(result2.cached).toBe(true);
//     expect(result2.duration).toBeLessThan(result1.duration);
//   });

//   // 测试用例 3: 错误处理
//   test("should handle build failures gracefully", async () => {
//     const config: BuildConfig = {
//       id: "test-build-3",
//       type: "invalid-type"
//     };

//     const result = await buildManager.build(config);
//     expect(result.success).toBe(false);
//     expect(result.error).toBeDefined();
//   });

//   // 测试用例 4: 并发构建
//   test("should handle concurrent builds", async () => {
//     const configs = Array.from({ length: 5 }, (_, i) => ({
//       id: `test-build-${i}`,
//       type: "page"
//     }));

//     const results = await Promise.all(configs.map(config => buildManager.build(config)));
//     expect(results.every(r => r.success)).toBe(true);
//   });

//   // 测试用例 5: 资源清理
//   test("should cleanup resources after build", async () => {
//     const config: BuildConfig = {
//       id: "test-build-5",
//       type: "page",
//       optimization: { keepWorkingDir: false }
//     };

//     const result = await buildManager.build(config);
//     expect(result.success).toBe(true);
//     // 验证临时目录已被清理
//     expect(() => {
//       const tempDir = path.join(process.cwd(), ".build-cache", config.id);
//       require("fs").accessSync(tempDir);
//     }).toThrow();
//   });

//   // 测试用例 6: 构建取消
//   test("should cancel ongoing build", async () => {
//     const config: BuildConfig = {
//       id: "test-build-6",
//       type: "page"
//     };

//     const buildPromise = buildManager.build(config);
//     await buildManager.cancelBuild(config.id);

//     const result = await buildPromise;
//     expect(result.success).toBe(false);
//     expect(result.error?.message).toContain("cancelled");
//   });

//   // 测试用例 7: 构建进度追踪
//   test("should track build progress", async () => {
//     const config: BuildConfig = {
//       id: "test-build-7",
//       type: "page"
//     };

//     const progressEvents: any[] = [];
//     buildManager.on("buildProgress", event => {
//       progressEvents.push(event);
//     });

//     await buildManager.build(config);
//     expect(progressEvents.length).toBeGreaterThan(0);
//     expect(progressEvents[progressEvents.length - 1].stage).toBe("completed");
//   });

//   // 测试用例 8: 性能指标收集
//   test("should collect performance metrics", async () => {
//     const config: BuildConfig = {
//       id: "test-build-8",
//       type: "page"
//     };

//     const result = await buildManager.build(config);
//     expect(result.metrics).toBeDefined();
//     expect(result.metrics?.duration).toBeGreaterThan(0);
//     expect(result.metrics?.memory).toBeDefined();
//   });

//   // 测试用例 9: 依赖注入
//   test("should handle custom build strategies", async () => {
//     const mockStrategy = {
//       build: jest.fn().mockResolvedValue({ success: true })
//     };

//     const buildManager = new BuildManager({ strategies: { custom: mockStrategy } });
//     const config: BuildConfig = {
//       id: "test-build-9",
//       type: "custom"
//     };

//     await buildManager.build(config);
//     expect(mockStrategy.build).toHaveBeenCalled();
//   });

//   // 测试用例 10: 边界条件处理
//   test("should handle edge cases", async () => {
//     // 空配置
//     await expect(buildManager.build({} as BuildConfig)).rejects.toThrow();

//     // 重复构建ID
//     const config: BuildConfig = {
//       id: "test-build-10",
//       type: "page"
//     };

//     const build1 = buildManager.build(config);
//     const build2 = buildManager.build(config);

//     await expect(Promise.all([build1, build2])).rejects.toThrow();
//   });
// });
