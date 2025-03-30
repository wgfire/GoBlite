import { atom } from 'jotai';
import { FileItem, FileItemType, FileOperation } from './types';

// 初始文件结构
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
        content: '// 这是一个示例文件\nconsole.log("Hello, World!");\n'
      },
      {
        name: 'app.js',
        path: '/src/app.js',
        type: FileItemType.FILE,
        content: 'function App() {\n  return "App Component";\n}\n\nexport default App;\n'
      },
      {
        name: 'styles.css',
        path: '/src/styles.css',
        type: FileItemType.FILE,
        content: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}\n'
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
        content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Web Editor</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>\n'
      }
    ]
  }
];

// 文件系统状态原子
export const filesAtom = atom<FileItem[]>(initialFiles);
export const operationsAtom = atom<FileOperation[]>([]);
export const activeFileAtom = atom<string | null>(null);
export const openFilesAtom = atom<string[]>([]);

// 辅助函数：查找文件或文件夹
export const findItemHelper = (items: FileItem[], path: string): FileItem | null => {
  // 处理根路径
  if (path === '/') {
    return {
      name: 'root',
      path: '/',
      type: FileItemType.FOLDER,
      children: items
    };
  }

  const normalizedPath = path.toLowerCase();
  
  for (const item of items) {
    if (item.path.toLowerCase() === normalizedPath) {
      return item;
    }

    if (item.type === FileItemType.FOLDER && item.children) {
      const found = findItemHelper(item.children, path);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

// 辅助函数：获取父路径
export const getParentPathHelper = (path: string): string => {
  if (path === '/') return '/';
  
  const parts = path.split('/');
  
  // 如果路径以 / 结尾，移除最后一个空字符串
  if (parts[parts.length - 1] === '') {
    parts.pop();
  }
  
  // 移除最后一个部分（文件名或文件夹名）
  parts.pop();
  
  // 如果结果为空，返回根路径
  if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
    return '/';
  }
  
  return parts.join('/');
};

// 辅助函数：查找并更新文件或文件夹
export const findAndUpdateItemHelper = (
  items: FileItem[],
  path: string,
  updateFn: (item: FileItem) => FileItem
): FileItem[] => {
  return items.map(item => {
    if (item.path === path) {
      return updateFn(item);
    }

    if (item.type === FileItemType.FOLDER && item.children) {
      return {
        ...item,
        children: findAndUpdateItemHelper(item.children, path, updateFn)
      };
    }

    return item;
  });
};

// 派生原子：查找文件或文件夹
export const findItemAtom = atom(
  null,
  (get, set, path: string) => {
    const files = get(filesAtom);
    return findItemHelper(files, path);
  }
);

// 派生原子：获取活动文件内容
export const activeFileContentAtom = atom(
  (get) => {
    const activeFile = get(activeFileAtom);
    const files = get(filesAtom);
    
    if (!activeFile) return '';
    
    const file = findItemHelper(files, activeFile);
    return file && file.type === FileItemType.FILE ? file.content || '' : '';
  }
);
