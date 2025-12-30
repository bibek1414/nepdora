"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Template } from "@/types/super-admin/components/template";
import { usePreviewTemplate } from "@/hooks/owner-site/admin/use-template";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: Template;
}

const getBgColor = (id: number | string) => {
  const colors = [
    "bg-stone-50",
    "bg-slate-50",
    "bg-orange-50",
    "bg-indigo-50",
    "bg-pink-50",
    "bg-gray-50",
  ];
  const index =
    typeof id === "number"
      ? id
      : typeof id === "string"
        ? parseInt(id, 10) || 0
        : 0;
  return colors[Math.abs(index) % colors.length];
};

const formatTemplateName = (name: string): string => {
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const { openPreview } = usePreviewTemplate();
  const bgColor = getBgColor(template.id);
  const formattedName = formatTemplateName(template.name);

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (template.preview_url) {
      window.open(template.preview_url, "_blank", "noopener,noreferrer");
    } else {
      openPreview(template.schema_name);
    }
  };

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "/admin/signup";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div
        className={`mb-4 cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 bg-white transition-all duration-300 ${bgColor}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-4/3 overflow-hidden">
          {template.template_category?.name && (
            <div className="absolute top-3 left-3 z-20 inline-flex items-center rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-900 backdrop-blur-sm">
              {template.template_category.name}
            </div>
          )}
          {template.template_image ? (
            <img
              src={template.template_image}
              alt={formattedName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100">
              <span className="text-4xl text-gray-400">📄</span>
            </div>
          )}
          {/* Image overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 bg-linear-to-br from-blue-900/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {formattedName}
          </h3>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreview}
            rounded={true}
          >
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseTemplate}
            rounded={true}
          >
            Use
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const TemplateCardSkeleton = () => {
  return (
    <div>
      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="aspect-4/3 w-full animate-pulse bg-slate-200" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
};
