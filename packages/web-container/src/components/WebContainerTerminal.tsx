import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useWebContainer } from '../hooks/useWebContainer';
import 'xterm/css/xterm.css';

interface WebContainerTerminalProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WebContainer终端组件
 * 用于显示WebContainer命令执行的输出
 */
const WebContainerTerminal: React.FC<WebContainerTerminalProps> = ({ className, style }) => {
  const { setTerminal, buildInfo } = useWebContainer();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  // 初始化终端
  useEffect(() => {
    if (!terminalRef.current) return;

    // 创建终端实例
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      },
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace'
    });

    // 创建适配插件
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // 打开终端
    term.open(terminalRef.current);
    fitAddon.fit();

    // 存储引用
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // 创建可写流，将输出传递给终端
    const writable = new WritableStream({
      write(data) {
        term.write(data);
      }
    });

    // 设置终端到WebContainer
    setTerminal({ writable });

    // 显示初始消息
    term.write('WebContainer Terminal\r\n');
    term.write('准备就绪，等待命令执行...\r\n\r\n');

    // 窗口大小变化时调整终端大小
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [setTerminal]);

  // 当构建信息更新时，将日志显示在终端中
  useEffect(() => {
    if (xtermRef.current && buildInfo.logs.length > 0) {
      // 只显示最新的日志
      const lastLog = buildInfo.logs[buildInfo.logs.length - 1];
      xtermRef.current.write(`${lastLog}\r\n`);
    }
  }, [buildInfo.logs]);

  return (
    <div 
      className={`web-container-terminal ${className || ''}`} 
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#1e1e1e',
        ...style 
      }}
    >
      <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default WebContainerTerminal;
