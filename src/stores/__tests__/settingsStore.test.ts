import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settingsStore';

const INITIAL_CONFIG = {
  providerId: 'mock',
    providerName: 'Mock',
  endpoint: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  mockDelay: 30,
};

beforeEach(() => {
  useSettingsStore.setState({
    llmConfig: { ...INITIAL_CONFIG },
    showMinimap: true,
    showSystemPrompts: false,
    showSettings: false,
  });
});

describe('settingsStore', () => {
  describe('updateLLMConfig', () => {
    it('merges partial config updates', () => {
      useSettingsStore.getState().updateLLMConfig({ temperature: 0.9 });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.temperature).toBe(0.9);
      expect(config.providerId).toBe('mock'); // unchanged
      expect(config.model).toBe('gpt-4o-mini'); // unchanged
    });

    it('sets OpenAI defaults when switching to openai provider', () => {
      useSettingsStore.getState().updateLLMConfig({ providerId: 'openai' });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.providerId).toBe('openai');
      expect(config.model).toBe('gpt-4o-mini');
    });

    it('sets Anthropic defaults when switching to anthropic provider', () => {
      useSettingsStore.getState().updateLLMConfig({ providerId: 'anthropic' });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.providerId).toBe('anthropic');
      expect(config.model).toBe('claude-sonnet-4-5-20250929');
    });

    it('does not override model when staying on the same provider', () => {
      useSettingsStore.getState().updateLLMConfig({ providerId: 'openai' });
      useSettingsStore.getState().updateLLMConfig({ model: 'gpt-4o' });

      // Updating non-provider fields should not reset model
      useSettingsStore.getState().updateLLMConfig({ temperature: 0.5 });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.model).toBe('gpt-4o');
    });

    it('does not apply provider defaults for unknown providers', () => {
      useSettingsStore.getState().updateLLMConfig({
        providerId: 'custom-provider',
        model: 'custom-model',
      });
      const config = useSettingsStore.getState().llmConfig;
      expect(config.providerId).toBe('custom-provider');
      expect(config.model).toBe('custom-model');
    });
  });

  describe('toggleMinimap', () => {
    it('toggles minimap from true to false', () => {
      expect(useSettingsStore.getState().showMinimap).toBe(true);
      useSettingsStore.getState().toggleMinimap();
      expect(useSettingsStore.getState().showMinimap).toBe(false);
    });

    it('toggles minimap from false to true', () => {
      useSettingsStore.getState().toggleMinimap(); // true → false
      useSettingsStore.getState().toggleMinimap(); // false → true
      expect(useSettingsStore.getState().showMinimap).toBe(true);
    });
  });

  describe('toggleSystemPrompts', () => {
    it('toggles system prompts visibility', () => {
      expect(useSettingsStore.getState().showSystemPrompts).toBe(false);
      useSettingsStore.getState().toggleSystemPrompts();
      expect(useSettingsStore.getState().showSystemPrompts).toBe(true);
      useSettingsStore.getState().toggleSystemPrompts();
      expect(useSettingsStore.getState().showSystemPrompts).toBe(false);
    });
  });

  describe('toggleSettings', () => {
    it('toggles settings panel visibility', () => {
      expect(useSettingsStore.getState().showSettings).toBe(false);
      useSettingsStore.getState().toggleSettings();
      expect(useSettingsStore.getState().showSettings).toBe(true);
    });
  });

  describe('setShowSettings', () => {
    it('sets settings visibility explicitly', () => {
      useSettingsStore.getState().setShowSettings(true);
      expect(useSettingsStore.getState().showSettings).toBe(true);
      useSettingsStore.getState().setShowSettings(false);
      expect(useSettingsStore.getState().showSettings).toBe(false);
    });
  });
});
