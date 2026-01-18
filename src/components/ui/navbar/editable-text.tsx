import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  X,
  Palette,
  Highlighter,
  Bold,
  Italic,
  Underline,
  Minus,
  Plus,
  Type,
} from "lucide-react";
import { useDynamicFonts } from "@/providers/dynamic-font-provider";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  onStyleChange?: (style: TextStyle) => void;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  className?: string;
  style?: React.CSSProperties;
  isEditable?: boolean;
  placeholder?: string;
  multiline?: boolean;
  useHeadingFont?: boolean; // New prop to determine if this should use heading font
  currentTextColor?: string;
  currentFontFamily?: string;
}

interface TextStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: string;
}

interface TextSelection {
  text: string;
  range: Range;
  color?: string;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  onStyleChange,
  as: Tag = "p",
  className,
  style,
  isEditable = false,
  placeholder = "Click to edit...",
  multiline = false,
  useHeadingFont = false, // Default to body font
  currentTextColor,
  currentFontFamily,
}) => {
  // Get dynamic fonts from context
  const { bodyFont, headingFont } = useDynamicFonts();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  // Determine which font to use based on component type
  const isHeading = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(Tag);
  const defaultFont = useHeadingFont || isHeading ? headingFont : bodyFont;

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false);

  const [selectedFont, setSelectedFont] = useState(
    currentFontFamily || style?.fontFamily || defaultFont
  );
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [customColor, setCustomColor] = useState("");
  const [customFontSize, setCustomFontSize] = useState("16px");
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [textSelection, setTextSelection] = useState<TextSelection | null>(
    null
  );
  const [selectionColor, setSelectionColor] = useState(
    theme?.colors?.primary || "#3B82F6"
  );
  const [selectionFontSize, setSelectionFontSize] = useState("16px");
  const [showColorInput, setShowColorInput] = useState(false);
  const [showFontSizeInput, setShowFontSizeInput] = useState(false);

  const textRef = useRef<HTMLElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const fontSizePickerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Update font when dynamic fonts change
  useEffect(() => {
    if (!currentFontFamily && !style?.fontFamily) {
      setSelectedFont(defaultFont);
    }
  }, [defaultFont, currentFontFamily, style?.fontFamily]);

  // Update color when theme changes
  useEffect(() => {
    if (!currentTextColor && !style?.color && theme?.colors?.text) {
    }
  }, [theme?.colors?.text, currentTextColor, style?.color]);

  // Set initial HTML content with preserved inline styles
  useEffect(() => {
    if (textRef.current && value) {
      if (textRef.current.innerHTML !== value) {
        textRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Handle text changes - Save HTML to preserve inline styles
  const handleTextChange = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.target.innerHTML;
    if (value !== newValue) {
      onChange(newValue);
    }
  };

  // Apply formatting command
  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);

    // Update the value with HTML content
    if (textRef.current) {
      const newValue = textRef.current.innerHTML;
      onChange(newValue);
    }
  };

  // Apply font size to selected text
  const applyFontSizeToSelection = (fontSize: string) => {
    if (!textSelection) return;

    // Use execCommand with styleWithCSS to apply font size
    document.execCommand("styleWithCSS", false, "true");
    applyFormatting("fontSize", "7"); // This sets a base size, we'll override with inline style

    // Apply inline style for precise control
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = fontSize;
      range.surroundContents(span);

      // Update the value with HTML content
      if (textRef.current) {
        const newValue = textRef.current.innerHTML;
        onChange(newValue);
      }
    }

    // Clear selection after applying font size
    setShowFontSizeInput(false);
  };

  // Apply font size to entire text
  const applyFontSizeToAll = (fontSize: string) => {
    if (textRef.current) {
      textRef.current.style.fontSize = fontSize;
      setSelectedFontSize(fontSize);

      if (onStyleChange) {
        onStyleChange({
          fontFamily: selectedFont,
          fontSize: fontSize,
        });
      }

      // Update the value with HTML content
      const newValue = textRef.current.innerHTML;
      onChange(newValue);
    }
  };

  // Handle text selection
  const handleTextSelect = () => {
    if (!isEditable) return;

    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setTextSelection({
        text: selection.toString(),
        range: range,
      });

      // Position the selection toolbar below the selected text
      setPickerPosition({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
      setShowSelectionToolbar(true);
      setShowColorInput(false);
      setShowFontSizeInput(false);
    } else {
      setTextSelection(null);
      setShowSelectionToolbar(false);
      setShowColorInput(false);
      setShowFontSizeInput(false);
    }
  };

  // Apply color to selected text
  const applyColorToSelection = (color: string) => {
    if (!textSelection) return;

    // Use execCommand to apply color while preserving other formatting
    applyFormatting("foreColor", color);

    // Clear selection after applying color
    setShowColorInput(false);
  };

  // Handle palette button click for entire text
  const handlePaletteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
      setShowColorPicker(true);
      setShowFontSizePicker(false);
    }
  };

  // Handle font size button click for entire text
  const handleFontSizeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
      setShowFontSizePicker(true);
      setShowColorPicker(false);
    }
  };

  // Handle custom color input for entire text
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    if (onStyleChange) {
      onStyleChange({
        color: color,
        fontFamily: selectedFont,
        fontSize: selectedFontSize,
      });
    }
  };

  // Handle custom font size input for entire text
  const handleCustomFontSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fontSize = e.target.value;
    setCustomFontSize(fontSize);
    applyFontSizeToAll(fontSize);
  };

  // Quick font size options
  const quickFontSizes = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
  ];

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close main color picker
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        textRef.current &&
        !textRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }

      // Close font size picker
      if (
        fontSizePickerRef.current &&
        !fontSizePickerRef.current.contains(event.target as Node) &&
        textRef.current &&
        !textRef.current.contains(event.target as Node)
      ) {
        setShowFontSizePicker(false);
      }

      // Close selection toolbar
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setShowSelectionToolbar(false);
        setShowColorInput(false);
        setShowFontSizeInput(false);
        setTextSelection(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isEditable) return;

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          applyFormatting("bold");
          break;
        case "i":
          e.preventDefault();
          applyFormatting("italic");
          break;
        case "u":
          e.preventDefault();
          applyFormatting("underline");
          break;
      }
    }

    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    if (e.key === "Escape") {
      e.currentTarget.blur();
      setShowColorPicker(false);
      setShowFontSizePicker(false);
      setShowSelectionToolbar(false);
      setShowColorInput(false);
      setShowFontSizeInput(false);
      setTextSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const commonProps = {
    ref: textRef,
    contentEditable: isEditable && !showColorPicker && !showFontSizePicker,
    onBlur: handleTextChange,
    onMouseUp: handleTextSelect,
    onKeyDown: handleKeyDown,
    onKeyUp: handleTextSelect,
    suppressContentEditableWarning: true,
    "data-placeholder": !value ? placeholder : undefined,
    className: cn(
      className,
      isEditable && [
        "cursor-text",
        "hover:bg-blue-50/30 transition-colors rounded px-2 py-1 relative group",
        "min-h-[1.5em]",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400",
        "empty:before:pointer-events-none empty:before:absolute",
      ],
      (showColorPicker || showFontSizePicker || showSelectionToolbar) &&
        "ring-2 ring-blue-400"
    ),
    style: {
      position: "relative" as const,
      // Use CSS variables with fallback to selected font
      fontFamily: `var(${isHeading || useHeadingFont ? "--font-heading" : "--font-body"}, ${selectedFont})`,
      fontSize: selectedFontSize,
      ...style,
    },
  };

  const quickColors = [
    theme?.colors?.text || "#0F172A",
    theme?.colors?.primary || "#3B82F6",
    theme?.colors?.secondary || "#F59E0B",
    "#DC2626",
    "#FFFFFF",
    "#9333EA",
    "#CA8A04",
    "#DB2777",
    "#0891B2",
    "#65A30D",
    "#EA580C",
    "#475569",
  ];

  return (
    <>
      <div className="relative inline-block w-full">
        {React.createElement(Tag, commonProps)}
      </div>

      {/* Main color picker for entire text */}
      {showColorPicker && (
        <div
          ref={pickerRef}
          className="animate-in fade-in slide-in-from-top-2 fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-2xl duration-200"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
            transform: "translate(-50%, 0)",
            minWidth: "300px",
          }}
        >
          <button
            onClick={() => setShowColorPicker(false)}
            className="absolute top-2 right-2 rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <div className="mb-4 border-b border-gray-200 pb-4">
            <h4 className="mb-2 text-xs font-semibold text-gray-700">
              Text Color
            </h4>
            <div className="flex gap-2">
              <input
                type="color"
                onChange={handleCustomColorChange}
                className="h-10 w-12 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                onChange={e => {
                  const color = e.target.value;
                  setCustomColor(color);
                  if (onStyleChange) {
                    onStyleChange({
                      color: color,
                      fontFamily: selectedFont,
                      fontSize: selectedFontSize,
                    });
                  }
                }}
                placeholder="#000000"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {quickColors.map(color => (
              <button
                key={color}
                onClick={() => {
                  if (onStyleChange) {
                    onStyleChange({
                      color: color,
                      fontFamily: selectedFont,
                      fontSize: selectedFontSize,
                    });
                  }
                }}
                className="h-8 w-8 rounded border border-gray-300 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main font size picker for entire text */}
      {showFontSizePicker && (
        <div
          ref={fontSizePickerRef}
          className="animate-in fade-in slide-in-from-top-2 fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-2xl duration-200"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
            transform: "translate(-50%, 0)",
            minWidth: "280px",
          }}
        >
          <button
            onClick={() => setShowFontSizePicker(false)}
            className="absolute top-2 right-2 rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <div className="mb-4 border-b border-gray-200 pb-4">
            <h4 className="mb-2 text-xs font-semibold text-gray-700">
              Font Size
            </h4>
            <div className="flex gap-2">
              <input
                type="number"
                value={parseInt(customFontSize) || 16}
                onChange={handleCustomFontSizeChange}
                min="8"
                max="72"
                className="h-10 w-20 rounded border border-gray-300 px-3 text-sm text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="16"
              />
              <span className="flex items-center text-sm text-gray-500">
                px
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickFontSizes.map(size => (
              <button
                key={size}
                onClick={() => {
                  setCustomFontSize(size);
                  applyFontSizeToAll(size);
                }}
                className="rounded border border-gray-300 px-3 py-2 text-sm text-black transition-colors hover:bg-gray-100 hover:text-blue-600"
                style={{
                  fontSize: size,
                }}
              >
                {parseInt(size)}px
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection toolbar with formatting options */}
      {showSelectionToolbar && textSelection && (
        <div
          ref={toolbarRef}
          className="animate-in fade-in slide-in-from-top-2 fixed z-50 rounded-lg border border-gray-200 bg-white shadow-2xl duration-200"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
            transform: "translate(-50%, 0)",
          }}
        >
          <div className="flex items-center gap-1 p-2">
            {/* Bold Button */}
            <button
              onClick={() => applyFormatting("bold")}
              className="rounded p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4 text-gray-700" />
            </button>

            {/* Italic Button */}
            <button
              onClick={() => applyFormatting("italic")}
              className="rounded p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4 text-gray-700" />
            </button>

            {/* Underline Button */}
            <button
              onClick={() => applyFormatting("underline")}
              className="rounded p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4 text-gray-700" />
            </button>

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-gray-300" />

            {/* Color Button */}
            <button
              onClick={() => {
                setShowColorInput(!showColorInput);
                setShowFontSizeInput(false);
              }}
              className="rounded p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
              title="Text Color"
            >
              <Palette className="h-4 w-4 text-gray-700" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowSelectionToolbar(false);
                setShowColorInput(false);
                setShowFontSizeInput(false);
                setTextSelection(null);
                window.getSelection()?.removeAllRanges();
              }}
              className="ml-1 rounded p-2 transition-colors hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Color picker section */}
          {showColorInput && (
            <div className="border-t border-gray-200 p-3">
              <div className="mb-2">
                <div className="flex gap-2">
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
                    onClick={() => applyColorToSelection(selectionColor)}
                    className="hover:bg-primary rounded bg-blue-500 px-3 py-1 text-xs text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {quickColors.map(color => (
                  <button
                    key={color}
                    onClick={() => applyColorToSelection(color)}
                    className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Font size picker section */}
          {showFontSizeInput && (
            <div className="border-t border-gray-200 p-3">
              <div className="mb-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={parseInt(selectionFontSize) || 16}
                    onChange={e => setSelectionFontSize(`${e.target.value}px`)}
                    min="8"
                    max="72"
                    className="h-8 w-16 rounded border border-gray-300 px-2 text-sm text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="16"
                  />
                  <span className="flex items-center text-xs text-gray-500">
                    px
                  </span>
                  <button
                    onClick={() => applyFontSizeToSelection(selectionFontSize)}
                    className="hover:bg-primary rounded bg-blue-500 px-3 py-1 text-xs text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {quickFontSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => applyFontSizeToSelection(size)}
                    className="rounded border border-gray-300 px-2 py-1 text-xs text-black transition-colors hover:bg-gray-100 hover:text-blue-600"
                    style={{
                      fontSize: size,
                    }}
                  >
                    {parseInt(size)}px
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
