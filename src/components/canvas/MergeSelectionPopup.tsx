import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, GitMerge, Sparkles, Link, FileText } from 'lucide-react';

interface MergeSelectionPopupProps {
  topics: string[];
  onMerge: (action: string) => void;
  onDismiss: () => void;
}

export function MergeSelectionPopup({ topics, onMerge, onDismiss }: MergeSelectionPopupProps) {
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

  const submit = (action: string) => {
    if (action.trim()) {
      onMerge(action.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      submit(input.trim());
    }
  };

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-96 rounded-lg border border-surface-700 bg-surface-800 shadow-xl shadow-black/50"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-center gap-1.5 mb-2">
          <GitMerge size={14} className="text-accent-400 shrink-0" />
          <span className="text-xs font-medium text-neutral-300">
            {t('merge.mergeNodes', { count: topics.length })}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {topics.map((topic, i) => (
            <span
              key={i}
              className="text-[10px] text-accent-300 bg-accent-500/15 border border-accent-500/20 rounded-full px-2 py-0.5 truncate max-w-[140px]"
              title={topic}
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('merge.placeholder')}
            className="flex-1 min-w-0 bg-neutral-800/80 text-sm text-neutral-200 rounded-md px-2.5 py-1.5 placeholder-neutral-500 border border-neutral-700/50 focus:border-accent-500/50 focus:outline-none transition-colors"
          />
          <button
            className="shrink-0 p-1.5 rounded-md bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={t('merge.send')}
            disabled={!input.trim()}
            onClick={(e) => {
              e.stopPropagation();
              submit(input.trim());
            }}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-700/30 px-1.5 py-1 flex gap-0.5">
        <button
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-accent-400 hover:bg-accent-500/10 rounded-md px-2 py-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            submit('Compare these');
          }}
        >
          <Sparkles size={12} />
          <span>{t('merge.compare')}</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-accent-400 hover:bg-accent-500/10 rounded-md px-2 py-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            submit('Summarize together');
          }}
        >
          <FileText size={12} />
          <span>{t('merge.summarize')}</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-accent-400 hover:bg-accent-500/10 rounded-md px-2 py-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            submit('Find connections');
          }}
        >
          <Link size={12} />
          <span>{t('merge.connections')}</span>
        </button>
      </div>
    </div>
  );
}
