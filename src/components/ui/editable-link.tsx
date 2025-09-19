"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Edit, Check, X, ExternalLink } from "lucide-react";

interface EditableLinkProps {
  text: string;
  href: string;
  onChange: (text: string, href: string) => void;
  className?: string;
  style?: React.CSSProperties;
  isEditable?: boolean;
  textPlaceholder?: string;
  hrefPlaceholder?: string;
  children?: React.ReactNode;
  siteUser?: string;
  target?: "_blank" | "_self";
  showExternalIcon?: boolean;
}

export const EditableLink: React.FC<EditableLinkProps> = ({
  text,
  href,
  onChange,
  className,
  style, // Already in props, now we'll use it
  isEditable = false,
  textPlaceholder = "Link text...",
  hrefPlaceholder = "Enter URL...",
  children,
  siteUser,
  target = "_self",
  showExternalIcon = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editHref, setEditHref] = useState(href);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Generate the actual href for navigation (fixed logic)
  const generateLinkHref = (originalHref: string) => {
    // If it's already an absolute URL (http/https/mailto), return as-is
    if (originalHref.startsWith("http") || originalHref.startsWith("mailto:")) {
      return originalHref;
    }

    // If we're in edit mode or no siteUser, return original href
    if (isEditable || !siteUser) {
      return originalHref;
    }

    // Handle empty or home links
    if (
      originalHref === "/" ||
      originalHref === "#" ||
      originalHref === "" ||
      originalHref === "home"
    ) {
      return `/preview/${siteUser}`;
    }

    // Clean the href and create preview URL
    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  // Handle saving changes
  const handleSave = () => {
    onChange(editText, editHref);
    setIsEditing(false);
  };

  // Handle canceling changes
  const handleCancel = () => {
    setEditText(text);
    setEditHref(href);
    setIsEditing(false);
  };

  // Handle edit mode - FIXED: Prevent navigation first
  const handleEdit = (e: React.MouseEvent) => {
    if (!isEditable) return;

    // Prevent navigation FIRST
    e.preventDefault();
    e.stopPropagation();

    setIsEditing(true);
  };

  // Handle link click when not in edit mode
  const handleLinkClick = (e: React.MouseEvent) => {
    if (isEditable) {
      // In editable mode, always prevent navigation and enter edit mode
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }
    // If not editable, let the link navigate normally
  };

  // Focus text input when entering edit mode
  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [isEditing]);

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Update local state when props change
  useEffect(() => {
    setEditText(text);
    setEditHref(href);
  }, [text, href]);

  // If in edit mode, show inline editing
  if (isEditing && isEditable) {
    return (
      <div className="inline-flex flex-col gap-1">
        {/* Text input */}
        <input
          ref={textInputRef}
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={textPlaceholder}
          className="rounded border border-blue-300 bg-white px-2 py-1 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        {/* URL input */}
        <input
          type="text"
          value={editHref}
          onChange={e => setEditHref(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hrefPlaceholder}
          className="rounded border border-blue-300 bg-white px-2 py-1 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        {/* Action buttons */}
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="flex items-center justify-center rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center justify-center rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  // Regular link display
  const finalHref = generateLinkHref(href);
  const displayText = text || textPlaceholder;
  const isEmpty = !text || !href;
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  return (
    <div className="group relative inline-block">
      <a
        href={finalHref}
        target={isExternal ? "_blank" : target}
        style={style} // Apply the style prop here
        className={cn(
          "inline-flex items-center gap-1",
          className,
          isEditable && [
            "hover:bg-primary cursor-pointer rounded px-1 transition-colors",
            isEmpty && "text-gray-400 italic",
          ]
        )}
        onClick={handleLinkClick}
        // Add data attribute to identify editable links for TopLoader
        {...(isEditable && { "data-editable-link": "true" })}
      >
        {children || (
          <>
            {displayText}
            {showExternalIcon && isExternal && (
              <ExternalLink className="ml-1 h-3 w-3" />
            )}
          </>
        )}
      </a>
    </div>
  );
};
