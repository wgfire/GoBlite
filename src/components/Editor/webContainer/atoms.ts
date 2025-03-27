import { atom } from 'jotai';
import { WebContainerStatus, TerminalTab, ViewMode } from './types';

// WebContainer状态原子
export const webContainerStatusAtom = atom<WebContainerStatus>(WebContainerStatus.EMPTY);

// 预览URL原子
export const previewUrlAtom = atom<string>('');

// 终端展开状态原子
export const terminalExpandedAtom = atom<boolean>(true);

// 终端标签原子
export const terminalTabsAtom = atom<TerminalTab[]>([
  { id: 'terminal-1', name: '终端 1', content: ['欢迎使用 WebContainer 终端！'] }
]);

export const activeTerminalTabIdAtom = atom<string>('terminal-1');

// 预览模式原子
export const previewModeAtom = atom<ViewMode>('desktop');

// 预览加载状态原子
export const previewLoadingAtom = atom<boolean>(false);

// 错误信息原子
export const errorMessageAtom = atom<string | null>(null);

// WebContainer可见性原子
export const webContainerVisibleAtom = atom<boolean>(false);
