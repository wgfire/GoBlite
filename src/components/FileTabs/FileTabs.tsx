import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFile, FiCode, FiFileText, FiCoffee, FiDatabase } from 'react-icons/fi';

import { useFileSystem } from '@core/fileSystem/hooks/useFileSystem';
import './FileTabs.css';

interface FileTabsProps {
  onTabSelect?: (filePath: string) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  onTabSelect
}) => {
  const {
    files,
    openFiles,
    activeFile,
    closeFile,
    setActiveTab,
    findItem
  } = useFileSystem();

  // 使用 ref 跟踪上一次的 openFiles，用于优化渲染
  const prevOpenFilesRef = useRef<string[]>([]);

  // 调试输出，帮助排查问题
  useEffect(() => {
    console.log('FileTabs - openFiles:', openFiles);
    console.log('FileTabs - activeFile:', activeFile);
    prevOpenFilesRef.current = [...openFiles];
  }, [openFiles, activeFile]);

  // 如果没有打开的文件，显示一个空的标签栏
  if (!openFiles || openFiles.length === 0) {
    return (
      <div className="w-full overflow-x-auto bg-gray-800 border-b border-gray-700 flex-shrink-0 h-9">
        <div className="flex h-full items-center px-3 text-gray-500 text-sm">
          无打开的文件
        </div>
      </div>
    );
  }

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return <FiCode className="text-orange-400" />;
      case 'css':
        return <FiCode className="text-blue-500" />;
      case 'js':
        return <FiCoffee className="text-yellow-400" />;
      case 'ts':
      case 'tsx':
        return <FiCode className="text-blue-400" />;
      case 'json':
        return <FiDatabase className="text-gray-400" />;
      case 'md':
        return <FiFileText className="text-blue-800" />;
      default:
        return <FiFile className="text-gray-400" />;
    }
  };

  const getFileName = (path: string) => {
    const fileItem = findItem(files, path);
    return fileItem ? fileItem.name : path.split('/').pop() || '未命名';
  };

  const handleTabClick = (path: string) => {
    console.log('FileTabs - Tab clicked:', path);
    setActiveTab(path);
    if (onTabSelect) {
      onTabSelect(path);
    }
  };

  const handleTabClose = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('FileTabs - 关闭标签:', path);
    closeFile(path);
  };

  return (
    <div className="w-full overflow-x-auto bg-gray-800 border-b border-gray-700 flex-shrink-0 h-9">
      <div className="flex h-full">
        <AnimatePresence initial={false} mode="popLayout">
          {openFiles.map((filePath) => {
            const isActive = activeFile === filePath;

            return (
              <motion.div
                key={filePath}
                className={`flex items-center px-3 h-full min-w-[120px] max-w-[180px] cursor-pointer select-none relative overflow-hidden transition-colors duration-150 ease-in-out
                  ${isActive
                    ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-r border-gray-700'}`}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                onClick={() => handleTabClick(filePath)}
                layout
              >
                <span className="flex items-center mr-2 opacity-80">
                  {getFileIcon(filePath)}
                </span>
                <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                  {getFileName(filePath)}
                </span>
                <button
                  className={`bg-transparent border-none p-1 ml-1 rounded flex items-center justify-center
                    ${isActive
                      ? 'text-gray-300 hover:bg-gray-700 opacity-80'
                      : 'text-gray-500 hover:bg-gray-600 opacity-60 hover:opacity-100'}`}
                  onClick={(e) => handleTabClose(filePath, e)}
                  aria-label="Close tab"
                >
                  <FiX size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
