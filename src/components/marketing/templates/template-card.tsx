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
    "bg-stone-100",
    "bg-slate-100",
    "bg-orange-50",
    "bg-indigo-50",
    "bg-pink-50",
    "bg-gray-100",
  ];
  const index =
    typeof id === "number"
      ? id
      : typeof id === "string"
        ? parseInt(id, 10) || 0
        : 0;
  return colors[Math.abs(index) % colors.length];
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const { openPreview } = usePreviewTemplate();
  const bgColor = getBgColor(template.id);

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPreview(template.schema_name);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer"
    >
      <div
        className={`relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl ${bgColor}`}
      >
        {template.template_image ? (
          <img
            src={template.template_image}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl text-gray-400">📄</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="default"
            size="sm"
            className="translate-y-4 transition-transform group-hover:translate-y-0"
            onClick={handlePreview}
          >
            Customize
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{template.name}</h3>
        <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          {template.template_category?.name || "Template"}
        </span>
      </div>
    </motion.div>
  );
};

export const TemplateCardSkeleton = () => {
  return (
    <div>
      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
        <div className="h-full w-full animate-pulse bg-slate-200" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
};
