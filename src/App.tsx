import { StrictMode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/canvas/Canvas';
import { CopilotKitProviderShell } from './components/copilot/CopilotKitProviderShell';
import { CustomCopilotChat } from './components/copilot/CustomCopilotChat';
import { usePersistence } from './hooks/usePersistence';
import { useSettingsStore } from './stores/settingsStore';

function AppInner() {
  const { t } = useTranslation();
  const [showChat, setShowChat] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  usePersistence();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const getSystemTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [theme]);

  return (
    <StrictMode>
      <Canvas />
      
      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-accent-500 text-white shadow-lg hover:bg-accent-600 transition-all hover:scale-105"
        title={showChat ? t('copilot.chat.chatToggleCloseLabel') : t('copilot.chat.chatToggleOpenLabel')}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Custom Chat Panel */}
      <CustomCopilotChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </StrictMode>
  );
}

export default function App() {
  return (
    <CopilotKitProviderShell>
      <ReactFlowProvider>
        <AppInner />
      </ReactFlowProvider>
    </CopilotKitProviderShell>
  );
}
