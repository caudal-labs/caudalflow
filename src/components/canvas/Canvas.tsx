import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  SelectionMode,
  useOnSelectionChange,
  type NodeTypes,
  type EdgeTypes,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import { useFlowStore } from '../../stores/flowStore';
import { useChatStore } from '../../stores/chatStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { ChatNodeComponent } from '../nodes/ChatNode';
import { TopicEdge } from '../edges/TopicEdge';
import { CanvasControls } from './CanvasControls';
import { SettingsPanel } from '../ui/SettingsPanel';
import { WorkspaceSelector } from '../ui/WorkspaceSelector';
import { MergeSelectionPopup } from './MergeSelectionPopup';
import { WelcomePopup } from '../ui/WelcomePopup';
import { calculateMergePosition } from '../../utils/nodeLayout';
import { getMergeSystemPrompt } from '../../utils/systemPrompts';
import { streamChat } from '../../services/llm';
import type { ChatNode } from '../../types/flow';

const nodeTypes: NodeTypes = {
  chat: ChatNodeComponent,
};

const edgeTypes: EdgeTypes = {
  topic: TopicEdge,
};

function SelectionHandler({ onSelectionChange }: { onSelectionChange: (params: OnSelectionChangeParams) => void }) {
  useOnSelectionChange({ onChange: onSelectionChange });
  return null;
}

