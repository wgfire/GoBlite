# Build System

构建系统用于生成邮件模板、活动页面和落地页。

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 启动服务

```bash
npm start
```

## API 使用说明

### 1. 获取可用构建类型

```bash
GET /api/build/types
```

返回:
```json
{
  "types": ["email", "activity", "landing"]
}
```

### 2. 开始构建

```bash
POST /api/build
```

请求体:
```json
{
  "id": "build-123",
  "type": "email",
  "nextConfig": {
    // Next.js配置
  },
  "assets": {
    "scripts": ["https://example.com/script.js"],
    "styles": ["https://example.com/style.css"]
  },
  "optimization": {
    "minify": true,
    "compress": true,
    "splitChunks": true,
    "keepWorkingDir": false
  }
}
```

### 3. 获取构建进度

```bash
GET /api/build/:id/progress
```

返回:
```json
{
  "progress": {
    "buildId": "build-123",
    "stage": "building",
    "progress": 60,
    "message": "Running Next.js build"
  },
  "metrics": {
    "startTime": 1629123456789,
    "endTime": 1629123456999,
    "duration": 210,
    "memory": {
      "heapUsed": 1000000,
      "heapTotal": 2000000,
      "external": 500000
    },
    "cpu": {
      "user": 100,
      "system": 50
    }
  },
  "duration": 210
}
```

### 4. 获取构建日志

```bash
GET /api/build/:id/logs
```

### 5. 取消构建

```bash
POST /api/build/:id/cancel
```

### 6. 清理构建

```bash
DELETE /api/build/:id
```

## 构建类型说明

### Email 模板
- 移除外部JS和CSS
- 内联样式
- 优化邮件兼容性

### 活动页面
- 注入跟踪脚本
- 添加分析代码
- 优化加载性能

### 落地页
- SEO优化
- 转化跟踪
- 主题样式注入

## 开发说明

### 目录结构
```
src/
  ├── types/          # 类型定义
  ├── strategies/     # 构建策略
  ├── post-build/     # 后处理策略
  ├── monitoring/     # 监控和日志
  └── server.ts       # API服务器
```

### 添加新的构建类型

1. 在 `types/index.ts` 中添加新的类型定义
2. 在 `post-build/` 中创建新的后处理策略
3. 在 `post-build-manager.ts` 中注册新策略
4. 更新 API 文档 

## TODO

### 架构改进
- [ ] 引入依赖注入，提高可测试性和扩展性
- [ ] 增加事件系统，支持构建生命周期钩子
- [ ] 添加插件系统，支持功能扩展

### 功能完善
- [ ] 支持增量构建
- [ ] 添加构建预热
- [ ] 支持构建回滚
- [ ] 添加构建报告生成

### 性能优化
- [ ] 实现并行构建
- [ ] 优化缓存策略
- [ ] 添加资源复用机制

### 可靠性提升
- [ ] 完善错误处理
- [ ] 添加自动重试机制
- [ ] 实现构建超时控制

### 监控和告警
- [ ] 添加性能指标收集
- [ ] 实现构建状态监控
- [ ] 集成告警系统

### 测试和文档
- [ ] 补充单元测试
- [ ] 添加集成测试
- [ ] 完善API文档
- [ ] 添加使用示例