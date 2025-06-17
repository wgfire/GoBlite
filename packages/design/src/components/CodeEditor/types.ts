import { Extension } from "@codemirror/state";

/**
 * API参数类型定义
 */
export interface ApiParamType {
  /**
   * 参数名称
   */
  name: string;
  /**
   * 参数类型
   */
  type: string;
  /**
   * 参数描述
   */
  description?: string;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 子参数，用于对象类型参数
   */
  children?: ApiParamType[];
  /**
   * 示例值
   */
  example?: string;
}

/**
 * API方法定义
 */
export interface ApiMethodType {
  /**
   * 方法名称
   */
  name: string;
  /**
   * 方法描述
   */
  description?: string;
  /**
   * 方法参数
   */
  params?: ApiParamType[];
  /**
   * 返回值类型
   */
  returnType?: string;
  /**
   * 返回值描述
   */
  returnDescription?: string;
  /**
   * 示例代码
   */
  example?: string;
}

/**
 * API对象定义
 */
export interface ApiObjectType {
  /**
   * 对象名称
   */
  name: string;
  /**
   * 对象描述
   */
  description?: string;
  /**
   * 对象方法
   */
  methods?: ApiMethodType[];
  /**
   * 对象属性
   */
  properties?: ApiParamType[];
}

/**
 * 自定义API定义
 */
export interface CustomApiType {
  /**
   * 全局对象
   */
  globals?: Record<string, any>;
  /**
   * API定义
   */
  apis?: ApiObjectType[];
}

/**
 * 支持的语言类型
 */
export type LanguageType = "javascript" | "css" | "html" | "json";

/**
 * 编辑器主题类型
 */
export type ThemeType = "light" | "dark";

/**
 * 代码编辑器属性
 */
export interface CodeEditorProps {
  /**
   * 初始代码内容
   */
  initialValue?: string;
  /**
   * 代码语言类型
   */
  language?: LanguageType;
  /**
   * 主题类型
   */
  theme?: ThemeType;
  /**
   * 是否只读
   */
  readOnly?: boolean;
  /**
   * 高度，可以是数字或CSS字符串
   */
  height?: string | number;
  /**
   * 代码内容变化回调
   */
  onChange?: (value: string) => void;
  /**
   * 额外的编辑器扩展
   */
  extensions?: Extension[];
  /**
   * 自定义全局对象
   */
  globals?: Record<string, any>;
  /**
   * 自定义API定义，用于代码提示
   */
  customApis?: CustomApiType;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 自动聚焦
   */
  autoFocus?: boolean;
}

/**
 * 编辑器弹窗属性
 */
export interface CodeEditorDialogProps {
  /**
   * 弹窗打开状态
   */
  open: boolean;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 弹窗关闭回调
   */
  onOpenChange: (open: boolean) => void;
  /**
   * 初始代码内容
   */
  initialValue?: string;
  /**
   * 代码语言类型
   */
  language?: LanguageType;
  /**
   * 主题类型
   */
  theme?: ThemeType;
  /**
   * 确认回调，返回编辑的代码内容
   */
  onConfirm?: (value: string) => void;
  /**
   * 取消回调
   */
  onCancel?: () => void;
  /**
   * 自定义全局对象，用于代码提示
   */
  globals?: Record<string, any>;
  /**
   * 自定义API定义，用于代码提示
   */
  customApis?: CustomApiType;
}
