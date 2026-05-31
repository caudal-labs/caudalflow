import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { listProviders } from '../../services/providers/registry';

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
  const providers = listProviders();

  if (!showSettings) return null;

  const labelClass = 'block text-xs font-medium text-neutral-400 mb-1';
  const inputClass =
    'w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:border-accent-500/50 focus:outline-none transition-colors';

  return (
    <div className="absolute top-0 right-0 z-50 h-full w-80 bg-surface-900 border-l border-neutral-700/50 shadow-2xl shadow-black/50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700/50">
        <h2 className="text-sm font-semibold text-neutral-200">{t('settings.title')}</h2>
        <button
          onClick={() => setShowSettings(false)}
          className="text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        {config.providerId === 'openai' && (
          <>
            <div>
              <p className="text-xs text-neutral-500">
                {t('settings.apiKeyConfigured')}
              </p>
            </div>
            <div>
              <label className={labelClass}>{t('settings.model')}</label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => updateConfig({ model: e.target.value })}
                className={inputClass}
                placeholder="gpt-4o-mini"
              />
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
              <div className="text-xs text-neutral-500 text-right">
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

        {config.providerId === 'anthropic' && (
          <>
            <div>
              <p className="text-xs text-neutral-500">
                {t('settings.apiKeyConfigured')}
              </p>
            </div>
            <div>
              <label className={labelClass}>{t('settings.model')}</label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => updateConfig({ model: e.target.value })}
                className={inputClass}
                placeholder="claude-sonnet-4-5-20250929"
              />
            </div>
            <div>
              <label className={labelClass}>{t('settings.temperature')}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) =>
                  updateConfig({ temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-accent-500"
              />
              <div className="text-xs text-neutral-500 text-right">
                {config.temperature}
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('settings.maxTokens')}</label>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) =>
                  updateConfig({ maxTokens: parseInt(e.target.value) || 4096 })
                }
                className={inputClass}
              />
            </div>
          </>
        )}

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
            <p className="text-xs text-neutral-500 mt-1">
              {t('settings.tokenDelayDescription')}
            </p>
          </div>
        )}

        <div className="border-t border-neutral-700/50 pt-4">
          <h3 className="text-xs font-semibold text-neutral-300 mb-3">{t('settings.display')}</h3>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-neutral-400">{t('settings.showSystemPrompts')}</span>
            <button
              onClick={toggleSystemPrompts}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                showSystemPrompts ? 'bg-accent-500' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  showSystemPrompts ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>
          <p className="text-[10px] text-neutral-600 mt-1">
            {t('settings.showSystemPromptsDescription')}
          </p>
        </div>

        <div className="border-t border-neutral-700/50 pt-4">
          <h3 className="text-xs font-semibold text-neutral-300 mb-3">Language</h3>
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

      <div className="px-4 py-3 border-t border-neutral-700/50">
        <p className="text-[10px] text-neutral-600 text-center">
          {t('settings.savedToLocalStorage')}
        </p>
      </div>
    </div>
  );
}
