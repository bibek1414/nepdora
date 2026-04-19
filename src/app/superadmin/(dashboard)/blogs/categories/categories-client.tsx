"use client";

import React from "react";
import CategoryTagManagement from "@/components/super-admin/blogs/category-tag-management";

export default function CategoriesClient() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-4xl px-6 md:px-8">
        <CategoryTagManagement />
      </div>
    </div>
  );
}
