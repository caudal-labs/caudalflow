export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  images?: {
    base64: string;
    mimeType: string;
  }[];
  triggeredBy?: string;
}

export interface Conversation {
  nodeId: string;
  messages: ChatMessage[];
  isStreaming: boolean;
}

export interface LLMConfig {
  providerId: string;
  providerName: string;
  endpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  mockDelay: number;
}
