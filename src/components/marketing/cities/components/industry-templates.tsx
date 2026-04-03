"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useGetTemplates } from "@/hooks/owner-site/admin/use-template";
import { TemplateCard } from "../../templates/template-card";
interface IndustryTemplatesProps {
  category: string;
}

export const IndustryTemplates: React.FC<IndustryTemplatesProps> = ({
  category,
}) => {
  const { data: templatesData, isLoading } = useGetTemplates({
    page_size: 12,
  });

  const templates = templatesData?.results || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (templates.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
            Templates for Nepali {category.replace("-", " ")}s
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Professional, high-converting designs tailored for your business.
            Launch your site in minutes with our ready-to-use templates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template as any} />
          ))}
        </div>
      </div>
    </section>
  );
};
