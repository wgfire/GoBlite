import { Resolver, SerializedNodes } from "@craftjs/core";

// --- 基础类型 ---
/**
 * 资源类型
 */
export type AssetType = "Image" | "PDF";
/**
 * 设备类型
 */
export type DeviceType = "mobile" | "tablet" | "desktop";
/**
 * 页面模板类型
 * 'static-download' 为特殊类型，代表静态下载模板，其他为字符串自定义类型
 */
export type PageTemplateType = "static-download" | string;

/**
 * 资源对象接口
 */
export interface Asset {
  /** 资源唯一标识 */
  id: string;
  /** 资源名称 */
  name: string;
  /** 资源URL */
  url: string;
  /** 资源类型 */
  type: AssetType;
}

/**
 * 特定设备和语言下的页面结构 (Schema)
 */
export interface DevicePageSchema {
  /** Craft.js 序列化后的节点数据或其字符串表示 */
  schema: SerializedNodes | string;
}

/**
 * 设备配置接口
 * 定义了一个特定设备类型、特定页面模板下的多语言页面集合
 */
export interface DeviceConfiguration {
  /** 设备配置唯一标识 */
  id: string;
  /** 设备类型 */
  deviceType: DeviceType;
  /** 页面模板类型 */
  pageTemplate: PageTemplateType;
  /** (可选) 此设备配置的名称，方便用户识别 */
  name?: string;
  /**
   * 语言页面映射表
   * 键为语言标识 (如 'zh', 'en')，值为该语言对应的页面结构
   */
  languagePageMap: {
    [languageKey: string]: DevicePageSchema;
  };
}

/**
 * 项目模板中的单个项
 */
export interface ProjectTemplateItem {
  /** 模板项唯一标识 */
  id: string;
  /** 模板项名称 */
  name: string;
  /** 此模板项包含的设备配置列表 */
  devices: DeviceConfiguration[];
}
/**
 * 项目模板组
 * 用于将不同类型的模板项分组
 */
export interface ProjectTemplateGroup {
  /** 模板组类型标识 */
  type: string;
  /** 模板组内的模板项列表 */
  list: ProjectTemplateItem[];
}

// --- State Slices ---

// UI Slice
/**
 * UI状态接口，管理编辑器界面相关的状态
 */
export interface UiState {
  /** 是否处于编辑模式 */
  isEditMode: boolean;
  /** 当前选择的设备类型 */
  currentDeviceType: DeviceType;
  /** 当前选择的页面模板类型 */
  currentPageTemplate: PageTemplateType;
  /** 当前选择的语言 */
  currentLanguage: string;
  /** 当前激活的Craft.js解析器 (Resolver) */
  activeResolver: Resolver;
  /** 侧边栏是否可见 */
  isSidebarVisible: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 通知列表 */
  notifications: Array<{ id: string; message: string; type: "success" | "error" | "info" }>;
}

/**
 * UI操作接口，定义了修改UI状态的方法
 */
export interface UiActions {
  /** 设置编辑模式 */
  setEditMode: (isEditing: boolean) => void;
  /** 设置当前视图 (设备、模板、语言) */
  setCurrentView: (params: { deviceType: DeviceType; pageTemplate: PageTemplateType; language: string }) => void;
  /** 切换侧边栏可见性 */
  toggleSidebar: () => void;
  /** 设置激活的Craft.js解析器 */
  setActiveResolver: (resolver: Resolver) => void;
  /** 添加通知 */
  addNotification: (notification: Omit<UiState["notifications"][0], "id">) => void;
  /** 移除通知 */
  removeNotification: (id: string) => void;
  /**
   * 初始化UI状态
   * 用于从 DesignProvider 的初始属性设置UI相关的初始状态
   */
  initializeUiState: (initialProps: {
    publish?: boolean;
    resolver?: Resolver;
    showSidebar?: boolean;
    currentInfo?: {
      device: DeviceType;
      pageTemplate: PageTemplateType;
      language: string;
    };
  }) => void;
}

// Project Slice
/**
 * 项目状态接口，管理核心项目数据
 */
export interface ProjectState {
  /** (可选) 项目名称 */
  projectName?: string;
  /**
   * 设备配置列表
   * 这是项目页面数据的核心，每个元素代表一种设备/模板组合下的多语言页面
   */
  deviceConfigurations: DeviceConfiguration[];
  /** 项目资源列表 (如图片、PDF等) */
  assets: Asset[];
  /** 项目可用模板列表 */
  templates: ProjectTemplateGroup[];
  /** 项目元数据，用于存储其他自定义信息 */
  metadata: { [key: string]: unknown };
}

/**
 * 项目操作接口，定义了修改项目状态的方法
 */
