import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronUp, FiChevronDown, FiPlus, FiTerminal, FiTrash2 } from 'react-icons/fi';
import { useTerminal } from '../../webContainer';
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
    toggleExpanded
  } = useTerminal();
  
  const [commandInput, setCommandInput] = React.useState<string>('');
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [tabs]);

  // 处理命令输入变化
  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandInput(e.target.value);
  };

  // 处理命令提交
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commandInput.trim() || !isRunning) return;
    
    executeCommand(commandInput);
    setCommandInput('');
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
              {activeTab.content.map((line, index) => (
                <div key={index} className="terminal-line">
                  {line}
                </div>
              ))}
            </div>
            
            <form className="terminal-input-form" onSubmit={handleCommandSubmit}>
              <span className="terminal-prompt">$</span>
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={commandInput}
                onChange={handleCommandChange}
                placeholder={isRunning ? "输入命令..." : "服务未启动，无法执行命令"}
                disabled={!isRunning}
                autoFocus
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
