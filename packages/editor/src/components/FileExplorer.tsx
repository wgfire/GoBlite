import React, { useState } from 'react';
import { useEditor } from '../hooks/useEditor';
import { FileTreeNode } from '../types';

interface FileExplorerProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 文件浏览器组件
 * 显示项目文件结构，支持文件操作
 */
const FileExplorer: React.FC<FileExplorerProps> = ({ className, style }) => {
  const { 
    fileTree, 
    activeFile, 
    openFile,
    createFile,
    deleteFile,
    renameFile
  } = useEditor();
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [contextMenuInfo, setContextMenuInfo] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: FileTreeNode | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null
  });
  const [newItemInfo, setNewItemInfo] = useState<{
    parentPath: string;
    isCreating: boolean;
    isFolder: boolean;
    name: string;
  } | null>(null);
  const [renameInfo, setRenameInfo] = useState<{
    node: FileTreeNode;
    name: string;
  } | null>(null);

  // 切换文件夹展开状态
  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // 处理文件点击
  const handleFileClick = (node: FileTreeNode) => {
    if (node.isDirectory) {
      toggleFolder(node.path);
    } else {
      openFile(node.path);
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent, node: FileTreeNode) => {
    e.preventDefault();
    setContextMenuInfo({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node
    });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenuInfo(prev => ({
      ...prev,
      visible: false
    }));
  };

  // 处理新建文件/文件夹
  const handleCreate = (parentPath: string, isFolder: boolean) => {
    closeContextMenu();
    setNewItemInfo({
      parentPath,
      isCreating: true,
      isFolder,
      name: ''
    });
  };

  // 处理删除文件/文件夹
  const handleDelete = (node: FileTreeNode) => {
    closeContextMenu();
    if (window.confirm(`确定要删除 ${node.name} 吗？`)) {
      deleteFile(node.path);
    }
  };

  // 处理重命名
  const handleRename = (node: FileTreeNode) => {
    closeContextMenu();
    setRenameInfo({
      node,
      name: node.name
    });
  };

  // 提交新建文件/文件夹
  const submitNewItem = () => {
    if (!newItemInfo || !newItemInfo.name.trim()) {
      setNewItemInfo(null);
      return;
    }

    const path = `${newItemInfo.parentPath}/${newItemInfo.name}`.replace(/\/+/g, '/');
    
    if (newItemInfo.isFolder) {
      // 创建文件夹（在实际应用中，这里需要调用文件系统API）
      // 由于我们的模型中没有直接创建文件夹的方法，这里可以创建一个.gitkeep文件来表示文件夹
      createFile(`${path}/.gitkeep`, '');
    } else {
      // 创建文件
      createFile(path, '');
    }
    
    setNewItemInfo(null);
  };

  // 提交重命名
  const submitRename = () => {
    if (!renameInfo || !renameInfo.name.trim()) {
      setRenameInfo(null);
      return;
    }

    const oldPath = renameInfo.node.path;
    const pathParts = oldPath.split('/');
    pathParts.pop();
    const newPath = [...pathParts, renameInfo.name].join('/');
    
    renameFile(oldPath, newPath);
    setRenameInfo(null);
  };

  // 渲染文件树节点
  const renderNode = (node: FileTreeNode) => {
    const isExpanded = expandedFolders[node.path];
    const isActive = activeFile && activeFile.path === node.path;
    
    // 检查是否正在重命名该节点
    const isRenaming = renameInfo && renameInfo.node.path === node.path;
    
    // 检查是否正在该节点下创建新项目
    const isCreatingChild = newItemInfo && newItemInfo.parentPath === node.path;

    return (
      <div key={node.path} className="file-node">
        <div 
          className={`file-node-item ${isActive ? 'active' : ''}`}
          onClick={() => handleFileClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          <span className="file-icon">
            {node.isDirectory ? (isExpanded ? '📂' : '📁') : getFileIcon(node.extension || '')}
          </span>
          
          {isRenaming ? (
            <input
              type="text"
              value={renameInfo.name}
              onChange={(e) => setRenameInfo({ ...renameInfo, name: e.target.value })}
              onBlur={submitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitRename();
                if (e.key === 'Escape') setRenameInfo(null);
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="file-name">{node.name}</span>
          )}
        </div>
        
        {node.isDirectory && isExpanded && (
          <div className="file-children">
            {node.children?.map(child => renderNode(child))}
            
            {isCreatingChild && (
              <div className="file-node-item new-item">
                <span className="file-icon">
                  {newItemInfo.isFolder ? '📁' : '📄'}
                </span>
                <input
                  type="text"
                  value={newItemInfo.name}
                  onChange={(e) => setNewItemInfo({ ...newItemInfo, name: e.target.value })}
                  onBlur={submitNewItem}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitNewItem();
                    if (e.key === 'Escape') setNewItemInfo(null);
                  }}
                  autoFocus
                  placeholder={newItemInfo.isFolder ? '新文件夹名称' : '新文件名称'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`file-explorer ${className || ''}`} 
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'auto',
        backgroundColor: '#252526',
        color: '#d4d4d4',
        ...style 
      }}
      onClick={closeContextMenu}
    >
      <div className="file-explorer-header" style={{ padding: '8px', borderBottom: '1px solid #3c3c3c' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>文件浏览器</h3>
      </div>
      
      <div className="file-tree" style={{ padding: '8px' }}>
        {fileTree.map(node => renderNode(node))}
        
        {fileTree.length === 0 && (
          <div className="empty-message" style={{ padding: '16px', textAlign: 'center' }}>
            <p>没有文件</p>
            <button 
              onClick={() => handleCreate('', false)}
              style={{
                backgroundColor: '#0e639c',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              创建文件
            </button>
          </div>
        )}
      </div>
      
      {/* 右键菜单 */}
      {contextMenuInfo.visible && contextMenuInfo.node && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenuInfo.y,
            left: contextMenuInfo.x,
            backgroundColor: '#2d2d2d',
            border: '1px solid #3c3c3c',
            borderRadius: '2px',
            zIndex: 1000,
            minWidth: '150px'
          }}
        >
          {contextMenuInfo.node.isDirectory && (
            <>
              <div 
                className="menu-item"
                onClick={() => handleCreate(contextMenuInfo.node!.path, false)}
                style={{ padding: '6px 12px', cursor: 'pointer', hover: { backgroundColor: '#3c3c3c' } }}
              >
                新建文件
              </div>
              <div 
                className="menu-item"
                onClick={() => handleCreate(contextMenuInfo.node!.path, true)}
                style={{ padding: '6px 12px', cursor: 'pointer', hover: { backgroundColor: '#3c3c3c' } }}
              >
                新建文件夹
              </div>
              <div className="menu-separator" style={{ borderTop: '1px solid #3c3c3c', margin: '4px 0' }} />
            </>
          )}
          <div 
            className="menu-item"
            onClick={() => handleRename(contextMenuInfo.node!)}
            style={{ padding: '6px 12px', cursor: 'pointer', hover: { backgroundColor: '#3c3c3c' } }}
          >
            重命名
          </div>
          <div 
            className="menu-item"
            onClick={() => handleDelete(contextMenuInfo.node!)}
            style={{ padding: '6px 12px', cursor: 'pointer', hover: { backgroundColor: '#3c3c3c' }, color: '#e51400' }}
          >
            删除
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 根据文件扩展名获取文件图标
 * @param extension 文件扩展名
 * @returns 文件图标
 */
function getFileIcon(extension: string): string {
  const iconMap: Record<string, string> = {
    'js': '📄',
    'jsx': '📄',
    'ts': '📄',
    'tsx': '📄',
    'html': '📄',
    'css': '📄',
    'json': '📄',
    'md': '📄',
    'vue': '📄',
    'gitkeep': '📄'
  };
  
  return iconMap[extension] || '📄';
}

export default FileExplorer;
