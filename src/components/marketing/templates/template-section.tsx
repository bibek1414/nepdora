"use client";
import React from "react";
import { useTemplates } from "@/hooks/super-admin/components/use-templates";
import { TemplateCard, TemplateCardSkeleton } from "./template-card";
import { Template } from "@/types/super-admin/components/template";

interface TemplateSectionProps {
  title: string;
  description?: string;
  category?: string;
  pageSize?: number;
}

export const TemplateSection: React.FC<TemplateSectionProps> = ({
  title,
  category,
  description,
  pageSize = 12,
}) => {
  const { data: templatesData, isLoading } = useTemplates({
    pageSize,
    category: category && category !== "All" ? category : undefined,
  });

  const templates = templatesData?.results || [];

  return (
    <div className="bg-white py-32">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-slate-500">{description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <TemplateCardSkeleton key={i} />
              ))
            : templates.map((template: Template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
        </div>

        {!isLoading && templates.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400">
              No templates found in this section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
