// src/hooks/useCopyToClipboard.ts

import { useState } from 'react';

interface CopyToClipboardState {
  copied: boolean;
  error: boolean;
}

interface CopyToClipboardReturn extends CopyToClipboardState {
  copyToClipboard: (text: string) => Promise<boolean>;
  resetCopyState: () => void;
}

/**
 * Custom hook for copying text to clipboard
 * @returns Object with copy state and copy function
 */
export const useCopyToClipboard = (): CopyToClipboardReturn => {
  const [copyState, setCopyState] = useState<CopyToClipboardState>({
    copied: false,
    error: false,
  });

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!text) {
      setCopyState({ copied: false, error: true });
      return false;
    }

    try {
      if (navigator.clipboard) {
        // Modern API approach
        await navigator.clipboard.writeText(text);
        setCopyState({ copied: true, error: false });
        return true;
      } else {
        // Fallback approach
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopyState({ copied: success, error: !success });
        return success;
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
      setCopyState({ copied: false, error: true });
      return false;
    }
  };

  const resetCopyState = () => {
    setCopyState({ copied: false, error: false });
  };

  return {
    ...copyState,
    copyToClipboard,
    resetCopyState,
  };
};
