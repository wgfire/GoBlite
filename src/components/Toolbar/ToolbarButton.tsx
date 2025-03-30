import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import './Toolbar.css';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  tooltip,
  onClick,
  disabled = false,
  active = false,
  variant = 'default'
}) => {
  return (
    <motion.div
      className="toolbar-tooltip-container"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <motion.button
        className={clsx(
          'toolbar-button',
          `toolbar-button-${variant}`,
          { 'toolbar-button-active': active },
          { 'toolbar-button-disabled': disabled }
        )}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        aria-label={tooltip}
        whileHover={{ 
          backgroundColor: !disabled ? 'var(--toolbar-button-hover-bg)' : undefined,
          color: !disabled ? 'var(--toolbar-button-hover-color)' : undefined
        }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.button>
      {tooltip && (
        <div className="toolbar-tooltip">
          {tooltip}
        </div>
      )}
    </motion.div>
  );
};

export default ToolbarButton;
