import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';
import type { LLMConfig } from '../types/chat';

type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  llmConfig: LLMConfig;
  showMinimap: boolean;
  showSystemPrompts: boolean;
  showSettings: boolean;
  welcomeDismissed: boolean;
  language: string;
  theme: Theme;
  selectMode: boolean;
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
  toggleMinimap: () => void;
  toggleSystemPrompts: () => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
  dismissWelcome: () => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: Theme) => void;
  setSelectMode: (selectMode: boolean) => void;
  toggleSelectMode: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function applyTheme(theme: Theme) {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.setAttribute('data-theme', resolvedTheme);
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
      theme: 'dark',
      selectMode: false,

      updateLLMConfig: (config) => {
        const current = get().llmConfig;
        const merged = { ...current, ...config };

        // When switching providers, set sensible defaults for endpoint and model
        if (config.providerId && config.providerId !== current.providerId) {
          const defaults: Record<string, { model: string; endpoint?: string }> = {
            openai: { model: 'gpt-4o-mini', endpoint: 'https://api.openai.com/v1/chat/completions' },
            anthropic: { model: 'claude-sonnet-4-5-20250929', endpoint: 'https://api.anthropic.com/v1/messages' },
            custom: { model: '', endpoint: '' },
          };
          const d = defaults[config.providerId];
          if (d) {
            merged.model = d.model;
            if (d.endpoint) merged.endpoint = d.endpoint;
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

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      setSelectMode: (selectMode) => set({ selectMode }),

      toggleSelectMode: () => set({ selectMode: !get().selectMode }),
    }),
    {
      name: 'caudalflow-settings',
      partialize: (state) => ({
        llmConfig: state.llmConfig,
        showMinimap: state.showMinimap,
        showSystemPrompts: state.showSystemPrompts,
        welcomeDismissed: state.welcomeDismissed,
        language: state.language,
        theme: state.theme,
        selectMode: state.selectMode,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useSettingsStore.getState().theme;
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });
}
