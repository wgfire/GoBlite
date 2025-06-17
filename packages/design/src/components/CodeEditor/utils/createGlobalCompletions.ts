import { ApiMethodType, ApiParamType, CustomApiType } from "../types";
import { CompletionContext, CompletionResult, Completion } from "@codemirror/autocomplete";
/**
 * 生成参数字符串
 */
const generateParamsString = (params: ApiParamType[] = []): string => {
  if (params.length === 0) return "";

  return params
    .map(param => {
      if (param.children && param.children.length > 0) {
        // 对象类型参数
        const childrenStr = generateParamsString(param.children);
        return `${param.name}${param.required ? "" : "?"}: { ${childrenStr} }`;
      }
      return `${param.name}${param.required ? "" : "?"}: ${param.type}`;
    })
    .join(", ");
};

/**
 * 生成方法提示信息
 */
const generateMethodInfo = (method: ApiMethodType): string => {
  let info = method.description || "";

  // 添加参数信息
  if (method.params && method.params.length > 0) {
    info += "\n\n参数:";
    method.params.forEach(param => {
      info += `\n  ${param.name}${param.required ? " (必填)" : ""}: ${param.type}`;
      if (param.description) info += ` - ${param.description}`;

      // 处理子参数
      if (param.children && param.children.length > 0) {
        param.children.forEach(child => {
          info += `\n    ${child.name}${child.required ? " (必填)" : ""}: ${child.type}`;
          if (child.description) info += ` - ${child.description}`;
        });
      }
    });
  }

  // 添加返回值信息
  if (method.returnType) {
    info += `\n\n返回值: ${method.returnType}`;
    if (method.returnDescription) info += ` - ${method.returnDescription}`;
  }

  // 添加示例代码
  if (method.example) {
    info += `\n\n示例:\n${method.example}`;
  }

  return info;
};

/**
 * 创建全局对象自动完成提供器
 */
export const createGlobalCompletions = (globals: Record<string, any> = {}, customApis?: CustomApiType) => {
  return (context: CompletionContext): CompletionResult | null => {
    // 获取当前光标前的文本
    const { state, pos } = context;
    const line = state.doc.lineAt(pos);
    const lineStart = line.from;
    const textBefore = line.text.slice(0, pos - lineStart);

    // 检查是否正在输入全局对象属性
    const dotMatch = /(?:window|document|global)\.([\w]*)$/.exec(textBefore);
    const funcMatch = /(?:window|document|global)\.([\w]+)\(([^)]*)$/.exec(textBefore);

    if (!dotMatch && !funcMatch) return null;

    const matchObj = dotMatch || funcMatch;
    if (!matchObj) return null;

    const prefix = matchObj[0].split(".")[0]; // window, document, global 等
    const objToComplete =
      prefix === "window" ? globals : prefix === "document" ? document : prefix === "global" ? globals : null;

    if (!objToComplete) return null;

    // 如果是函数调用，提供参数提示
    if (funcMatch) {
      const funcName = funcMatch[1];

      // 查找自定义API定义
      if (customApis?.apis) {
        for (const api of customApis.apis) {
          if (api.name === prefix) {
            const method = api.methods?.find(m => m.name === funcName);
            if (method && method.params) {
              // 创建参数提示
              const options: Completion[] = [];

              // 如果只有一个参数且是对象类型，提供对象字面量格式
              if (method.params.length === 1 && method.params[0].children && method.params[0].children.length > 0) {
                const param = method.params[0];
                const children = param.children || [];
                const childrenStr = children
                  .map(p => `${p.name}: ${p.type === "string" ? "" : p.type === "number" ? "0" : "{}"}`)
                  .join(", ");
                options.push({
                  label: `{ ${generateParamsString(children)} }`,
                  type: "snippet",
                  detail: param.description || param.type,
                  info: generateMethodInfo(method),
                  apply: `{ ${childrenStr} }`
                });
              } else {
                // 多参数情况
                method.params.forEach(param => {
                  options.push({
                    label: param.name,
                    type: "variable",
                    detail: param.type,
                    info: param.description,
                    apply: param.name + (param.type === "string" ? "''" : param.type === "number" ? "0" : "{}")
                  });
                });
              }

              return {
                from: pos,
                options,
                validFor: /^[\w\s,{}:"']*$/
              };
            }
          }
        }
      }

      // 默认行为
      return null;
    }

    // 常规属性提示
    const options: Completion[] = [];

    // 添加标准全局对象属性
    Object.keys(objToComplete).forEach(key => {
      options.push({
        label: key,
        type: typeof objToComplete[key as keyof typeof objToComplete] === "function" ? "function" : "variable",
        detail: typeof objToComplete[key as keyof typeof objToComplete],
        apply: key
      });
    });

    // 添加自定义API
    if (customApis?.apis) {
      for (const api of customApis.apis) {
        if (api.name === prefix) {
          // 添加方法
          if (api.methods) {
            api.methods.forEach(method => {
              let paramsStr = "";
              if (method.params && method.params.length > 0) {
                paramsStr = generateParamsString(method.params);
              }

              options.push({
                label: method.name,
                type: "function",
                detail: `(${paramsStr}) => ${method.returnType || "void"}`,
                info: generateMethodInfo(method),
                apply: `${method.name}()`
              });
            });
          }

          // 添加属性
          if (api.properties) {
            api.properties.forEach(prop => {
              // 生成属性信息，包含描述和示例值
              let propInfo = prop.description || "";
              if (prop.example) {
                propInfo += propInfo ? "\n\n示例值: " + prop.example : "示例值: " + prop.example;
              }

              options.push({
                label: prop.name,
                type: "variable",
                detail: prop.type,
                info: propInfo,
                apply: prop.name
              });
            });
          }
        }
      }
    }

    return {
      from: pos - (dotMatch ? dotMatch[1]?.length || 0 : 0),
      options,
      validFor: /^[\w]*$/
    };
  };
};
