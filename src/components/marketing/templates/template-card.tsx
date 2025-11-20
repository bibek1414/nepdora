"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Template } from "@/types/super-admin/components/template";
import { usePreviewTemplate } from "@/hooks/owner-site/admin/use-template";

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const { openPreview } = usePreviewTemplate();
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPreview(template.schema_name);
  };

  return (
    <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
      <div className="group-hover: relative overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition-all duration-300 group-hover:ring-gray-300">
        <div
          className="relative aspect-[4/3] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={
              template.template_image ||
              `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(template.name)}`
            }
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {template.template_category && (
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                {template.template_category.name}
              </span>
            </div>
          )}

          {/* Hover Overlay with Preview Button */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              onClick={handlePreview}
              variant="secondary"
              className="rounded-lg bg-white text-gray-900 transition-all duration-200 hover:bg-gray-50"
            >
              Preview
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-purple-600">
            {template.name}
          </div>
          {template.template_subcategory && (
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              {template.template_subcategory.name}
            </p>
          )}
          <Link href={"/admin/signup"}>
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            >
              Use Template
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
