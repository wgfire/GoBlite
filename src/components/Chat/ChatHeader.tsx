import React, { useState } from 'react';
import { FiLayout, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

type TabType = 'landing' | 'campaign';

interface ChatHeaderProps {
  onTabChange: (tab: TabType) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('landing');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="border-b border-gray-700 bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-200">AI 设计助手</h2>
        <button className="text-gray-400 hover:text-white">
          <FiMail size={20} />
        </button>
      </div>

      <div className="flex mt-4 relative">
        <button
          onClick={() => handleTabChange('landing')}
          className={`flex-1 py-2 font-medium text-center relative z-10 ${
            activeTab === 'landing' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiLayout size={16} />
            <span>落地页模板</span>
          </div>
        </button>
        <button
          onClick={() => handleTabChange('campaign')}
          className={`flex-1 py-2 font-medium text-center relative z-10 ${
            activeTab === 'campaign' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FiMail size={16} />
            <span>活动页模板</span>
          </div>
        </button>
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-500 z-0"
          initial={{ width: '50%', x: 0 }}
          animate={{
            width: '50%',
            x: activeTab === 'campaign' ? '100%' : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default ChatHeader;