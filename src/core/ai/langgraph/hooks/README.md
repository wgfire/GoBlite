# useAgentChat Hook

`useAgentChat` 是一个 React Hook，用于在 React 应用中集成基于 LangGraph 的聊天代理，并支持自动状态持久化。

## 功能特点

- 使用 IndexedDBMemorySaver 自动保存聊天状态到浏览器
- 支持多个会话管理（创建、切换、删除）
- 自动加载上一次的聊天内容
- 提供简单的 API 发送消息和管理会话
- 支持自定义模型配置

## 使用方法

### 基本用法

```tsx
import { useAgentChat } from '@/core/ai/langgraph/hooks/useAgentChat';

function ChatComponent() {
  const {
    isInitialized,
    isLoading,
    error,
    conversations,
    currentConversationId,
    messages,
    sendMessage,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearAllConversations,
  } = useAgentChat();

  // 发送消息
  const handleSend = async () => {
    await sendMessage('你好，请介绍一下自己！');
  };

  // 创建新会话
  const handleNewChat = async () => {
    await createNewConversation();
  };

  return (
    <div>
      {/* 渲染聊天界面 */}
    </div>
  );
}
```

### 自定义配置

```tsx
const {
  // ...
} = useAgentChat({
  apiKey: 'your-api-key',
  provider: ModelProvider.OPENAI,
  modelType: ModelType.GPT4O,
  temperature: 0.7,
  maxTokens: 2000,
  dbName: 'my_chat_app',
  storeName: 'conversations',
  systemPrompt: '你是一个有用的AI助手，能够回答用户的问题并提供帮助。'
});
```

## API 参考

### 选项

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| apiKey | string | DEFAULT_MODEL_CONFIG.apiKey | API密钥 |
| provider | ModelProvider | DEFAULT_MODEL_CONFIG.provider | 模型提供商 |
| modelType | ModelType | DEFAULT_MODEL_CONFIG.modelType | 模型类型 |
| temperature | number | 0.7 | 温度参数 |
| maxTokens | number | 2000 | 最大token数 |
| dbName | string | 'agent_chat_memory' | IndexedDB数据库名称 |
| storeName | string | 'conversations' | IndexedDB存储名称 |
| systemPrompt | string | '你是一个有用的AI助手...' | 系统提示词 |

### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| isInitialized | boolean | 代理是否已初始化 |
| isLoading | boolean | 是否正在加载 |
| error | string \| null | 错误信息 |
| conversations | Conversation[] | 会话列表 |
| currentConversationId | string \| null | 当前会话ID |
| messages | Message[] | 当前会话的消息列表 |
| sendMessage | (content: string) => Promise<Message \| null> | 发送消息 |
| createNewConversation | () => Promise<string \| null> | 创建新会话 |
| switchConversation | (id: string) => Promise<void> | 切换会话 |
| deleteConversation | (id: string) => Promise<void> | 删除会话 |
| clearAllConversations | () => Promise<void> | 清空所有会话 |
| agent | object | 原始代理对象 |
| currentState | object | 当前状态对象 |

## 与 ChatHeader 组件集成

`useAgentChat` 可以与 `ChatHeader` 组件集成，提供会话管理功能：

```tsx
import { useState } from 'react';
import { useAgentChat } from '@/core/ai/langgraph/hooks/useAgentChat';
import { ChatHeader } from '@/components/Chat/ChatHeader';
import { HeaderTab } from '@/components/Chat/types';

function ChatApp() {
  const [activeTab, setActiveTab] = useState<HeaderTab>('conversations');
  
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearAllConversations,
    // ...其他属性和方法
  } = useAgentChat();

  return (
    <div>
      <ChatHeader
        onTemplateSelect={() => {}}
        selectedTemplate={null}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onCreateNewConversation={createNewConversation}
        onSwitchConversation={switchConversation}
        onDeleteConversation={deleteConversation}
        onClearAllConversations={clearAllConversations}
      />
      
      {/* 其他聊天UI组件 */}
    </div>
  );
}
```

## 示例

完整示例请参考 `src/components/Chat/AgentChatExample.tsx`。
