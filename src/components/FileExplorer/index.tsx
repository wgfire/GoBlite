import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiFolderPlus, FiFilePlus, FiChevronRight, FiChevronDown, FiEdit2, FiTrash2, FiFile, FiMoreVertical, FiCheck, FiX } from "react-icons/fi";
import { FileItem, FileItemType } from "@core/fileSystem/types";
import { useFileSystem } from "@core/fileSystem/hooks/useFileSystem";

interface FileExplorerProps {
  onFileOpen?: (file: FileItem) => void;
}

interface EditingState {
  path: string;
  type: "rename" | "newFile" | "newFolder";
  parentPath?: string;
  name: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ onFileOpen }) => {
  const { files, activeFile, createFile, createFolder, openFile, renameItem, deleteItem, findItem } = useFileSystem();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "/": true,
    "/src": true,
    "/public": true,
  });

  const [editing, setEditing] = useState<EditingState | null>(null);
  // 添加一个标志来跟踪是否正在重命名
  const isRenamingRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理重命名保存
  const handleSaveRename = useCallback(() => {
    // 如果已经在重命名中，直接返回
    if (isRenamingRef.current) {
      console.log("重命名已在进行中，忽略重复调用");
      return;
    }

    if (!editing || editing.type !== "rename") return;

    const item = findItem(files, editing.path);
    if (!item || !editing.name.trim()) {
      setEditing(null);
      return;
    }

    // 如果名称没有变化，直接取消编辑
    if (item.name === editing.name) {
      setEditing(null);
      return;
    }

    // 设置标志表示正在重命名
    isRenamingRef.current = true;

    // 保存新名称
    const newName = editing.name;

    // 先清除编辑状态，然后再执行重命名
    // 这样可以避免重命名过程中的闪烁
    setEditing(null);

    // 使用 requestAnimationFrame 确保在下一帧渲染周期后执行重命名
    requestAnimationFrame(() => {
      // 执行重命名
      renameItem(item, newName);

      // 重置标志
      setTimeout(() => {
        isRenamingRef.current = false;
      }, 100); // 减少延迟时间
    });
  }, [editing, files, findItem, renameItem, setEditing]);

  // 自动聚焦输入框，但不全选文本
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // 点击文档其他区域时取消编辑
  useEffect(() => {
    // 如果没有正在编辑的内容，不需要添加事件监听
    if (!editing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest(".edit-actions")) {
        // 如果点击的不是输入框或编辑按钮，则保存当前编辑
        if (editing.type === "rename") {
          // 直接调用已经优化过的 handleSaveRename 函数
          handleSaveRename();
        } else if (editing.name.trim()) {
          // 处理新建文件/文件夹保存
          if (!editing || !editing.parentPath) return;

          const newPath = editing.parentPath === "/" ? `/${editing.name}` : `${editing.parentPath}/${editing.name}`;

          // 检查是否已存在同名文件/文件夹
          if (findItem(files, newPath)) {
            alert(`${editing.type === "newFolder" ? "文件夹" : "文件"} ${editing.name} 已存在!`);
            setEditing(null);
            return;
          }

          // 先清除编辑状态
          const type = editing.type;
          const name = editing.name;
          const parentPath = editing.parentPath;
          setEditing(null);

          // 执行创建
          if (type === "newFile") {
            const newFile: FileItem = {
              name,
              path: newPath,
              type: FileItemType.FILE,
              content: "",
            };
            createFile(parentPath, newFile);
          } else {
            const newFolder: FileItem = {
              name,
              path: newPath,
              type: FileItemType.FOLDER,
              children: [],
            };
            createFolder(parentPath, newFolder);
          }
        } else {
          // 取消编辑
          setEditing(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editing, files, findItem, renameItem, createFile, createFolder, setEditing, handleSaveRename]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === FileItemType.FILE) {
      openFile(file);
      if (onFileOpen) {
        onFileOpen(file);
      }
    }
  };

  // 处理重命名开始
  const handleStartRename = (item: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editing) {
      // 如果已经在编辑状态，先保存当前编辑
      if (editing.type === "rename") {
        handleSaveRename();
      } else if (editing.name.trim()) {
        handleSaveNew();
      } else {
        handleCancelEdit();
      }
    }

    setEditing({
      path: item.path,
      type: "rename",
      name: item.name,
    });
  };

  // 处理新建文件开始
  const handleStartAddFile = (parentPath: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (editing) {
      // 如果已经在编辑状态，先保存当前编辑
      if (editing.type === "rename") {
        handleSaveRename();
      } else if (editing.name.trim()) {
        handleSaveNew();
      } else {
        handleCancelEdit();
      }
    }

    // 确保父文件夹展开
    if (parentPath !== "/") {
      setExpandedFolders((prev) => ({
        ...prev,
        [parentPath]: true,
      }));
    }

    setEditing({
      path: `${parentPath}/__new_file__`,
      type: "newFile",
      parentPath,
      name: "",
    });
  };

  // 处理新建文件夹开始
  const handleStartAddFolder = (parentPath: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (editing) {
      // 如果已经在编辑状态，先保存当前编辑
      if (editing.type === "rename") {
        handleSaveRename();
      } else if (editing.name.trim()) {
        handleSaveNew();
      } else {
        handleCancelEdit();
      }
    }

    // 确保父文件夹展开
    if (parentPath !== "/") {
      setExpandedFolders((prev) => ({
        ...prev,
        [parentPath]: true,
      }));
    }

    setEditing({
      path: `${parentPath}/__new_folder__`,
      type: "newFolder",
      parentPath,
      name: "",
    });
  };

  // 处理新建文件/文件夹保存
  const handleSaveNew = useCallback(() => {
    if (!editing || !editing.parentPath) return;

    // 如果名称为空，取消创建
    if (!editing.name.trim()) {
      setEditing(null);
      return;
    }

    const newPath = editing.parentPath === "/" ? `/${editing.name}` : `${editing.parentPath}/${editing.name}`;

    // 检查是否已存在同名文件/文件夹
    if (findItem(files, newPath)) {
      alert(`${editing.type === "newFolder" ? "文件夹" : "文件"} ${editing.name} 已存在!`);
      setEditing(null);
      return;
    }

    // 执行创建
    if (editing.type === "newFile") {
      const newFile: FileItem = {
        name: editing.name,
        path: newPath,
        type: FileItemType.FILE,
        content: "",
      };
      createFile(editing.parentPath, newFile);
    } else {
      const newFolder: FileItem = {
        name: editing.name,
        path: newPath,
        type: FileItemType.FOLDER,
        children: [],
      };
      createFolder(editing.parentPath, newFolder);
    }

    setEditing(null);
  }, [editing, files, findItem, createFile, createFolder, setEditing]);

  // 处理取消编辑
  const handleCancelEdit = useCallback(() => {
    setEditing(null);
  }, [setEditing]);

  // 处理删除
  const handleDeleteItem = (item: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteItem(item.path);
  };

  // 处理输入框按键事件
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (editing?.type === "rename") {
          handleSaveRename();
        } else {
          handleSaveNew();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancelEdit();
      }
    },
    [editing, handleSaveRename, handleSaveNew, handleCancelEdit]
  );

  // 处理输入框内容变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;

    const newValue = e.target.value;
    setEditing({ ...editing, name: newValue });
  };

  // 处理输入框失焦事件
  const handleInputBlur = (e: React.FocusEvent) => {
    // 如果失焦是因为点击了编辑按钮，不做处理
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest(".edit-actions")) {
      return;
    }
  };

  const getFileIcon = (file: FileItem) => {
    // 只返回文件图标，文件夹图标单独处理
    if (file.type === FileItemType.FOLDER) {
      return null;
    }

    // Determine file icon based on extension
    const extension = file.path.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "html":
        return <FiFile className="text-[#e34c26]" />;
      case "css":
        return <FiFile className="text-[#264de4]" />;
      case "js":
        return <FiFile className="text-[#f0db4f]" />;
      case "ts":
      case "tsx":
        return <FiFile className="text-[#3178c6]" />;
      case "json":
        return <FiFile className="text-[#5b5b5b]" />;
      case "md":
        return <FiFile className="text-[#083fa1]" />;
      default:
        return <FiFile className="text-gray-400" />;
    }
  };

  const renderNewItemInput = (parentPath: string, type: "newFile" | "newFolder") => {
    if (!editing || editing.parentPath !== parentPath || editing.type !== type) return null;

    const indentLevel = parentPath.split("/").filter(Boolean).length;

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className={`flex items-center h-8 pl-${(indentLevel + 1) * 4} pr-2 group`}>
          <div className="flex items-center justify-center w-5 h-5 mr-2">
            {type === "newFolder" ? <FiFolder className="text-yellow-400" /> : <FiFile className="text-gray-400" />}
          </div>
          <motion.div className="flex-1 relative" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-gray-800 border border-blue-500 rounded px-2 py-1 text-sm text-white outline-none"
              value={editing.name}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              placeholder={type === "newFolder" ? "新文件夹名称" : "新文件名称"}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-800 pl-1">
              <button className="edit-actions p-1 rounded hover:bg-blue-600/20 text-blue-500" onClick={handleSaveNew}>
                <FiCheck size={14} />
              </button>
              <button className="edit-actions p-1 rounded hover:bg-red-600/20 text-red-500" onClick={handleCancelEdit}>
                <FiX size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const renderFileTree = (fileList: FileItem[], level = 0) => {
    return fileList.map((file) => {
      const isFolder = file.type === FileItemType.FOLDER;
      const isExpanded = expandedFolders[file.path];
      const isActive = activeFile === file.path;
      const isRenaming = editing?.path === file.path && editing?.type === "rename";

      // 计算缩进
      const paddingLeft = level * 16;

      return (
        <React.Fragment key={file.path}>
          <motion.div
            className={`relative ${isActive ? "bg-blue-800/30" : "hover:bg-gray-700/30"} ${isRenaming ? "z-10" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex items-center h-8 pr-2 group"
              style={{ paddingLeft: `${paddingLeft}px` }}
              onClick={() => (isFolder ? toggleFolder(file.path) : handleFileClick(file))}
            >
              {isFolder && (
                <div
                  className="flex items-center justify-center w-4 h-4 mr-1 cursor-pointer text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(file.path);
                  }}
                >
                  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                </div>
              )}

              <div className="flex items-center justify-center w-5 h-5 mr-2">{isFolder ? <FiFolder className="text-yellow-400" /> : getFileIcon(file)}</div>

              {isRenaming ? (
                <motion.div className="flex-1 relative" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-gray-800 border border-blue-500 rounded px-2 py-1 text-sm text-white outline-none"
                    value={editing.name}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-800 pl-1">
                    <button className="edit-actions p-1 rounded hover:bg-blue-600/20 text-blue-500" onClick={handleSaveRename}>
                      <FiCheck size={14} />
                    </button>
                    <button className="edit-actions p-1 rounded hover:bg-red-600/20 text-red-500" onClick={handleCancelEdit}>
                      <FiX size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <span className="flex-1 truncate text-sm text-gray-200">{file.name}</span>
                  <div className="hidden group-hover:flex items-center gap-1 bg-gray-800/80 rounded p-0.5">
                    {isFolder && (
                      <>
                        <button
                          className="edit-actions p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                          onClick={(e) => handleStartAddFile(file.path, e)}
                          title="添加文件"
                        >
                          <FiFilePlus size={14} />
                        </button>
                        <button
                          className="edit-actions p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                          onClick={(e) => handleStartAddFolder(file.path, e)}
                          title="添加文件夹"
                        >
                          <FiFolderPlus size={14} />
                        </button>
                      </>
                    )}
                    <button className="edit-actions p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white" onClick={(e) => handleStartRename(file, e)} title="重命名">
                      <FiEdit2 size={14} />
                    </button>
                    <button className="edit-actions p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white" onClick={(e) => handleDeleteItem(file, e)} title="删除">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {isFolder && (
            <AnimatePresence>
              {isExpanded && (
                <div>
                  {renderNewItemInput(file.path, "newFile")}
                  {renderNewItemInput(file.path, "newFolder")}
                  {file.children && renderFileTree(file.children, level + 1)}
                </div>
              )}
            </AnimatePresence>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 select-none">
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
        <h3 className="text-sm font-medium">文件浏览器</h3>
        <div className="flex gap-1">
          <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white" onClick={() => handleStartAddFile("/")} title="新建文件">
            <FiFilePlus size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white" onClick={() => handleStartAddFolder("/")} title="新建文件夹">
            <FiFolderPlus size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white" title="更多选项">
            <FiMoreVertical size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        <AnimatePresence>
          {renderNewItemInput("/", "newFile")}
          {renderNewItemInput("/", "newFolder")}
          {renderFileTree(files)}
        </AnimatePresence>
      </div>
    </div>
  );
};
