# CodeMirror编辑器功能设计

## 1. 整体架构 (新设计)

编辑器采用分层架构设计，将核心逻辑与UI分离，并通过服务层与WebContainer交互：

### 1.1 架构分层
- [x] **UI层** (已实现)
  - 编辑器界面
  - 文件浏览器
  - 状态显示
- [x] **服务层** (部分实现)
  - 编辑器核心服务
  - 文件管理服务
  - WebContainer通信服务
- [x] **基础设施层** (已实现)
  - CodeMirror 6
  - WebContainer API
  - 文件系统API

### 1.2 核心服务
- [x] **编辑器服务** (已实现)
  - 代码编辑
  - 语法分析
  - 扩展管理
- [x] **文件服务** (已实现)
  - 文件操作
  - 版本管理
  - 同步控制
- [x] **容器服务** (部分实现)
  - 生命周期管理
  - 命令执行
  - 状态同步

## 2. 详细功能设计

### 2.1 编辑器核心功能
- [x] **基础编辑功能** (基本实现)
  - [x] 语法高亮
  - [x] 行号显示
  - [x] 代码折叠
  - [x] 搜索和替换
  - [x] 撤销和重做
  - [ ] 代码片段插入
  - [ ] 多光标编辑
  - [x] 自动缩进
  - [x] 括号匹配

- [x] **实用编辑功能** (部分实现)
  - [x] 基本代码自动补全
  - [x] 语法错误提示
  - [ ] 代码格式化
  - [x] 代码注释切换

### 2.2 文件管理功能
- [x] **文件操作** (基本实现)
  - [x] 新建文件/文件夹
  - [x] 打开文件
  - [x] 保存文件
  - [x] 重命名文件
  - [x] 删除文件
  - [ ] 导入/导出项目

- [x] **文件切换** (已实现)
  - [x] 标签式文件切换
  - [x] 最近文件列表
  - [x] 文件搜索功能

### 2.3 主题和定制功能
- [x] **主题选择** (部分实现)
  - [x] 明亮/暗黑主题
  - [x] 语法高亮主题
  - [ ] 自定义主题配置

- [ ] **界面定制** (规划中)
  - [ ] 布局调整
  - [ ] 字体和字号设置
  - [ ] 缩进设置
  - [ ] 行高调整
  - [ ] 显示/隐藏元素

### 2.4 WebContainer集成功能
- [x] **文件同步** (部分实现)
  - [x] 将编辑器文件同步到WebContainer
  - [x] 接收WebContainer文件变更通知
  - [x] 配置自动同步选项
  - [ ] 冲突解决策略
  
- [x] **通信接口** (基本实现)
  - [x] 发送命令到WebContainer
  - [x] 接收执行结果
  - [x] 状态监控和通知
  
- [x] **同步控制** (部分实现)
  - [x] 手动同步触发
  - [x] 同步状态显示
  - [ ] 冲突解决界面

## 3. 核心Hook设计

### 3.1 编辑器Hook

#### useEditor [x] (基本实现)
```typescript
// 创建和管理编辑器实例
const {
  editor,            // [x] 编辑器实例
  view,              // [x] 编辑器视图
  getContent,        // [x] 获取编辑器内容
  setContent,        // [x] 设置编辑器内容
  focus,             // [x] 聚焦编辑器
  refresh,           // [x] 刷新编辑器
  undo,              // [x] 撤销操作
  redo,              // [x] 重做操作
  insertAtCursor,    // [ ] 在光标位置插入内容
  formatCode,        // [ ] 格式化代码
  toggleComment,     // [x] 切换注释
  findAndReplace     // [x] 查找和替换
} = useEditor(options);
```

#### useEditorTheme [x] (部分实现)
```typescript
// 管理编辑器主题
const {
  currentTheme,      // [x] 当前主题
  availableThemes,   // [x] 可用主题列表
  setTheme,          // [x] 设置主题
  toggleDarkMode,    // [x] 切换暗黑模式
  customizeTheme     // [ ] 自定义主题
} = useEditorTheme(initialTheme);
```

### 3.2 文件管理Hook

