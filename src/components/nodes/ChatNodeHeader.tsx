import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, Minus, Maximize2, X, Palette } from 'lucide-react';

interface ChatNodeHeaderProps {
  topic: string;
  collapsed: boolean;
  maximized: boolean;
  isPanning?: boolean;
  onToggleCollapse: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onTogglePalette:() => void
  color?:string
  label?:string
}

export function ChatNodeHeader({
  topic,
  collapsed,
  maximized,
  isPanning,
  onToggleCollapse,
  onMinimize,
  onMaximize,
  onClose,
  onTogglePalette,
  color,
  label
}: ChatNodeHeaderProps) {
  const { t } = useTranslation();
  
  const btnClass = "p-1.5 rounded-md hover:bg-surface-700 transition-colors";
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1.5 border-b border-border bg-surface-800 rounded-t-xl ${isPanning ? 'cursor-grab' : 'cursor-move'}`}>
      <button
        onClick={onToggleCollapse}
        className={`nodrag ${btnClass} text-text-secondary hover:text-text-primary`}
        title={collapsed ? t('node.expand') : t('node.collapse')}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
      </button>
      <div className="flex-1 min-w-0 px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-medium text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded-full truncate">
            {topic}
          </span>

          {label && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: color ? `${color}20` : '#262626',
                color: color ?? '#a3a3a3',
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onMinimize}
        className={`nodrag ${btnClass} text-text-muted hover:text-amber-400`}
        title={t('node.minimize')}
      >
        <Minus size={14} />
      </button>
      <button
        onClick={onMaximize}
        className={`nodrag ${btnClass} ${
          maximized
            ? 'text-accent-400 hover:text-accent-300'
            : 'text-text-muted hover:text-text-primary'
        }`}
        title={maximized ? t('node.restoreSize') : t('node.maximize')}
      >
        <Maximize2 size={14} />
      </button>
      <button
        onClick={onTogglePalette}
        className={`nodrag ${btnClass} text-text-muted hover:text-text-primary`}
        title={t('node.addLabelAndColor')}
        >
        <Palette size={14} />
      </button>
      <button
        onClick={onClose}
        className={`nodrag ${btnClass} text-text-muted hover:text-red-400`}
        title={t('node.close')}
      >
        <X size={14} />
      </button>
    </div>
  );
}
