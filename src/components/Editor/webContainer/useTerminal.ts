import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  terminalTabsAtom,
  activeTerminalTabIdAtom,
  terminalExpandedAtom,

} from './atoms';
import { webContainerStatusAtom } from './atoms';
import { WebContainerStatus, TerminalTab } from './types';

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

  /**
   * 获取当前活动的终端标签
   */
  const getActiveTab = useCallback(() => {
    return tabs.find(tab => tab.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  /**
   * 添加新的终端标签
   */
  const addTab = useCallback(() => {
    const newTabId = `terminal-${tabs.length + 1}`;
    const newTab: TerminalTab = {
      id: newTabId,
      name: `终端 ${tabs.length + 1}`,
      content: ['欢迎使用 WebContainer 终端！']
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);

    return newTabId;
  }, [tabs, setTabs, setActiveTabId]);

  /**
   * 关闭终端标签
   */
  const closeTab = useCallback((tabId: string) => {
    // 如果只有一个标签，不允许关闭
    if (tabs.length <= 1) return false;

    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);

    // 如果关闭的是当前活动标签，则切换到第一个标签
    if (tabId === activeTabId) {
      setActiveTabId(updatedTabs[0].id);
    }

    return true;
  }, [tabs, activeTabId, setTabs, setActiveTabId]);

  /**
   * 切换终端标签
   */
  const switchTab = useCallback((tabId: string) => {
    if (tabs.some(tab => tab.id === tabId)) {
      setActiveTabId(tabId);
      return true;
    }
    return false;
  }, [tabs, setActiveTabId]);

  /**
   * 执行命令
   */
  const executeCommand = useCallback((command: string) => {
    if (!command.trim() || containerStatus !== WebContainerStatus.RUNNING) return false;

    // 添加命令到当前终端内容
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          content: [
            ...tab.content,
            `$ ${command}`,
            // 模拟命令响应
            `执行命令: ${command}`,
            '命令已完成'
          ]
        };
      }
      return tab;
    }));

    return true;
  }, [activeTabId, containerStatus, setTabs]);

  /**
   * 清空终端内容
   */
  const clearTerminal = useCallback(() => {
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          content: ['终端已清空']
        };
      }
      return tab;
    }));
  }, [activeTabId, setTabs]);

  /**
   * 切换终端展开/折叠状态
   */
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, [setIsExpanded]);

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
    setExpanded: setIsExpanded
  };
};
