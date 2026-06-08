import { describe, it, expect, beforeEach } from 'vitest';
import { buildCanvasAgentState } from '../canvasAgentState';
import { useChatStore } from '../../../stores/chatStore';
import { useFlowStore } from '../../../stores/flowStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useWorkspaceStore } from '../../../stores/workspaceStore';

beforeEach(() => {
  useFlowStore.setState({ nodes: [], edges: [] });
  useChatStore.setState({ conversations: {}, activeNodeContext: null });
  useSettingsStore.setState({
    llmConfig: {
      providerId: 'mock',
      providerName: 'Mock',
      endpoint: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2048,
      mockDelay: 30,
    },
  });
  useWorkspaceStore.setState({
    workspaces: [
      {
        id: 'workspace-1',
        name: 'Research Map',
        createdAt: 100,
        updatedAt: 200,
      },
    ],
    activeWorkspaceId: 'workspace-1',
  });
});

describe('buildCanvasAgentState', () => {
  it('exposes workspace, nodes, edges, conversations, and current selected messages', () => {
    const flow = useFlowStore.getState();
    const nodeId = flow.addChatNode({ x: 10, y: 20 }, { topic: 'Root question', collapsed: false });
    const childId = flow.addChatNode({ x: 500, y: 20 }, { topic: 'Branch', parentNodeId: nodeId });
    flow.addEdge(nodeId, childId, 'follow-up');
    useFlowStore
      .getState()
      .setNodes(useFlowStore.getState().nodes.map((node) => (node.id === nodeId ? { ...node, selected: true } : node)));

    const chat = useChatStore.getState();
    chat.initConversation(nodeId);
    chat.addMessage(nodeId, 'system', 'hidden system prompt');
    chat.addMessage(nodeId, 'user', 'What should we explore?', [{ base64: 'large-image-payload', mimeType: 'image/png' }]);
    chat.addMessage(nodeId, 'assistant', 'Explore the cost, risk, and timing.');

    const state = buildCanvasAgentState();

    expect(state.activeWorkspace).toMatchObject({
      id: 'workspace-1',
      name: 'Research Map',
      createdAt: 100,
      updatedAt: 200,
    });
    expect(state.nodes).toHaveLength(2);
    expect(state.nodes[0]).toMatchObject({
      id: nodeId,
      topic: 'Root question',
      selected: true,
      position: { x: 10, y: 20 },
      messageCount: 2,
      lastUserMessage: 'What should we explore?',
      lastAssistantMessage: 'Explore the cost, risk, and timing.',
    });
    expect(state.edges).toEqual([
      {
        id: `e-${nodeId}-${childId}`,
        source: nodeId,
        target: childId,
        label: 'follow-up',
      },
    ]);
    expect(state.conversations[nodeId]).toMatchObject({
      nodeId,
      messageCount: 2,
      systemMessageCount: 1,
    });
    expect(state.conversations[nodeId].messages.map((message) => message.role)).toEqual(['user', 'assistant']);
    expect(state.conversations[nodeId].messages[0]).toMatchObject({
      imageCount: 1,
      hasImages: true,
    });
    expect(state.conversations[nodeId].messages[0]).not.toHaveProperty('images');
    expect(state.selectedNodes.map((node) => node.id)).toEqual([nodeId]);
    expect(state.currentMessages.map((message) => message.sourceNodeId)).toEqual([nodeId, nodeId]);
    expect(state.mergeContext).toBeNull();
  });

  it('builds mergeContext from multiple selected nodes', () => {
    const flow = useFlowStore.getState();
    const firstId = flow.addChatNode({ x: 0, y: 0 }, { topic: 'Option A' });
    const secondId = flow.addChatNode({ x: 480, y: 0 }, { topic: 'Option B' });
    useFlowStore.getState().setNodes(useFlowStore.getState().nodes.map((node) => ({ ...node, selected: true })));

    const chat = useChatStore.getState();
    chat.initConversation(firstId);
    chat.initConversation(secondId);
    chat.addMessage(firstId, 'assistant', 'A is fast.');
    chat.addMessage(secondId, 'assistant', 'B is safer.');

    const state = buildCanvasAgentState();

    expect(state.selectedNodes.map((node) => node.id)).toEqual([firstId, secondId]);
    expect(state.currentMessages.map((message) => message.sourceTopic)).toEqual(['Option A', 'Option B']);
    expect(state.mergeContext).toMatchObject({
      ready: true,
      sourceNodeIds: [firstId, secondId],
      sourceTopics: ['Option A', 'Option B'],
    });
    expect(state.mergeContext?.sources.map((source) => source.lastAssistantMessage)).toEqual(['A is fast.', 'B is safer.']);
  });

  describe('message limits', () => {
    it('caps node.messages at 8', () => {
      const flow = useFlowStore.getState();
      const nodeId = flow.addChatNode({ x: 0, y: 0 }, { topic: 'Many messages' });
      const chat = useChatStore.getState();
      chat.initConversation(nodeId);
      for (let i = 0; i < 20; i++) {
        chat.addMessage(nodeId, i % 2 === 0 ? 'user' : 'assistant', `Message ${i}`);
      }

      const state = buildCanvasAgentState();
      expect(state.nodes[0].messages.length).toBeLessThanOrEqual(8);
    });

    it('caps conversation.messages at 24', () => {
      const flow = useFlowStore.getState();
      const nodeId = flow.addChatNode({ x: 0, y: 0 }, { topic: 'Long convo' });
      const chat = useChatStore.getState();
      chat.initConversation(nodeId);
      for (let i = 0; i < 50; i++) {
        chat.addMessage(nodeId, i % 2 === 0 ? 'user' : 'assistant', `Message ${i}`);
      }

      const state = buildCanvasAgentState();
      expect(state.conversations[nodeId].messages.length).toBeLessThanOrEqual(24);
    });

    it('caps mergeContext.sources[].messages at 12', () => {
      const flow = useFlowStore.getState();
      const firstId = flow.addChatNode({ x: 0, y: 0 }, { topic: 'A' });
      const secondId = flow.addChatNode({ x: 480, y: 0 }, { topic: 'B' });
      useFlowStore.getState().setNodes(
        useFlowStore.getState().nodes.map((node) => ({ ...node, selected: true })),
      );

      const chat = useChatStore.getState();
      chat.initConversation(firstId);
      chat.initConversation(secondId);
      for (let i = 0; i < 30; i++) {
        chat.addMessage(firstId, i % 2 === 0 ? 'user' : 'assistant', `Msg ${i}`);
      }

      const state = buildCanvasAgentState();
      expect(state.mergeContext).not.toBeNull();
      expect(state.mergeContext!.sources[0].messages.length).toBeLessThanOrEqual(12);
    });
  });

  describe('activeNodeContext from chatStore', () => {
    it('reads context from chatStore when no parameter is given', () => {
      useChatStore.getState().setActiveNodeContext({
        nodeId: 'node-1',
        mode: 'root',
        topic: 'Root topic',
      });
      const state = buildCanvasAgentState();
      expect(state.nodeContext).toMatchObject({ nodeId: 'node-1', mode: 'root' });
    });

    it('returns null nodeContext when chatStore has no active context', () => {
      const state = buildCanvasAgentState();
      expect(state.nodeContext).toBeNull();
    });

    it('explicit parameter overrides chatStore context', () => {
      useChatStore.getState().setActiveNodeContext({
        nodeId: 'node-1',
        mode: 'root',
        topic: 'Store topic',
      });
      const override = { nodeId: 'node-2', mode: 'branch' as const, topic: 'Override' };
      const state = buildCanvasAgentState(override);
      expect(state.nodeContext).toMatchObject({ nodeId: 'node-2', mode: 'branch' });
    });
  });

  describe('edge cases', () => {
    it('handles nodes without conversations', () => {
      const flow = useFlowStore.getState();
      flow.addChatNode({ x: 0, y: 0 }, { topic: 'Orphan' });
      const state = buildCanvasAgentState();
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].messageCount).toBe(0);
      expect(state.nodes[0].lastUserMessage).toBe('');
    });

    it('returns empty arrays for empty state', () => {
      const state = buildCanvasAgentState();
      expect(state.nodes).toEqual([]);
      expect(state.edges).toEqual([]);
      expect(state.selectedNodes).toEqual([]);
      expect(state.currentMessages).toEqual([]);
    });

    it('returns null mergeContext for a single selected node', () => {
      const flow = useFlowStore.getState();
      const nodeId = flow.addChatNode({ x: 0, y: 0 }, { topic: 'Solo' });
      useFlowStore.getState().setNodes(
        useFlowStore.getState().nodes.map((n) => (n.id === nodeId ? { ...n, selected: true } : n)),
      );
      const state = buildCanvasAgentState();
      expect(state.selectedNodes).toHaveLength(1);
      expect(state.mergeContext).toBeNull();
    });

    it('includes llmConfig from settingsStore', () => {
      const state = buildCanvasAgentState();
      expect(state.llmConfig).toMatchObject({
        providerId: 'mock',
        model: 'gpt-4o-mini',
        temperature: 0.7,
      });
    });
  });
});
