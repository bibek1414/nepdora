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
    search: category === "nepal" ? "" : category,
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
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Templates for {category.replace(/-/g, " ")} businesses
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Professional, ready-to-use designs. Go live in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template as any} />
          ))}
        </div>
      </div>
    </section>
  );
};
