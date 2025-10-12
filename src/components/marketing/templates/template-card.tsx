"use client";
import React from "react";
import { Template } from "./types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
      <div className="group-hover: relative overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition-all duration-300 group-hover:ring-gray-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={template.image}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              e.currentTarget.src = `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(
                template.name
              )}`;
            }}
          />
          {template.featured && (
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                Featured
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              variant="secondary"
              className="rounded-lg bg-white text-gray-900 transition-all duration-200 hover:bg-gray-50"
            >
              Preview
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-purple-600">
            {template.name}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {template.description}
          </p>
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
