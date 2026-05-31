import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Map,
  Settings,
  Plus,
  HelpCircle,
  Network,
  ChevronDownSquare,
  ChevronUpSquare
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useFlowStore } from '../../stores/flowStore';
import { useChatStore } from '../../stores/chatStore';
import { HelpGuidePanel } from '../ui/HelpGuide';
import { calculateAutoLayoutPositions } from '../../utils/nodeLayout';

export function CanvasControls() {
  const { t } = useTranslation();
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow();
  const toggleMinimap = useSettingsStore((s) => s.toggleMinimap);
  const showMinimap = useSettingsStore((s) => s.showMinimap);
  const toggleSettings = useSettingsStore((s) => s.toggleSettings);
  const [showHelp, setShowHelp] = useState(false);
  const arrangeTimerRef = useRef<number | null>(null);
  const toggleCollapseSmart = useFlowStore((s) => s.toggleCollapseSmart);

  const nodes = useFlowStore((s) => s.nodes);
  const collapsedCount = nodes.filter((n) => n.data?.collapsed).length;
  const mostlyCollapsed = collapsedCount > nodes.length / 2;

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
    useChatStore.getState().initConversation(nodeId);
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

  const btnClass =
    'p-2 rounded-lg bg-surface-900 border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:bg-surface-800 transition-colors';

  return (
    <>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <button onClick={handleNewNode} className={btnClass} title={t('canvas.newChat')}>
          <Plus size={18} />
        </button>
        <div className="h-px bg-neutral-700/50 my-0.5" />
        <button onClick={() => zoomIn()} className={btnClass} title={t('canvas.zoomIn')}>
          <ZoomIn size={18} />
        </button>
        <button onClick={() => zoomOut()} className={btnClass} title={t('canvas.zoomOut')}>
          <ZoomOut size={18} />
        </button>
        <button onClick={() => fitView({ padding: 0.2 })} className={btnClass} title={t('canvas.fitView')}>
          <Maximize size={18} />
        </button>
        <button onClick={handleAutoArrange} className={btnClass} title={t('canvas.autoArrange')}>
          <Network size={18} />
        </button>
        <div className="h-px bg-neutral-700/50 my-0.5" />
        <button
          onClick={toggleMinimap}
          className={`${btnClass} ${showMinimap ? 'text-accent-400' : ''}`}
          title={t('canvas.toggleMinimap')}
        >
          <Map size={18} />
        </button>
        <button  
          onClick={toggleCollapseSmart}
          className={btnClass}
          title={t('canvas.toggleCollapse')}
        >
          {mostlyCollapsed ? <ChevronUpSquare size={18} /> : <ChevronDownSquare size={18} />}        
        </button>
        <button onClick={toggleSettings} className={btnClass} title={t('canvas.settings')}>
          <Settings size={18} />
        </button>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={`${btnClass} ${showHelp ? 'text-accent-400' : ''}`}
          title={t('canvas.help')}
        >
          <HelpCircle size={18} />
        </button>
      </div>
      {showHelp && <HelpGuidePanel />}
    </>
  );
}
