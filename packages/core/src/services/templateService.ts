import { TemplateMetadata, FileSystemTree } from '../types';
import { FileSystemUtils } from '../utils/fileSystemUtils';

/**
 * 模板服务
 * 负责管理和加载应用模板
 */
export class TemplateService {
  private static instance: TemplateService;
  private templatesCache: Map<string, TemplateMetadata>;
  
  private constructor() {
    this.templatesCache = new Map();
  }
  
  /**
   * 获取模板服务单例
   */
  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }
  
  /**
   * 加载所有可用模板的元数据
   * @param templatesPath 模板目录路径
   * @returns 模板元数据数组
   */
  public async loadTemplates(templatesPath: string): Promise<TemplateMetadata[]> {
    try {
      // 在实际应用中，这里会从文件系统读取模板目录
      // 在浏览器环境中，我们可能需要通过API获取
      
      // 模拟从API获取模板列表
      const templates = await this.fetchTemplatesList(templatesPath);
      
      // 缓存模板数据
      templates.forEach(template => {
        this.templatesCache.set(template.name, template);
      });
      
      return templates;
    } catch (error) {
      console.error('加载模板失败:', error);
      return [];
    }
  }
  
  /**
   * 获取单个模板的元数据
   * @param templateName 模板名称
   * @returns 模板元数据，如果不存在则返回null
   */
  public getTemplateMetadata(templateName: string): TemplateMetadata | null {
    return this.templatesCache.get(templateName) || null;
  }
  
  /**
   * 通过标签筛选模板
   * @param tags 标签数组
   * @returns 符合标签条件的模板元数据数组
   */
  public filterTemplatesByTags(tags: string[]): TemplateMetadata[] {
    const results: TemplateMetadata[] = [];
    
    this.templatesCache.forEach(template => {
      // 检查模板是否包含所有指定标签
      const hasAllTags = tags.every(tag => template.tags.includes(tag));
      if (hasAllTags) {
        results.push(template);
      }
    });
    
    return results;
  }
  
  /**
   * 通过框架类型筛选模板
   * @param framework 框架类型
   * @returns 符合框架类型的模板元数据数组
   */
  public filterTemplatesByFramework(framework: string): TemplateMetadata[] {
    const results: TemplateMetadata[] = [];
    
    this.templatesCache.forEach(template => {
      if (template.framework === framework) {
        results.push(template);
      }
    });
    
    return results;
  }
  
  /**
   * 加载模板文件内容
   * @param templateName 模板名称
   * @returns 文件系统树对象，如果模板不存在则返回null
   */
  public async loadTemplateFiles(templateName: string): Promise<FileSystemTree | null> {
    const template = this.getTemplateMetadata(templateName);
    if (!template) return null;
    
    try {
      // 在实际应用中，这里会从文件系统读取模板文件
      // 在浏览器环境中，我们可能需要通过API获取
      
      // 模拟从API获取模板文件
      const files = await this.fetchTemplateFiles(templateName);
      
      // 转换为WebContainer格式
      return FileSystemUtils.toWebContainerFormat(files);
    } catch (error) {
      console.error(`加载模板 ${templateName} 文件失败:`, error);
      return null;
    }
  }
  
  /**
   * 模拟从API获取模板列表
   * 实际应用中应该替换为真实API调用
   * @param templatesPath 模板目录路径
   */
  private async fetchTemplatesList(templatesPath: string): Promise<TemplateMetadata[]> {
    // 这里是模拟数据，实际应用中应该通过API获取
    return [
      {
        name: 'Vue 3 Template',
        description: '基于 Vue 3 和 Vite 的标准模板',
        thumbnail: 'vue-template.png',
        tags: ['vue', 'typescript', 'vite'],
        framework: 'vue',
        language: 'typescript',
        dependencies: {
          'vue': '^3.3.4',
          'vue-router': '^4.2.4'
        },
        devDependencies: {
          'vite': '^4.4.9',
          '@vitejs/plugin-vue': '^4.2.3',
          'typescript': '^5.1.6'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build',
          'preview': 'vite preview'
        },
        files: [
          'src/',
          'public/',
          'index.html',
          'vite.config.ts',
          'tsconfig.json',
          'package.json'
        ]
      },
      {
        name: 'React Template',
        description: '基于 React 和 Vite 的标准模板',
        thumbnail: 'react-template.png',
        tags: ['react', 'typescript', 'vite'],
        framework: 'react',
        language: 'typescript',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'react-router-dom': '^6.15.0'
        },
        devDependencies: {
          'vite': '^4.4.9',
          '@vitejs/plugin-react': '^4.0.4',
          'typescript': '^5.1.6'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build',
          'preview': 'vite preview'
        },
        files: [
          'src/',
          'public/',
          'index.html',
          'vite.config.ts',
          'tsconfig.json',
          'package.json'
        ]
      }
    ];
  }
  
  /**
   * 模拟从API获取模板文件
   * 实际应用中应该替换为真实API调用
   * @param templateName 模板名称
   */
  private async fetchTemplateFiles(templateName: string): Promise<Record<string, string>> {
    // 这里是模拟数据，实际应用中应该通过API获取
    
    // Vue 3 模板简化示例
    if (templateName === 'Vue 3 Template') {
      return {
        'package.json': JSON.stringify({
          name: 'vue-app',
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            'dev': 'vite',
            'build': 'vue-tsc && vite build',
            'preview': 'vite preview'
          },
          dependencies: {
            'vue': '^3.3.4',
            'vue-router': '^4.2.4'
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^4.2.3',
            'typescript': '^5.1.6',
            'vite': '^4.4.9',
            'vue-tsc': '^1.8.8'
          }
        }, null, 2),
        'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
        'src/main.ts': `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`,
        'src/App.vue': `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <h1>Vite + Vue</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit <code>src/App.vue</code> and save to test HMR
      </p>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 2em;
}
</style>`,
        'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})`,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
      };
    }
    
    // React 模板简化示例
    if (templateName === 'React Template') {
      return {
        'package.json': JSON.stringify({
          name: 'react-app',
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            'dev': 'vite',
            'build': 'tsc && vite build',
            'preview': 'vite preview'
          },
          dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'react-router-dom': '^6.15.0'
          },
          devDependencies: {
            '@types/react': '^18.2.21',
            '@types/react-dom': '^18.2.7',
            '@vitejs/plugin-react': '^4.0.4',
            'typescript': '^5.1.6',
            'vite': '^4.4.9'
          }
        }, null, 2),
        'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        'src/App.tsx': `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App`,
        'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
      };
    }
    
    return {};
  }
}

// 导出单例实例
export const templateService = TemplateService.getInstance();
