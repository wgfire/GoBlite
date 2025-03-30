import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPackage, FiCode, FiServer } from 'react-icons/fi';
import { EmptyStateProps } from './types';
import './EmptyState.css';

export const EmptyState: React.FC<EmptyStateProps> = ({ onStart }) => {
  return (
    <motion.div 
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <FiServer size={60} />
        </div>
        <h2 className="empty-state-title">WebContainer 准备就绪</h2>
        <p className="empty-state-description">
          WebContainer 提供了一个完整的代码运行环境，可以直接在浏览器中运行您的项目。
        </p>
        
        <div className="empty-state-features">
          <div className="empty-state-feature">
            <FiCode size={24} />
            <span>实时预览</span>
          </div>
          <div className="empty-state-feature">
            <FiPackage size={24} />
            <span>依赖管理</span>
          </div>
          <div className="empty-state-feature">
            <FiServer size={24} />
            <span>终端控制</span>
          </div>
        </div>
        
        <button 
          className="empty-state-button"
          onClick={onStart}
        >
          <FiPlay />
          <span>启动服务</span>
        </button>
      </div>
    </motion.div>
  );
};
