import type { LLMProvider } from './types';
import { MockProvider } from './mock';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { CustomProvider } from './custom';

const providers = new Map<string, LLMProvider>();

function register(provider: LLMProvider) {
  providers.set(provider.id, provider);
}

register(MockProvider);
register(OpenAIProvider);
register(AnthropicProvider);
register(CustomProvider);

export function getProvider(id: string): LLMProvider | undefined {
  return providers.get(id);
}

export function listProviders(): LLMProvider[] {
  return Array.from(providers.values());
}
