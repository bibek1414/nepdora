"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface TextSelection {
  text: string;
  range: Range;
  element?: HTMLElement;
  fontSize?: string;
  color?: string;
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
        // Don't clearSelection() to keep the toolbar open
      }
    },
    [selection]
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
        // Don't clearSelection() to keep the toolbar open
      }
    },
    [selection]
  );

  /* Helper to unwrap nested font size spans */
  const cleanFontSizeSpans = (root: HTMLElement) => {
    const spans = Array.from(root.querySelectorAll("span")) as HTMLElement[];
    // Process from inner-most to outer to avoid skipping nested spans
    spans.reverse().forEach(el => {
      try {
        if (el.style && el.style.fontSize) {
          // Move children out, then remove this span
          while (el.firstChild) {
            el.parentNode?.insertBefore(el.firstChild, el);
          }
          el.parentNode?.removeChild(el);
        }
      } catch (e) {
        // ignore DOM exceptions
      }
    });
  };

  const applyFontSize = useCallback(
    (fontSize: string) => {
      if (!selection) return;

      const sel = window.getSelection();
      if (!sel) return;

      try {
        // Restore selection
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        const range = sel.getRangeAt(0);
        if (range.collapsed) return;

        // Check for existing ancestor span to update (preventing nesting loop)
        const common = range.commonAncestorContainer;
        let ancestor =
          common.nodeType === 1
            ? (common as HTMLElement)
            : common.parentElement;
        let fontAncestor: HTMLElement | null = null;

        // Find the closest span ancestor with a font-size
        while (ancestor) {
          if (
            ancestor.tagName === "SPAN" &&
            ancestor.style &&
            ancestor.style.fontSize
          ) {
            fontAncestor = ancestor;
            break;
          }
          // Stop if we hit a block element or non-span to avoid breaking out of scope too far
          if (
            ancestor.tagName === "DIV" ||
            ancestor.tagName === "P" ||
            ancestor.contentEditable === "true"
          ) {
            break;
          }
          ancestor = ancestor.parentElement;
        }

        // If we found an ancestor, check if our selection covers it entirely (or effectively matches)
        if (fontAncestor) {
          const rangeText = range.toString().trim();
          const ancestorText = fontAncestor.textContent?.trim() || "";

          // If the selected text matches the ancestor text, or if the ancestor ONLY contains our selection
          if (rangeText === ancestorText && rangeText.length > 0) {
            // Update the existing span instead of wrapping
            fontAncestor.style.fontSize = fontSize;
            fontAncestor.style.lineHeight = "1.15"; // Ensure consistent line height

            // Update selection to cover the updated ancestor
            const newRange = document.createRange();
            newRange.selectNodeContents(fontAncestor);
            sel.removeAllRanges();
            sel.addRange(newRange);

            setSelection({ ...selection, range: newRange, fontSize: fontSize });
            return;
          }
        }

        // Extract contents, clean nested spans, and wrap
        try {
          const content = range.extractContents();
          const tempDiv = document.createElement("div");
          tempDiv.appendChild(content);

          // Clean any nested font-size spans inside the extracted content
          cleanFontSizeSpans(tempDiv);

          const wrapper = document.createElement("span");
          wrapper.style.fontSize = fontSize;
          wrapper.style.lineHeight = "1.15";

          // Move cleaned children into the wrapper
          while (tempDiv.firstChild) {
            wrapper.appendChild(tempDiv.firstChild);
          }

          range.insertNode(wrapper);

          // Update selection to the new wrapper
          const newRange = document.createRange();
          newRange.selectNodeContents(wrapper);
          sel.removeAllRanges();
          sel.addRange(newRange);

          // Update local state if needed (optional, but good for consistency)
          setSelection({ ...selection, range: newRange, fontSize: fontSize });
        } catch (e) {
          console.warn("Manual span wrapping failed, falling back:", e);
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("fontSize", false, "4");
        }
      } catch (error) {
        console.warn("Font size application failed:", error);
      }
    },
    [selection] // Removed clearSelection from dependencies as we might not want to clear immediately
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
