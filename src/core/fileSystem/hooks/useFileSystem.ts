import { useAtom, useAtomValue } from "jotai";
import { FileItem, FileItemType, FileMetadata } from "../types";
import { filesAtom, operationsAtom, activeFileAtom, openFilesAtom, findItemHelper, getParentPathHelper, findAndUpdateItemHelper, activeFileContentAtom } from "../atoms";
import { useCallback, useEffect, useRef } from "react";

// 文件系统钩子
export const useFileSystem = function (initialFiles?: FileItem[]) {
  // 分离读取和写入
  const [files, setFiles] = useAtom(filesAtom);
  const [operations, setOperations] = useAtom(operationsAtom);
  const [activeFile, setActiveFile] = useAtom(activeFileAtom);
  const [openFiles, setOpenFiles] = useAtom(openFilesAtom);
  const activeFileContent = useAtomValue(activeFileContentAtom);

  // 使用 ref 跟踪初始化状态，避免重复初始化
  const initializedRef = useRef(false);

  // 添加文件路径缓存，避免频繁遍历文件树
  const pathToItemCacheRef = useRef<Map<string, FileItem>>(new Map());

  // 用于防止重复调用的标志
  const isRenamingRef = useRef<Record<string, boolean>>({});

  // 构建并更新文件路径缓存
  const updateFileCache = useCallback((fileItems: FileItem[]) => {
    const cache = new Map<string, FileItem>();

    // 递归遍历文件树并构建缓存
    const traverseFiles = (items: FileItem[]) => {
      for (const item of items) {
        cache.set(item.path, item);
        if (item.type === FileItemType.FOLDER && item.children) {
          traverseFiles(item.children);
        }
      }
    };

    traverseFiles(fileItems);
    pathToItemCacheRef.current = cache;
  }, []);

  // 为文件添加元数据
  const addMetadataToFiles = useCallback((items: FileItem[]): FileItem[] => {
    const now = Date.now();

    const processItem = (item: FileItem): FileItem => {
      // 如果已有元数据，则保留
      const metadata: FileMetadata = item.metadata || {
        createdAt: now,
        updatedAt: now,
        size: item.type === FileItemType.FILE && item.content ? new Blob([item.content]).size : undefined,
      };

      if (item.type === FileItemType.FOLDER && item.children) {
        return {
          ...item,
          metadata,
          children: item.children.map(processItem),
        };
      }

      return {
        ...item,
        metadata,
      };
    };

    return items.map(processItem);
  }, []);

  // 监听文件变化并更新缓存
  useEffect(() => {
    updateFileCache(files);
  }, [files, updateFileCache]);

  // 初始化时自动打开默认文件
  useEffect(() => {
    console.log("useFileSystem 初始化");

    // 如果提供了初始文件，则使用它们初始化文件系统
    if (initialFiles && initialFiles.length > 0 && !initializedRef.current) {
      console.log("使用初始文件初始化文件系统:", initialFiles);
      // 为初始文件添加元数据
      const filesWithMetadata = addMetadataToFiles(initialFiles);
      setFiles(filesWithMetadata);
      updateFileCache(filesWithMetadata);
      initializedRef.current = true;
      return; // 初始化后直接返回，避免执行后续逻辑
    }
  }, [initialFiles, setFiles, updateFileCache, addMetadataToFiles]);

  // 使用缓存优化的查找函数
  const findItem = useCallback((items: FileItem[], path: string): FileItem | null => {
    // 先从缓存查找
    const cachedItem = pathToItemCacheRef.current.get(path);
    if (cachedItem) {
      return cachedItem;
    }

    // 缓存未命中时回退到原始查找方法
    return findItemHelper(items, path);
  }, []);

  // 查找第一个可用的文件
  const findFirstFile = (items: FileItem[]): FileItem | null => {
    for (const item of items) {
      if (item.type === FileItemType.FILE) {
        return item;
      } else if (item.children && item.children.length > 0) {
        const file = findFirstFile(item.children);
        if (file) return file;
      }
    }
    return null;
  };

  // 重置文件系统
  const resetFileSystem = useCallback(
    (newFiles: FileItem[]) => {
      console.log("重置文件系统:", newFiles);

      // 为新文件添加元数据
      const filesWithMetadata = addMetadataToFiles(newFiles);

      // 更新文件系统状态
      setFiles(filesWithMetadata);
      setOperations([]);
      setActiveFile(null);
      setOpenFiles([]);

      // 更新文件路径缓存
      updateFileCache(filesWithMetadata);

      initializedRef.current = false;
    },
    [setFiles, setOperations, setActiveFile, setOpenFiles, addMetadataToFiles, updateFileCache]
  );

  // 获取父路径
  const getParentPath = useCallback((path: string): string => {
    return getParentPathHelper(path);
  }, []);

  // 查找并更新文件或文件夹
  const findAndUpdateItem = useCallback((items: FileItem[], path: string, updateFn: (item: FileItem) => FileItem): FileItem[] => {
    return findAndUpdateItemHelper(items, path, updateFn);
  }, []);

  // 查找父文件夹
  const findParent = useCallback(
    (items: FileItem[], childPath: string): FileItem | null => {
      const parentPath = getParentPath(childPath);
      return findItem(items, parentPath);
    },
    [getParentPath, findItem]
  );

  // 创建新文件
  const createFile = useCallback(
    (parentPath: string, newFile?: FileItem) => {
      if (!newFile) return;

      // 检查文件是否已存在
      if (findItem(files, newFile.path)) {
        alert(`文件 ${newFile.name} 已存在!`);
        return;
      }

      // 添加创建时间和更新时间元数据
      const now = Date.now();
      const fileWithMetadata = {
        ...newFile,
        metadata: {
          ...(newFile.metadata || {}),
          createdAt: now,
          updatedAt: now,
          size: newFile.content ? new Blob([newFile.content]).size : 0,
        },
      };

      setFiles((prevFiles) => {
        // 如果添加到根目录
        if (parentPath === "/") {
          const updatedFiles = [...prevFiles, fileWithMetadata];
          // 更新缓存，避免额外的遍历操作
          updateFileCache(updatedFiles);
          return updatedFiles;
        }

        // 添加到子文件夹
        const updatedFiles = findAndUpdateItem(prevFiles, parentPath, (item) => ({
          ...item,
          children: [...(item.children || []), fileWithMetadata],
        }));

        // 更新缓存
        updateFileCache(updatedFiles);
        return updatedFiles;
      });

      setOperations((prev) => [
        ...prev,
        {
          type: "create",
          path: newFile.path,
          isFolder: false,
          timestamp: now,
        },
      ]);
    },
    [files, findItem, findAndUpdateItem, setFiles, setOperations, updateFileCache]
  );

  // 创建新文件夹
  const createFolder = useCallback(
    (parentPath: string, newFolder?: FileItem) => {
      if (!newFolder) return;

      // 检查文件夹是否已存在
      if (findItem(files, newFolder.path)) {
        alert(`文件夹 ${newFolder.name} 已存在!`);
        return;
      }

      // 添加创建时间和更新时间元数据
      const now = Date.now();
      const folderWithMetadata = {
        ...newFolder,
        metadata: {
          ...(newFolder.metadata || {}),
          createdAt: now,
          updatedAt: now,
        },
      };

      setFiles((prevFiles) => {
        // 如果添加到根目录
        if (parentPath === "/") {
          const updatedFiles = [...prevFiles, folderWithMetadata];
          // 更新缓存
          updateFileCache(updatedFiles);
          return updatedFiles;
        }

        // 添加到子文件夹
        const updatedFiles = findAndUpdateItem(prevFiles, parentPath, (item) => ({
          ...item,
          children: [...(item.children || []), folderWithMetadata],
        }));

        // 更新缓存
        updateFileCache(updatedFiles);
        return updatedFiles;
      });

      setOperations((prev) => [
        ...prev,
        {
          type: "create",
          path: newFolder.path,
          isFolder: true,
          timestamp: now,
        },
      ]);
    },
    [files, findItem, findAndUpdateItem, setFiles, setOperations, updateFileCache]
  );

  // 打开文件
  const openFile = useCallback(
    (file: FileItem) => {
      console.log("openFile 被调用:", file.path);
      if (file.type === FileItemType.FOLDER) {
        console.log("无法打开文件夹");
        return;
      }

      // 验证文件是否存在
      const existingFile = findItem(files, file.path);
      if (!existingFile) {
        console.error(`要打开的文件不存在: ${file.path}`);
        return;
      }

      // 设置活动文件
      setActiveFile(file.path);

      // 添加到打开文件列表
      setOpenFiles((prev) => {
        if (!prev.includes(file.path)) {
          console.log("添加到打开文件列表:", [...prev, file.path]);
          return [...prev, file.path];
        }
        console.log("文件已在打开列表中:", prev);
        return prev;
      });
    },
    [files, findItem, setActiveFile, setOpenFiles]
  );

  // 关闭文件
  const closeFile = useCallback(
    (path: string) => {
      console.log("closeFile 被调用:", path);

      setOpenFiles((prev) => {
        // 如果文件不在打开列表中，直接返回原列表，避免不必要的更新
        if (!prev.includes(path)) {
          return prev;
        }

        const remaining = prev.filter((p) => p !== path);
        console.log("剩余打开文件:", remaining);

        // 如果关闭的是当前活动文件，则设置活动文件为最后一个打开的文件
        if (activeFile === path) {
          const newActiveFile = remaining.length > 0 ? remaining[remaining.length - 1] : null;
          console.log("设置新的活动文件:", newActiveFile);
          // 使用 setTimeout 延迟设置活动文件，避免在同一个渲染周期内触发多次状态更新
          setTimeout(() => {
            setActiveFile(newActiveFile);
          }, 0);
        }

        return remaining;
      });
    },
    [activeFile, setActiveFile, setOpenFiles]
  );

  // 重命名文件或文件夹
  const renameItem = useCallback(
    (item: FileItem, newName: string) => {
      if (!item) return;

      // 添加调用堆栈跟踪，帮助调试
      console.log("重命名被调用:", item.path, newName);
      console.log(new Error().stack);

      const oldPath = item.path;

      // 检查是否正在重命名同一个文件
      if (isRenamingRef.current[oldPath]) {
        console.log("重命名操作已在进行中，忽略重复调用:", oldPath);
        return;
      }

      // 设置重命名标志
      isRenamingRef.current[oldPath] = true;
      console.log("设置重命名标志:", oldPath);

      const now = Date.now();
      const parentPath = getParentPath(oldPath);

      // 构建新路径
      const newPath = parentPath === "/" ? `/${newName}` : `${parentPath}/${newName}`;

      // 检查新路径是否已存在
      if (findItem(files, newPath)) {
        alert(`名称 '${newName}' 已存在!`);
        // 重置重命名标志
        isRenamingRef.current[oldPath] = false;
        return;
      }

      // 递归更新路径
      const updatePaths = (oldItemPath: string, newItemPath: string, items: FileItem[]): FileItem[] => {
        return items.map((f) => {
          // 如果是要重命名的项，更新路径和名称
          if (f.path === oldItemPath) {
            // 更新元数据中的更新时间
            const updatedItem = {
              ...f,
              name: newName,
              path: newItemPath,
              metadata: {
                ...(f.metadata || { createdAt: now }),
                updatedAt: now,
              },
            };

            // 如果是文件夹，还需要递归更新所有子项路径
            if (f.type === FileItemType.FOLDER && f.children) {
              // 保留原始子文件的名称，只更新路径
              const updatedChildren = f.children.map((child) => {
                // 获取子项相对于父文件夹的路径
                const childOldPath = child.path;
                const childRelativePath = childOldPath.substring(oldItemPath.length);

                // 构建新路径，保留子项的相对路径
                let childNewPath;
                if (oldItemPath === "/") {
                  // 如果是根目录，特殊处理
                  childNewPath = `/${newName}${childRelativePath}`;
                } else {
                  childNewPath = `${newItemPath}${childRelativePath}`;
                }

                // 创建更新后的子项，仅更新路径，保留原始名称
                const updatedChild = {
                  ...child,
                  path: childNewPath,
                };

                // 如果子项是文件夹，递归更新其子项
                if (updatedChild.type === FileItemType.FOLDER && updatedChild.children) {
                  return {
                    ...updatedChild,
                    children: updatePaths(childOldPath, childNewPath, updatedChild.children),
                  };
                }

                return updatedChild;
              });

              return {
                ...updatedItem,
                children: updatedChildren,
              };
            }

            return updatedItem;
          }

          // 如果是文件夹，递归处理子项
          if (f.type === FileItemType.FOLDER && f.children) {
            return {
              ...f,
              children: updatePaths(oldItemPath, newItemPath, f.children),
            };
          }

          return f;
        });
      };

      // 更新文件系统
      setFiles((prevFiles) => {
        const updatedFiles = updatePaths(oldPath, newPath, prevFiles);
        // 更新缓存
        updateFileCache(updatedFiles);

        // 检查更新后的文件是否存在
        const renamedItem = findItem(updatedFiles, newPath);
        if (!renamedItem) {
          console.error(`重命名后的文件未找到: ${newPath}`);
        } else {
          console.log(`重命名成功: ${oldPath} -> ${newPath}`);
        }

        return updatedFiles;
      });

      // 如果是重命名当前活动文件，更新活动文件路径
      if (activeFile === oldPath) {
        setActiveFile(newPath);
      }

      // 更新打开的文件列表
      setOpenFiles((prev) => {
        // 创建一个新的数组，避免引用问题
        const updatedOpenFiles = prev.map((p) => {
          if (p === oldPath) {
            console.log(`更新打开的文件路径: ${p} -> ${newPath}`);
            return newPath;
          }
          if (item.type === FileItemType.FOLDER && p.startsWith(oldPath + "/")) {
            const updatedPath = newPath + p.substring(oldPath.length);
            console.log(`更新文件夹内文件路径: ${p} -> ${updatedPath}`);
            return updatedPath;
          }
          return p;
        });

        // 确保没有重复的路径
        const uniqueOpenFiles = [...new Set(updatedOpenFiles)];
        console.log("更新后的打开文件列表:", uniqueOpenFiles);

        // 验证更新后的文件是否存在
        uniqueOpenFiles.forEach((filePath) => {
          const fileExists = findItem(files, filePath);
          if (!fileExists) {
            console.log(`警告: 打开文件列表中的文件不存在: ${filePath}`);
          }
        });

        return uniqueOpenFiles;
      });

      setOperations((prev) => [
        ...prev,
        {
          type: "rename",
          path: oldPath,
          newPath,
          isFolder: item.type === FileItemType.FOLDER,
          timestamp: now,
        },
      ]);

      // 更新缓存以确保文件内容与新路径关联
      // 在重置标志前先确保缓存已更新
      const updatedFile = findItem(files, newPath);
      if (updatedFile && updatedFile.type === FileItemType.FILE) {
        console.log(`更新文件缓存: ${newPath}`);
        // 强制更新文件内容，确保缓存与新路径关联
        if (activeFile === newPath) {
          // 如果是活动文件，先切换到空文件再切回来，强制刷新缓存
          setActiveFile(null);
          setTimeout(() => {
            setActiveFile(newPath);
          }, 0);
        }
      }

      // 重置重命名标志，允许再次重命名
      // 使用 Promise 来确保在状态更新完成后重置标志
      // 使用 requestAnimationFrame 确保在下一帧渲染周期后执行
      requestAnimationFrame(() => {
        // 使用 Promise 确保在微任务队列中执行
        Promise.resolve().then(() => {
          setTimeout(() => {
            // 清除重命名标志
            if (isRenamingRef.current[oldPath]) {
              delete isRenamingRef.current[oldPath];
              console.log(`重命名操作完成，重置标志: ${oldPath}`);
            }
          }, 500); // 增加延迟时间，确保操作完成
        });
      });
    },
    [activeFile, files, findItem, getParentPath, setActiveFile, setFiles, setOpenFiles, setOperations, updateFileCache]
  );

  // 删除文件或文件夹
  const deleteItem = useCallback(
    (path: string) => {
      const item = findItem(files, path);
      if (!item) return;

      const parentPath = getParentPath(path);
      const now = Date.now();

      // 从父文件夹中移除项
      setFiles((prevFiles) => {
        let updatedFiles;

        if (parentPath === "/") {
          // 如果在根目录，直接过滤掉
          updatedFiles = prevFiles.filter((f) => f.path !== path);
        } else {
          // 更新父文件夹
          updatedFiles = findAndUpdateItem(prevFiles, parentPath, (p) => ({
            ...p,
            children: (p.children || []).filter((c) => c.path !== path),
          }));
        }

        // 更新缓存
        updateFileCache(updatedFiles);
        return updatedFiles;
      });

      // 如果删除的是文件夹，关闭所有子文件
      if (item.type === FileItemType.FOLDER) {
        const filesToRemove = openFiles.filter((p) => p.startsWith(path));

        if (filesToRemove.length > 0) {
          setOpenFiles((prev) => {
            const remaining = prev.filter((p) => !p.startsWith(path));

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
          setOpenFiles((prev) => {
            const remaining = prev.filter((p) => p !== path);

            // 如果删除的是当前活动文件，设置活动文件为最后一个打开的文件
            if (activeFile === path) {
              const newActiveFile = remaining.length > 0 ? remaining[remaining.length - 1] : null;
              setActiveFile(newActiveFile);
            }

            return remaining;
          });
        }
      }

      setOperations((prev) => [
        ...prev,
        {
          type: "delete",
          path,
          isFolder: item.type === FileItemType.FOLDER,
          timestamp: now,
        },
      ]);

      // 从缓存中删除项及其所有子项
      const cache = pathToItemCacheRef.current;
      if (item.type === FileItemType.FOLDER) {
        // 删除文件夹及其所有子项
        Array.from(cache.keys()).forEach((key) => {
          if (key === path || key.startsWith(`${path}/`)) {
            cache.delete(key);
          }
        });
      } else {
        // 只删除单个文件
        cache.delete(path);
      }
    },
    [activeFile, files, findItem, getParentPath, openFiles, findAndUpdateItem, setActiveFile, setFiles, setOpenFiles, setOperations, updateFileCache]
  );

  // 更新文件内容（添加更新时间戳）
  const updateFileContent = useCallback(
    (path: string, content: string) => {
      const now = Date.now();

      setFiles((prevFiles) =>
        findAndUpdateItem(prevFiles, path, (item) => {
          // 计算新的文件大小
          const size = new Blob([content]).size;

          return {
            ...item,
            content,
            metadata: {
              ...(item.metadata || { createdAt: now }),
              updatedAt: now,
              size,
            },
          };
        })
      );

      setOperations((prev) => [
        ...prev,
        {
          type: "update",
          path,
          timestamp: now,
        },
      ]);
    },
    [findAndUpdateItem, setFiles, setOperations]
  );

  // 设置活动文件标签
  const setActiveTab = useCallback(
    (path: string) => {
      console.log("设置活动标签:", path);

      // 验证文件是否存在
      const existingFile = findItem(files, path);
      if (!existingFile) {
        console.error(`要设置为活动标签的文件不存在: ${path}`);
        return;
      }

      if (openFiles.includes(path)) {
        setActiveFile(path);
      } else {
        console.log(`文件 ${path} 不在打开列表中，无法设置为活动标签`);
      }
    },
    [files, findItem, openFiles, setActiveFile]
  );

  // 创建目录结构
  const createDirectory = useCallback(
    async (path: string) => {
      if (!path || path === "/" || path === ".") return true;

      // 检查目录是否存在
      const existingDir = findItem(files, path);
      if (existingDir) return true;

      // 获取父目录路径
      const parentPath = getParentPath(path);

      // 递归创建父目录
      await createDirectory(parentPath);

      // 创建当前目录
      const dirName = path.split("/").pop() || "";
      createFolder(parentPath, {
        name: dirName,
        path: path,
        type: FileItemType.FOLDER,
        children: [],
      });

      return true;
    },
    [files, findItem, getParentPath, createFolder]
  );

  // 写入文件（创建或更新）
  const writeFile = useCallback(
    async (path: string, content: string) => {
      // 检查文件是否存在
      const existingFile = findItem(files, path);

      if (existingFile) {
        // 如果文件存在，更新内容
        updateFileContent(path, content);
        return true;
      } else {
        // 如果文件不存在，创建目录和文件
        try {
          // 获取父目录路径
          const parentPath = getParentPath(path);

          // 创建目录结构
          await createDirectory(parentPath);

          // 创建文件
          const fileName = path.split("/").pop() || "";
          createFile(parentPath, {
            name: fileName,
            path: path,
            type: FileItemType.FILE,
            content: content,
          });

          return true;
        } catch (error) {
          console.error(`写入文件失败: ${path}`, error);
          return false;
        }
      }
    },
    [files, findItem, updateFileContent, getParentPath, createFile, createDirectory]
  );

  // 检查文件是否存在
  const fileExists = useCallback(
    (path: string) => {
      return !!findItem(files, path);
    },
    [files, findItem]
  );

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
    activeFileContent,
    setActiveTab,
    resetFileSystem,
    findFirstFile,
    updateFileCache,
    writeFile,
    createDirectory,
    fileExists,
  };
};
