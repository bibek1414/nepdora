"use client";
import React, { useMemo } from "react";
import { EditableText } from "@/components/ui/editable-text";
import Tiptap from "@/components/ui/tip-tap";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { PolicyComponentData } from "@/types/owner-site/components/policies";

interface PolicyStyleProps {
  data: PolicyComponentData["data"];
  isEditable?: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export const PolicyStyle1: React.FC<PolicyStyleProps> = ({
  data,
  isEditable = false,
  onTitleChange,
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <EditableText
              value={data.title}
              onChange={onTitleChange}
              as="h1"
              className="text-5xl font-bold text-gray-900"
              isEditable={isEditable}
              placeholder="Enter policy title..."
              multiline={false}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {isEditable ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Policy Content (Auto-saves 2 seconds after you stop typing)
              </label>
              <Tiptap
                value={data.content}
                onChange={onContentChange}
                placeholder="Enter policy content..."
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
