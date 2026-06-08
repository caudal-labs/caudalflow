export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: ToolCall[];
  timestamp: number;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  result: unknown;
}

export interface CanvasState {
  nodes: unknown[];
  edges: unknown[];
  conversations: Record<string, unknown>;
  activeNodeId?: string;
  selectedNodeIds?: string[];
  mergeContext?: {
    parentIds: string[];
    action: string;
  };
}

export interface AgentRequest {
  message: string;
  canvasState: CanvasState;
  threadId: string;
}

export interface AgentResponse {
  type: 'text' | 'tool_call' | 'error';
  content?: string;
  toolCall?: ToolCall;
  error?: string;
}

export type AgentEventType = 
  | 'message_start'
  | 'text_delta'
  | 'tool_call'
  | 'message_end'
  | 'error';

export interface AgentEvent {
  type: AgentEventType;
  data: unknown;
}
