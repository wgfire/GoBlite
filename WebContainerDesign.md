# WebContainer组件功能设计

## 1. 整体架构

WebContainer组件将作为独立模块，与Editor组件并行存在，通过明确定义的接口进行交互。WebContainer负责代码的执行、预览和文件系统管理，提供一个完整的代码运行环境。

### 1.1 核心组件
- **WebContainer实例** - 基于@webcontainer/api创建的核心实例
- **虚拟文件系统** - 管理WebContainer内部的文件
- **终端界面** - 用于执行命令和查看输出
- **预览窗口** - 显示代码执行的结果
- **文件浏览器** - 展示和操作WebContainer内的文件

### 1.2 功能模块
- **容器控制面板** - 管理容器的启动、停止和重置
- **文件操作面板** - 提供文件的创建、编辑、删除等操作
- **终端控制台** - 交互式命令行界面
- **预览配置面板** - 控制预览的设置和模式
- **同步控制面板** - 管理编辑器与WebContainer之间的文件同步

## 2. 详细功能设计

### 2.1 容器核心功能
- **容器生命周期管理**
  - 初始化WebContainer实例
  - 启动/停止/重启容器
  - 监控容器状态
  - 错误处理和恢复机制

- **环境配置**
  - Node.js版本选择
  - NPM包管理
  - 环境变量设置
  - 容器资源限制

### 2.2 文件系统功能
- **文件基础操作**
  - 创建文件/文件夹
  - 读取文件内容
  - 写入/更新文件
  - 删除文件/文件夹
  - 重命名文件/文件夹

- **文件管理功能**
  - 文件树浏览
  - 文件搜索
  - 批量操作

- **与编辑器同步**
  - 将编辑器文件同步到WebContainer
  - 从WebContainer同步文件到编辑器
  - 自动同步设置
  - 冲突解决策略

### 2.3 终端功能
- **命令执行**
  - 执行Shell命令
  - 命令历史记录
  - 自动完成

- **进程管理**
  - 前台/后台进程
  - 进程监控
  - 进程终止

### 2.4 预览功能
- **实时预览**
  - 自动刷新
  - 手动刷新
  - 响应式视图

- **调试工具**
  - 控制台日志
  - 网络请求监控
  - DOM检查

## 3. 核心Hook设计

### 3.1 容器Hook

#### useWebContainer
```typescript
// 创建和管理WebContainer实例
const { 
  container,         // WebContainer实例
  status,            // 容器状态（初始化中、运行中、已停止、错误）
  initialize,        // 初始化容器
  start,             // 启动容器
  stop,              // 停止容器
  restart,           // 重启容器
  isReady,           // 容器是否准备就绪
  error              // 容器错误信息
} = useWebContainer(options);
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
  terminals,         // 终端列表
  activeTerminal,    // 当前活动终端
  createTerminal,    // 创建新终端
  closeTerminal,     // 关闭终端
  executeCommand,    // 执行命令
  commandHistory,    // 命令历史
  clearTerminal,     // 清空终端
  terminateProcess,  // 终止进程
  output,            // 终端输出
  input,             // 输入命令
  switchTerminal     // 切换终端
} = useTerminal(containerId);
```

### 3.4 预览Hook

#### usePreview
```typescript
// 预览功能
const { 
  previewUrl,        // 预览URL
  refreshPreview,    // 刷新预览
  previewMode,       // 预览模式（桌面/平板/手机）
  setPreviewMode,    // 设置预览模式
  previewWidth,      // 预览宽度
  previewHeight,     // 预览高度
  setPreviewSize,    // 设置预览尺寸
  logs,              // 控制台日志
  clearLogs,         // 清除日志
  devTools,          // 开发者工具
  toggleDevTools     // 切换开发者工具
} = usePreview(containerId);
```

## 4. 组件结构

```
WebContainer/
├── Core/
│   ├── WebContainerInstance.tsx     # 容器实例组件
│   ├── useWebContainer.ts           # 容器Hook
│   ├── ContainerControls.tsx        # 容器控制组件
│   └── WebContainerContext.tsx      # 容器上下文
├── FileSystem/
│   ├── FileExplorer.tsx             # 文件浏览器
│   ├── FileActions.tsx              # 文件操作组件
│   ├── useWebContainerFileSystem.ts # 文件系统Hook
│   └── FileSync.tsx                 # 文件同步组件
├── Terminal/
│   ├── Terminal.tsx                 # 终端组件
│   ├── TerminalTabs.tsx             # 终端标签页
│   ├── useTerminal.ts               # 终端Hook
│   └── CommandPalette.tsx           # 命令面板
├── Preview/
│   ├── PreviewFrame.tsx             # 预览框架
│   ├── PreviewControls.tsx          # 预览控制
│   ├── DevTools.tsx                 # 开发者工具
│   └── usePreview.ts                # 预览Hook
├── UI/
│   ├── Layout.tsx                   # 布局组件
│   ├── Sidebar.tsx                  # 侧边栏
│   ├── Toolbar.tsx                  # 工具栏
│   └── Notifications.tsx            # 通知组件
└── index.ts                         # 导出组件和Hook
```

## 5. 数据流图

```
┌─────────────────┐   文件同步   ┌───────────────┐   更新容器   ┌───────────────┐
│                 │ ──────────> │               │ ──────────> │               │
│   Editor组件    │              │  同步控制器    │              │ WebContainer  │
│                 │ <─────────── │               │ <─────────── │ 核心实例      │
└─────────────────┘   反向同步   └───────────────┘   状态更新   └───────────────┘
                                      │                             │
                                      │                             │
                                      ▼                             ▼
                                                          ┌─────────────────┐
                                                          │                 │
                                                          │ 虚拟文件系统    │
                                                          │                 │
                                                          └─────────────────┘
                                                                  │
                                                                  │
                         ┌───────────────┐                        │
                         │               │      文件操作           │
                         │  终端组件     │ <──────────────────────┘
                         │               │                        
                         └───────────────┘                        
                               │                                  
                               │                                  
                               ▼                                  
                        ┌───────────────┐                        
                        │               │                        
                        │  预览组件     │                        
                        │               │                        
                        └───────────────┘                        
```

## 6. Editor和WebContainer交互流程

```
┌───────────────────────────────────────────────────────────────────────┐
│                    Editor与WebContainer交互流程                        │
└───────────────────────────────────────────────────────────────────────┘
┌─────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│         │     │                 │     │                 │     │                 │
│ 用户编辑 │────>│ 文件保存到编辑器 │────>│ 触发文件同步    │────>│ 更新WebContainer │
│ 代码     │     │                 │     │                 │     │ 文件系统         │
└─────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                          │
                                                                          │
                                                                          ▼
                                                                  ┌─────────────────┐
                                                                  │                 │
                                                                  │ 自动执行代码    │
                                                                  │ (可选)          │
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
