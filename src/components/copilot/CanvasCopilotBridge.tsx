import { useEffect } from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { useChatStore } from '../../stores/chatStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';

export function CanvasCopilotBridge() {
  // Sync canvas state for the new Agent
  useEffect(() => {
    const unsubscribeFlow = useFlowStore.subscribe(() => {
      // State changes will be picked up by useAgent hook
    });
    const unsubscribeChat = useChatStore.subscribe(() => {
      // State changes will be picked up by useAgent hook
    });
    const unsubscribeWorkspace = useWorkspaceStore.subscribe(() => {
      // State changes will be picked up by useAgent hook
    });

    return () => {
      unsubscribeFlow();
      unsubscribeChat();
      unsubscribeWorkspace();
    };
  }, []);

  return null;
}
