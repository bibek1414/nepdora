import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Palette, Highlighter } from "lucide-react";

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
  theme?: {
    colors: {
      text: string;
      primary: string;
      primaryForeground: string;
      secondary: string;
      secondaryForeground: string;
      background: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
  };
  themeId?: string;
  currentTextColor?: string;
  currentFontFamily?: string;
}

interface TextStyle {
  color?: string;
  fontFamily?: string;
}

interface TextSelection {
  text: string;
  range: Range;
  color?: string;
}

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
  theme,
  currentTextColor,
  currentFontFamily,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSelectionColorPicker, setShowSelectionColorPicker] =
    useState(false);
  const [selectedColor, setSelectedColor] = useState(
    currentTextColor || style?.color || theme?.colors.text || "#0F172A"
  );
  const [selectedFont, setSelectedFont] = useState(
    currentFontFamily || style?.fontFamily || theme?.fonts.body || "Inter"
  );
  const [customColor, setCustomColor] = useState("");
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [textSelection, setTextSelection] = useState<TextSelection | null>(
    null
  );
  const [selectionColor, setSelectionColor] = useState(
    theme?.colors.primary || "#3B82F6"
  );

  const textRef = useRef<HTMLElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectionPickerRef = useRef<HTMLDivElement>(null);

  // Set initial HTML content with preserved inline styles
  useEffect(() => {
    if (textRef.current && value) {
      // Only update if content is different to avoid cursor issues
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

      // Position the selection color picker near the selected text
      setPickerPosition({
        top: rect.top - 50,
        left: rect.left + rect.width / 2,
      });
      setShowSelectionColorPicker(true);
    } else {
      setTextSelection(null);
      setShowSelectionColorPicker(false);
    }
  };

  // Apply color to selected text
  const applyColorToSelection = (color: string) => {
    if (!textSelection || !textRef.current) return;

    const span = document.createElement("span");
    span.style.color = color;
    span.textContent = textSelection.text;

    textSelection.range.deleteContents();
    textSelection.range.insertNode(span);

    // Update the value with HTML content
    if (textRef.current) {
      const newValue = textRef.current.innerHTML;
      onChange(newValue);
    }

    // Clear selection
    window.getSelection()?.removeAllRanges();
    setTextSelection(null);
    setShowSelectionColorPicker(false);
  };

  // Handle palette button click for entire text
  const handlePaletteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
      setShowColorPicker(true);
    }
  };

  // Handle custom color input for entire text
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
    if (onStyleChange) {
      onStyleChange({
        color: color,
        fontFamily: selectedFont,
      });
    }
  };

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

      // Close selection color picker
      if (
        selectionPickerRef.current &&
        !selectionPickerRef.current.contains(event.target as Node)
      ) {
        setShowSelectionColorPicker(false);
        setTextSelection(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isEditable) return;

    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    if (e.key === "Escape") {
      e.currentTarget.blur();
      setShowColorPicker(false);
      setShowSelectionColorPicker(false);
      setTextSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const commonProps = {
    ref: textRef,
    contentEditable:
      isEditable && !showColorPicker && !showSelectionColorPicker,
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
        "selection:bg-blue-200 selection:text-blue-900",
      ],
      (showColorPicker || showSelectionColorPicker) && "ring-2 ring-blue-400"
    ),
    style: {
      position: "relative" as const,
      color: selectedColor,
      fontFamily: selectedFont,
      ...style,
    },
  };

  const quickColors = [
    theme?.colors.text || "#0F172A",
    theme?.colors.primary || "#3B82F6",
    theme?.colors.secondary || "#F59E0B",
    "#DC2626",
    "#16A34A",
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

        {isEditable && (
          <button
            onClick={handlePaletteClick}
            className="absolute top-1/2 -right-8 -translate-y-1/2 rounded border border-gray-200 bg-white p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-gray-50"
            title="Change all text color"
          >
            <Palette className="h-3 w-3 text-gray-600" />
          </button>
        )}
      </div>

      {showColorPicker && (
        <div
          ref={pickerRef}
          className="animate-in fade-in slide-in-from-top-2 fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-2xl duration-200"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
            transform: "translate(-50%, -100%)",
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
                value={customColor || selectedColor}
                onChange={handleCustomColorChange}
                className="h-10 w-12 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={customColor || selectedColor}
                onChange={e => {
                  const color = e.target.value;
                  setCustomColor(color);
                  setSelectedColor(color);
                  if (onStyleChange) {
                    onStyleChange({
                      color: color,
                      fontFamily: selectedFont,
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
                  setSelectedColor(color);
                  if (onStyleChange) {
                    onStyleChange({
                      color: color,
                      fontFamily: selectedFont,
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

      {showSelectionColorPicker && textSelection && (
        <div
          ref={selectionPickerRef}
          className="animate-in fade-in slide-in-from-top-2 fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-2xl duration-200"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`,
            transform: "translate(-50%, -100%)",
            minWidth: "280px",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                Color for: &quot;
                {textSelection.text.length > 20
                  ? textSelection.text.substring(0, 20) + "..."
                  : textSelection.text}
                &quot;
              </span>
            </div>
            <button
              onClick={() => {
                setShowSelectionColorPicker(false);
                setTextSelection(null);
                window.getSelection()?.removeAllRanges();
              }}
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="mb-3">
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
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={() => applyColorToSelection(selectionColor)}
                className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
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
    </>
  );
};