export interface ProjectActions {
  /** 更新特定设备、模板、语言下的页面Schema */
  updatePageSchema: (params: {
    deviceType: DeviceType;
    pageTemplate: PageTemplateType;
    language: string;
    newSchema: SerializedNodes | string;
  }) => void;
  /** 添加新的设备配置 */
  addDeviceConfiguration: (config: Omit<DeviceConfiguration, "id">) => DeviceConfiguration;
  /** 移除设备配置 */
  removeDeviceConfiguration: (configId: string) => void;
  /** 更新现有设备配置 */
  updateDeviceConfiguration: (config: Partial<DeviceConfiguration> & { id: string }) => void;
  /** 添加资源 */
  addAsset: (asset: Omit<Asset, "id">) => Asset;
  /** 移除资源 */
  removeAsset: (assetId: string) => void;
  /** 更新项目名称 */
  updateProjectName: (name: string) => void;
  /** 更新项目元数据 */
  updateMetadata: (metadata: { [key: string]: unknown }) => void;
  /**
   * 初始化项目状态
   * 用于从 DesignProvider 的初始属性设置项目相关的初始状态
   */
  initializeProjectState: (initialProps: {
    device?: DeviceConfiguration[];
    assets?: Asset[];
    templates?: ProjectTemplateGroup[];
    metadata?: { [key: string]: unknown };
  }) => void;
}

// EditorSettings Slice
/**
 * 编辑器设置状态接口
 */
export interface EditorSettingsState {
  /** (可选) 自定义渲染包装器组件，用于包裹Craft.js的渲染输出 */
  customRenderWrapper?: React.ComponentType<{ render: React.ReactElement }>;
  /** 是否同步响应式更改 (例如，在一个设备上修改组件属性，是否自动应用到其他设备) */
  syncResponsiveChanges: boolean;
}

/**
 * 编辑器设置操作接口
 */
export interface EditorSettingsActions {
  /** 设置自定义渲染包装器 */
  setCustomRenderWrapper: (wrapper?: EditorSettingsState["customRenderWrapper"]) => void;
  /** 设置是否同步响应式更改 */
  setSyncResponsiveChanges: (sync: boolean) => void;
  /**
   * 初始化编辑器设置状态
   * 用于从 DesignProvider 的初始属性设置编辑器相关的初始状态
   */
  initializeEditorSettingsState: (initialProps: {
    onRender?: React.ComponentType<{ render: React.ReactElement }>;
    syncResponse?: boolean;
  }) => void;
}

// Custom Code/Events Slice (New, for managing user scripts and predefined events)
/**
 * 自定义代码脚本接口
 */
export interface CustomCodeScript {
  /** 脚本唯一标识 */
  id: string;
  /** 脚本名称 */
  name: string;
  /** 脚本内容 (JavaScript代码字符串) */
  content: string;
  /** (未来扩展) 定义此脚本可用的上下文变量列表 */
  // contextAvailable?: ('window' | 'document' | 'element' | 'event' | 'getComponentProps' | 'getStoreState')[];
}

/**
 * 页面生命周期脚本接口
 * 用于在页面加载或卸载时执行脚本
 */
export interface PageLifecycleScript {
  /** 页面ID或 'global' (表示全局，适用于所有页面) */
  pageIdOrGlobal: string;
  /** 生命周期事件类型: 'onPageLoad' (页面加载时) 或 'onPageUnload' (页面卸载时) */
  lifecycleEvent: "onPageLoad" | "onPageUnload";
  /** 要执行的 CustomCodeScript 的ID */
  scriptId: string;
}

/**
 * 自定义代码和事件状态接口
 */
export interface CustomCodeState {
  /** 存储所有自定义脚本 */
  scripts: CustomCodeScript[];
  /** 存储所有页面生命周期脚本的关联 */
  pageLifecycleScripts: PageLifecycleScript[];
}

// History Slice
/**
 * 历史记录状态接口 (用于撤销/重做)
 */
export interface HistoryState {
  /** 过去的快照列表 (项目核心数据的部分快照) */
  past: Partial<Pick<ProjectState, "deviceConfigurations" | "assets" | "metadata" | "projectName">>[];
  /** 未来的快照列表 (用于重做) */
  future: Partial<Pick<ProjectState, "deviceConfigurations" | "assets" | "metadata" | "projectName">>[];
  /** (可选) 最大历史记录长度 */
  maxHistoryLength?: number;
}
/**
 * 历史记录操作接口
 */
export interface HistoryActions {
  /** 撤销操作 */
  undo: () => void;
  /** 重做操作 */
  redo: () => void;
  /** 清空历史记录 */
  clearHistory: () => void;
  // addSnapshot 通常是内部操作，由其他改变状态的action触发
}

/**
 * 完整的Zustand Store类型，组合了所有State和Actions接口
 */
export type FullStore = UiState &
  UiActions &
  ProjectState &
  ProjectActions &
  EditorSettingsState &
  EditorSettingsActions &
  HistoryState &
  HistoryActions;
