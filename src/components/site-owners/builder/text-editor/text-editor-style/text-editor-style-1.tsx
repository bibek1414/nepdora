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
  const sanitizedContent = useMemo(() => {
    if (isEditable || !data.content) {
      return data.content;
    }
    return sanitizeContent(data.content);
  }, [data.content, isEditable]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div
              className="prose prose-lg prose-headings:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-xl prose-p:mb-4 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-strong:font-semibold prose-table:my-6 prose-table:w-full prose-table:border-collapse prose-thead:bg-gray-50 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
