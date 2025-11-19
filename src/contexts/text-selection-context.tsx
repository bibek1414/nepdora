"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface TextSelection {
  text: string;
  range: Range;
  element?: HTMLElement;
}

interface TextSelectionContextType {
  selection: TextSelection | null;
  setSelection: (selection: TextSelection | null) => void;
  clearSelection: () => void;
  applyFormatting: (command: string, value?: string) => void;
  applyColor: (color: string) => void;
  applyFontSize: (fontSize: string) => void;
}

const TextSelectionContext = createContext<
  TextSelectionContextType | undefined
>(undefined);

export const TextSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const clearSelection = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  const applyFormatting = useCallback(
    (command: string, value?: string) => {
      if (selection) {
        // Restore the selection
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(selection.range);
        }

        // Apply formatting
        document.execCommand(command, false, value);
        clearSelection();
      }
    },
    [selection, clearSelection]
  );

  const applyColor = useCallback(
    (color: string) => {
      if (selection) {
        // Restore the selection
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(selection.range);
        }

        // Apply color
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand("foreColor", false, color);
        clearSelection();
      }
    },
    [selection, clearSelection]
  );

  const applyFontSize = useCallback(
    (fontSize: string) => {
      if (!selection) return;

      // Restore the selection
      const sel = window.getSelection();
      if (!sel) return;

      sel.removeAllRanges();
      sel.addRange(selection.range);

      // Apply font size
      document.execCommand("styleWithCSS", false, "true");

      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const span = document.createElement("span");
        span.style.fontSize = fontSize;
        try {
          range.surroundContents(span);
        } catch (e) {
          console.warn("Could not apply font size:", e);
        }
      }

      clearSelection();
    },
    [selection, clearSelection]
  );

  return (
    <TextSelectionContext.Provider
      value={{
        selection,
        setSelection,
        clearSelection,
        applyFormatting,
        applyColor,
        applyFontSize,
      }}
    >
      {children}
    </TextSelectionContext.Provider>
  );
};

export const useTextSelection = () => {
  const context = useContext(TextSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useTextSelection must be used within a TextSelectionProvider"
    );
  }
  return context;
};
