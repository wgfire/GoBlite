import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { FiChevronDown } from 'react-icons/fi';
import './Toolbar.css';

interface DropdownItem {
  label?: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface ToolbarDropdownProps {
  icon: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  items: DropdownItem[];
}

const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  icon,
  tooltip,
  disabled = false,
  items
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="toolbar-dropdown-container" ref={dropdownRef}>
      <motion.div
        className="toolbar-tooltip-container"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <motion.button
          className={clsx(
            'toolbar-button',
            { 'toolbar-button-active': isOpen },
            { 'toolbar-button-disabled': disabled }
          )}
          onClick={toggleDropdown}
          disabled={disabled}
          aria-label={tooltip}
          whileHover={{ 
            backgroundColor: !disabled ? 'var(--toolbar-button-hover-bg)' : undefined,
            color: !disabled ? 'var(--toolbar-button-hover-color)' : undefined
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="toolbar-dropdown-button-content">
            {icon}
            <FiChevronDown 
              className={clsx(
                'toolbar-dropdown-chevron',
                { 'toolbar-dropdown-chevron-open': isOpen }
              )}
            />
          </div>
        </motion.button>
        {tooltip && (
          <div className="toolbar-tooltip">
            {tooltip}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="toolbar-dropdown-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {items.map((item, index) => (
              item.divider ? (
                <div key={`divider-${index}`} className="toolbar-dropdown-divider" />
              ) : (
                <motion.button
                  key={`item-${index}`}
                  className={clsx(
                    'toolbar-dropdown-item',
                    { 'toolbar-dropdown-item-disabled': item.disabled }
                  )}
                  onClick={() => handleItemClick(item.action)}
                  disabled={item.disabled}
                  whileHover={{ 
                    backgroundColor: !item.disabled ? 'var(--toolbar-dropdown-item-hover-bg)' : undefined,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  {item.label}
                </motion.button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolbarDropdown;
