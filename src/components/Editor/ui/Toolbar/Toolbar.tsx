import React from 'react';
import { motion } from 'framer-motion';
import {
  FiPlay,
  FiSettings,
  FiDownload,
  FiRefreshCw,
  FiCode,
} from 'react-icons/fi';
import ToolbarButton from './ToolbarButton';
import './Toolbar.css';

interface ToolbarProps {
  onSave?: () => void;
  onRun?: () => void;
  onSearch?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  disabled?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onRun,
  onRedo,
  onExport,
  onSettings,
  disabled = false
}) => {
  return (
    <motion.div
      className="editor-toolbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="toolbar-logo">
        <span className="code-icon">&lt;/&gt;</span>
        <span className="logo-text">CodeMirror Editor</span>
      </div>

      <div className="toolbar-actions">
        <div className="toolbar-divider"></div>

        <div className="toolbar-section">
          <ToolbarButton
            icon={<FiPlay />}
            tooltip="Run"
            onClick={onRun}
            disabled={disabled}
            variant="success"
          />
          <ToolbarButton
            icon={<FiCode />}
            tooltip="Format Code"
            onClick={() => console.log('Format Code')}
            disabled={disabled}
          />
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-section">
          <ToolbarButton
            icon={<FiDownload />}
            tooltip="Export"
            onClick={onExport}
            disabled={disabled}
          />
          <ToolbarButton
            icon={<FiSettings />}
            tooltip="Settings"
            onClick={onSettings}
            disabled={disabled}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Toolbar;
