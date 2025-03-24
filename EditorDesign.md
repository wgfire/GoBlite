# CodeMirror编辑器功能设计

## 1. 整体架构

CodeMirror编辑器将作为项目的核心组件，提供代码编辑和预览功能，并与WebContainer集成以实时运行代码。编辑器设计采用模块化架构，包含以下主要部分：

### 1.1 核心组件
- **编辑器核心** - 基于CodeMirror 6构建的编辑器实例
- **文件管理系统** - 处理文件的创建、打开、保存和删除
- **主题管理** - 提供多种编辑器主题和自定义选项
- **语言支持** - 针对不同编程语言的语法高亮和自动补全
- **WebContainer通信接口** - 用于与WebContainer组件交互

### 1.2 功能模块
- **菜单和工具栏** - 提供常用操作的快捷访问
- **文件树** - 显示项目文件结构
- **编辑区域** - 代码编辑的主要区域
- **状态栏** - 显示当前文件的状态和信息
- **同步控制区** - 管理与WebContainer的文件同步

## 2. 详细功能设计

### 2.1 编辑器核心功能
- **基础编辑功能**
  - 语法高亮
  - 行号显示
  - 代码折叠
  - 搜索和替换
  - 撤销和重做
  - 代码片段插入
  - 多光标编辑
  - 自动缩进
  - 括号匹配

- **实用编辑功能**
  - 基本代码自动补全
  - 语法错误提示
  - 代码格式化
  - 代码注释切换

### 2.2 文件管理功能
- **文件操作**
  - 新建文件/文件夹
  - 打开文件
  - 保存文件
  - 重命名文件
  - 删除文件
  - 导入/导出项目

- **文件切换**
  - 标签式文件切换
  - 最近文件列表
  - 文件搜索功能

### 2.3 主题和定制功能
- **主题选择**
  - 明亮/暗黑主题
  - 语法高亮主题
  - 自定义主题配置

- **界面定制**
  - 布局调整
  - 字体和字号设置
  - 缩进设置
  - 行高调整
  - 显示/隐藏元素

### 2.4 WebContainer集成功能
- **文件同步**
  - 将编辑器文件同步到WebContainer
  - 接收WebContainer文件变更通知
  - 配置自动同步选项
  
- **通信接口**
  - 发送命令到WebContainer
  - 接收执行结果
  - 状态监控和通知
  
- **同步控制**
  - 手动同步触发
  - 同步状态显示
  - 冲突解决界面

## 3. 核心Hook设计

### 3.1 编辑器Hook

#### useEditor
```typescript
// 创建和管理编辑器实例
const { 
  editor,            // 编辑器实例
  view,              // 编辑器视图
  getContent,        // 获取编辑器内容
  setContent,        // 设置编辑器内容
  focus,             // 聚焦编辑器
  refresh,           // 刷新编辑器
  undo,              // 撤销操作
  redo,              // 重做操作
  insertAtCursor,    // 在光标位置插入内容
  formatCode,        // 格式化代码
  toggleComment,     // 切换注释
  findAndReplace     // 查找和替换
} = useEditor(options);
```

#### useEditorTheme
```typescript
// 管理编辑器主题
const { 
  currentTheme,      // 当前主题
  availableThemes,   // 可用主题列表
  setTheme,          // 设置主题
  toggleDarkMode,    // 切换暗黑模式
  customizeTheme     // 自定义主题
} = useEditorTheme(initialTheme);
```

### 3.2 文件管理Hook

#### useFileSystem
```typescript
// 文件系统操作
const { 
  files,             // 文件列表
  currentFile,       // 当前文件
  createFile,        // 创建文件
  openFile,          // 打开文件
  saveFile,          // 保存文件
  renameFile,        // 重命名文件
  deleteFile,        // 删除文件
  createFolder,      // 创建文件夹
  importFiles,       // 导入文件
  exportFiles        // 导出文件
} = useFileSystem(initialFiles);
```

#### useFileTabs
```typescript
// 管理文件标签
const { 
  openTabs,          // 打开的标签
  activeTab,         // 当前活动标签
  openTab,           // 打开标签
  closeTab,          // 关闭标签
  switchTab,         // 切换标签
  reorderTabs        // 重新排序标签
} = useFileTabs();
```

### 3.3 WebContainer通信Hook

#### useWebContainerBridge
```typescript
// WebContainer通信接口
const { 
  isConnected,       // 连接状态
  connect,           // 建立连接
  disconnect,        // 断开连接
  syncFile,          // 同步单个文件到WebContainer
  syncAllFiles,      // 同步所有文件到WebContainer
  executeCommand,    // 发送命令到WebContainer
  commandResult,     // 命令执行结果
  containerStatus,   // WebContainer状态
  syncStatus,        // 同步状态
  lastSyncTime       // 上次同步时间
} = useWebContainerBridge();
```

#### useFileSynchronization
```typescript
// 文件同步管理
const { 
  syncMode,          // 同步模式（手动/自动）
  setSyncMode,       // 设置同步模式
  pendingChanges,    // 待同步的变更
  lastSynced,        // 最后同步的文件
  syncFile,          // 同步指定文件
  syncAll,           // 同步所有文件
  syncConflicts,     // 同步冲突
  resolveConflict    // 解决冲突
} = useFileSynchronization();
```

## 4. 组件结构

```
Editor/
├── core/
│   ├── EditorCore.tsx           # 核心编辑器组件
│   ├── useEditor.ts             # 编辑器Hook
│   ├── EditorCommands.ts        # 编辑器命令
│   └── EditorExtensions.ts      # 编辑器扩展
├── fileSystem/
│   ├── FileExplorer.tsx         # 文件浏览器
│   ├── FileTabs.tsx             # 文件标签
│   ├── useFileSystem.ts         # 文件系统Hook
│   └── useFileTabs.ts           # 文件标签Hook
├── theme/
│   ├── themeSelector.tsx        # 主题选择器
│   ├── useEditorTheme.ts        # 主题Hook
│   └── themes/                  # 主题配置
├── ui/
│   ├── toolbar.tsx              # 工具栏
│   ├── statusbar.tsx            # 状态栏
│   ├── sidebar.tsx              # 侧边栏
│   └── modals/                  # 模态框
├── webContainerBridge/
│   ├── SyncControl.tsx          # 同步控制组件
│   ├── CommandInterface.tsx     # 命令接口
│   ├── useWebContainerBridge.ts # WebContainer通信Hook
│   └── useFileSynchronization.ts # 文件同步Hook
└── index.ts                     # 导出组件和Hook
```

## 5. 数据流图

```
┌─────────────────┐  文件操作  ┌───────────────┐  更新编辑器  ┌────────────────┐
│                 │ ──────────>│               │ ────────────>│                │
│   文件系统模块   │            │  编辑器核心    │              │   编辑器视图    │
│                 │ <──────────│               │ <────────────│                │
└─────────────────┘  保存文件  └───────────────┘  用户输入    └────────────────┘
       ▲                             │                             
       │                             │                             
       │                             ▼                             
       │                      ┌───────────────┐                    
       │                      │               │                    
       │       文件同步        │ WebContainer  │                    
       └──────────────────────│ 通信接口      │                    
                              │               │                    
                              └───────────────┘                    
                                     │                             
                                     │                             
                                     ▼                             
                              ┌───────────────┐           
                              │               │  
                              │ WebContainer  │ 
                              │ 组件          │  
                              └───────────────┘           
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
