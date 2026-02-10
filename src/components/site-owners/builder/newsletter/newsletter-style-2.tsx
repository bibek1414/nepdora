"use client";
import React from "react";
import { NewsletterForm2 } from "./newsletter-form-2";
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

export const NewsletterStyle2: React.FC<NewsletterStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
}) => {
  const handleDataChange = (newData: NewsletterData) => {
    onUpdate?.(newData);
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <NewsletterForm2
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
