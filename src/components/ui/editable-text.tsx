"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  className?: string;
  style?: React.CSSProperties; // Added this line
  isEditable?: boolean;
  placeholder?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Tag = "p",
  className,
  style, // Added this parameter
  isEditable = false,
  placeholder = "Click to edit...",
  multiline = false,
}) => {
  // Handle text changes
  const handleTextChange = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.target.innerText;
    if (value !== newValue) {
      onChange(newValue);
    }
  };

  // Handle click to enter edit mode
  const handleTextClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isEditable) return;

    e.preventDefault();
    e.stopPropagation();

    const element = e.currentTarget;
    element.focus();

    // Select all text on click for better UX
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  // Handle key events for better UX
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isEditable) return;

    // Prevent line breaks in single-line mode
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    // Allow Escape to blur
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  const commonProps = {
    contentEditable: isEditable,
    onBlur: handleTextChange,
    onClick: handleTextClick,
    onKeyDown: handleKeyDown,
    suppressContentEditableWarning: true,
    "data-placeholder": !value ? placeholder : undefined,
    className: cn(
      className,
      isEditable && [
        "focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-text",
        "hover:bg-blue-50/50 transition-colors rounded px-1 relative z-10",
        "min-h-[1.5em]", // Ensure minimum height for empty content
        // Placeholder styling
        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400",
        "empty:before:pointer-events-none empty:before:absolute",
      ]
    ),
    style: {
      position: "relative" as const,
      ...style, // Merge the passed style with the default position style
    },
  };

  return React.createElement(Tag, commonProps, value);
};
