import { useState, useCallback } from 'react';
import { agentClient } from './client';
import type { AgentEvent, CanvasState } from './types';
import { useFlowStore } from '../../stores/flowStore';
import { useChatStore } from '../../stores/chatStore';

export function useAgent() {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const buildCanvasState = useCallback((): CanvasState => {
    const flow = useFlowStore.getState();
    const chat = useChatStore.getState();

    return {
      nodes: flow.nodes,
      edges: flow.edges,
      conversations: chat.conversations,
      activeNodeId: chat.activeNodeContext?.nodeId,
      selectedNodeIds: flow.nodes.filter((n) => n.selected).map((n) => n.id),
    };
  }, []);

  const send = useCallback(async (message: string) => {
    setIsRunning(true);
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    const canvasState = buildCanvasState();
    const threadId = crypto.randomUUID();

    let assistantMessage = '';

    await agentClient.sendMessage(message, canvasState, threadId, (event: AgentEvent) => {
      switch (event.type) {
        case 'text_delta':
          assistantMessage += event.data.delta;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg?.role === 'assistant') {
              lastMsg.content = assistantMessage;
            } else {
              newMessages.push({ role: 'assistant', content: assistantMessage });
            }
            return newMessages;
          });
          break;
        case 'tool_call':
          // Handle tool calls (update canvas, render UI, etc.)
          console.log('Tool call:', event.data);
          break;
        case 'error':
          console.error('Agent error:', event.data.error);
          break;
      }
    });

    setIsRunning(false);
  }, [buildCanvasState]);

  const abort = useCallback(() => {
    agentClient.abort();
    setIsRunning(false);
  }, []);

  return {
    messages,
    isRunning,
    send,
    abort,
  };
}
