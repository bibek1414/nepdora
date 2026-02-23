"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Palette,
  X,
  Minus,
  Plus,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from "lucide-react";
import { useTextSelection } from "@/contexts/text-selection-context";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const StickyFormattingToolbar: React.FC = () => {
  const {
    selection,
    clearSelection,
    applyFormatting,
    applyColor,
    applyFontSize,
  } = useTextSelection();

  const [selectionColor, setSelectionColor] = useState("#000000");
  const [selectionHighlight, setSelectionHighlight] = useState("#FFFF00");
  const [selectionFontSize, setSelectionFontSize] = useState("16px");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [fontSizeInput, setFontSizeInput] = useState("16");

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
    "Public Sans",
    "DM Sans",
  ];

  // Apply highlight/background color with better browser compatibility
  const applyHighlight = (color: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());

        try {
          // Method 1: Using backColor command
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("backColor", false, color);
        } catch (error) {
          console.warn("Highlight application failed:", error);
        }
      }
    }
  };

  // Apply font family
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
        }
      }
    }
  };

  // Apply text alignment
  const applyAlignment = (
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    if (selection?.element) {
      const alignCommands: Record<string, string> = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
        justify: "justifyFull",
      };

      try {
        document.execCommand(alignCommands[alignment], false);
      } catch (error) {
        console.warn(`Alignment ${alignment} failed:`, error);
      }
    }
  };

  // Enhanced formatting application
  const handleFormatting = (format: string) => {
    if (selection?.range) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selection.range.cloneRange());
        try {
          document.execCommand(format, false);
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
        } catch (error) {
          console.warn("Color application failed:", error);
        }
      }
    }
  };

  // Reset states when selection changes
  useEffect(() => {
    if (selection) {
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

  if (!selection) return null;

  return (
    <div className="animate-in slide-in-from-top fixed top-20 right-0 left-0 z-50 mx-auto w-fit rounded-lg border bg-white p-1 shadow-lg">
      <div className="flex items-center gap-1">
        {/* Font Family */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-[130px] justify-between px-2 font-normal"
            >
              <span className="truncate" style={{ fontFamily: selectedFont }}>
                {selectedFont}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[300px] w-[180px] overflow-y-auto">
            {fontOptions.map(font => (
              <DropdownMenuItem
                key={font}
                onClick={() => applyFontFamily(font)}
                style={{ fontFamily: font }}
              >
                {font}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Size */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const current = parseInt(selectionFontSize) || 16;
              if (current > 8) {
                const newSize = `${current - 1}px`;
                setSelectionFontSize(newSize);
                applyFontSize(newSize);
                setFontSizeInput((current - 1).toString());
              }
            }}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <div className="relative mx-1">
            <Input
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
                  applyFontSize(newSize);
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
              className="h-8 w-12 px-1 text-center text-sm"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const current = parseInt(selectionFontSize) || 16;
              if (current < 100) {
                const newSize = `${current + 1}px`;
                setSelectionFontSize(newSize);
                applyFontSize(newSize);
                setFontSizeInput((current + 1).toString());
              }
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-6 px-0">
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] w-20 overflow-y-auto">
              {quickFontSizes.map(size => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => {
                    applyFontSize(size);
                    setSelectionFontSize(size);
                    setFontSizeInput(parseInt(size).toString());
                  }}
                >
                  {parseInt(size)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Formatting */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormatting("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormatting("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormatting("underline")}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleFormatting("strikeThrough")}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Colors */}
        <div className="flex items-center gap-0.5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                title="Text Color"
              >
                <Palette className="h-4 w-4" />
                <div
                  className="absolute right-1.5 bottom-1.5 left-1.5 h-0.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: selectionColor }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectionColor}
                    onChange={e => {
                      setSelectionColor(e.target.value);
                      handleColorApply(e.target.value);
                    }}
                    className="h-8 w-10 cursor-pointer p-0.5"
                  />
                  <Input
                    type="text"
                    value={selectionColor}
                    onChange={e => {
                      setSelectionColor(e.target.value);
                      handleColorApply(e.target.value);
                    }}
                    className="h-8 flex-1 font-mono text-xs"
                    placeholder="#000000"
                  />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {quickColors.map((color, i) => (
                    <button
                      key={`${color}-${i}`}
                      onClick={() => handleColorApply(color as string)}
                      className={cn(
                        "aspect-square rounded-md border border-gray-200 transition-transform hover:scale-110 focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        selectionColor === color && "ring-2 ring-blue-500"
                      )}
                      style={{ backgroundColor: color as string }}
                      title={color as string}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                title="Highlight Color"
              >
                <Highlighter className="h-4 w-4" />
                <div
                  className="absolute right-1.5 bottom-1.5 left-1.5 h-0.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: selectionHighlight }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectionHighlight}
                    onChange={e => {
                      setSelectionHighlight(e.target.value);
                      applyHighlight(e.target.value);
                    }}
                    className="h-8 w-10 cursor-pointer p-0.5"
                  />
                  <Input
                    type="text"
                    value={selectionHighlight}
                    onChange={e => {
                      setSelectionHighlight(e.target.value);
                      applyHighlight(e.target.value);
                    }}
                    className="h-8 flex-1 font-mono text-xs"
                    placeholder="#FFFF00"
                  />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {quickHighlights.map((color, i) => (
                    <button
                      key={`${color}-${i}`}
                      onClick={() => applyHighlight(color)}
                      className={cn(
                        "aspect-square rounded-md border border-gray-200 transition-transform hover:scale-110 focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        selectionHighlight === color && "ring-2 ring-blue-500"
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <AlignLeft className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => applyAlignment("left")}>
              <AlignLeft className="mr-2 h-4 w-4" />
              Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyAlignment("center")}>
              <AlignCenter className="mr-2 h-4 w-4" />
              Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyAlignment("right")}>
              <AlignRight className="mr-2 h-4 w-4" />
              Right
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyAlignment("justify")}>
              <AlignJustify className="mr-2 h-4 w-4" />
              Justify
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={clearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
