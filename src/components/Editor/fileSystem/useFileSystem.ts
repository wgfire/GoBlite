import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FileItem, FileItemType, FileOperation } from './types';
import {
  filesAtom,
  operationsAtom,
  activeFileAtom,
  openFilesAtom,
  findItemHelper,
  getParentPathHelper,
  findAndUpdateItemHelper,
  activeFileContentAtom
} from './atoms';
import { useCallback, useEffect, useRef } from 'react';

// 文件系统钩子
export const useFileSystem = function() {
  // 获取原子状态
  const [files, setFiles] = useAtom(filesAtom);
  const [operations, setOperations] = useAtom(operationsAtom);
  const [activeFile, setActiveFile] = useAtom(activeFileAtom);
  const [openFiles, setOpenFiles] = useAtom(openFilesAtom);
  const activeFileContent = useAtomValue(activeFileContentAtom);
  
  // 使用 ref 跟踪初始化状态，避免重复初始化
  const initializedRef = useRef(false);

  // 初始化时自动打开默认文件
  useEffect(() => {
    console.log('useFileSystem 初始化');
    if (files.length > 0 && openFiles.length === 0 && !initializedRef.current) {
      initializedRef.current = true;
      // 查找默认文件
      const defaultFile = findItem(files, '/src/index.js');
      if (defaultFile && defaultFile.type === FileItemType.FILE) {
        console.log('自动打开默认文件:', defaultFile.path);
        // 直接设置状态，避免使用 openFile 函数（因为它在 useEffect 中不能作为依赖）
        setActiveFile(defaultFile.path);
        setOpenFiles([defaultFile.path]);
      }
    }
  }, [files, openFiles.length, setActiveFile, setOpenFiles]);

  // 查找文件或文件夹
  const findItem = useCallback((items: FileItem[], path: string): FileItem | null => {
    return findItemHelper(items, path);
  }, []);

  // 获取父路径
  const getParentPath = useCallback((path: string): string => {
    return getParentPathHelper(path);
  }, []);

  // 查找并更新文件或文件夹
  const findAndUpdateItem = useCallback((
    items: FileItem[],
    path: string,
    updateFn: (item: FileItem) => FileItem
  ): FileItem[] => {
    return findAndUpdateItemHelper(items, path, updateFn);
  }, []);

  // 查找父文件夹
  const findParent = useCallback((items: FileItem[], childPath: string): FileItem | null => {
    const parentPath = getParentPath(childPath);
    return findItem(items, parentPath);
  }, [getParentPath, findItem]);

  // 创建新文件
  const createFile = useCallback((parentPath: string, newFile?: FileItem) => {
    if (!newFile) return;
    
    // 检查文件是否已存在
    if (findItem(files, newFile.path)) {
      alert(`文件 ${newFile.name} 已存在!`);
      return;
    }
    
    setFiles(prevFiles => {
      // 如果添加到根目录
      if (parentPath === '/') {
        return [...prevFiles, newFile];
      }
      
      // 添加到子文件夹
      return findAndUpdateItem(prevFiles, parentPath, item => ({
        ...item,
        children: [...(item.children || []), newFile]
      }));
    });
    
    setOperations(prev => [
      ...prev, 
      { type: 'create', path: newFile.path, isFolder: false }
    ]);
  }, [files, findItem, findAndUpdateItem, setFiles, setOperations]);

  // 创建新文件夹
  const createFolder = useCallback((parentPath: string, newFolder?: FileItem) => {
    if (!newFolder) return;
    
    // 检查文件夹是否已存在
    if (findItem(files, newFolder.path)) {
      alert(`文件夹 ${newFolder.name} 已存在!`);
      return;
    }
    
    setFiles(prevFiles => {
      // 如果添加到根目录
      if (parentPath === '/') {
        return [...prevFiles, newFolder];
      }
      
      // 添加到子文件夹
      return findAndUpdateItem(prevFiles, parentPath, item => ({
        ...item,
        children: [...(item.children || []), newFolder]
      }));
    });
    
    setOperations(prev => [
      ...prev, 
      { type: 'create', path: newFolder.path, isFolder: true }
    ]);
  }, [files, findItem, findAndUpdateItem, setFiles, setOperations]);

  // 打开文件
  const openFile = useCallback((file: FileItem) => {
    console.log('openFile 被调用:', file.path);
    if (file.type === FileItemType.FOLDER) {
      console.log('无法打开文件夹');
      return;
    }
    
    // 设置活动文件
    setActiveFile(file.path);
    
    // 添加到打开文件列表
    setOpenFiles(prev => {
      if (!prev.includes(file.path)) {
        console.log('添加到打开文件列表:', [...prev, file.path]);
        return [...prev, file.path];
      }
      console.log('文件已在打开列表中:', prev);
      return prev;
    });
  }, [setActiveFile, setOpenFiles]);

  // 关闭文件
  const closeFile = useCallback((path: string) => {
    console.log('closeFile 被调用:', path);
    
    setOpenFiles(prev => {
      // 如果文件不在打开列表中，直接返回原列表，避免不必要的更新
      if (!prev.includes(path)) {
        return prev;
      }
      
      const remaining = prev.filter(p => p !== path);
      console.log('剩余打开文件:', remaining);
      
      // 如果关闭的是当前活动文件，则设置活动文件为最后一个打开的文件
      if (activeFile === path) {
        const newActiveFile = remaining.length > 0 ? remaining[remaining.length - 1] : null;
        console.log('设置新的活动文件:', newActiveFile);
        // 使用 setTimeout 延迟设置活动文件，避免在同一个渲染周期内触发多次状态更新
        setTimeout(() => {
          setActiveFile(newActiveFile);
        }, 0);
      }
      
      return remaining;
    });
  }, [activeFile, setActiveFile, setOpenFiles]);

  // 重命名文件或文件夹
  const renameItem = useCallback((item: FileItem, newName: string) => {
    if (!item) return;
    
    const oldPath = item.path;
    const parentPath = getParentPath(oldPath);
    const newPath = `${parentPath === '/' ? '' : parentPath}/${newName}`;
    
    // 检查新路径是否已存在
    if (findItem(files, newPath)) {
      alert(`${item.type === FileItemType.FOLDER ? '文件夹' : '文件'} ${newName} 已存在!`);
      return;
    }
    
    // 更新文件或文件夹
    setFiles(prevFiles => {
      // 创建一个新的文件或文件夹，使用新的名称和路径
      const updatedItem: FileItem = {
        ...item,
        name: newName,
        path: newPath
      };
      
      // 如果是文件夹，更新所有子项的路径
      if (item.type === FileItemType.FOLDER && item.children) {
        updatedItem.children = item.children.map(child => {
          const childNewPath = child.path.replace(oldPath, newPath);
          return {
            ...child,
            path: childNewPath
          };
        });
      }
      
      // 从父文件夹中移除旧项并添加新项
      const parent = findParent(prevFiles, oldPath);
      
      if (!parent) {
        // 如果没有父文件夹（即在根目录），直接替换
        return prevFiles.map(f => f.path === oldPath ? updatedItem : f);
      }
      
      // 更新父文件夹
      return findAndUpdateItem(prevFiles, parent.path, p => ({
        ...p,
        children: [
          ...(p.children || []).filter(c => c.path !== oldPath),
          updatedItem
        ]
      }));
    });
    
    // 更新打开的文件和活动文件
    if (openFiles.includes(oldPath)) {
      setOpenFiles(prev => prev.map(p => p === oldPath ? newPath : p));
    }
    
    if (activeFile === oldPath) {
      setActiveFile(newPath);
    }
    
    setOperations(prev => [
      ...prev, 
      { 
        type: 'rename', 
        path: oldPath, 
        newPath, 
        isFolder: item.type === FileItemType.FOLDER 
      }
    ]);
  }, [
    activeFile, 
    files, 
    findItem, 
    findParent, 
    getParentPath, 
    openFiles, 
    findAndUpdateItem, 
    setActiveFile, 
    setFiles, 
    setOpenFiles, 
    setOperations
  ]);

  // 删除文件或文件夹
  const deleteItem = useCallback((path: string) => {
    const item = findItem(files, path);
    if (!item) return;
    
    const parentPath = getParentPath(path);
    
    // 从父文件夹中移除项
    setFiles(prevFiles => {
      if (parentPath === '/') {
        // 如果在根目录，直接过滤掉
        return prevFiles.filter(f => f.path !== path);
      }
      
      // 更新父文件夹
      return findAndUpdateItem(prevFiles, parentPath, p => ({
        ...p,
        children: (p.children || []).filter(c => c.path !== path)
      }));
    });
    
    // 如果删除的是文件夹，关闭所有子文件
    if (item.type === FileItemType.FOLDER) {
      const filesToRemove = openFiles.filter(p => p.startsWith(path));
      
      if (filesToRemove.length > 0) {
        setOpenFiles(prev => {
          const remaining = prev.filter(p => !p.startsWith(path));
          
          // 如果活动文件在要删除的文件中，更新活动文件
          if (activeFile && activeFile.startsWith(path)) {
            const newActiveFile = remaining.length > 0 ? remaining[remaining.length - 1] : null;
            setActiveFile(newActiveFile);
          }
          
          return remaining;
        });
      }
    } else {
      // 如果删除的是文件，从打开的文件列表中移除
      if (openFiles.includes(path)) {
        setOpenFiles(prev => {
          const remaining = prev.filter(p => p !== path);
          
          // 如果删除的是当前活动文件，设置活动文件为最后一个打开的文件
          if (activeFile === path) {
            const newActiveFile = remaining.length > 0 ? remaining[remaining.length - 1] : null;
            setActiveFile(newActiveFile);
          }
          
          return remaining;
        });
      }
    }
    
    setOperations(prev => [
      ...prev, 
      { 
        type: 'delete', 
        path, 
        isFolder: item.type === FileItemType.FOLDER 
      }
    ]);
  }, [
    activeFile, 
    files, 
    findItem, 
    getParentPath, 
    openFiles, 
    findAndUpdateItem, 
    setActiveFile, 
    setFiles, 
    setOpenFiles, 
    setOperations
  ]);

  // 更新文件内容
  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles(prevFiles => 
      findAndUpdateItem(prevFiles, path, item => ({
        ...item,
        content
      }))
    );
    
    setOperations(prev => [
      ...prev, 
      { type: 'update', path }
    ]);
  }, [findAndUpdateItem, setFiles, setOperations]);

  // 获取当前活动文件内容
  const getActiveFileContent = useCallback(() => {
    if (!activeFile) return '';
    
    const file = findItem(files, activeFile);
    return file && file.type === FileItemType.FILE ? file.content || '' : '';
  }, [activeFile, files, findItem]);

  // 设置活动文件标签
  const setActiveTab = useCallback((path: string) => {
    console.log('设置活动标签:', path);
    if (openFiles.includes(path)) {
      setActiveFile(path);
    }
  }, [openFiles, setActiveFile]);

  return {
    files,
    operations,
    activeFile,
    openFiles,
    findItem,
    findAndUpdateItem,
    getParentPath,
    findParent,
    createFile,
    createFolder,
    openFile,
    closeFile,
    renameItem,
    deleteItem,
    updateFileContent,
    getActiveFileContent,
    setActiveTab
  };
}
