import type { LLMProvider, StreamCallbacks } from './types';
import type { ChatMessage, LLMConfig } from '../../types/chat';

function toOpenAIMessages(messages: ChatMessage[]) {
  return messages.map((m) => {
    if (m.images && m.images.length > 0) {
      return {
        role: m.role,
        content: [
          ...(m.content ? [{ type: 'text', text: m.content }] : []),
          ...m.images.map((img) => ({
            type: 'image_url',
            image_url: {
              url: `data:${img.mimeType};base64,${img.base64}`,
            },
          })),
        ],
      };
    }
    return { role: m.role, content: m.content };
  });
}

export const CustomProvider: LLMProvider = {
  id: 'custom',
  name: 'Custom (OpenAI Compatible)',
  supportsVision: true,

  async streamChat(
    messages: ChatMessage[],
    config: LLMConfig,
    callbacks: StreamCallbacks,
    signal: AbortSignal
  ) {
    const body = {
      model: config.model,
      messages: toOpenAIMessages(messages),
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    };

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
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

          if (data === '[DONE]') {
            callbacks.onDone();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              callbacks.onToken(content);
            }
          } catch (e) {
            continue;
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