export function Canvas() {
  const { t } = useTranslation();
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const showMinimap = useSettingsStore((s) => s.showMinimap);
  const [selectedNodes, setSelectedNodes] = useState<ChatNode[]>([]);
  const [spacePressed, setSpacePressed] = useState(false);

  // Listen for space key to toggle pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        // Don't trigger if user is typing in an input
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedNodes(params.nodes as ChatNode[]);
  }, []);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      // Prevent default React Flow zoom behavior
      event.stopPropagation();

      // Don't create node if double-clicking on a node or its children
      const target = event.target as HTMLElement;
      if (target.closest('.react-flow__node')) return;

      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const flowStore = useFlowStore.getState();

      const flowEl = event.currentTarget.querySelector('.react-flow__viewport') as HTMLElement;
      if (!flowEl) return;

      const transform = flowEl.style.transform;
      const match = transform.match(
        /translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)/
      );

      let x = event.clientX - bounds.left;
      let y = event.clientY - bounds.top;

      if (match) {
        const tx = parseFloat(match[1]);
        const ty = parseFloat(match[2]);
        const scale = parseFloat(match[3]);
        x = (x - tx) / scale - 200;
        y = (y - ty) / scale - 250;
      }

      const nodeId = flowStore.addChatNode({ x, y }, {
        topic: t('canvas.newChat'),
        collapsed: false,
      });
      useChatStore.getState().initConversation(nodeId);
    },
    [t]
  );

  const handleConnect = useCallback(
    (connection: { source: string; target: string | null; sourceHandle?: string | null; targetHandle?: string | null }) => {
      const flowStore = useFlowStore.getState();
      if (connection.target) {
        flowStore.addEdge(connection.source, connection.target, '');
      }
    },
    []
  );

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: any) => {
      // If we're not connecting to a valid target, create a new node
      if (connectionState.toNode) return;
      
      const flowStore = useFlowStore.getState();
      const sourceNode = flowStore.nodes.find((n) => n.id === connectionState.fromNode?.id);
      if (!sourceNode) return;

      // Get mouse position
      const flowEl = document.querySelector('.react-flow');
      if (!flowEl) return;
      
      const bounds = flowEl.getBoundingClientRect();
      const viewport = (flowEl.querySelector('.react-flow__viewport') as HTMLElement)?.style.transform;
      const match = viewport?.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)/);
      
      let x = 0;
      let y = 0;
      
      if ('clientX' in event) {
        x = event.clientX - bounds.left;
        y = event.clientY - bounds.top;
      }
      
      if (match) {
        const tx = parseFloat(match[1]);
        const ty = parseFloat(match[2]);
        const scale = parseFloat(match[3]);
        x = (x - tx) / scale;
        y = (y - ty) / scale;
      }

      const newNodeId = flowStore.addChatNode({ x, y }, {
        topic: t('canvas.newChat'),
        collapsed: false,
      });
      
      flowStore.addEdge(sourceNode.id, newNodeId, '');
      useChatStore.getState().initConversation(newNodeId);
    },
    [t]
  );

  const handleMerge = useCallback(
    (action: string) => {
      const flowStore = useFlowStore.getState();
      const chatStore = useChatStore.getState();

      const parentIds = selectedNodes.map((n) => n.id);
      const parentNodes = parentIds
        .map((pid) => flowStore.nodes.find((n) => n.id === pid))
        .filter((n): n is ChatNode => n !== null && n !== undefined);

      if (parentNodes.length < 2) return;

      // Calculate position
      const position = calculateMergePosition(parentNodes);

      // Build topic from action
      const topicLabel = action.length > 30 ? action.slice(0, 30) + '...' : action;

      // Create merge node
      const newNodeId = flowStore.addChatNode(position, {
        topic: topicLabel,
        parentNodeIds: parentIds,
        mergeAction: action,
        collapsed: false,
      });

      // Create edge from each parent to the merge node
      for (const parentId of parentIds) {
        flowStore.addEdge(parentId, newNodeId, action);
      }

      // Initialize conversation
      chatStore.initConversation(newNodeId);

      // Build system prompt from parent data
      const parents = parentNodes.map((node) => {
        const msgs = chatStore.getMessages(node.id)
          .map((m) => ({ role: m.role, content: m.content }));
        return { topic: node.data.topic, messages: msgs };
      });
      const systemPrompt = getMergeSystemPrompt(parents, action);
      chatStore.addMessage(newNodeId, 'system', systemPrompt);

      // Auto-send the user's action as first user message + stream LLM response
      setTimeout(() => {
        const store = useChatStore.getState();
        const messages = store.getMessages(newNodeId);

        store.addMessage(newNodeId, 'user', action);
        store.addMessage(newNodeId, 'assistant', '');
        store.setStreaming(newNodeId, true);

        const controller = new AbortController();

        streamChat(
          [...messages, { id: 'q', role: 'user' as const, content: action, timestamp: Date.now() }],
          {
            onToken: (token: string) => {
              useChatStore.getState().appendToLastMessage(newNodeId, token);
            },
            onDone: () => {
              useChatStore.getState().setStreaming(newNodeId, false);
            },
            onError: (error: Error) => {
              useChatStore.getState().appendToLastMessage(
                newNodeId,
                `\n\n**Error:** ${error.message}`
              );
              useChatStore.getState().setStreaming(newNodeId, false);
            },
          },
          controller.signal
        );
      }, 100);

      // Clear selection — re-read current nodes so the newly added merge node isn't lost
      const currentNodes = useFlowStore.getState().nodes;
      useFlowStore.getState().setNodes(
        currentNodes.map((n) => ({ ...n, selected: false }))
      );
      setSelectedNodes([]);
    },
    [selectedNodes]
  );

  const handleDismissPopup = useCallback(() => {
    const flowStore = useFlowStore.getState();
    flowStore.setNodes(
      flowStore.nodes.map((n) => ({ ...n, selected: false }))
    );
    setSelectedNodes([]);
  }, []);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'topic',
      animated: false,
    }),
    []
  );

  const selectedTopics = selectedNodes.map((n) => n.data.topic);

  return (
    <div className="w-full h-full flex flex-col">
      <WorkspaceSelector />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onConnectEnd={handleConnectEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onDoubleClick={handleDoubleClick}
          zoomOnDoubleClick={false}
          fitView={false}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={null}
          selectionKeyCode="Shift"
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={!spacePressed}
          panOnDrag={spacePressed}
          panOnScroll={spacePressed}
          nodesDraggable={!spacePressed}
          elementsSelectable={true}
        >
          <SelectionHandler onSelectionChange={handleSelectionChange} />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#262626"
          />
          {showMinimap && (
            <MiniMap
              nodeColor="#262626"
              nodeStrokeColor="#404040"
              maskColor="rgba(0, 0, 0, 0.7)"
              pannable
              zoomable
            />
          )}
        </ReactFlow>
        <CanvasControls />
        <SettingsPanel />
        <WelcomePopup />
        {selectedNodes.length >= 2 && (
          <MergeSelectionPopup
            topics={selectedTopics}
            onMerge={handleMerge}
            onDismiss={handleDismissPopup}
          />
        )}
      </div>
    </div>
  );
}
