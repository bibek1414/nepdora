import React, { useState, useRef, useEffect } from "react";

import { useDynamicFonts } from "@/providers/dynamic-font-provider";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useTextSelection } from "@/contexts/text-selection-context";
import {
  getDefaultFontSize,
  getDefaultLineHeight,
  getDefaultFontWeight,
} from "@/utils/text-styles";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  onStyleChange?: (style: TextStyle) => void;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "title" |"label";
  className?: string;
  style?: React.CSSProperties;
  isEditable?: boolean;
  placeholder?: string;
  multiline?: boolean;
  useHeadingFont?: boolean;
  currentTextColor?: string;
  currentFontFamily?: string;
  currentLineHeight?: string;
}

interface TextStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

// Removed local styling helpers - moved to @/utils/text-styles

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
  useHeadingFont = false,
  currentTextColor,
  currentFontFamily,
  currentLineHeight,
}) => {
  // Get dynamic fonts from context
  const { bodyFont, headingFont } = useDynamicFonts();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  // Text selection context
  const { setSelection } = useTextSelection();

  // Determine which font to use based on component type
  const isHeading = ["h1", "h2", "h3", "h4", "h5", "h6", "title", "label"].includes(Tag);
  const defaultFont = useHeadingFont || isHeading ? headingFont : bodyFont;

  const [selectedFont, setSelectedFont] = useState(
    currentFontFamily || style?.fontFamily || defaultFont
  );

  // Set initial font size based on tag type
  const [selectedFontSize, setSelectedFontSize] = useState(
    style?.fontSize || getDefaultFontSize(Tag)
  );

  const [selectedLineHeight, setSelectedLineHeight] = useState<string>(
    currentLineHeight ||
      (typeof style?.lineHeight === "string"
        ? style.lineHeight
        : typeof style?.lineHeight === "number"
          ? String(style.lineHeight)
          : undefined) ||
      getDefaultLineHeight(Tag, selectedFontSize)
  );

  const textRef = useRef<HTMLElement>(null);

  // Update font when dynamic fonts change
  useEffect(() => {
    if (!currentFontFamily && !style?.fontFamily) {
      setSelectedFont(defaultFont);
    }
  }, [defaultFont, currentFontFamily, style?.fontFamily]);

  // Update font size when tag changes
  useEffect(() => {
    if (!style?.fontSize) {
      setSelectedFontSize(getDefaultFontSize(Tag));
    }
  }, [Tag, style?.fontSize]);

  // Update line height when tag or font size changes
  useEffect(() => {
    if (!currentLineHeight && !style?.lineHeight) {
      setSelectedLineHeight(getDefaultLineHeight(Tag, selectedFontSize));
    } else if (currentLineHeight) {
      setSelectedLineHeight(currentLineHeight);
    } else if (style?.lineHeight !== undefined) {
      setSelectedLineHeight(
        typeof style.lineHeight === "string"
          ? style.lineHeight
          : String(style.lineHeight)
      );
    }
  }, [Tag, selectedFontSize, currentLineHeight, style?.lineHeight]);

  // Set initial HTML content with preserved inline styles and line breaks
  useEffect(() => {
    if (textRef.current && typeof value === "string") {
      // Treat actual newlines and literal \n string as HTML <br/> for rendering
      const displayValue = value
        .replace(/\\n/g, "<br/>")
        .replace(/\n/g, "<br/>");

      if (textRef.current.innerHTML !== displayValue) {
        textRef.current.innerHTML = displayValue;
      }
    }
  }, [value, Tag]);

  // Handle text changes - Convert HTML breaks back to \n and save
  const handleTextChange = (e: React.FocusEvent<HTMLElement>) => {
    let newValue = e.target.innerHTML;

    // If the user typed literal <br> or \n, or pressed Enter (which inserts <div> or <br>)
    // Convert all those variations into a simple \n character for the backend
    newValue = newValue
      .replace(/<div>/gi, "\n")
      .replace(/<\/div>/gi, "")
      .replace(/<p>/gi, "\n")
      .replace(/<\/p>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/&lt;br\s*\/?&gt;/gi, "\n")
      .replace(/\\n/g, "\n");

    if (value !== newValue) {
      onChange(newValue);
    }
  };

  // Sniff font size from initial HTML content to ensure persistence across reloads
  useEffect(() => {
    if (!textRef.current || !value) return;

    // We only want to adopt the font size if the entire content is wrapped in a span with a specific size
    const checkNestedStyle = () => {
      const children = textRef.current?.children;
      if (children && children.length === 1) {
        const firstChild = children[0] as HTMLElement;
        if (firstChild.tagName === "SPAN" && firstChild.style.fontSize) {
          const fontSize = firstChild.style.fontSize;
          setSelectedFontSize(fontSize);

          if (!currentLineHeight && !style?.lineHeight) {
            setSelectedLineHeight(getDefaultLineHeight(Tag, fontSize));
          }
        }
      }
    };

    // Delay slightly to ensure browser has rendered the content
    const timer = setTimeout(checkNestedStyle, 50);
    return () => clearTimeout(timer);
  }, [value, Tag]);

  // Handle text selection
  const handleTextSelect = () => {
    if (!isEditable) return;

    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);

      // Extract styles from the selection
      let fontSize = undefined;
      let color = undefined;
      let lineHeight = undefined;

      const container = range.startContainer;
      const parentElement =
        container.nodeType === 1
          ? (container as HTMLElement)
          : container.parentElement;

      if (parentElement) {
        // Prefer inline style if available (usually unitless multiplier)
        lineHeight = parentElement.style.lineHeight;

        const style = window.getComputedStyle(parentElement);
        fontSize = style.fontSize;
        color = style.color;

        // If no inline style, fallback to computed and try to convert back to multiplier
        if (!lineHeight || lineHeight === "normal") {
          const computedLH = style.lineHeight;
          if (computedLH.includes("px") && fontSize.includes("px")) {
            const lh = parseFloat(computedLH);
            const fs = parseFloat(fontSize);
            if (!isNaN(lh) && !isNaN(fs) && fs > 0) {
              lineHeight = (lh / fs).toFixed(1);
            } else {
              lineHeight = computedLH;
            }
          } else {
            lineHeight = computedLH;
          }
        }
      }

      setSelection({
        text: selection.toString(),
        range: range,
        element: textRef.current || undefined,
        fontSize,
        color,
        lineHeight,
      });
    } else {
      setSelection(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isEditable) return;

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          document.execCommand("bold", false);
          break;
        case "i":
          e.preventDefault();
          document.execCommand("italic", false);
          break;
        case "u":
          e.preventDefault();
          document.execCommand("underline", false);
          break;
      }
    }

    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    if (e.key === "Escape") {
      e.currentTarget.blur();
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const commonProps = {
    ref: textRef,
    contentEditable: isEditable,
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
      ]
    ),
    style: {
      position: "relative" as const,
      fontFamily: `var(${isHeading || useHeadingFont ? "--font-heading" : "--font-body"}, ${selectedFont})`,
      fontSize: selectedFontSize,
      lineHeight: selectedLineHeight,
      fontWeight: getDefaultFontWeight(Tag),
      ...style,
    },
  };
  const Wrapper = Tag === "p" || Tag === "span" ? "span" : "div";
  // Map "title" to a valid HTML tag for rendering in the body
  const RenderTag = Tag === "title" ? "h1" : Tag;

  return (
    <Wrapper
      className={cn(
        "relative w-full",
        Tag === "span" || Tag === "p" ? "block" : "block"
      )}
    >
      {React.createElement(RenderTag, commonProps)}
    </Wrapper>
  );
};
