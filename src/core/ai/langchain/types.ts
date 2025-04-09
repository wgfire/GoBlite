/**
 * LangChain service types
 */

export interface LangChainServiceConfig {
  defaultModelName: string;
  apiKey?: string;
  baseUrl?: string;
  memoryType?: 'buffer' | 'summary' | 'conversation' | 'vector';
  persistenceProvider?: 'localStorage' | 'indexedDB' | 'custom';
  maxTokens?: number;
  temperature?: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ConversationInfo {
  id: string;
  name: string;
  lastMessage?: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface LangChainService {
  initialize(config: LangChainServiceConfig): Promise<boolean>;
  createConversation(id: string, options?: any): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | null>;
  listConversations(): Promise<ConversationInfo[]>;
  deleteConversation(id: string): Promise<boolean>;
  sendMessage(conversationId: string, message: string): Promise<string>;
}

export interface TemplateAnalysisResult {
  templateId: string;
  templatePath: string;
  businessContext: BusinessContext;
  components: ComponentInfo[];
  structure: TemplateStructure;
  metadata: Record<string, any>;
  similarTemplates?: string[];
}

export interface BusinessContext {
  industry: string;
  businessGoal: string;
  targetAudience: string;
  designStyle: string;
}

export interface ComponentInfo {
  id: string;
  name: string;
  type: 'UI' | 'business' | 'functional';
  description: string;
  properties?: Record<string, any>;
}

export interface TemplateStructure {
  elements: TemplateElement[];
}

export interface TemplateElement {
  id: string;
  type: string;
  name: string;
  children?: TemplateElement[];
  properties?: Record<string, any>;
}

export interface TemplateRecommendation {
  templateId: string;
  templatePath: string;
  templateName: string;
  description: string;
  matchScore: number;
  businessContextMatch: BusinessContextMatch;
  previewUrl?: string;
  recommendedComponents?: ComponentRecommendation[];
}

export interface BusinessContextMatch {
  industry: string;
  businessGoal: string;
  targetAudience: string;
  designStyle: string;
}

export interface ComponentRecommendation {
  componentId: string;
  componentName: string;
  description: string;
  matchScore: number;
}