#### useFileSystem [x] (基本实现)
```typescript
// 文件系统操作
const {
  files,             // [x] 文件列表
  currentFile,       // [x] 当前文件
  createFile,        // [x] 创建文件
  openFile,          // [x] 打开文件
  saveFile,          // [x] 保存文件
  renameFile,        // [x] 重命名文件
  deleteFile,        // [x] 删除文件
  createFolder,      // [x] 创建文件夹
  importFiles,       // [ ] 导入文件
  exportFiles        // [ ] 导出文件
} = useFileSystem(initialFiles);
```

#### useFileTabs [x] (基本实现)
```typescript
// 管理文件标签
const {
  openTabs,          // [x] 打开的标签
  activeTab,         // [x] 当前活动标签
  openTab,           // [x] 打开标签
  closeTab,          // [x] 关闭标签
  switchTab,         // [x] 切换标签
  reorderTabs        // [x] 重新排序标签
} = useFileTabs();
```

### 3.3 WebContainer通信Hook

#### useWebContainerBridge [x] (部分实现)
```typescript
// WebContainer通信接口
const {
  isConnected,       // [x] 连接状态
  connect,           // [x] 建立连接
  disconnect,        // [x] 断开连接
  syncFile,          // [x] 同步单个文件到WebContainer
  syncAllFiles,      // [x] 同步所有文件到WebContainer
  executeCommand,    // [x] 发送命令到WebContainer
  commandResult,     // [x] 命令执行结果
  containerStatus,   // [x] WebContainer状态
  syncStatus,        // [ ] 同步状态
  lastSyncTime       // [ ] 上次同步时间
} = useWebContainerBridge();
```

#### useFileSynchronization [x] (部分实现)
```typescript
// 文件同步管理
const {
  syncMode,          // [x] 同步模式（手动/自动）
  setSyncMode,       // [x] 设置同步模式
  pendingChanges,    // [x] 待同步的变更
  lastSynced,        // [x] 最后同步的文件
  syncFile,          // [x] 同步指定文件
  syncAll,           // [x] 同步所有文件
  syncConflicts,     // [ ] 同步冲突
  resolveConflict    // [ ] 解决冲突
} = useFileSynchronization();
```

## 4. 组件结构 (实际项目结构)

```
src/components/Editor/
├── core/                       # 核心编辑器逻辑(已实现)
│   └── useEditor.ts            # 编辑器核心Hook
├── fileSystem/                 # 文件系统相关(已实现)
│   ├── atoms.ts                # 文件系统状态管理
│   ├── FileExplorer.tsx        # 文件浏览器组件
│   ├── FileTabs.tsx            # 文件标签组件
│   ├── useFileSystem.ts        # 文件系统Hook
│   └── types.ts                # 类型定义
├── webContainer/               # WebContainer集成(部分实现)
│   ├── atoms.ts                # WebContainer状态管理
│   ├── usePreview.ts           # 预览功能Hook
│   ├── useTerminal.ts          # 终端功能Hook
│   ├── useWebContainer.ts      # WebContainer核心Hook
│   └── types.ts                # 类型定义
├── ui/                         # 所有UI组件(已实现)
│   ├── FileTabs/               # 文件标签相关UI
│   ├── Layout/                 # 布局组件
│   ├── Sidebar/                # 侧边栏组件
│   ├── StatusBar/              # 状态栏组件
│   ├── Toolbar/                # 工具栏组件
│   └── WebContainer/           # WebContainer相关UI
│       ├── PreviewArea.tsx     # 预览区域
│       ├── TerminalArea.tsx    # 终端区域
│       └── WebContainer.tsx    # 主容器组件
├── style/                      # 样式文件(已实现)
│   ├── editor.css              # 编辑器基础样式
│   └── syntax.css              # 语法高亮样式
└── index.tsx                   # 入口文件
```

## 5. 数据流图 (完整架构)

