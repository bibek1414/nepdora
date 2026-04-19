"use client";

import React from "react";
import TemplateCategoryManagement from "@/components/super-admin/builder/template/template-category-management";

export default function TemplateCategoriesClient() {
  return (
    <div className="bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-7xl px-6 md:px-8">
        <TemplateCategoryManagement initialTab="categories" />
      </div>
    </div>
  );
}
