import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Square, Paperclip, X } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';

interface ChatInputProps {
  nodeId: string;
  onSend: (message: string, images: File[]) => void;
  onCancel: () => void;
  supportsVision?: boolean;
}

export function ChatInput({
  nodeId,
  onSend,
  onCancel,
  supportsVision = true,
}: ChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isStreaming = useChatStore(
    (s) => s.conversations[nodeId]?.isStreaming ?? false
  );

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if ((!trimmed && images.length === 0) || isStreaming) return;

    onSend(trimmed, images);
    setInput('');
    setImages([]);
  }, [input, images, isStreaming, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/')
    );

    setImages((prev) => [...prev, ...files]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );

    setImages((prev) => [...prev, ...files]);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          setImages((prev) => [...prev, file]);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`nodrag nopan border-t border-neutral-700/50 p-2 transition ${
        isDragging ? 'bg-neutral-700/30' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {images.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {images.map((file, i) => (
            <div
              key={i}
              className="relative w-16 h-16 rounded-md overflow-hidden border border-neutral-600"
            >
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1.5">
        

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={t('chat.askSomething')}
          rows={1}
          className="flex-1 resize-none bg-neutral-800/50 text-sm text-neutral-200 rounded-lg px-3 py-2 placeholder-neutral-500 border border-neutral-700/50 focus:border-accent-500/50 focus:outline-none transition-colors"
          style={{ minHeight: '36px', maxHeight: '100px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height =
              Math.min(target.scrollHeight, 100) + 'px';
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!supportsVision}
          className="shrink-0 p-2 rounded-lg bg-neutral-800/60 text-neutral-300 hover:bg-neutral-700 transition disabled:opacity-30"
          title={
            supportsVision
              ? t('chat.attachImage')
              : t('chat.imagesNotSupported')
          }
        >
          <Paperclip size={16} />
        </button>

        {isStreaming ? (
          <button
            onClick={onCancel}
            className="shrink-0 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() && images.length === 0}
            className="shrink-0 p-2 rounded-lg bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