```
┌─────────────────┐  用户交互  ┌─────────────────┐  状态变更  ┌─────────────────┐
│                 │ ─────────>│                 │ ─────────>│                 │
│    UI组件层      │           │    服务层        │           │   状态管理       │
│ (React组件)      │ <─────────│ (纯逻辑服务)     │ <─────────│ (Jotai状态)      │
└─────────────────┘  渲染更新  └─────────────────┘  数据更新  └─────────────────┘
        │                                                         ▲
        │                                                         │
        │ 文件同步/命令执行                                       │ 状态同步
        ▼                                                         │
┌─────────────────┐                                     ┌─────────────────┐
│                 │                                     │                 │
│ WebContainer    │ ◄───────────────────────────────────┤ 文件系统状态    │
│ 实例            │                                     │ (Jotai原子)      │
└─────────────────┘                                     └─────────────────┘
```
       │                             │
       │                             │
       │                             ▼
       │                      ┌─────────────────┐
       │                      │                 │
       │       文件同步        │ WebContainer    │
       └──────────────────────│ 通信服务层       │
                              │ (API代理)        │
                              └─────────────────┘
                                     │
                                     │ HTTP/WS
                                     ▼
                              ┌─────────────────┐
                              │                 │
                              │ WebContainer    │
                              │ 运行时实例       │
                              └─────────────────┘
```

## 6. 流程图

```
┌───────────────────────────────────────────────────────────────────────┐
│                           编辑器启动流程                               │
└───────────────────────────────────────────────────────────────────────┘
┌─────────┐     ┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│         │     │             │     │               │     │             │
│ 初始化   │────>│ 加载文件系统 │────>│ 创建编辑器实例 │────>│ 启动WebCont │
│         │     │             │     │               │     │ ainer       │
└─────────┘     └─────────────┘     └───────────────┘     └─────────────┘
                                                                │
┌─────────────┐     ┌─────────────┐     ┌───────────────┐      │
│             │     │             │     │               │      │
│ 编辑开始    │<────│ 加载默认文件 │<────│ 渲染UI组件    │<─────┘
│             │     │             │     │               │      
└─────────────┘     └─────────────┘     └───────────────┘     

┌───────────────────────────────────────────────────────────────────────┐
│                           文件操作流程                                 │
└───────────────────────────────────────────────────────────────────────┘
┌─────────┐     ┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│         │     │             │     │               │     │             │
│ 选择文件 │────>│ 读取文件内容 │────>│ 更新编辑器内容 │────>│ 应用语法高亮 │
│ 操作     │     │             │     │               │     │             │
└─────────┘     └─────────────┘     └───────────────┘     └─────────────┘
                                                                │
┌─────────────┐     ┌─────────────┐     ┌───────────────┐      │
│             │     │             │     │               │      │
│ 更新文件标签 │<────│ 记录文件历史 │<────│ 更新编辑器状态 │<─────┘
│             │     │             │     │               │      
└─────────────┘     └─────────────┘     └───────────────┘     
```

## 7. 依赖项

### CodeMirror核心
- @codemirror/basic-setup - 基础设置
- @codemirror/commands - 编辑器命令
- @codemirror/language - 语言支持基础
- @codemirror/state - 编辑器状态管理
- @codemirror/view - 编辑器视图
- @codemirror/search - 搜索功能
- @lezer/highlight - 语法高亮

### 语言支持
- @codemirror/lang-javascript - JavaScript/TypeScript支持
- @codemirror/lang-html - HTML支持
- @codemirror/lang-css - CSS支持
- @codemirror/lang-json - JSON支持
- @codemirror/lang-markdown - Markdown支持
- @codemirror/lang-python - Python支持

### 其他依赖
- jotai - 状态管理
- framer-motion - 动画效果
- clsx - 条件CSS类管理

## 8. 未来扩展计划

1. **插件系统** - 允许通过插件扩展编辑器功能
2. **高级编辑功能** - 跳转到定义、查找引用、代码大纲视图等
3. **协作编辑** - 支持多用户同时编辑同一文件

## 9. 实现状态

| 功能模块 | 状态 | 备注 |
|---------|------|------|
| 基础编辑 | ✅ 已实现 | 核心功能完整 |
| 文件管理 | ✅ 已实现 | 基础功能完整 |
| WebContainer集成 | ⚠️ 部分实现 | 文件同步和基础通信已实现 |
| 主题管理 | ⏳ 规划中 | 预计下个版本实现 |
| 高级编辑功能 | ⏳ 规划中 | 需要更多开发资源 |
