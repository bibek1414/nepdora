"use client";
import React, { useMemo } from "react";
import Tiptap from "@/components/ui/tip-tap";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { TextEditorComponentData } from "@/types/owner-site/components/text-editor";

interface TextEditorStyleProps {
  data: TextEditorComponentData["data"];
  isEditable?: boolean;
  onContentChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export const TextEditorStyle1: React.FC<TextEditorStyleProps> = ({
  data,
  isEditable = false,
  onContentChange,
  onImageUpload,
}) => {
  return (
    <div className="mx-auto max-w-7xl ">
      <div className="rounded-lg bg-white">
        <div className="px-8 py-8">
          {isEditable ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Text Editor Content (Auto-saves 2 seconds after you stop typing)
              </label>
              <Tiptap
                value={data.content}
                onChange={onContentChange}
                placeholder="Enter content..."
                height="500px"
                toolbar="advanced"
                onImageUpload={onImageUpload}
                maxImageSize={5}
              />
            </div>
          ) : (
            <div className="prose prose-xl prose-gray rich-text mx-auto mb-32 max-w-7xl space-y-8 leading-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeContent(data.content),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
