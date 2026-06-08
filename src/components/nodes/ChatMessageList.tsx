import { useRef, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useFlowStore } from '../../stores/flowStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useTextSelection } from '../../hooks/useTextSelection';
import { ChatMessage } from './ChatMessage';
import { SelectionPopup } from './SelectionPopup';

interface ChatMessageListProps {
  nodeId: string;
  onExplore: (selectedText: string, prompt: string) => void;
}

export function ChatMessageList({ nodeId, onExplore }: ChatMessageListProps) {
  const { t } = useTranslation();
  const allMessages = useChatStore((s) => s.conversations[nodeId]?.messages ?? []);
  const showSystemPrompts = useSettingsStore((s) => s.showSystemPrompts);
  const messages = useMemo(
    () => showSystemPrompts ? allMessages : allMessages.filter((m) => m.role !== 'system'),
    [allMessages, showSystemPrompts]
  );
  const edges = useFlowStore((s) => s.edges);
  const exploredTexts = useMemo(
    () =>
      edges
        .filter((e) => e.source === nodeId && e.data?.label)
        .map((e) => e.data!.label),
    [edges, nodeId]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useAutoScroll(messages);
  const { selection, handleMouseUp, clearSelection } = useTextSelection(containerRef);
  const [popupOpen, setPopupOpen] = useState(false);

  const dismiss = useCallback(() => {
    setPopupOpen(false);
    clearSelection();
    window.getSelection()?.removeAllRanges();
  }, [clearSelection]);

  const handleExplore = (selectedText: string, prompt: string) => {
    dismiss();
    onExplore(selectedText, prompt);
  };

  // When a new selection is made, reset to the small button
  const onMouseUp = useCallback(() => {
    setPopupOpen(false);
    handleMouseUp();
  }, [handleMouseUp]);

  return (
    <div className="relative flex-1 min-h-0" ref={containerRef}>
      <div
        ref={scrollRef}
        className="nowheel nodrag nopan h-full overflow-y-auto select-text"
        onMouseUp={onMouseUp}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted text-sm px-4 text-center">
            {t('chat.askQuestionToStart')}
          </div>
        ) : (
          <div className="py-2 space-y-1">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} exploredTexts={exploredTexts} />
            ))}
          </div>
        )}
      </div>
      {selection && !popupOpen && (
        <div
          data-selection-popup
          className="nodrag nopan nowheel absolute z-50"
          style={{
            left: selection.x,
            top: selection.y,
            transform: 'translate(-50%, -100%)',
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPopupOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-accent-500/60 bg-accent-600 shadow-lg shadow-black/50 text-white hover:bg-accent-500 transition-colors"
            title={t('selection.branchFromSelection')}
          >
            <GitBranch size={14} />
            <span className="text-xs font-semibold">{t('selection.branch')}</span>
          </button>
        </div>
      )}
      {selection && popupOpen && (
        <SelectionPopup
          text={selection.text}
          x={selection.x}
          y={selection.y}
          onExplore={handleExplore}
          onDismiss={dismiss}
        />
      )}
    </div>
  );
}
