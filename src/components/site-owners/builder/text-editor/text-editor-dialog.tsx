"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Type } from "lucide-react";

interface TextEditorStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: () => void;
}

export const TextEditorStylesDialog: React.FC<TextEditorStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = () => {
    setIsSelecting(true);
    setTimeout(() => {
      onStyleSelect();
      setIsSelecting(false);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-r bg-white p-6 shadow-xl transition-all duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Rich Text Editor
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Create custom content with our powerful rich text editor. Perfect
            for articles, descriptions, documentation, and any other text-based
            content.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div
            className={`group cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
              isSelecting
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={handleSelect}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleSelect();
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500">
                <Type className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  Rich Text Editor
                </h3>
                <p className="text-sm text-gray-600">
                  Create and format custom text content with full editing
                  capabilities
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <FileText className="h-3 w-3" />
                  <span>Fully customizable with rich text formatting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
              <Type className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-semibold text-purple-900">
                Rich Formatting Options
              </h4>
              <p className="text-xs text-purple-700">
                The text editor comes with comprehensive formatting tools
                including headings, lists, links, bold, italic, and more.
                Perfect for creating any type of text-based content for your
                website.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-purple-700">
                <li className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-purple-500"></span>
                  Multiple heading levels (H1-H6)
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-purple-500"></span>
                  Text formatting (bold, italic, underline)
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-purple-500"></span>
                  Lists (ordered and unordered)
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-purple-500"></span>
                  Hyperlinks and more
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
