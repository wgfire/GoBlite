import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

export type ToastVariant = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // 根据variant选择图标和颜色
  const getIconAndColor = () => {
    switch (variant) {
      case 'success':
        return { 
          icon: <FiCheckCircle className="w-5 h-5" />, 
          bgColor: 'bg-green-500',
          textColor: 'text-white'
        };
      case 'error':
        return { 
          icon: <FiAlertCircle className="w-5 h-5" />, 
          bgColor: 'bg-red-500',
          textColor: 'text-white'
        };
      case 'warning':
        return { 
          icon: <FiAlertCircle className="w-5 h-5" />, 
          bgColor: 'bg-yellow-500',
          textColor: 'text-white'
        };
      case 'info':
        return { 
          icon: <FiInfo className="w-5 h-5" />, 
          bgColor: 'bg-blue-500',
          textColor: 'text-white'
        };
      default:
        return { 
          icon: <FiInfo className="w-5 h-5" />, 
          bgColor: 'bg-gray-800',
          textColor: 'text-white'
        };
    }
  };

  const { icon, bgColor, textColor } = getIconAndColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`${bgColor} ${textColor} rounded-lg shadow-lg p-4 flex items-start max-w-sm w-full pointer-events-auto`}
    >
      <div className="flex-shrink-0 mr-3 pt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-4 text-white opacity-70 hover:opacity-100 focus:outline-none"
      >
        <FiX className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right'
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // 根据position设置容器位置
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-0 right-0';
      case 'top-left':
        return 'top-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'top-center':
        return 'top-0 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-0 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-0 right-0';
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 添加toast的方法
  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
    return id;
  };

  // 暴露方法到window对象，方便全局调用
  useEffect(() => {
    (window as any).toast = {
      show: addToast,
      success: (title: string, description?: string) => 
        addToast({ title, description, variant: 'success' }),
      error: (title: string, description?: string) => 
        addToast({ title, description, variant: 'error' }),
      info: (title: string, description?: string) => 
        addToast({ title, description, variant: 'info' }),
      warning: (title: string, description?: string) => 
        addToast({ title, description, variant: 'warning' }),
    };

    return () => {
      delete (window as any).toast;
    };
  }, []);

  return (
    <div className={`fixed ${getPositionClasses()} p-4 space-y-4 z-50 pointer-events-none`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// 创建一个上下文，方便在组件中使用
export const ToastContext = React.createContext<{
  show: (toast: Omit<ToastProps, 'id' | 'onClose'>) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
}>({
  show: () => '',
  success: () => '',
  error: () => '',
  info: () => '',
  warning: () => '',
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
    return id;
  };

  const contextValue = {
    show: addToast,
    success: (title: string, description?: string) => 
      addToast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) => 
      addToast({ title, description, variant: 'error' }),
    info: (title: string, description?: string) => 
      addToast({ title, description, variant: 'info' }),
    warning: (title: string, description?: string) => 
      addToast({ title, description, variant: 'warning' }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-0 right-0 p-4 space-y-4 z-50 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
