"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Palette,
  Type,
  X,
  Minus,
  Plus,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ChevronDown,
} from "lucide-react";
import { useTextSelection } from "@/contexts/text-selection-context";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

export const StickyFormattingToolbar: React.FC = () => {
  const {
    selection,
    setSelection,
    clearSelection,
    applyFormatting,
    applyColor,
    applyFontSize,
  } = useTextSelection();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showAlignPicker, setShowAlignPicker] = useState(false);

  const [selectionColor, setSelectionColor] = useState("#000000");
  const [selectionHighlight, setSelectionHighlight] = useState("#FFFF00");
  const [selectionFontSize, setSelectionFontSize] = useState("16px");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [fontSizeInput, setFontSizeInput] = useState("16");

  const toolbarRef = useRef<HTMLDivElement>(null);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  // Quick color options - Text colors
  const quickColors = [
    theme?.colors?.text || "#0F172A",
    theme?.colors?.primary || "#3B82F6",
    theme?.colors?.secondary || "#F59E0B",
    "#DC2626",
    "#10B981",
    "#9333EA",
    "#CA8A04",
    "#DB2777",
    "#0891B2",
    "#65A30D",
    "#EA580C",
    "#475569",
  ];

  // Highlight colors
  const quickHighlights = [
    "#FFFF00", // Yellow
    "#90EE90", // Light Green
    "#FFB6C1", // Light Pink
    "#87CEEB", // Sky Blue
    "#FFD700", // Gold
    "#FFA500", // Orange
    "#DDA0DD", // Plum
    "#F0E68C", // Khaki
    "#98FB98", // Pale Green
    "#FFB6C1", // Light Pink
    "#E6E6FA", // Lavender
    "#F5F5DC", // Beige
  ];

  // Quick font size options
  const quickFontSizes = [
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
    "60px",
    "72px",
    "96px",
  ];

  // Font options
  const fontOptions = [
    "Inter",
    "Poppins",
    "Roboto",
    "Arial",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Helvetica",
    "Comic Sans MS",
  ];

  // Apply highlight/background color with better browser compatibility
  const applyHighlight = (color: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        // Try multiple methods for highlighting
        try {
          // Method 1: Using backColor command
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("backColor", false, color);

          // Method 2: Using backgroundColor style for modern browsers
          if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const span = document.createElement("span");
            span.style.backgroundColor = color;

            // Only wrap if there's selected content
            if (!range.collapsed) {
              try {
                range.surroundContents(span);
              } catch (e) {
                // If surrounding fails, try alternative method
                const content = range.extractContents();
                span.appendChild(content);
                range.insertNode(span);
              }
            }
          }
        } catch (error) {
          console.warn("Highlight application failed:", error);
          // Fallback: use traditional execCommand
          document.execCommand("backColor", false, color);
        }

        // Update context with the current selection after DOM modification
        const currentSel = window.getSelection();
        if (currentSel && currentSel.rangeCount > 0) {
          setSelection({
            ...selection,
            range: currentSel.getRangeAt(0),
          });
        }

        // Trigger input event on the element to ensure EditableText catches the change
        if (selection.element) {
          selection.element.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }
      }
    }
    setShowHighlightPicker(false);
  };

  // Apply font family with better compatibility
  const applyFontFamily = (font: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        try {
          document.execCommand("fontName", false, font);
          setSelectedFont(font);
        } catch (error) {
          console.warn("Font family application failed:", error);
          // Fallback: use CSS styling
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("fontName", false, font);
        }

        // Update context with potentially new range
        if (sel.rangeCount > 0) {
          setSelection({
            ...selection,
            range: sel.getRangeAt(0),
          });
        }

        // Trigger input event
        if (selection.element) {
          selection.element.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }
      }
    }
    setShowFontPicker(false);
  };

  // Apply text alignment
  const applyAlignment = (
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    if (selection?.element) {
      const alignCommands = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
        justify: "justifyFull",
      };

      try {
        document.execCommand(alignCommands[alignment], false);
        selection.element.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (error) {
        console.warn(`Alignment ${alignment} failed:`, error);
      }
    }
    setShowAlignPicker(false);
  };
  // Add this new function that uses the context's applyFontSize
  const handleFontSizeChange = (size: string) => {
    if (selection?.range) {
      // Call the context's applyFontSize which should handle the API update
      applyFontSize(size);

      // Update local state
      setSelectionFontSize(size);
      setFontSizeInput(parseInt(size).toString());

      // Close dropdown if open
      setShowFontSizePicker(false);
    }
  };

  // Then update all your font size buttons to use this function
  // Enhanced formatting application
  const handleFormatting = (format: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        try {
          document.execCommand(format, false);
          // Update context with potentially new range if browser updated it
          if (sel.rangeCount > 0) {
            setSelection({
              ...selection,
              range: sel.getRangeAt(0),
            });
          }

          if (selection.element) {
            selection.element.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          }
        } catch (error) {
          console.warn(`Formatting ${format} failed:`, error);
        }
      }
    }
  };

  // Enhanced color application
  const handleColorApply = (color: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        try {
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("foreColor", false, color);
          setSelectionColor(color);

          if (sel.rangeCount > 0) {
            setSelection({
              ...selection,
              range: sel.getRangeAt(0),
              color: color,
            });
          }

          if (selection.element) {
            selection.element.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          }
        } catch (error) {
          console.warn("Color application failed:", error);
          document.execCommand("foreColor", false, color);
          if (selection.element) {
            selection.element.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          }
        }
      }
    }
    setShowColorPicker(false);
  };

  // Enhanced font size application
  const handleFontSizeApply = (size: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (!sel) return;

      try {
        // Restore and use the stored selection range
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        const range = sel.getRangeAt(0);
        if (range.collapsed) return;

        // Helper: unwrap any spans that have inline font-size from a root element
        const cleanFontSizeSpans = (root: HTMLElement) => {
          const spans = Array.from(
            root.querySelectorAll("span")
          ) as HTMLElement[];
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
              // ignore DOM exceptions for complex nodes
            }
          });
        };

        // If selection is inside an ancestor element that already has a font-size,
        // update that ancestor instead of wrapping. This avoids creating nested spans.
        const common = range.commonAncestorContainer;
        let ancestor =
          common.nodeType === 1
            ? (common as HTMLElement)
            : common.parentElement;
        let fontAncestor: HTMLElement | null = null;
        while (ancestor) {
          if (
            ancestor instanceof HTMLElement &&
            ancestor.style &&
            ancestor.style.fontSize
          ) {
            fontAncestor = ancestor;
            break;
          }
          ancestor = ancestor.parentElement;
        }

        if (fontAncestor) {
          // Clean nested font-size spans inside this ancestor and then set the size
          cleanFontSizeSpans(fontAncestor);
          fontAncestor.style.fontSize = size;
          fontAncestor.style.lineHeight = "1.15";

          const newRange = document.createRange();
          newRange.selectNodeContents(fontAncestor);
          sel.removeAllRanges();
          sel.addRange(newRange);

          setSelection({
            ...selection,
            range: newRange,
            fontSize: size,
          });
          setSelectionFontSize(size);
          return;
        }

        // Otherwise, extract the selected contents, clean nested font-size spans,
        // and wrap once with a new span.
        try {
          const content = range.extractContents();
          const tempDiv = document.createElement("div");
          tempDiv.appendChild(content);

          // Clean any nested font-size spans inside the extracted content
          cleanFontSizeSpans(tempDiv);

          const wrapper = document.createElement("span");
          wrapper.style.fontSize = size;
          wrapper.style.lineHeight = "1.15";

          // Move cleaned children into the wrapper
          while (tempDiv.firstChild) {
            wrapper.appendChild(tempDiv.firstChild);
          }

          range.insertNode(wrapper);

          const newRange = document.createRange();
          newRange.selectNodeContents(wrapper);
          sel.removeAllRanges();
          sel.addRange(newRange);

          setSelection({
            ...selection,
            range: newRange,
            fontSize: size,
          });
          setSelectionFontSize(size);
        } catch (e) {
          console.warn("Manual span wrapping failed, falling back:", e);
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("fontSize", false, "4"); // Mid size fallback
        }

        // Trigger input event on the element to ensure EditableText catches the change
        if (selection.element) {
          selection.element.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }
      } catch (error) {
        console.warn("Font size application failed:", error);
      }
    }
    setShowFontSizePicker(false);
  };

  // Reset states when selection changes
  useEffect(() => {
    if (!selection) {
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowFontSizePicker(false);
      setShowFontPicker(false);
      setShowAlignPicker(false);
    } else {
      if (selection.fontSize) {
        const size = parseInt(selection.fontSize);
        setSelectionFontSize(selection.fontSize);
        setFontSizeInput(size.toString());
      }
      if (selection.color) {
        // Convert RGB to HEX for the color picker if needed
        if (selection.color.startsWith("rgb")) {
          const rgb = selection.color.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const hex =
              "#" +
              [rgb[0], rgb[1], rgb[2]]
                .map(x => parseInt(x).toString(16).padStart(2, "0"))
                .join("");
            setSelectionColor(hex);
          }
        } else {
          setSelectionColor(selection.color);
        }
      }
    }
  }, [selection]);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowFontSizePicker(false);
        setShowFontPicker(false);
        setShowAlignPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns when another is opened
  const closeAllDropdowns = () => {
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowFontSizePicker(false);
    setShowFontPicker(false);
    setShowAlignPicker(false);
  };

  if (!selection) return null;

  return (
    <div
      ref={toolbarRef}
      className="animate-in slide-in-from-top fixed top-16 right-0 left-0 z-50 mx-auto w-fit border border-gray-300 bg-white shadow-xl duration-200"
      style={{ borderRadius: "8px" }}
    >
      {/* Main Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2">
        {/* Font Family Dropdown */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowFontPicker(!showFontPicker);
            }}
            className="flex min-w-[120px] items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            title="Font Family"
          >
            <span
              className="max-w-20 truncate"
              style={{ fontFamily: selectedFont }}
            >
              {selectedFont}
            </span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {showFontPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {fontOptions.map(font => (
                <button
                  key={font}
                  onClick={() => applyFontFamily(font)}
                  className="hover:text-primary block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => {
              const current = parseInt(selectionFontSize) || 16;
              if (current > 8) {
                const newSize = `${current - 2}px`;
                setSelectionFontSize(newSize);
                handleFontSizeApply(newSize);
                handleFontSizeChange(newSize); // Use the new function

                setFontSizeInput((current - 2).toString());
              }
            }}
            className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-gray-100"
            title="Decrease font size"
          >
            <Minus className="h-4 w-4 text-gray-700" />
          </button>

          <div className="relative flex items-center">
            <input
              type="text"
              value={fontSizeInput}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFontSizeInput(value);
              }}
              onBlur={() => {
                if (fontSizeInput) {
                  const size = Math.min(
                    Math.max(parseInt(fontSizeInput), 1),
                    100
                  );
                  const newSize = `${size}px`;
                  setSelectionFontSize(newSize);
                  handleFontSizeApply(newSize);
                  handleFontSizeChange(newSize); // Use the new function

                  setFontSizeInput(size.toString());
                } else {
                  setFontSizeInput(parseInt(selectionFontSize).toString());
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-12 rounded border border-gray-300 px-1 py-1.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:border-blue-400 focus:outline-none"
              title="Font Size"
            />
            <button
              onClick={e => {
                e.stopPropagation();
                closeAllDropdowns();
                setShowFontSizePicker(!showFontSizePicker);
              }}
              className="absolute right-0 flex h-full items-center px-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => {
              const current = parseInt(selectionFontSize) || 16;
              if (current < 100) {
                const newSize = `${current + 2}px`;
                setSelectionFontSize(newSize);
                handleFontSizeApply(newSize);
                handleFontSizeChange(newSize);
                setFontSizeInput((current + 2).toString());
              }
            }}
            className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-gray-100"
            title="Increase font size"
          >
            <Plus className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Font Size Dropdown */}
        {showFontSizePicker && (
          <div className="absolute top-full left-[180px] z-50 mt-1 max-h-60 w-32 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {quickFontSizes.map(size => (
              <button
                key={size}
                onClick={() => {
                  handleFontSizeApply(size);
                  setFontSizeInput(parseInt(size).toString());
                  handleFontSizeChange(size); // Use the new function
                }}
                className="hover:text-primary block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50"
              >
                {parseInt(size)}px
              </button>
            ))}
          </div>
        )}

        <div className="h-6 w-px bg-gray-300" />

        {/* Formatting Buttons */}
        <button
          onClick={() => handleFormatting("bold")}
          className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-gray-100 active:bg-gray-200"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4 text-gray-700" />
        </button>

        <button
          onClick={() => handleFormatting("italic")}
          className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-gray-100 active:bg-gray-200"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4 text-gray-700" />
        </button>

        <button
          onClick={() => handleFormatting("underline")}
          className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-gray-100 active:bg-gray-200"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4 text-gray-700" />
        </button>

        <button
          onClick={() => handleFormatting("strikeThrough")}
          className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-gray-100 active:bg-gray-200"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4 text-gray-700" />
        </button>

        <div className="h-6 w-px bg-gray-300" />

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowColorPicker(!showColorPicker);
            }}
            className={`rounded border border-gray-300 p-1.5 transition-colors ${
              showColorPicker ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
            title="Text Color"
          >
            <div className="relative">
              <Palette className="h-4 w-4 text-gray-700" />
              <div
                className="absolute right-0 -bottom-1 left-0 h-1 rounded-full border border-gray-300"
                style={{ backgroundColor: selectionColor }}
              />
            </div>
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 w-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 flex gap-2">
                <input
                  type="color"
                  value={selectionColor}
                  onChange={e => setSelectionColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={selectionColor}
                  onChange={e => setSelectionColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => handleColorApply(selectionColor)}
                  className="hover:bg-primary rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-colors"
                >
                  Apply
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {quickColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorApply(color)}
                    className="h-7 w-7 rounded border-2 border-gray-300 transition-all hover:scale-110 hover:border-blue-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight Picker */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowHighlightPicker(!showHighlightPicker);
            }}
            className={`rounded border border-gray-300 p-1.5 transition-colors ${
              showHighlightPicker ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
            title="Highlight Color"
          >
            <div className="relative">
              <Highlighter className="h-4 w-4 text-gray-700" />
              <div
                className="absolute right-0 -bottom-1 left-0 h-1 rounded-full border border-gray-300"
                style={{ backgroundColor: selectionHighlight }}
              />
            </div>
          </button>

          {showHighlightPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 w-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
              <div className="mb-2 flex gap-2">
                <input
                  type="color"
                  value={selectionHighlight}
                  onChange={e => setSelectionHighlight(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={selectionHighlight}
                  onChange={e => setSelectionHighlight(e.target.value)}
                  placeholder="#FFFF00"
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => applyHighlight(selectionHighlight)}
                  className="hover:bg-primary rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-colors"
                >
                  Apply
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {quickHighlights.map(color => (
                  <button
                    key={color}
                    onClick={() => applyHighlight(color)}
                    className="h-7 w-7 rounded border-2 border-gray-300 transition-all hover:scale-110 hover:border-blue-500"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Alignment Dropdown */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              closeAllDropdowns();
              setShowAlignPicker(!showAlignPicker);
            }}
            className={`rounded border border-gray-300 p-1.5 transition-colors ${
              showAlignPicker ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
            title="Text Alignment"
          >
            <AlignLeft className="h-4 w-4 text-gray-700" />
          </button>

          {showAlignPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => applyAlignment("left")}
                className="hover:text-primary flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50"
              >
                <AlignLeft className="h-4 w-4 shrink-0" />
                <span>Align Left</span>
              </button>

              <button
                onClick={() => applyAlignment("center")}
                className="hover:text-primary flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50"
              >
                <AlignCenter className="h-4 w-4 shrink-0" />
                <span>Align Center</span>
              </button>

              <button
                onClick={() => applyAlignment("right")}
                className="hover:text-primary flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50"
              >
                <AlignRight className="h-4 w-4 shrink-0" />
                <span>Align Right</span>
              </button>

              <button
                onClick={() => applyAlignment("justify")}
                className="hover:text-primary flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50"
              >
                <AlignJustify className="h-4 w-4 shrink-0" />
                <span>Justify</span>
              </button>
            </div>
          )}
        </div>

        {/* List Buttons */}

        <div className="h-6 w-px bg-gray-300" />

        {/* Close Button */}
        <button
          onClick={clearSelection}
          className="rounded border border-gray-300 p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Close Toolbar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
