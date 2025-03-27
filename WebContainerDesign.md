# WebContainer组件功能设计

## 1. 整体架构 (新设计)

WebContainer采用分层架构设计，将核心功能封装为可复用的服务层，与UI层分离，并通过明确定义的接口与Editor交互。

### 1.1 架构分层
- [x] **UI层** (已实现)
  - 终端界面
  - 预览窗口
  - 控制面板
- [x] **服务层** (部分实现)
  - 容器管理服务
  - 文件同步服务
  - 命令执行服务
  - 预览服务
- [x] **基础设施层** (已实现)
  - WebContainer API
  - 文件系统API
  - 终端协议

### 1.2 核心服务
- [x] **容器服务** (已实现)
  - 生命周期管理
  - 资源监控
  - 环境配置
- [x] **同步服务** (部分实现)
  - 双向文件同步
  - 冲突检测
  - 批量处理
- [x] **执行服务** (已实现)
  - 命令队列
  - 结果处理
  - 进程管理
- [x] **预览服务** (基本实现)
  - 实时刷新
  - 设备模拟
  - 调试工具

## 2. 详细功能设计

### 2.1 容器核心功能
- [x] **容器生命周期管理** (部分实现)
  - [x] 初始化WebContainer实例
  - [x] 启动/停止容器
  - [ ] 重启容器
  - [x] 基本错误处理
  - [ ] 高级恢复机制

- [ ] **环境配置** (未实现)
  - [ ] Node.js版本选择
  - [ ] NPM包管理
  - [ ] 环境变量设置
  - [ ] 容器资源限制

### 2.2 文件系统功能
- [ ] **文件基础操作** (未实现)
  - [ ] 创建文件/文件夹
  - [ ] 读取文件内容
  - [ ] 写入/更新文件
  - [ ] 删除文件/文件夹
  - [ ] 重命名文件/文件夹

- [ ] **文件管理功能** (未实现)
  - [ ] 文件树浏览
  - [ ] 文件搜索
  - [ ] 批量操作

- [x] **与编辑器同步** (部分实现)
  - [x] 将编辑器文件同步到WebContainer
  - [ ] 从WebContainer同步文件到编辑器
  - [ ] 自动同步设置
  - [ ] 冲突解决策略

### 2.3 终端功能
- [x] **命令执行** (部分实现)
  - [x] 执行Shell命令
  - [ ] 命令历史记录
  - [ ] 自动完成

- [ ] **进程管理** (未实现)
  - [ ] 前台/后台进程
  - [ ] 进程监控
  - [ ] 进程终止

### 2.4 预览功能
- [x] **实时预览** (基本实现)
  - [x] 自动刷新
  - [x] 手动刷新
  - [ ] 响应式视图

- [ ] **调试工具** (未实现)
  - [ ] 控制台日志
  - [ ] 网络请求监控
  - [ ] DOM检查

## 3. 核心Hook设计

### 3.1 容器Hook

#### useWebContainer
```typescript
// 创建和管理WebContainer实例
const {
  status,            // 容器状态(EMPTY|INITIALIZING|RUNNING|STOPPED|ERROR)
  previewUrl,        // 预览URL
  error,             // 错误信息
  isVisible,         // 是否可见
  isRunning,         // 是否运行中(派生状态)
  isInitializing,    // 是否初始化中(派生状态)
  isError,           // 是否错误状态(派生状态)
  isStopped,         // 是否已停止(派生状态)
  isEmpty,           // 是否空状态(派生状态)
  initialize,        // 初始化容器
  start,             // 启动容器
  stop,              // 停止容器
  reset,             // 重置容器状态
  toggleVisibility,  // 切换可见性
  setVisibility      // 设置可见性
} = useWebContainer();
```

#### useWebContainerEnvironment
```typescript
// 管理容器环境
const { 
  nodeVersion,       // 当前Node版本
  setNodeVersion,    // 设置Node版本
  environmentVars,   // 环境变量
  setEnvironmentVar, // 设置环境变量
  removeEnvironmentVar, // 移除环境变量
  resetEnvironment   // 重置环境
} = useWebContainerEnvironment(initialConfig);
```

### 3.2 文件系统Hook

#### useWebContainerFileSystem
```typescript
// WebContainer文件系统操作
const { 
  files,             // 文件树
  currentPath,       // 当前路径
  createFile,        // 创建文件
  readFile,          // 读取文件
  writeFile,         // 写入文件
  deleteFile,        // 删除文件
  createDirectory,   // 创建目录
  deleteDirectory,   // 删除目录
  rename,            // 重命名
  move,              // 移动
  copyFile,          // 复制文件
  listDirectory,     // 列出目录内容
  navigateTo,        // 导航到指定路径
  watchFile          // 监视文件变化
} = useWebContainerFileSystem();
```

