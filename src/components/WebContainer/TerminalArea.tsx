import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronUp, FiChevronDown, FiPlus, FiTerminal, FiTrash2 } from 'react-icons/fi';
import { useTerminal } from '@core/webContainer';
import { TerminalAreaProps } from './types';
import './TerminalArea.css';

export const TerminalArea: React.FC<TerminalAreaProps> = ({ 
  isExpanded = true, 
  onToggle,
  isRunning = false
}) => {
  const {
    tabs,
    activeTabId,
    getActiveTab,
    addTab,
    closeTab,
    switchTab,
    executeCommand,
    clearTerminal,
    toggleExpanded,
    getPreviousCommand,
    getNextCommand
  } = useTerminal();
  
  const [commandInput, setCommandInput] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [tabs]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isExpanded && inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isExpanded, isProcessing]);

  // 处理命令输入变化
  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandInput(e.target.value);
  };

  // 处理键盘事件（上下箭头浏览历史命令）
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      // 获取上一条命令
      const prevCommand = getPreviousCommand();
      if (prevCommand) {
        setCommandInput(prevCommand);
        // 将光标移到末尾
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.value.length;
            inputRef.current.selectionEnd = inputRef.current.value.length;
          }
        }, 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      // 获取下一条命令
      const nextCommand = getNextCommand();
      setCommandInput(nextCommand);
      e.preventDefault();
    } else if (e.key === 'Tab') {
      // 防止Tab键切换焦点
      e.preventDefault();
      // 这里可以实现命令补全功能
    }
  };

  // 处理命令提交
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commandInput.trim() || !isRunning || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      await executeCommand(commandInput);
    } catch (error) {
      console.error('命令执行失败:', error);
    } finally {
      setCommandInput('');
      setIsProcessing(false);
      
      // 重新聚焦输入框
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // 添加新标签
  const handleAddTab = () => {
    addTab();
    
    // 聚焦输入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // 关闭标签
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  // 清空终端
  const handleClearTerminal = () => {
    clearTerminal();
  };

  // 切换终端展开/折叠
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      toggleExpanded();
    }
  };

  // 获取当前活动标签
  const activeTab = getActiveTab();

  // 格式化终端行（处理命令行前缀）
  const formatTerminalLine = (line: string, index: number) => {
    // 如果是命令行（以$开头）
    if (line.startsWith('$ ')) {
      return (
        <div key={index} className="terminal-line command-line">
          <span className="terminal-prompt">$</span>
          <span className="command-content">{line.substring(2)}</span>
        </div>
      );
    }
    
    // 如果是错误信息（以错误:开头）
    if (line.startsWith('错误:')) {
      return (
        <div key={index} className="terminal-line error-line">
          {line}
        </div>
      );
    }
    
    // 普通输出行
    return (
      <div key={index} className="terminal-line">
        {line}
      </div>
    );
  };

  return (
    <div className={`terminal-area ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="terminal-header">
        <div className="terminal-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`terminal-tab ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="terminal-tab-icon"><FiTerminal /></span>
              <span className="terminal-tab-name">{tab.name}</span>
              <button
                className="terminal-tab-close"
                onClick={(e) => handleCloseTab(tab.id, e)}
                title="关闭终端"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
          
          <button
            className="terminal-new-tab"
            onClick={handleAddTab}
            title="新建终端"
          >
            <FiPlus />
          </button>
        </div>
        
        <div className="terminal-controls">
          <button
            className="terminal-toggle"
            onClick={handleClearTerminal}
            title="清空终端"
          >
            <FiTrash2 />
          </button>
          
          <button
            className="terminal-toggle"
            onClick={handleToggle}
            title={isExpanded ? '折叠终端' : '展开终端'}
          >
            {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="terminal-content-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="terminal-content" ref={terminalContentRef}>
              {activeTab.content.map((line, index) => 
                formatTerminalLine(line, index)
              )}
            </div>
            
            <form className="terminal-input-form" onSubmit={handleCommandSubmit}>
              <span className="terminal-prompt">$</span>
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={commandInput}
                onChange={handleCommandChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isProcessing 
                    ? "正在执行命令..." 
                    : isRunning 
                      ? "输入命令..." 
                      : "服务未启动，无法执行命令"
                }
                disabled={!isRunning || isProcessing}
                autoFocus
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
