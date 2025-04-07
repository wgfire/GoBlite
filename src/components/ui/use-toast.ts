import { useContext } from 'react';
import { ToastContext, ToastProps } from './toast';

export interface ToastOptions extends Omit<ToastProps, 'id' | 'onClose'> {}

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    // 如果没有在ToastProvider中使用，提供一个基本的实现
    return {
      toast: (options: ToastOptions) => {
        console.log('Toast:', options);
        return '';
      },
    };
  }
  
  return {
    toast: context.show,
  };
};

// 为了方便直接导入使用
export const toast = (options: ToastOptions) => {
  // 如果在浏览器环境且window.toast存在，使用它
  if (typeof window !== 'undefined' && (window as any).toast) {
    return (window as any).toast.show(options);
  }
  
  // 否则只是记录到控制台
  console.log('Toast:', options);
  return '';
};
