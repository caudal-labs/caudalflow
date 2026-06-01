import type { ChatNode, TopicEdge } from '../types/flow';
import type { ChatMessage, Conversation } from '../types/chat';

interface ExportOptions {
  selectedNodeIds?: string[];
  includeMetadata?: boolean;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

function buildNodeTree(
  nodes: ChatNode[],
  edges: TopicEdge[]
): Map<string, ChatNode[]> {
  const tree = new Map<string, ChatNode[]>();
  
  // Find root nodes (no incoming edges)
  const targetIds = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(n => !targetIds.has(n.id));
  
  // Build parent -> children mapping
  for (const edge of edges) {
    if (!tree.has(edge.source)) {
      tree.set(edge.source, []);
    }
    const parent = nodes.find(n => n.id === edge.source);
    const child = nodes.find(n => n.id === edge.target);
    if (parent && child) {
      tree.get(edge.source)!.push(child);
    }
  }
  
  return tree;
}

function formatMessage(msg: ChatMessage): string {
  const role = msg.role === 'user' ? '**User:**' : '**Assistant:**';
  return `${role} ${msg.content}`;
}

function formatNode(
  node: ChatNode,
  conversation: Conversation | undefined,
  tree: Map<string, ChatNode[]>,
  nodes: ChatNode[],
  depth: number = 0
): string {
  const lines: string[] = [];
  const indent = '#'.repeat(Math.min(depth + 2, 6));
  
  // Node header
  lines.push(`${indent} ${node.data.topic}`);
  
  // Branch info
  if (node.data.branchText) {
    lines.push(`> Branch from: "${node.data.branchText.slice(0, 50)}${node.data.branchText.length > 50 ? '...' : ''}"`);
  } else if (node.data.mergeAction) {
    lines.push(`> Merge: ${node.data.mergeAction}`);
  }
  
  lines.push('');
  
  // Conversation
  if (conversation && conversation.messages.length > 0) {
    lines.push('### Conversation');
    lines.push('');
    
    for (const msg of conversation.messages) {
      if (msg.role === 'system') continue; // Skip system messages
      lines.push(formatMessage(msg));
      lines.push('');
    }
  }
  
  lines.push('---');
  lines.push('');
  
  // Children
  const children = tree.get(node.id) || [];
  for (const child of children) {
    lines.push(formatNode(child, undefined, tree, nodes, depth + 1));
  }
  
  return lines.join('\n');
}

export function exportMarkdown(
  nodes: ChatNode[],
  edges: TopicEdge[],
  conversations: Record<string, Conversation>,
  workspaceName: string,
  options: ExportOptions = {}
): void {
  const { selectedNodeIds, includeMetadata = true } = options;
  
  // Filter nodes if specific ones are selected
  let nodesToExport = nodes;
  if (selectedNodeIds && selectedNodeIds.length > 0) {
    nodesToExport = nodes.filter(n => selectedNodeIds.includes(n.id));
  }
  
  // Build tree structure
  const tree = buildNodeTree(nodesToExport, edges);
  
  // Find root nodes for export
  const targetIds = new Set(edges.map(e => e.target));
  const rootNodes = nodesToExport.filter(n => !targetIds.has(n.id));
  
  // Generate markdown
  const lines: string[] = [];
  
  // Header
  lines.push(`# ${workspaceName}`);
  lines.push('');
  
  if (includeMetadata) {
    lines.push(`> Exported on ${formatDate(Date.now())}`);
    lines.push(`> ${nodesToExport.length} nodes, ${edges.length} connections`);
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  
  // Nodes
  for (const node of rootNodes) {
    const conversation = conversations[node.id];
    lines.push(formatNode(node, conversation, tree, nodes));
  }
  
  // If no root nodes, export all selected nodes
  if (rootNodes.length === 0 && nodesToExport.length > 0) {
    for (const node of nodesToExport) {
      const conversation = conversations[node.id];
      lines.push(formatNode(node, conversation, tree, nodes));
    }
  }
  
  // Create and download file
  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workspaceName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
