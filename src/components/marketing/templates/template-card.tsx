"use client";
import React from "react";
import { Template } from "./types";

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:ring-gray-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={template.image}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              e.currentTarget.src = `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(template.name)}`;
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
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg transition-all duration-200 hover:bg-gray-50">
              Preview
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-purple-600">
            {template.name}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {template.description}
          </p>
          <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50">
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};
