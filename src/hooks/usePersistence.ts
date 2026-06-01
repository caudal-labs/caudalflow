import { useEffect, useRef, useCallback } from 'react';
import i18n from '../i18n';
import { useFlowStore } from '../stores/flowStore';
import { useChatStore } from '../stores/chatStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import type { WorkspaceData, WorkspaceFile } from '../types/workspace';

const DEBOUNCE_MS = 1000;

function storageKey(workspaceId: string) {
  return `caudalflow-workspace-${workspaceId}`;
}

function sanitizeNodes(nodes: WorkspaceData['nodes']) {
  return nodes.map((n) => {
    const w = n.style?.width;
    const h = n.style?.height;
    const badWidth = w === 'auto' || (typeof w === 'number' && (isNaN(w) || w <= 0));
    const badHeight = h === 'auto' || (typeof h === 'number' && (isNaN(h) || h <= 0));
    if (badWidth || badHeight || n.data?.minimized || n.data?.maximized) {
      return {
        ...n,
        style: {
          ...n.style,
          width: (n.data?._prevWidth as number) || 400,
          height: (n.data?._prevHeight as number) || 500,
        },
        data: { ...n.data, minimized: false, maximized: false },
      };
    }
    return n;
  });
}

function saveToStorage(workspaceId: string) {
  const flow = useFlowStore.getState();
  const chat = useChatStore.getState();
  const data: WorkspaceData = {
    nodes: flow.nodes,
    edges: flow.edges,
    conversations: chat.conversations,
  };
  try {
    localStorage.setItem(storageKey(workspaceId), JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

function loadFromStorage(workspaceId: string) {
  try {
    const raw = localStorage.getItem(storageKey(workspaceId));
    if (raw) {
      const data: WorkspaceData = JSON.parse(raw);
      if (data.nodes?.length) {
        useFlowStore.getState().setNodes(sanitizeNodes(data.nodes));
        useFlowStore.getState().setEdges(data.edges ?? []);
      } else {
        useFlowStore.getState().setNodes([]);
        useFlowStore.getState().setEdges([]);
      }
      if (data.conversations) {
        useChatStore.getState().setConversations(data.conversations);
      } else {
        useChatStore.getState().setConversations({});
      }
    } else {
      // No saved data for this workspace — start empty
      useFlowStore.getState().setNodes([]);
      useFlowStore.getState().setEdges([]);
      useChatStore.getState().setConversations({});
    }
  } catch {
    // Corrupted data — start empty
    useFlowStore.getState().setNodes([]);
    useFlowStore.getState().setEdges([]);
    useChatStore.getState().setConversations({});
  }

  // Auto-create a root node if workspace is empty, centered in viewport
  if (useFlowStore.getState().nodes.length === 0) {
    const nodeW = 400;
    const nodeH = 500;
    const x = (window.innerWidth - nodeW) / 2;
    const y = (window.innerHeight - nodeH) / 2;
    const nodeId = useFlowStore.getState().addChatNode(
      { x, y },
      { topic: i18n.t('canvas.newChat'), collapsed: false }
    );
    useChatStore.getState().initConversation(nodeId);
  }
}

// Standalone functions — safe to call from any component without duplicating hook effects

export function exportWorkspace() {
  const workspace = useWorkspaceStore.getState().getActiveWorkspace();
  if (!workspace) return;

  const flow = useFlowStore.getState();
  const chat = useChatStore.getState();

  const file: WorkspaceFile = {
    version: 1,
    type: 'caudalflow-workspace',
    metadata: workspace,
    data: {
      nodes: flow.nodes,
      edges: flow.edges,
      conversations: chat.conversations,
    },
  };

  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = workspace.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.download = `${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWorkspace(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result as string);

      let name: string;
      let data: WorkspaceData;

      // Support both new versioned format and legacy format
      if (parsed.type === 'caudalflow-workspace' && parsed.version === 1) {
        const wsFile = parsed as WorkspaceFile;
        name = wsFile.metadata.name;
        data = wsFile.data;
      } else if (parsed.nodes) {
        // Legacy format: plain {nodes, edges, conversations}
        name = 'Imported Workspace';
        data = {
          nodes: parsed.nodes,
          edges: parsed.edges ?? [],
          conversations: parsed.conversations ?? {},
        };
      } else {
        alert('Invalid file format');
        return;
      }

      // Always create a new workspace (no overwrite risk)
      const wsStore = useWorkspaceStore.getState();

      // Flush-save current workspace first
      const currentId = wsStore.activeWorkspaceId;
      if (currentId) saveToStorage(currentId);

      const newId = wsStore.createWorkspace(name);

      // Save the imported data to the new workspace's storage
      const importedData: WorkspaceData = {
        nodes: data.nodes?.length ? sanitizeNodes(data.nodes) : [],
        edges: data.edges ?? [],
        conversations: data.conversations ?? {},
      };
      localStorage.setItem(storageKey(newId), JSON.stringify(importedData));

      // The workspace switch will trigger loadFromStorage via the useEffect
    } catch {
      alert('Invalid file format');
    }
  };
  reader.readAsText(file);
}

export function usePersistence() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevWorkspaceRef = useRef<string | null>(null);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  // Initialize: ensure at least one workspace exists
  useEffect(() => {
    const { workspaces, createWorkspace } = useWorkspaceStore.getState();
    if (workspaces.length === 0) {
      createWorkspace('My Workspace');
    }
  }, []);

  // Handle workspace switches (including first load)
  useEffect(() => {
    if (!activeWorkspaceId) return;

    const prev = prevWorkspaceRef.current;

    // Flush-save the previous workspace before switching
    if (prev && prev !== activeWorkspaceId) {
      clearTimeout(timeoutRef.current);
      saveToStorage(prev);
    }

    // Load the new workspace
    loadFromStorage(activeWorkspaceId);
    prevWorkspaceRef.current = activeWorkspaceId;
  }, [activeWorkspaceId]);

  // Debounced auto-save on state changes
  const debouncedSave = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const wsId = useWorkspaceStore.getState().activeWorkspaceId;
      if (wsId) saveToStorage(wsId);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const unsubFlow = useFlowStore.subscribe(debouncedSave);
    const unsubChat = useChatStore.subscribe(debouncedSave);
    return () => {
      unsubFlow();
      unsubChat();
      clearTimeout(timeoutRef.current);
    };
  }, [debouncedSave]);
}
