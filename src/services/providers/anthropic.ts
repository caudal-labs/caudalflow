import type { LLMProvider, StreamCallbacks } from './types';
import type { ChatMessage, LLMConfig } from '../../types/chat';

function toAnthropicMessages(messages: ChatMessage[]) {
  return messages.map((m) => {
    if (m.images && m.images.length > 0) {
      return {
        role: m.role,
        content: [
          ...m.images.map((img) => ({
            type: 'image',
            source: {
              type: 'base64',
              media_type: img.mimeType,
              data: img.base64,
            },
          })),
          ...(m.content ? [{ type: 'text', text: m.content }] : []),
        ],
      };
    }

    return { role: m.role, content: m.content };
  });
}

export const AnthropicProvider: LLMProvider = {
  id: 'anthropic',
  name: 'Anthropic',

  async streamChat(
    messages: ChatMessage[],
    config: LLMConfig,
    callbacks: StreamCallbacks,
    signal: AbortSignal
  ) {
    // Anthropic expects system as a top-level field, not in the messages array
    const systemMessages = messages.filter((m) => m.role === 'system');
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    const body: Record<string, unknown> = {
      model: config.model,
      messages: toAnthropicMessages(nonSystemMessages),
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      stream: true,
    };

    if (systemMessages.length > 0) {
      body.system = systemMessages.map((m) => m.content).join('\n\n');
    }

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-llm-provider': 'anthropic',
          'x-api-key': config.apiKey || '',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (signal.aborted) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              callbacks.onToken(parsed.delta.text);
            }

            if (parsed.type === 'message_stop') {
              callbacks.onDone();
              return;
            }

            if (parsed.type === 'error') {
              throw new Error(parsed.error?.message ?? 'Unknown stream error');
            }
          } catch (e) {
            if (e instanceof Error && e.message.startsWith('API error')) throw e;

            if (e instanceof Error && e.message !== 'Unknown stream error' &&
                !e.message.includes('stream error')) {
              continue;
            }

            if (e instanceof Error) {
              throw e;
            }
          }
        }
      }

      callbacks.onDone();
    } catch (error) {
      if (signal.aborted) return;
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  },
};