import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';
import type { LLMConfig } from '../types/chat';

interface SettingsState {
  llmConfig: LLMConfig;
  showMinimap: boolean;
  showSystemPrompts: boolean;
  showSettings: boolean;
  welcomeDismissed: boolean;
  language: string;
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
  toggleMinimap: () => void;
  toggleSystemPrompts: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
  dismissWelcome: () => void;
  setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      llmConfig: {
        providerId: 'mock',
        endpoint: 'https://api.openai.com/v1',
        apiKey: '',
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 2048,
        mockDelay: 30,
      },
      showMinimap: true,
      showSystemPrompts: false,
      showSettings: false,
      welcomeDismissed: false,
      language: 'en',

      updateLLMConfig: (config) => {
        const current = get().llmConfig;
        const merged = { ...current, ...config };

        // When switching providers, set sensible defaults for endpoint and model
        if (config.providerId && config.providerId !== current.providerId) {
          const defaults: Record<string, { model: string }> = {
            openai: { model: 'gpt-4o-mini' },
            anthropic: { model: 'claude-sonnet-4-5-20250929' },
          };
          const d = defaults[config.providerId];
          if (d) {
            merged.model = d.model;
          }
        }

        set({ llmConfig: merged });
      },

      toggleMinimap: () => set({ showMinimap: !get().showMinimap }),

      toggleSystemPrompts: () => set({ showSystemPrompts: !get().showSystemPrompts }),

      toggleSettings: () => set({ showSettings: !get().showSettings }),

      setShowSettings: (show) => set({ showSettings: show }),

      dismissWelcome: () => set({ welcomeDismissed: true }),

      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },
    }),
    {
      name: 'caudalflow-settings',
      partialize: (state) => ({
        llmConfig: state.llmConfig,
        showMinimap: state.showMinimap,
        showSystemPrompts: state.showSystemPrompts,
        welcomeDismissed: state.welcomeDismissed,
        language: state.language,
      }),
    }
  )
);
