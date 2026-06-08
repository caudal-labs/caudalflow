import { useTranslation } from 'react-i18next';
import { MousePointer2, GitBranch, BoxSelect, Maximize2, Plus, Move } from 'lucide-react';

export function HelpGuidePanel() {
  const { t } = useTranslation();

  const shortcuts = [
    { icon: Plus, label: t('help.shortcuts.newNode'), description: t('help.shortcuts.newNodeDescription') },
    { icon: Move, label: t('help.shortcuts.panCanvas'), description: t('help.shortcuts.panCanvasDescription') },
    { icon: MousePointer2, label: t('help.shortcuts.selectText'), description: t('help.shortcuts.selectTextDescription') },
    { icon: GitBranch, label: t('help.shortcuts.branchFromText'), description: t('help.shortcuts.branchFromTextDescription') },
    { icon: BoxSelect, label: t('help.shortcuts.multiSelectNodes'), description: t('help.shortcuts.multiSelectNodesDescription') },
    { icon: GitBranch, label: t('help.shortcuts.mergeNodes'), description: t('help.shortcuts.mergeNodesDescription') },
    { icon: Maximize2, label: t('help.shortcuts.maximizeNode'), description: t('help.shortcuts.maximizeNodeDescription') },
  ];

  const tips = [
    t('help.tips.escClosesPopup'),
    t('help.tips.mergedNodesContext'),
    t('help.tips.branchRetainsContext'),
  ];

  return (
    <div className="absolute top-4 left-16 z-40 w-80 rounded-xl border border-border bg-surface-900 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">{t('help.title')}</h3>
      </div>

      <div className="p-3 space-y-2">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex gap-2.5">
            <div className="shrink-0 mt-0.5">
              <s.icon size={14} className="text-accent-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-text-primary">{s.label}</div>
              <div className="text-[11px] text-text-muted leading-snug">{s.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-border bg-surface-800">
        <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">{t('help.tips.title')}</div>
        <ul className="space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-[11px] text-text-muted leading-snug flex gap-1.5">
              <span className="text-accent-500 shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
