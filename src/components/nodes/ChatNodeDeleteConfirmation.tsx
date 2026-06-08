import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ChatNodeDeleteConfirmationProps {
  topic: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ChatNodeDeleteConfirmation({
  topic,
  onConfirm,
  onCancel,
}: ChatNodeDeleteConfirmationProps) {
  const { t } = useTranslation();
  const popupRef = useRef<HTMLDivElement>(null);
  const truncatedTopic = topic.length > 48 ? topic.slice(0, 48) + '...' : topic;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  useEffect(() => {
    // Use a ref flag to skip the very first mousedown (the one that opened the popup)
    let skipFirst = true;
    const handleMouseDown = (e: MouseEvent) => {
      if (skipFirst) {
        skipFirst = false;
        return;
      }
      const target = e.target as Node | null;
      if (target && popupRef.current?.contains(target)) return;
      onCancel();
    };

    // Small delay so the opening click is skipped
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleMouseDown);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onCancel]);

  return (
    <div
      ref={popupRef}
      className="nodrag nopan nowheel absolute right-2 top-10 z-50 w-72 rounded-lg border border-red-500/30 bg-surface-800 shadow-xl shadow-black/50"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="false"
      aria-labelledby="delete-chat-node-title"
    >
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-start gap-2">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
          <div className="min-w-0 flex-1">
            <div
              id="delete-chat-node-title"
              className="text-xs font-medium text-text-primary"
            >
              {t('delete.deleteChat')}
            </div>
            <p className="mt-1 text-[11px] leading-4 text-text-secondary">
              {t('delete.deleteDescription', { topic: truncatedTopic })}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
            title={t('delete.cancel')}
            aria-label={t('delete.cancel')}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="border-t border-border px-1.5 py-1 flex justify-end gap-1">
        <button
          className="text-xs text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md px-2 py-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        >
          {t('delete.cancel')}
        </button>
        <button
          className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-md px-2 py-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
        >
          <Trash2 size={12} />
          <span>{t('delete.delete')}</span>
        </button>
      </div>
    </div>
  );
}
