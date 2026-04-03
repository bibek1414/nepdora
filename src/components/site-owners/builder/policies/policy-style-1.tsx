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
    return sanitizeContent(data.content || "");
  }, [data.content]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
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
            <div className="prose prose-xl prose-gray rich-text mx-auto mb-10 max-w-7xl space-y-8 leading-8">
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
