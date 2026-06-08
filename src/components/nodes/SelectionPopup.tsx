import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface SelectionPopupProps {
  text: string;
  x: number;
  y: number;
  onExplore: (selectedText: string, prompt: string) => void;
  onDismiss: () => void;
}

export function SelectionPopup({ text, x, y, onExplore, onDismiss }: SelectionPopupProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  const submit = (customPrompt: string) => {
    onExplore(text, customPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(input.trim());
    }
  };

  const truncated = text.length > 40 ? text.slice(0, 40) + '…' : text;

  return (
    <div
      data-selection-popup
      className="nodrag nopan nowheel absolute z-50 w-72 rounded-lg border border-surface-700 bg-surface-800 shadow-xl shadow-black/50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="px-2.5 pt-2 pb-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] text-text-muted truncate">
            {t('selection.selectionLabel')} <span className="text-text-secondary">&ldquo;{truncated}&rdquo;</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="shrink-0 text-text-muted hover:text-text-primary transition-colors ml-1"
            title={t('selection.closeEsc')}
          >
            <X size={12} />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('selection.askAbout', { text: truncated })}
            className="flex-1 min-w-0 bg-surface-800 text-sm text-text-primary rounded-md px-2.5 py-1.5 placeholder-text-muted border border-border focus:border-accent-500/50 focus:outline-none transition-colors"
          />
          <button
            className="shrink-0 p-1.5 rounded-md bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors"
            title={t('selection.send')}
            onClick={(e) => {
              e.stopPropagation();
              submit(input.trim());
            }}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div className="border-t border-border px-1.5 py-1">
        <button
          className="w-full flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-md px-2 py-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            submit('');
          }}
        >
          <Sparkles size={12} />
          <span>{t('selection.explore')}</span>
        </button>
      </div>
    </div>
  );
}
