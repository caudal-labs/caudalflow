import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Trash2, Download, Upload, Check, Pencil, Github, FileText } from 'lucide-react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useFlowStore } from '../../stores/flowStore';
import { useChatStore } from '../../stores/chatStore';
import { exportWorkspace, importWorkspace } from '../../hooks/usePersistence';
import { exportMarkdown } from '../../utils/markdownExport';

export function WorkspaceSelector() {
  const { t } = useTranslation();
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);
  const createWorkspace = useWorkspaceStore((s) => s.createWorkspace);
  const renameWorkspace = useWorkspaceStore((s) => s.renameWorkspace);
  const deleteWorkspace = useWorkspaceStore((s) => s.deleteWorkspace);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = workspaces.find((w) => w.id === activeWorkspaceId);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Focus input when editing starts
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEditing = useCallback(() => {
    if (!active) return;
    setEditValue(active.name);
    setEditing(true);
  }, [active]);

  const commitRename = useCallback(() => {
    if (!active) return;
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== active.name) {
      renameWorkspace(active.id, trimmed);
    }
    setEditing(false);
  }, [active, editValue, renameWorkspace]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        commitRename();
      } else if (e.key === 'Escape') {
        setEditing(false);
      }
    },
    [commitRename]
  );

  const handleSwitch = useCallback(
    (id: string) => {
      if (id !== activeWorkspaceId) {
        switchWorkspace(id);
      }
      setDropdownOpen(false);
    },
    [activeWorkspaceId, switchWorkspace]
  );

  const handleNew = useCallback(() => {
    createWorkspace();
    setDropdownOpen(false);
  }, [createWorkspace]);

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      deleteWorkspace(id);
    },
    [deleteWorkspace]
  );

  const handleRenameFromDropdown = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      // Switch to the workspace first if it's not active, then start editing
      if (id !== activeWorkspaceId) {
        switchWorkspace(id);
      }
      setDropdownOpen(false);
      // Small delay so the dropdown closes and the name is visible before editing
      setTimeout(() => {
        const ws = useWorkspaceStore.getState().workspaces.find((w) => w.id === id);
        if (ws) {
          setEditValue(ws.name);
          setEditing(true);
        }
      }, 50);
    },
    [activeWorkspaceId, switchWorkspace]
  );

  const handleImport = useCallback(() => fileRef.current?.click(), []);

  const handleExportMarkdown = useCallback(() => {
    const flow = useFlowStore.getState();
    const chat = useChatStore.getState();
    const workspace = useWorkspaceStore.getState().getActiveWorkspace();
    
    // Get selected nodes
    const selectedNodes = flow.nodes.filter(n => n.selected);
    const selectedIds = selectedNodes.length > 0 ? selectedNodes.map(n => n.id) : undefined;
    
    exportMarkdown(
      flow.nodes,
      flow.edges,
      chat.conversations,
      workspace?.name ?? 'CaudalFlow Workspace',
      { selectedNodeIds: selectedIds }
    );
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) importWorkspace(file);
      e.target.value = '';
    },
    []
  );

  return (
    <div className="h-9 bg-surface-950 border-b border-border flex items-center px-3 shrink-0 select-none">
      {/* Left: workspace name + dropdown */}
      <div className="relative" ref={dropdownRef}>
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            className="bg-surface-900 border border-border-hover rounded px-2 py-0.5 text-sm text-text-primary outline-none focus:border-accent-500 w-48"
          />
        ) : (
          <div className="flex items-center gap-1 group/name">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="max-w-48 truncate">{active?.name ?? t('workspace.defaultName')}</span>
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={startEditing}
              className="opacity-0 group-hover/name:opacity-100 p-0.5 text-text-muted hover:text-text-primary transition-all"
              title={t('workspace.renameWorkspace')}
            >
              <Pencil size={12} />
            </button>
          </div>
        )}

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-surface-900 border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleSwitch(ws.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-800 transition-colors group"
                >
                  <span className="w-4 shrink-0">
                    {ws.id === activeWorkspaceId && <Check size={14} className="text-accent-400" />}
                  </span>
                  <span className="truncate flex-1 text-left">{ws.name}</span>
                  <button
                    onClick={(e) => handleRenameFromDropdown(e, ws.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-text-primary transition-all"
                    title={t('workspace.renameWorkspace')}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, ws.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-red-400 transition-all"
                    title={t('workspace.deleteWorkspace')}
                  >
                    <Trash2 size={14} />
                  </button>
                </button>
              ))}
            </div>
            <div className="border-t border-border">
              <button
                onClick={handleNew}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-800 transition-colors"
              >
                <Plus size={14} />
                <span>{t('workspace.newWorkspace')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: export + import + github */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleExportMarkdown}
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          title={t('workspace.exportMarkdown')}
        >
          <FileText size={15} />
        </button>
        <button
          onClick={exportWorkspace}
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          title={t('workspace.exportWorkspace')}
        >
          <Download size={15} />
        </button>
        <button
          onClick={handleImport}
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          title={t('workspace.importWorkspace')}
        >
          <Upload size={15} />
        </button>
        <a
          href="https://github.com/yancongya/caudalflow"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          title={t('workspace.github')}
        >
          <Github size={15} />
        </a>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
