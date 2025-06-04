interface ScriptExecutionContext {
  window?: Window;
  document?: Document;
  event?: Event;
  element?: HTMLElement;
  // getAppStore?: () => AppStoreType;
}

export function executeUserScript(scriptContent: string, context: ScriptExecutionContext = {}): any {
  if (!scriptContent || typeof scriptContent !== "string") return;

  const argNames = Object.keys(context);
  const argValues = Object.values(context);

  try {
    const scriptFunction = new Function(...argNames, `'use strict';\n${scriptContent}`);
    return scriptFunction(...argValues);
  } catch (error) {
    console.error("用户脚本执行错误:", error, { scriptContent });
    return { error: (error as Error).message };
  }
}
