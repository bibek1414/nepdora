"use client";

import React from "react";
import TemplateCategoryManagement from "@/components/super-admin/builder/template/template-category-management";

export default function TemplateSubcategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-7xl px-6 md:px-8">
        <TemplateCategoryManagement initialTab="subcategories" />
      </div>
    </div>
  );
}
