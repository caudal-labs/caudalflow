import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Settings,
  Plus,
  HelpCircle,
  Network,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { HelpGuidePanel } from '../ui/HelpGuide';
import { Tooltip } from '../ui/Tooltip';
import { calculateAutoLayoutPositions } from '../../utils/nodeLayout';
import { useFlowStore } from '../../stores/flowStore';

interface CanvasControlsProps {}

export function CanvasControls({}: CanvasControlsProps) {
  const { t } = useTranslation();
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const toggleSettings = useSettingsStore((s) => s.toggleSettings);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const [showHelp, setShowHelp] = useState(false);
  const arrangeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (arrangeTimerRef.current !== null) {
        window.clearTimeout(arrangeTimerRef.current);
      }
      document.querySelector('.react-flow')?.classList.remove('auto-arranging');
    };
  }, []);

  const handleNewNode = () => {
    const viewport = getViewport();
    const x = (-viewport.x + window.innerWidth / 2) / viewport.zoom - 200;
    const y = (-viewport.y + window.innerHeight / 2) / viewport.zoom - 250;

    const nodeId = useFlowStore.getState().addChatNode({ x, y }, {
      topic: t('canvas.newChat'),
      collapsed: false,
    });
    useFlowStore.getState().updateNodeData(nodeId, { collapsed: false });
  };

  const handleAutoArrange = () => {
    const flowStore = useFlowStore.getState();
    const flowElement = document.querySelector('.react-flow');

    if (arrangeTimerRef.current !== null) {
      window.clearTimeout(arrangeTimerRef.current);
    }

    flowElement?.classList.add('auto-arranging');

    const positions = calculateAutoLayoutPositions(flowStore.nodes, flowStore.edges, {
      horizontalGap: 100,
      verticalGap: 40,
      componentGap: 200,
      origin: { x: 0, y: 0 },
    });

    flowStore.setNodes(
      flowStore.nodes.map((node) => {
        const position = positions[node.id];
        if (!position) return node;
        return {
          ...node,
          position,
        };
      })
    );

    arrangeTimerRef.current = window.setTimeout(() => {
      fitView({ padding: 0.2 });
      flowElement?.classList.remove('auto-arranging');
      arrangeTimerRef.current = null;
    }, 320);
  };

  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const btnClass =
    'p-2 rounded-lg bg-surface-900 border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:bg-surface-800 transition-colors';

  return (
    <>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <Tooltip content={t('canvas.newChat')}>
          <button onClick={handleNewNode} className={btnClass}>
            <Plus size={18} />
          </button>
        </Tooltip>
        <div className="h-px bg-border my-0.5" />
        <Tooltip content={t('canvas.zoomIn')}>
          <button onClick={() => zoomIn()} className={btnClass}>
            <ZoomIn size={18} />
          </button>
        </Tooltip>
        <Tooltip content={t('canvas.zoomOut')}>
          <button onClick={() => zoomOut()} className={btnClass}>
            <ZoomOut size={18} />
          </button>
        </Tooltip>
        <Tooltip content={t('canvas.fitView')}>
          <button onClick={() => fitView({ padding: 0.2 })} className={btnClass}>
            <Maximize size={18} />
          </button>
        </Tooltip>
        <Tooltip content={t('canvas.autoArrange')}>
          <button onClick={handleAutoArrange} className={btnClass}>
            <Network size={18} />
          </button>
        </Tooltip>
        <div className="h-px bg-border my-0.5" />
        <Tooltip content={t(`settings.theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`)}>
          <button onClick={handleThemeToggle} className={btnClass}>
            <ThemeIcon size={18} />
          </button>
        </Tooltip>
        <Tooltip content={t('canvas.settings')}>
          <button onClick={toggleSettings} className={btnClass}>
            <Settings size={18} />
          </button>
        </Tooltip>
        <Tooltip content={t('canvas.help')}>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`${btnClass} ${showHelp ? 'text-accent-400' : ''}`}
          >
            <HelpCircle size={18} />
          </button>
        </Tooltip>
      </div>
      {showHelp && <HelpGuidePanel />}
    </>
  );
}
