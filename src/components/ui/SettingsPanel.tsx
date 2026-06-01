import { useTranslation } from 'react-i18next';
import { X, Sun, Moon, Monitor, Eye, EyeOff, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { listProviders } from '../../services/providers/registry';
import { fetchModels, testConnection } from '../../services/providers/api';

export function SettingsPanel() {
  const { t } = useTranslation();
  const showSettings = useSettingsStore((s) => s.showSettings);
  const setShowSettings = useSettingsStore((s) => s.setShowSettings);
  const config = useSettingsStore((s) => s.llmConfig);
  const updateConfig = useSettingsStore((s) => s.updateLLMConfig);
  const showSystemPrompts = useSettingsStore((s) => s.showSystemPrompts);
  const toggleSystemPrompts = useSettingsStore((s) => s.toggleSystemPrompts);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const providers = listProviders();
  const [showApiKey, setShowApiKey] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);

  if (!showSettings) return null;

  const labelClass = 'block text-xs font-medium mb-1';
  const inputClass =
    'w-full bg-surface-800 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-500/50 focus:outline-none transition-colors';

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: t('settings.themeLight') },
    { value: 'dark' as const, icon: Moon, label: t('settings.themeDark') },
    { value: 'system' as const, icon: Monitor, label: t('settings.themeSystem') },
  ];

  const handleFetchModels = useCallback(async () => {
    if (!config.endpoint || !config.apiKey) return;
    setLoadingModels(true);
    try {
      const fetchedModels = await fetchModels(config.endpoint, config.apiKey);
      setModels(fetchedModels);
    } finally {
      setLoadingModels(false);
    }
  }, [config.endpoint, config.apiKey]);

  const handleTestConnection = useCallback(async () => {
    if (!config.endpoint || !config.apiKey) return;
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const result = await testConnection(config.endpoint, config.apiKey);
      setConnectionResult(result);
    } finally {
      setTestingConnection(false);
    }
  }, [config.endpoint, config.apiKey]);

  return (
    <div className="absolute top-0 right-0 z-50 h-full w-80 bg-surface-900 border-l border-border shadow-2xl shadow-black/50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary">{t('settings.title')}</h2>
        <button
          onClick={() => setShowSettings(false)}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Theme Section */}
        <div className="border-b border-border pb-4">
          <h3 className="text-xs font-semibold text-text-secondary mb-3">{t('settings.theme')}</h3>
          <div className="flex gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                  theme === option.value
                    ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                    : 'border-border bg-surface-800 text-text-secondary hover:border-border-hover'
                }`}
              >
                <option.icon size={18} />
                <span className="text-[10px] font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LLM Provider Section */}
        <div>
          <label className={labelClass}>{t('settings.llmProvider')}</label>
          <select
            value={config.providerId}
            onChange={(e) => updateConfig({ providerId: e.target.value })}
            className={inputClass}
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Provider Name - Editable for custom */}
        {config.providerId === 'custom' && (
          <div>
            <label className={labelClass}>{t('settings.providerName')}</label>
            <input
              type="text"
              value={config.providerName}
              onChange={(e) => updateConfig({ providerName: e.target.value })}
              className={inputClass}
              placeholder="My Custom Provider"
            />
          </div>
        )}

        {/* API Key Input - Show for all providers except mock */}
        {config.providerId !== 'mock' && (
          <div>
            <label className={labelClass}>{t('settings.apiKey')}</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                className={inputClass}
                placeholder={t('settings.apiKeyPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              {t('settings.apiKeyDescription')}
            </p>
          </div>
        )}

        {/* Endpoint URL - Show for custom provider */}
        {config.providerId === 'custom' && (
          <div>
            <label className={labelClass}>{t('settings.endpoint')}</label>
            <input
              type="text"
              value={config.endpoint}
              onChange={(e) => updateConfig({ endpoint: e.target.value })}
              className={inputClass}
              placeholder="https://api.example.com/v1/chat/completions"
            />
            <p className="text-[10px] text-text-muted mt-1">
              {t('settings.endpointDescription')}
            </p>

            {/* Test Connection & Fetch Models */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleTestConnection}
                disabled={!config.endpoint || !config.apiKey || testingConnection}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface-700 hover:bg-surface-600 rounded-md transition-colors disabled:opacity-50"
              >
                {testingConnection ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : connectionResult?.success ? (
                  <CheckCircle size={12} className="text-green-400" />
                ) : connectionResult?.success === false ? (
                  <XCircle size={12} className="text-red-400" />
                ) : null}
                {t('settings.testConnection')}
              </button>
              <button
                onClick={handleFetchModels}
                disabled={!config.endpoint || !config.apiKey || loadingModels}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface-700 hover:bg-surface-600 rounded-md transition-colors disabled:opacity-50"
              >
                {loadingModels ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                {t('settings.fetchModels')}
              </button>
            </div>

            {connectionResult && (
              <p className={`text-[10px] mt-1 ${connectionResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {connectionResult.message}
              </p>
            )}
          </div>
        )}

        {/* Model Config - Show for non-mock providers */}
        {config.providerId !== 'mock' && (
          <>
            <div>
              <label className={labelClass}>{t('settings.model')}</label>
              {models.length > 0 ? (
                <select
                  value={config.model}
                  onChange={(e) => updateConfig({ model: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t('settings.selectModel')}</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => updateConfig({ model: e.target.value })}
                  className={inputClass}
                  placeholder={config.providerId === 'openai' ? 'gpt-4o-mini' : config.providerId === 'anthropic' ? 'claude-sonnet-4-20250514' : 'model-id'}
                />
              )}
            </div>
            <div>
              <label className={labelClass}>{t('settings.temperature')}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) =>
                  updateConfig({ temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-accent-500"
              />
              <div className="text-xs text-text-muted text-right">
                {config.temperature}
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('settings.maxTokens')}</label>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) =>
                  updateConfig({ maxTokens: parseInt(e.target.value) || 2048 })
                }
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* Mock Provider Config */}
        {config.providerId === 'mock' && (
          <div>
            <label className={labelClass}>{t('settings.tokenDelay')}</label>
            <input
              type="number"
              value={config.mockDelay}
              onChange={(e) =>
                updateConfig({ mockDelay: parseInt(e.target.value) || 30 })
              }
              className={inputClass}
              min="5"
              max="500"
            />
            <p className="text-xs text-text-muted mt-1">
              {t('settings.tokenDelayDescription')}
            </p>
          </div>
        )}

        {/* Display Settings */}
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-text-secondary mb-3">{t('settings.display')}</h3>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-text-secondary">{t('settings.showSystemPrompts')}</span>
            <button
              onClick={toggleSystemPrompts}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                showSystemPrompts ? 'bg-accent-500' : 'bg-surface-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  showSystemPrompts ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>
          <p className="text-[10px] text-text-muted mt-1">
            {t('settings.showSystemPromptsDescription')}
          </p>
        </div>

        {/* Language Settings */}
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-text-secondary mb-3">Language</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputClass}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-text-muted text-center">
          {t('settings.savedToLocalStorage')}
        </p>
      </div>
    </div>
  );
}