#### useFileSync
```typescript
// 编辑器与WebContainer文件同步
const { 
  syncMode,          // 同步模式（手动/自动/双向）
  setSyncMode,       // 设置同步模式
  syncToContainer,   // 从编辑器同步到容器
  syncFromContainer, // 从容器同步到编辑器
  syncFile,          // 同步单个文件
  syncDirectory,     // 同步整个目录
  conflicts,         // 同步冲突
  resolveConflict,   // 解决冲突
  lastSyncTime       // 上次同步时间
} = useFileSync(editorFiles, containerFiles);
```

### 3.3 终端Hook

#### useTerminal
```typescript
// 终端操作
const {
  tabs,              // 终端标签列表
  activeTabId,       // 当前活动标签ID
  isExpanded,        // 终端是否展开
  isRunning,         // 容器是否运行中
  getActiveTab,      // 获取当前活动标签
  addTab,            // 添加新终端标签
  closeTab,          // 关闭终端标签
  switchTab,         // 切换终端标签
  executeCommand,    // 执行命令
  clearTerminal,     // 清空终端内容
  toggleExpanded,    // 切换展开/折叠状态
  setExpanded        // 设置展开状态
} = useTerminal();
```

### 3.4 预览Hook

#### usePreview
```typescript
// 预览功能
const {
  url,               // 预览URL
  viewMode,          // 预览模式（desktop/tablet/mobile）
  isLoading,         // 是否正在加载
  isRunning,         // 容器是否运行中
  refresh,           // 刷新预览
  updateUrl,         // 更新预览URL
  changeViewMode,    // 切换预览模式
  openInNewWindow,   // 在新窗口打开预览
  handleIframeLoad,  // 处理iframe加载完成
  getPreviewSize     // 获取预览尺寸
} = usePreview();
  previewWidth,      // 预览宽度
  previewHeight,     // 预览高度
  setPreviewSize,    // 设置预览尺寸
  logs,              // 控制台日志
  clearLogs,         // 清除日志
  devTools,          // 开发者工具
  toggleDevTools     // 切换开发者工具
} = usePreview(containerId);
```

## 4. 组件结构 (实际项目结构)

```
src/components/Editor/ui/WebContainer/
├── PreviewArea.tsx              # 预览区域组件(已实现)
├── TerminalArea.tsx             # 终端区域组件(已实现)
├── WebContainer.tsx             # 主容器组件(已实现)
├── ContainerControls.tsx        # 容器控制组件(部分实现)
├── SyncStatus.tsx               # 同步状态组件(部分实现)
└── atoms.ts                     # 状态管理(已实现)

src/components/Editor/webContainer/
├── usePreview.ts                # 预览功能Hook(已实现)
├── useTerminal.ts               # 终端功能Hook(已实现)
├── useWebContainer.ts           # 容器核心Hook(已实现)
└── types.ts                     # 类型定义(已实现)
```
│   │   ├── ContainerView.tsx    # 容器视图(已实现)
│   │   └── ContainerControls.tsx # 容器控制(已实现)
│   ├── Terminal/                # 终端UI
│   │   ├── TerminalView.tsx     # 终端视图(已实现)
│   │   └── TerminalTabs.tsx     # 终端标签(已实现)
│   ├── Preview/                 # 预览UI
│   │   ├── PreviewFrame.tsx     # 预览框架(已实现)
│   │   └── PreviewControls.tsx  # 预览控制(部分实现)
│   └── shared/                  # 共享UI
│       ├── Toolbar.tsx          # 工具栏(已实现)
│       └── StatusBar.tsx        # 状态栏(已实现)
└── hooks/                       # 自定义Hook
    ├── useContainer.ts          # 容器Hook(已实现)
    ├── useTerminal.ts           # 终端Hook(已实现)
    └── usePreview.ts            # 预览Hook(部分实现)
```

## 5. 数据流图 (分层架构)

```
┌─────────────────┐  用户交互  ┌─────────────────┐  状态变更  ┌─────────────────┐
│                 │ ─────────>│                 │ ─────────>│                 │
│    UI组件层      │           │    服务层        │           │   状态管理       │
│ (React组件)      │ <─────────│ (纯逻辑服务)     │ <─────────│ (Jotai状态)      │
└─────────────────┘  渲染更新  └─────────────────┘  数据更新  └─────────────────┘
       │                             │
       │                             │
       │                             ▼
       │                      ┌─────────────────┐
       │                      │                 │
       │       文件同步        │ WebContainer    │
       └──────────────────────│ 核心服务         │
                              │ (useWebContainer)│
                              └─────────────────┘
                                     │
                                     │ 状态更新
                                     ▼
                              ┌─────────────────┐
                              │                 │
                              │ 终端/预览       │
                              │ (集成服务)      │
                              └─────────────────┘
                              │ (iframe)        │
                              └─────────────────┘
