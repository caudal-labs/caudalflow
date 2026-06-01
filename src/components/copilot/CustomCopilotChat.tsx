import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, MessageSquare, Loader2, Copy, Check } from 'lucide-react';
import { useAgent } from '../../services/agent';

interface CustomCopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomCopilotChat({ isOpen, onClose }: CustomCopilotChatProps) {
  const { t } = useTranslation();
  const { messages, isRunning, send, abort } = useAgent();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!input.trim() || isRunning) return;
    const message = input.trim();
    setInput('');
    await send(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] bg-surface-900 border-l border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-900">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-accent-400" />
          <h2 className="text-sm font-semibold text-text-primary">
            {t('copilot.chat.title')}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-800 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={48} className="text-surface-700 mb-4" />
            <p className="text-text-muted text-sm">
              {t('copilot.chat.welcomeMessageText')}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-accent-500 text-white'
                    : 'bg-surface-800 text-text-primary'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => handleCopy(`${index}`, msg.content)}
                      className="text-text-muted hover:text-text-primary transition-colors"
                    >
                      {copiedId === `${index}` ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isRunning && (
          <div className="flex justify-start">
            <div className="bg-surface-800 rounded-xl px-4 py-3">
              <Loader2 size={16} className="text-accent-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-surface-900 p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('copilot.chat.chatInputPlaceholder')}
            rows={1}
            className="flex-1 resize-none bg-surface-800 text-sm text-text-primary rounded-xl px-4 py-3 placeholder-text-muted border border-border focus:border-accent-500/50 focus:outline-none transition-colors"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={isRunning ? abort : handleSubmit}
            className="shrink-0 p-3 rounded-xl bg-accent-500 text-white hover:bg-accent-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRunning ? <X size={16} /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-2 text-center">
          {t('copilot.chat.chatDisclaimerText')}
        </p>
      </div>
    </div>
  );
}
