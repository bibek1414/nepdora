"use client";
import React from "react";
import { NewsletterForm3 } from "./newsletter-form-3";
import {
  NewsletterComponentData,
  NewsletterData,
} from "@/types/owner-site/components/newsletter";

interface NewsletterStyleProps {
  data: NewsletterComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<NewsletterComponentData["data"]>) => void;
}

export const NewsletterStyle3: React.FC<NewsletterStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const handleDataChange = (newData: NewsletterData) => {
    onUpdate?.(newData);
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NewsletterForm3
          data={data}
          siteUser={isEditable ? undefined : siteUser}
          isPreview={isEditable}
          isEditable={isEditable}
          onDataChange={isEditable ? handleDataChange : undefined}
        />
      </div>
    </section>
  );
};
