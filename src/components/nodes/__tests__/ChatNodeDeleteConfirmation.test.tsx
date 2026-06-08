/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import '../../../i18n';
import { ChatNodeDeleteConfirmation } from '../ChatNodeDeleteConfirmation';

describe('ChatNodeDeleteConfirmation', () => {
  let container: HTMLDivElement;
  let root: Root;
  let onConfirm: Mock<() => void>;
  let onCancel: Mock<() => void>;

  const renderPopup = () => {
    act(() => {
      root.render(
        <ChatNodeDeleteConfirmation
          topic="A conversation worth keeping"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
    });
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    onConfirm = vi.fn();
    onCancel = vi.fn();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  it('confirms deletion from the Delete button', () => {
    renderPopup();

    const deleteButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Delete'),
    );

    act(() => {
      deleteButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('cancels from the Cancel button', () => {
    renderPopup();

    const cancelButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Cancel',
    );

    act(() => {
      cancelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('cancels when Escape is pressed', () => {
    renderPopup();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('cancels when clicking outside the popup', () => {
    vi.useFakeTimers();
    renderPopup();

    // Advance past the 50ms delay so the mousedown handler is attached
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // First mousedown is skipped by the component's skipFirst guard
    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    // Second mousedown outside triggers cancel
    act(() => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
