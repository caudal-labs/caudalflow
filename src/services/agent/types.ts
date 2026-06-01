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
  args: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  result: any;
}

export interface CanvasState {
  nodes: any[];
  edges: any[];
  conversations: Record<string, any>;
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
  data: any;
}
