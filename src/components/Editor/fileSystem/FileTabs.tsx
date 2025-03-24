import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFile } from 'react-icons/fi';
import { FileItem } from './types';
import useFileSystem from './useFileSystem';
import './FileTabs.css';

interface FileTabsProps {
  onTabSelect?: (file: FileItem) => void;
}

const FileTabs: React.FC<FileTabsProps> = ({
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

  if (openFiles.length === 0) {
    return null;
  }

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'html': 
        return <FiFile color="#e34c26" />;
      case 'css': 
        return <FiFile color="#264de4" />;
      case 'js': 
        return <FiFile color="#f0db4f" />;
      case 'ts':
      case 'tsx': 
        return <FiFile color="#3178c6" />;
      case 'json': 
        return <FiFile color="#5b5b5b" />;
      case 'md': 
        return <FiFile color="#083fa1" />;
      default: 
        return <FiFile />;
    }
  };

  const getFileName = (path: string) => {
    const fileItem = findItem(files, path);
    return fileItem ? fileItem.name : path.split('/').pop() || '未命名';
  };

  const handleTabClick = (path: string) => {
    setActiveTab(path);
    const file = findItem(files, path);
    if (file && onTabSelect) {
      onTabSelect(file);
    }
  };

  const handleTabClose = (path: string) => {
    closeFile(path);
  };

  return (
    <div className="file-tabs-container">
      <div className="file-tabs">
        <AnimatePresence initial={false}>
          {openFiles.map((filePath) => {
            const isActive = activeFile === filePath;
            
            return (
              <motion.div 
                key={filePath}
                className={`file-tab ${isActive ? 'active' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleTabClick(filePath)}
              >
                <span className="tab-icon">
                  {getFileIcon(filePath)}
                </span>
                <span className="tab-name">
                  {getFileName(filePath)}
                </span>
                <button 
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClose(filePath);
                  }}
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

export default FileTabs;
