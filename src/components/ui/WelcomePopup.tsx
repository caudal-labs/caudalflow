import { useEffect, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Settings, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

export function WelcomePopup() {
  const { t } = useTranslation();
  const providerId = useSettingsStore((s) => s.llmConfig.providerId);
  const welcomeDismissed = useSettingsStore((s) => s.welcomeDismissed);
  const dismissWelcome = useSettingsStore((s) => s.dismissWelcome);
  const setShowSettings = useSettingsStore((s) => s.setShowSettings);

  const visible = providerId === 'mock' && !welcomeDismissed;

  const handleDismiss = useCallback(() => {
    dismissWelcome();
  }, [dismissWelcome]);

  const handleOpenSettings = useCallback(() => {
    dismissWelcome();
    setShowSettings(true);
  }, [dismissWelcome, setShowSettings]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleDismiss]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleDismiss}
    >
      <div
        className="w-96 rounded-lg border border-surface-700 bg-surface-800 shadow-xl shadow-black/50 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-accent-400" />
          <h2 className="text-base font-semibold text-text-primary">
            {t('welcome.title')}
          </h2>
        </div>

        <p className="text-sm text-text-secondary mb-2">
          <Trans i18nKey="welcome.mockModeDescription">
            You're currently in <span className="text-accent-300 font-medium">mock mode</span> — responses are simulated so you can explore the canvas without an API key.
          </Trans>
        </p>

        <p className="text-sm text-text-secondary mb-4">
          {t('welcome.realAiDescription')}
        </p>

        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium rounded-md px-3 py-2 bg-accent-500/20 text-accent-300 hover:bg-accent-500/30 border border-accent-500/30 transition-colors"
            onClick={handleOpenSettings}
          >
            <Settings size={14} />
            {t('welcome.openSettings')}
          </button>
          <button
            className="flex-1 text-sm font-medium rounded-md px-3 py-2 text-text-secondary hover:text-text-primary bg-surface-700/50 hover:bg-surface-700 border border-surface-600 transition-colors"
            onClick={handleDismiss}
          >
            {t('welcome.exploreMockMode')}
          </button>
        </div>
      </div>
    </div>
  );
}
