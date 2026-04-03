"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { useGetTemplates } from "@/hooks/owner-site/admin/use-template";
import Link from "next/link";
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
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Templates for Nepali {category.replace("-", " ")}s
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Professional, high-converting designs tailored for your business.
            Launch your site in minutes with our ready-to-use templates.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={
                    template.template_image ||
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="line-clamp-1 text-xl font-semibold text-slate-900">
                    {template.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-medium tracking-wider text-blue-600 uppercase">
                    {category.split("-")[0]}
                  </span>
                </div>
                <Link href={template.preview_url || "#"} target="_blank">
                  <Button className="w-full" variant="outline">
                    <span className="flex items-center justify-center gap-2">
                      Preview Template <ExternalLink className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