```

## 6. Editor和WebContainer交互流程 (分层架构)

```
┌───────────────────────────────────────────────────────────────────────┐
│                    Editor与WebContainer交互流程 (分层架构)              │
└───────────────────────────────────────────────────────────────────────┘
┌─────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│         │     │                 │     │                 │     │                 │
│ 用户编辑 │────>│ UI层捕获输入    │────>│ 服务层处理变更  │────>│ 状态管理更新    │
│ 代码     │     │ (React组件)     │     │ (纯逻辑服务)    │     │ (Jotai状态)     │
└─────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                           │
                                                                           │ HTTP/WS
                                                                           ▼
                                                                   ┌─────────────────┐
                                                                   │                 │
                                                                   │ WebContainer    │
                                                                   │ 通信服务层       │
                                                                   └─────────────────┘
                                                                           │
                                                                           │
                                                                           ▼
                                                                   ┌─────────────────┐
                                                                   │                 │
                                                                   │ 执行代码        │
                                                                   │ (容器运行时)     │
                                                                   └─────────────────┘
                                                                           │
                                                                           │
                                                                           ▼
┌─────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│         │     │                 │     │                 │     │                 │
│ 用户查看 │<────│ 更新预览窗口    │<────│ 捕获执行结果    │<────│ 显示执行输出    │
│ 结果     │     │                 │     │                 │     │                 │
└─────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 7. 用户界面布局

```
┌─────────────────────────────────────────────────────────────────────────┐
│ WebContainer组件                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────────────────────────────────┐ │
│ │             │ │ 工具栏 (启动/停止/重启/同步)                       │ │
│ │             │ ├─────────────────────────────────────────────────────┤ │
│ │             │ │                                                     │ │
│ │             │ │                                                     │ │
│ │ 文件浏览器   │ │                                                     │ │
│ │             │ │                                                     │ │
│ │             │ │                                                     │ │
│ │             │ │               预览窗口                              │ │
│ │             │ │                                                     │ │
│ │             │ │                                                     │ │
│ │             │ │                                                     │ │
│ │             │ │                                                     │ │
│ ├─────────────┤ │                                                     │ │
│ │             │ ├─────────────────────────────────────────────────────┤ │
│ │ 容器控制     │ │                                                     │ │
│ │             │ │                                                     │ │
│ └─────────────┘ │                   终端                             │ │
│                 │                                                     │ │
│                 └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 8. Editor和WebContainer集成方案

### 8.1 通信接口

Editor和WebContainer之间需要定义明确的通信接口，包括：

1. **文件同步接口**
   - 从Editor到WebContainer的文件推送
   - 从WebContainer到Editor的文件拉取
   - 文件变更通知
   - 冲突处理策略

2. **命令执行接口**
   - 从Editor发送命令到WebContainer执行
   - 执行结果返回到Editor
   - 执行状态更新通知

3. **状态共享接口**
   - WebContainer状态通知
   - 文件系统状态同步
   - 运行环境信息共享

### 8.2 集成模式

1. **独立模式**
   - Editor和WebContainer完全分离
   - 通过明确的API进行通信
   - 各自维护自己的状态

2. **松耦合模式**
   - 共享部分状态
   - 保持独立的UI和生命周期
   - 可以独立操作

3. **紧耦合模式**
   - 深度集成
   - 共享大部分状态
   - UI协调一致

推荐使用**松耦合模式**，既保持组件的独立性，又提供良好的协作体验。

### 8.3 布局集成选项

1. **分屏布局**
   - Editor和WebContainer并排显示
   - 可调整分屏比例
   - 方便同时查看代码和结果

2. **标签式布局**
   - Editor和WebContainer在标签中切换
   - 节省屏幕空间
   - 适合小屏幕设备

3. **可拖拽面板布局**
   - 可自由排列的面板
   - 用户可以自定义布局
   - 支持拖拽调整大小

4. **弹出式预览**
   - WebContainer可以在单独窗口打开
   - 支持多显示器工作流
   - 全屏预览选项

## 9. 技术考量

1. **性能优化**
   - 延迟加载WebContainer
   - 文件变更批处理
   - 资源使用监控
   - 内存管理

2. **安全考量**
   - 容器沙箱限制
   - 代码执行限制
   - 网络访问控制
   - 资源使用限制

3. **可访问性**
   - 键盘导航支持
   - 屏幕阅读器兼容
   - 主题适配
   - 高对比度模式

4. **错误处理**
   - 容器崩溃恢复
   - 网络错误处理
   - 文件系统错误处理
   - 用户友好错误提示

## 10. 未来扩展计划

1. **协作功能**
   - 多用户同时编辑
   - 实时代码共享
   - 协作预览

2. **插件系统**
   - 插件支持
   - 自定义运行环境
   - 第三方工具集成

3. **更多预览模式**
   - 多设备同时预览
   - 交互式调试
   - 性能分析工具

## 11. 实现状态

| 功能模块 | 状态 | 备注 |
|---------|------|------|
| 容器核心 | ✅ 已实现 | 生命周期管理完整 |
| 文件系统 | ✅ 已实现 | 基础操作完整 |
| 终端功能 | ✅ 已实现 | 命令执行完整 |
| 预览功能 | ⚠️ 部分实现 | 基础预览已实现 |
| 调试工具 | ⏳ 规划中 | 需要更多开发资源 |
| 高级同步 | ⏳ 规划中 | 冲突解决等功能待实现 |
