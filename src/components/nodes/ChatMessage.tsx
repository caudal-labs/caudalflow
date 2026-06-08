import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  exploredTexts: string[];
}

function highlightExplored(children: ReactNode, texts: string[]): ReactNode {
  if (texts.length === 0) return children;

  const process = (node: ReactNode): ReactNode => {
    if (typeof node === 'string') {
      return splitAndHighlight(node, texts);
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => <span key={i}>{process(child)}</span>);
    }
    if (node && typeof node === 'object' && 'props' in node) {
      const { children: c, ...rest } = node.props as { children?: ReactNode; [key: string]: unknown };
      if (c !== undefined) {
        return { ...node, props: { ...rest, children: process(c) } };
      }
    }
    return node;
  };

  return process(children);
}

function splitAndHighlight(text: string, texts: string[]): ReactNode {
  // Sort by length descending so longer matches take priority
  const sorted = [...texts].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  const parts = text.split(pattern);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const isMatch = sorted.some((t) => t.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <mark
          key={i}
          className="bg-yellow-400/25 text-yellow-300 rounded-sm px-0.5 decoration-yellow-400/50 underline underline-offset-2"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export const ChatMessage = memo(function ChatMessage({
  message,
  exploredTexts,
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content || '');
      setCopied(true);
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
      resetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        resetTimeoutRef.current = null;
      }, 1500);
    } catch (error) {
      console.error('Failed to copy message content', error);
    }
  }, [message.content]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const withHighlights = (children: ReactNode) =>
    isUser ? children : highlightExplored(children, exploredTexts);

  if (isSystem) {
    return (
      <div className="px-3 py-1.5">
        <div className="text-[11px] leading-relaxed text-text-muted bg-surface-800 border border-border rounded-lg px-3 py-2 italic">
          <span className="text-text-secondary font-medium not-italic text-[10px] uppercase tracking-wider">System</span>
          <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`px-3 py-2 ${
        isUser ? 'flex justify-end' : ''
      }`}
    >
      <div
        className={`relative group text-sm leading-relaxed ${
          isUser
            ? 'bg-accent-600 text-white rounded-2xl rounded-br-md px-3 py-2 pr-7 max-w-[85%] inline-block'
            : 'text-text-primary prose-invert prose-sm max-w-none pr-7'
        }`}
      >
        <button
          type="button"
          aria-label={copied ? 'Copied message' : 'Copy message'}
          data-state={copied ? 'copied' : 'idle'}
          onClick={handleCopy}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-primary"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        {isUser ? (
            <div className="flex flex-col gap-2">
              {message?.images?.map((img, i) => {
                const url = `data:${img.mimeType};base64,${img.base64}`;

                return (
                  <img
                    key={i}
                    src={url}
                    onClick={() => setLightbox(url)}
                    className="max-w-25 sm:max-w-25 rounded-lg cursor-pointer border border-border hover:opacity-90 transition"
                  />
                );
              })}
              {message.content && <div>{message.content}</div>}
            </div>
          ) : (
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');
                if (match) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: '0.5rem 0',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  );
                }
                return (
                  <code
                    className="bg-surface-700 px-1 py-0.5 rounded text-xs"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0">{withHighlights(children)}</p>;
              },
              h2({ children }) {
                return (
                  <h2 className="text-sm font-semibold text-text-primary mt-3 mb-1">
                    {withHighlights(children)}
                  </h2>
                );
              },
              h3({ children }) {
                return (
                  <h3 className="text-sm font-medium text-text-primary mt-2 mb-1">
                    {withHighlights(children)}
                  </h3>
                );
              },
              ul({ children }) {
                return <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>;
              },
              ol({ children }) {
                return (
                  <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>
                );
              },
              li({ children }) {
                return <li className="text-sm">{withHighlights(children)}</li>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-2 border-accent-500 pl-3 my-2 text-text-secondary italic">
                    {children}
                  </blockquote>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full text-xs border-collapse">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="border border-border-hover px-2 py-1 bg-surface-800 text-left font-medium">
                    {withHighlights(children)}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border border-border px-2 py-1">
                    {withHighlights(children)}
                  </td>
                );
              },
              strong({ children }) {
                return <strong className="font-semibold text-text-primary">{withHighlights(children)}</strong>;
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-400 hover:underline"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {message.content || '▊'}
          </Markdown>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
});
