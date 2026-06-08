import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Handle, Position, NodeResizer, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Maximize2, X, ChevronRight } from 'lucide-react';
import type { ChatNode } from '../../types/flow';
import { useChatStore } from '../../stores/chatStore';
import { useFlowStore } from '../../stores/flowStore';
import { useNodeCopilotChat } from '../../hooks/useNodeCopilotChat';
import { streamChat } from '../../services/llm';
import { calculateBranchPosition } from '../../utils/nodeLayout';
import { getBranchSystemPrompt } from '../../utils/systemPrompts';
import { ChatNodeHeader } from './ChatNodeHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatNodeDeleteConfirmation } from './ChatNodeDeleteConfirmation';

const PALETTE_COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#06b6d4',
];

export function ChatNodeComponent({ id, data, selected }: NodeProps<ChatNode>) {
  const { t } = useTranslation();
  const { topic, collapsed, minimized, maximized, parentNodeId, branchText, parentNodeIds, mergeAction, color, label } = data;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const { sendMessage, cancelStream } = useNodeCopilotChat(id, topic, parentNodeId, branchText, parentNodeIds as string[] | undefined, mergeAction as string | undefined);
  const { getViewport, setViewport } = useReactFlow();

  // Listen for space key and delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      if (e.code === 'Space' && !e.repeat) {
        setIsPanning(true);
      }
      // Delete key or X key to trigger delete confirmation
      if ((e.code === 'Delete' || e.code === 'KeyX') && selected) {
        e.preventDefault();
        setShowDeleteConfirmation(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selected]);
  const updateNodeInternals = useUpdateNodeInternals();
  const messageCount = useChatStore(
    (s) =>
      s.conversations[id]?.messages.filter((m) => m.role !== "system").length ??
      0,
  );
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef(label);
  useEffect(() => { labelRef.current = label; }, [label]);

  const updateLabel = useCallback((newLabel?: string) => {
    useFlowStore.getState().updateNodeData(id, {
      label: newLabel,
    });
  }, [id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!popoverRef.current) return;

      if (!popoverRef.current.contains(event.target as Node)) {
        const trimmed = labelRef.current?.trim() || undefined;
        useFlowStore.getState().updateNodeData(id, { label: trimmed });
        setIsPaletteOpen(false);
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPaletteOpen(false);
      }
    };

    if (isPaletteOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isPaletteOpen, id]);

  useEffect(() => {
    useChatStore.getState().initConversation(id);
  }, [id]);

  const handleToggleCollapse = useCallback(() => {
    const flowStore = useFlowStore.getState();
    flowStore.updateNodeData(id, { collapsed: !collapsed });
    
    // Force React Flow to re-measure after DOM update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateNodeInternals(id);
      });
    });
  }, [id, collapsed, updateNodeInternals]);

  const handleMinimize = useCallback(() => {
    const flowStore = useFlowStore.getState();
    const node = flowStore.nodes.find((n) => n.id === id);
    if (!node) return;
    const prevWidth = (node.style?.width as number) ?? 400;
    const prevHeight = (node.style?.height as number) ?? 500;
    flowStore.setNodes(
      flowStore.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                minimized: true,
                maximized: false,
                _prevWidth: prevWidth,
                _prevHeight: prevHeight,
              },
              style: { ...n.style, width: "auto", height: "auto" },
            }
          : n,
      ),
    );
  }, [id]);

  const handleRestore = useCallback(() => {
    const flowStore = useFlowStore.getState();
    const node = flowStore.nodes.find((n) => n.id === id);
    if (!node) return;
    const w = (node.data._prevWidth as number) ?? 400;
    const h = (node.data._prevHeight as number) ?? 500;
    const prevX = node.data._prevX as number | undefined;
    const prevY = node.data._prevY as number | undefined;
    flowStore.setNodes(
      flowStore.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: { ...n.data, minimized: false, maximized: false },
              style: { ...n.style, width: w, height: h },
              position:
                prevX != null && prevY != null
                  ? { x: prevX, y: prevY }
                  : n.position,
            }
          : n,
      ),
    );
  }, [id]);

  const handleMaximize = useCallback(() => {
    const flowStore = useFlowStore.getState();
    const node = flowStore.nodes.find((n) => n.id === id);
    if (!node) return;

    if (maximized) {
      // Restore to previous size, position, and zoom
      const w = (node.data._prevWidth as number) ?? 400;
      const h = (node.data._prevHeight as number) ?? 500;
      const prevX = (node.data._prevX as number) ?? node.position.x;
      const prevY = (node.data._prevY as number) ?? node.position.y;
      const prevZoom = (node.data._prevZoom as number) | 0;
      const prevVpX = (node.data._prevVpX as number) | 0;
      const prevVpY = (node.data._prevVpY as number) | 0;
      flowStore.setNodes(
        flowStore.nodes.map((n) =>
          n.id === id
            ? {
                ...n,
                data: { ...n.data, maximized: false },
                style: { ...n.style, width: w, height: h },
                position: { x: prevX, y: prevY },
              }
            : n,
        ),
      );
      if (prevZoom) {
        setViewport(
          { x: prevVpX, y: prevVpY, zoom: prevZoom },
          { duration: 200 },
        );
      }
      return;
    }

    const prevWidth = (node.style?.width as number) ?? 400;
    const prevHeight = (node.style?.height as number) ?? 500;
    const viewport = getViewport();

    const padding = 40;

    // Fixed node dimensions in flow-coordinates — half the screen width at zoom=1
    const nodeHeight = window.innerHeight - padding * 2;
    const nodeWidth = window.innerWidth / 2 - padding * 2;

    // Zoom so the node height fills the viewport vertically
    const zoom = Math.min(
      Math.max((window.innerHeight - padding * 2) / nodeHeight, 0.1),
      2,
    );

    // Position the node at the origin for simplicity, then pan viewport to center it
    const nodeX = node.position.x;
    const nodeY = node.position.y;

    // Viewport pan: center the node horizontally and align top with padding
    const vpX = -(nodeX * zoom) + (window.innerWidth - nodeWidth * zoom) / 2;
    const vpY = -(nodeY * zoom) + padding;

    flowStore.setNodes(
      flowStore.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                maximized: true,
                _prevWidth: prevWidth,
                _prevHeight: prevHeight,
                _prevX: node.position.x,
                _prevY: node.position.y,
                _prevZoom: viewport.zoom,
                _prevVpX: viewport.x,
                _prevVpY: viewport.y,
              },
              style: { ...n.style, width: nodeWidth, height: nodeHeight },
              position: { x: nodeX, y: nodeY },
            }
          : n,
      ),
    );
    setViewport({ x: vpX, y: vpY, zoom }, { duration: 200 });
  }, [id, maximized, getViewport, setViewport]);

  const handleClose = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    useFlowStore.getState().removeNode(id);
    useChatStore.getState().removeConversation(id);
  }, [id]);

  const handleExplore = useCallback(
    (selectedText: string, prompt: string) => {
      const flowStore = useFlowStore.getState();
      let parentNode = flowStore.nodes.find((n) => n.id === id);
      if (!parentNode) return;

      // If maximized, restore to original size/position first
      if (parentNode.data.maximized) {
        const w = (parentNode.data._prevWidth as number) ?? 400;
        const h = (parentNode.data._prevHeight as number) ?? 500;
        const prevX =
          (parentNode.data._prevX as number) ?? parentNode.position.x;
        const prevY =
          (parentNode.data._prevY as number) ?? parentNode.position.y;
        flowStore.setNodes(
          flowStore.nodes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  data: { ...n.data, maximized: false },
                  style: { ...n.style, width: w, height: h },
                  position: { x: prevX, y: prevY },
                }
              : n,
          ),
        );
        // Re-read updated node
        parentNode = useFlowStore.getState().nodes.find((n) => n.id === id)!;
      }

      const childCount = flowStore.getChildCount(id);
      const position = calculateBranchPosition(parentNode, childCount);

      const newNodeId = flowStore.addChatNode(position, {
        topic: selectedText,
        parentNodeId: id,
        branchText: selectedText,
        collapsed: false,
      });

      flowStore.addEdge(id, newNodeId, selectedText);

      // Initialize conversation with branch context
      const chatStore = useChatStore.getState();
      chatStore.initConversation(newNodeId);

      const parentMessages = chatStore
        .getMessages(id)
        .map((m) => ({ role: m.role, content: m.content }));

      const systemPrompt = getBranchSystemPrompt(topic, parentMessages);
      chatStore.addMessage(newNodeId, "system", systemPrompt);

      // First user message: popup input + highlighted text
      const firstMessage = prompt
        ? `${prompt}\n\n> "${selectedText}"`
        : selectedText;

      // Auto-send first message
      setTimeout(() => {
        const store = useChatStore.getState();
        const messages = store.getMessages(newNodeId);

        store.addMessage(newNodeId, "user", firstMessage);
        store.addMessage(newNodeId, "assistant", "");
        store.setStreaming(newNodeId, true);

        const controller = new AbortController();

        streamChat(
          [
            ...messages,
            {
              id: "q",
              role: "user" as const,
              content: firstMessage,
              timestamp: Date.now(),
            },
          ],
          {
            onToken: (token: string) => {
              useChatStore.getState().appendToLastMessage(newNodeId, token);
            },
            onDone: () => {
              useChatStore.getState().setStreaming(newNodeId, false);
            },
            onError: (error: Error) => {
              useChatStore
                .getState()
                .appendToLastMessage(
                  newNodeId,
                  `\n\n**Error:** ${error.message}`,
                );
              useChatStore.getState().setStreaming(newNodeId, false);
            },
          },
          controller.signal,
        );
      }, 100);
    },
    [id, topic],
  );

  const updateColor = (newColor?: string) => {
    useFlowStore.getState().updateNodeData(id, { color: newColor });
  };

  if (minimized) {
    return (
      <div
        className={`relative flex items-center gap-2 bg-surface-900 border rounded-full shadow-lg shadow-black/30 px-3 py-1.5 cursor-grab active:cursor-grabbing ${
          selected ? 'border-accent-500/60' : 'border-border'
        } transition-colors`}
        onDoubleClick={handleRestore}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-accent-500 !border-none !w-2 !h-2"
          id="left"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-accent-400 !border-none !w-2 !h-2"
          id="right"
        />
        <span className="text-xs font-medium text-accent-400 truncate max-w-[160px]">
          {topic}
        </span>
        {messageCount > 0 && (
          <span className="text-[10px] text-text-muted bg-surface-800 rounded-full px-1.5 py-0.5 leading-none">
            {messageCount}
          </span>
        )}
        <button
          onClick={handleRestore}
          className="nodrag text-text-muted hover:text-text-primary transition-colors"
          title={t('node.restore')}
        >
          <Maximize2 size={12} />
        </button>
        <button
          onClick={handleClose}
          className="nodrag text-text-muted hover:text-red-400 transition-colors"
          title={t('node.close')}
        >
          <X size={12} />
        </button>
        {showDeleteConfirmation && (
          <ChatNodeDeleteConfirmation
            topic={topic}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    );
  }

  // Collapsed view - small rectangular card
  if (collapsed) {
    return (
      <div
        className={`relative flex flex-col bg-surface-900 border rounded-lg shadow-lg shadow-black/30 w-[140px] cursor-grab active:cursor-grabbing ${
          selected ? 'border-accent-500/60' : 'border-border'
        } transition-colors`}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-accent-500 !border-none !w-2 !h-2"
          id="left"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-accent-400 !border-none !w-2 !h-2"
          id="right"
        />

        {/* Header with color indicator */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-border bg-surface-800 rounded-t-lg">
          <div className="flex items-center gap-1.5 min-w-0">
            {color && (
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
            )}
            <span className="text-[10px] font-medium text-text-primary truncate">
              {topic.length > 12 ? topic.slice(0, 12) + '...' : topic}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {messageCount > 0 && (
              <span className="text-[8px] text-text-muted bg-surface-700 rounded-full px-1 leading-none">
                {messageCount}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-2 py-1.5 flex flex-col gap-1">
          {label && (
            <span className="text-[9px] text-text-muted truncate">
              {label}
            </span>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggleCollapse}
              className="nodrag text-text-secondary hover:text-text-primary transition-colors"
              title={t('node.expand')}
            >
              <ChevronRight size={10} />
            </button>
            <button
              onClick={handleClose}
              className="nodrag text-text-muted hover:text-red-400 transition-colors"
              title={t('node.close')}
            >
              <X size={10} />
            </button>
          </div>
        </div>

        {showDeleteConfirmation && (
          <ChatNodeDeleteConfirmation
            topic={topic}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    );
  }

  // Expanded view - full card
  return (
    <div
      className={`relative flex flex-col bg-surface-900 border rounded-xl shadow-xl shadow-black/30 h-full ${
        selected
          ? 'border-accent-500/60'
          : 'border-border'
      } transition-colors`}
    >
      <NodeResizer
        minWidth={320}
        minHeight={300}
        isVisible={selected}
        lineClassName="!border-accent-500/30"
        handleClassName="!bg-accent-500 !border-none !w-2 !h-2 !rounded-sm"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-accent-500 !border-none !w-2.5 !h-2.5"
        id="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-accent-400 !border-none !w-2.5 !h-2.5"
        id="right"
      />

      <ChatNodeHeader
        topic={topic}
        collapsed={false}
        maximized={!!maximized}
        isPanning={isPanning}
        onToggleCollapse={handleToggleCollapse}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
        onTogglePalette={() => setIsPaletteOpen((p) => !p)}
        color={color}
        label={label}
      />
      {showDeleteConfirmation && (
        <ChatNodeDeleteConfirmation
          topic={topic}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {isPaletteOpen && (
        <div
          ref={popoverRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-10 right-3 z-50 bg-surface-950 border border-border rounded-lg p-3 w-48 nodrag"
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {PALETTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => updateColor(color === c ? undefined : c)}
                className={`w-5 h-5 rounded-full border-2 ${
                  color === c ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <input
            value={label ?? ""}
            onChange={(e) => updateLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateLabel(label?.trim() || undefined);
                setIsPaletteOpen(false);
              }
            }}
            placeholder={t('node.addLabel')}
            maxLength={20}
            className="w-full text-xs bg-surface-800 px-2 py-1 rounded outline-none"
          />

          <button
            onClick={() => {
              updateColor(undefined);
              updateLabel(undefined);
            }}
            className="text-xs text-red-400 mt-2"
          >
            {t('node.clear')}
          </button>
        </div>
      )}

      <ChatMessageList nodeId={id} onExplore={handleExplore} />
      <ChatInput nodeId={id} onSend={sendMessage} onCancel={cancelStream} />
    </div>
  );
}
