// 定义事件处理函数的类型
export type EventHandler = (event: EventContext) => void;

// 事件上下文接口，包含事件相关的数据
export interface EventContext {
  // 事件名称
  eventName: string;
  // 事件触发的目标元素
  target: HTMLElement;
  // 事件附带的数据
  data?: any;
}

// 事件脚本接口
export interface EventScript {
  // 事件名称
  name: string;
  // 事件描述
  description?: string;
  // 事件版本
  version: string;
  // 事件处理函数
  handler: EventHandler;
}

/**
 * 现在有一个这样的前端场景，在一个react的按钮组件中，可以有一个下拉框可以选择这个组件点击后的事件处理函数
 * 这个事件处理函数我想单独使用一个库来加载。主项目是多仓库的模式，现在是我项目的一个子包，这个子包里可能有多个事件库，比如一个register事件脚本，一个login事件脚本
 * 当我点击按钮的时候，会触发register事件脚本的事件处理函数
 * 
 * 现在我的要求是
 * 1. 如何搭建这个子包的工程目录，他需要typescript编写，帮我设计每个脚本的开发规则，以及打包工具
 * 2. 当一个react组件选择这个库里的某个脚本的时候，我不希望打包到项目源码里，因为我是next的ssg渲染，我希望可以在index.html里引入这个脚本,因为这个库到时候也会发布到一个远程地址上
 * 3. 当项目ssg构建后，引入的脚本如何设计可以被按钮的点击触发，需要设计组件的加载规则，和脚本的暴露规则
 */