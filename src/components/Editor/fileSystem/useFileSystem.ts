import { useState, useCallback } from 'react';
import { FileItem, FileItemType, FileOperation } from './types';

// Initial directory structure for demo purposes
const initialFiles: FileItem[] = [
  {
    name: 'src',
    path: '/src',
    type: FileItemType.FOLDER,
    children: [
      {
        name: 'index.js',
        path: '/src/index.js',
        type: FileItemType.FILE,
        content: '// JavaScript code goes here\n'
      },
      {
        name: 'styles.css',
        path: '/src/styles.css',
        type: FileItemType.FILE,
        content: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}'
      }
    ]
  },
  {
    name: 'public',
    path: '/public',
    type: FileItemType.FOLDER,
    children: [
      {
        name: 'index.html',
        path: '/public/index.html',
        type: FileItemType.FILE,
        content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>'
      }
    ]
  }
];

export function useFileSystem() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [operations, setOperations] = useState<FileOperation[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);

  // Helper function to find and update a file or folder
  const findAndUpdateItem = useCallback((
    items: FileItem[],
    path: string,
    updater: (item: FileItem) => FileItem
  ): FileItem[] => {
    return items.map(item => {
      if (item.path === path) {
        return updater(item);
      }
      
      if (item.children) {
        return {
          ...item,
          children: findAndUpdateItem(item.children, path, updater)
        };
      }
      
      return item;
    });
  }, []);

  // Helper function to find a file or folder by path
  const findItem = useCallback((items: FileItem[], path: string): FileItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      
      if (item.children) {
        const found = findItem(item.children, path);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  }, []);

  // Helper function to find parent folder path
  const getParentPath = useCallback((path: string): string => {
    const parts = path.split('/');
    parts.pop(); // Remove the last part (file or folder name)
    return parts.join('/') || '/';
  }, []);

  // Helper function to find a parent folder
  const findParent = useCallback((items: FileItem[], childPath: string): FileItem | null => {
    const parentPath = getParentPath(childPath);
    return findItem(items, parentPath);
  }, [findItem, getParentPath]);

  // Create a new file
  const createFile = useCallback((parentPath: string, newFile?: FileItem) => {
    if (!newFile) return;
    
    // Check if file already exists
    if (findItem(files, newFile.path)) {
      alert(`文件 ${newFile.name} 已存在!`);
      return;
    }
    
    setFiles(prevFiles => {
      // If adding to root
      if (parentPath === '/') {
        return [...prevFiles, newFile];
      }
      
      // Add to a subfolder
      return findAndUpdateItem(prevFiles, parentPath, item => ({
        ...item,
        children: [...(item.children || []), newFile]
      }));
    });
    
    setOperations(prev => [
      ...prev, 
      { type: 'create', path: newFile.path, content: newFile.content || '', isFolder: false }
    ]);
    
    // Auto-open the new file
    openFile(newFile);
  }, [files, findItem, findAndUpdateItem]);

  // Create a new folder
  const createFolder = useCallback((parentPath: string, newFolder?: FileItem) => {
    if (!newFolder) return;
    
    // Check if folder already exists
    if (findItem(files, newFolder.path)) {
      alert(`文件夹 ${newFolder.name} 已存在!`);
      return;
    }
    
    setFiles(prevFiles => {
      // If adding to root
      if (parentPath === '/') {
        return [...prevFiles, newFolder];
      }
      
      // Add to a subfolder
      return findAndUpdateItem(prevFiles, parentPath, item => ({
        ...item,
        children: [...(item.children || []), newFolder]
      }));
    });
    
    setOperations(prev => [
      ...prev, 
      { type: 'create', path: newFolder.path, isFolder: true }
    ]);
  }, [files, findItem, findAndUpdateItem]);

  // Open a file
  const openFile = useCallback((file: FileItem) => {
    if (file.type === FileItemType.FOLDER) return;
    
    setActiveFile(file.path);
    
    setOpenFiles(prev => {
      if (!prev.includes(file.path)) {
        return [...prev, file.path];
      }
      return prev;
    });
  }, []);

  // Close a file
  const closeFile = useCallback((path: string) => {
    setOpenFiles(prev => prev.filter(p => p !== path));
    
    // If closing the active file, set the active file to the last open file
    if (activeFile === path) {
      setActiveFile(prev => {
        const remaining = openFiles.filter(p => p !== path);
        return remaining.length > 0 ? remaining[remaining.length - 1] : null;
      });
    }
  }, [activeFile, openFiles]);

  // Update file content
  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles(prevFiles => 
      findAndUpdateItem(prevFiles, path, item => ({
        ...item,
        content
      }))
    );
    
    setOperations(prev => [
      ...prev, 
      { type: 'update', path, content }
    ]);
  }, [findAndUpdateItem]);

  // Rename a file or folder
  const renameItem = useCallback((item: FileItem, newName: string) => {
    const parentPath = getParentPath(item.path);
    const newPath = parentPath === '/' 
      ? `/${newName}` 
      : `${parentPath}/${newName}`;
    
    // Check if a file or folder with the new name already exists
    if (findItem(files, newPath)) {
      alert(`Item ${newName} already exists!`);
      return;
    }
    
    // Update the item and all its children (if it's a folder)
    const updatePathsRecursively = (items: FileItem[], oldPath: string, newPath: string): FileItem[] => {
      return items.map(item => {
        if (item.path === oldPath) {
          const updated = {
            ...item,
            name: newName,
            path: newPath,
          };
          
          if (item.children) {
            updated.children = item.children.map(child => {
              const childNewPath = child.path.replace(oldPath, newPath);
              return {
                ...child,
                path: childNewPath,
                children: child.children 
                  ? updatePathsRecursively(child.children, child.path, childNewPath)
                  : undefined
              };
            });
          }
          
          return updated;
        }
        
        if (item.children) {
          return {
            ...item,
            children: updatePathsRecursively(item.children, oldPath, newPath)
          };
        }
        
        return item;
      });
    };
    
    setFiles(prevFiles => updatePathsRecursively(prevFiles, item.path, newPath));
    
    // Update open files and active file if needed
    if (openFiles.includes(item.path)) {
      setOpenFiles(prev => prev.map(p => p === item.path ? newPath : p));
    }
    
    if (activeFile === item.path) {
      setActiveFile(newPath);
    }
    
    setOperations(prev => [
      ...prev, 
      { 
        type: 'rename', 
        path: item.path, 
        newPath, 
        isFolder: item.type === FileItemType.FOLDER 
      }
    ]);
  }, [files, findItem, getParentPath, activeFile, openFiles]);

  // Delete a file or folder
  const deleteItem = useCallback((item: FileItem) => {
    const isFolder = item.type === FileItemType.FOLDER;
    
    // Helper function to get all paths in a folder recursively
    const getAllPaths = (item: FileItem): string[] => {
      const paths = [item.path];
      if (item.children) {
        item.children.forEach(child => {
          paths.push(...getAllPaths(child));
        });
      }
      return paths;
    };
    
    const pathsToDelete = isFolder ? getAllPaths(item) : [item.path];
    
    // Close any open files that are being deleted
    pathsToDelete.forEach(path => {
      if (openFiles.includes(path)) {
        closeFile(path);
      }
    });
    
    // Remove the item from the file tree
    const removeItem = (items: FileItem[], path: string): FileItem[] => {
      // For root level items
      const filtered = items.filter(item => item.path !== path);
      if (filtered.length < items.length) return filtered;
      
      // For nested items
      return items.map(item => {
        if (item.children) {
          return {
            ...item,
            children: removeItem(item.children, path)
          };
        }
        return item;
      });
    };
    
    setFiles(prevFiles => removeItem(prevFiles, item.path));
    
    setOperations(prev => [
      ...prev, 
      { 
        type: 'delete', 
        path: item.path, 
        isFolder: item.type === FileItemType.FOLDER 
      }
    ]);
  }, [closeFile, openFiles]);

  // Get the content of the active file
  const getActiveFileContent = useCallback(() => {
    if (!activeFile) return '';
    
    const file = findItem(files, activeFile);
    return file?.content || '';
  }, [activeFile, files, findItem]);

  // Set the active file tab
  const setActiveTab = useCallback((path: string) => {
    if (openFiles.includes(path)) {
      setActiveFile(path);
    }
  }, [openFiles]);

  return {
    files,
    openFiles,
    activeFile,
    operations,
    createFile,
    createFolder,
    openFile,
    closeFile,
    updateFileContent,
    renameItem,
    deleteItem,
    getActiveFileContent,
    setActiveTab,
    findItem
  };
}

export default useFileSystem;
