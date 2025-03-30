import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { terminalTabsAtom, activeTerminalTabIdAtom, terminalExpandedAtom } from "@core/webContainer/atoms";
import { webContainerStatusAtom } from "@core/webContainer/atoms";
import { WebContainerStatus, TerminalTab } from "@core/webContainer/types";
import { WebContainerService } from "@/core/webContainer/services/WebContainerService";

/**
 * 终端功能Hook
 *
 * 提供终端的状态管理和操作方法
 */
export const useTerminal = () => {
  // 状态管理
  const [tabs, setTabs] = useAtom(terminalTabsAtom);
  const [activeTabId, setActiveTabId] = useAtom(activeTerminalTabIdAtom);
  const [isExpanded, setIsExpanded] = useAtom(terminalExpandedAtom);
  const [containerStatus] = useAtom(webContainerStatusAtom);

  // WebContainerService实例引用
  const serviceRef = useRef<WebContainerService | null>(null);

  // 命令历史记录
  const commandHistoryRef = useRef<string[]>([]);
  const commandIndexRef = useRef<number>(-1);

  // 确保只创建一个服务实例
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = WebContainerService.getInstance();
    }
  }, []);

  // 监听WebContainer的终端输出
  useEffect(() => {
    if (containerStatus === WebContainerStatus.RUNNING && serviceRef.current) {
      const handleTerminalOutput = (output: string) => {
        // 添加输出到当前终端内容
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id === activeTabId) {
              return {
                ...tab,
                content: [...tab.content, output],
              };
            }
            return tab;
          })
        );
      };

      // 注册终端输出监听器
      serviceRef.current.onTerminalOutput(handleTerminalOutput);

      return () => {
        // 清理监听器
        if (serviceRef.current) {
          serviceRef.current.offTerminalOutput(handleTerminalOutput);
        }
      };
    }
  }, [containerStatus, activeTabId, setTabs]);

  /**
   * 获取当前活动的终端标签
   */
  const getActiveTab = useCallback(() => {
    return tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  /**
   * 添加新的终端标签
   */
  const addTab = useCallback(() => {
    const newTabId = `terminal-${Date.now()}`;
    const newTab: TerminalTab = {
      id: newTabId,
      name: `终端 ${tabs.length + 1}`,
      content: ["欢迎使用 WebContainer 终端！", "输入命令开始操作..."],
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);

    return newTabId;
  }, [tabs, setTabs, setActiveTabId]);

  /**
   * 关闭终端标签
   */
  const closeTab = useCallback(
    (tabId: string) => {
      // 如果只有一个标签，不允许关闭
      if (tabs.length <= 1) return false;

      const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(updatedTabs);

      // 如果关闭的是当前活动标签，则切换到第一个标签
      if (tabId === activeTabId) {
        setActiveTabId(updatedTabs[0].id);
      }

      return true;
    },
    [tabs, activeTabId, setTabs, setActiveTabId]
  );

  /**
   * 切换终端标签
   */
  const switchTab = useCallback(
    (tabId: string) => {
      if (tabs.some((tab) => tab.id === tabId)) {
        setActiveTabId(tabId);
        return true;
      }
      return false;
    },
    [tabs, setActiveTabId]
  );

  /**
   * 执行命令
   */
  const executeCommand = useCallback(
    async (command: string) => {
      if (!command.trim() || containerStatus !== WebContainerStatus.RUNNING) return false;

      // 添加命令到当前终端内容
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === activeTabId) {
            return {
              ...tab,
              content: [...tab.content, `$ ${command}`],
            };
          }
          return tab;
        })
      );

      // 添加命令到历史记录
      commandHistoryRef.current = [
        command,
        ...commandHistoryRef.current.slice(0, 49), // 最多保存50条历史记录
      ];
      commandIndexRef.current = -1;

      // 如果WebContainerService实例存在，执行命令
      if (serviceRef.current) {
        try {
          await serviceRef.current.executeCommand(command);
          return true;
        } catch (error) {
          // 添加错误信息到终端
          setTabs((prev) =>
            prev.map((tab) => {
              if (tab.id === activeTabId) {
                return {
                  ...tab,
                  content: [...tab.content, `错误: ${error instanceof Error ? error.message : String(error)}`],
                };
              }
              return tab;
            })
          );
          return false;
        }
      }

      return false;
    },
    [activeTabId, containerStatus, setTabs]
  );

  /**
   * 获取命令历史记录
   */
  const getCommandHistory = useCallback(() => {
    return commandHistoryRef.current;
  }, []);

  /**
   * 获取上一条命令
   */
  const getPreviousCommand = useCallback(() => {
    if (commandHistoryRef.current.length === 0) return "";

    const nextIndex = Math.min(commandIndexRef.current + 1, commandHistoryRef.current.length - 1);
    commandIndexRef.current = nextIndex;

    return commandHistoryRef.current[nextIndex];
  }, []);

  /**
   * 获取下一条命令
   */
  const getNextCommand = useCallback(() => {
    if (commandHistoryRef.current.length === 0 || commandIndexRef.current <= 0) {
      commandIndexRef.current = -1;
      return "";
    }

    const nextIndex = commandIndexRef.current - 1;
    commandIndexRef.current = nextIndex;

    return commandHistoryRef.current[nextIndex];
  }, []);

  /**
   * 清空终端内容
   */
  const clearTerminal = useCallback(() => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            content: ["终端已清空"],
          };
        }
        return tab;
      })
    );
  }, [activeTabId, setTabs]);

  /**
   * 切换终端展开/折叠状态
   */
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded]);

  /**
   * 添加终端输出
   */
  const addTerminalOutput = useCallback(
    (output: string) => {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === activeTabId) {
            return {
              ...tab,
              content: [...tab.content, output],
            };
          }
          return tab;
        })
      );
    },
    [activeTabId, setTabs]
  );

  return {
    tabs,
    activeTabId,
    isExpanded,
    isRunning: containerStatus === WebContainerStatus.RUNNING,
    getActiveTab,
    addTab,
    closeTab,
    switchTab,
    executeCommand,
    clearTerminal,
    toggleExpanded,
    setExpanded: setIsExpanded,
    getCommandHistory,
    getPreviousCommand,
    getNextCommand,
    addTerminalOutput,
  };
};
