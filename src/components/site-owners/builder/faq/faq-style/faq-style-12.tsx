"use client";

import React from "react";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { FAQCard12 } from "../faq-card/faq-card-12";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface FAQStyleProps {
  data: FAQComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQComponentData["data"]>) => void;
}

export const FAQStyle12: React.FC<FAQStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const {
    title = "You ask, \n we answer",
    subtitle,
    buttonText,
    buttonLink,
  } = data || {};
  const { data: faqs = [], isLoading, error , refetch } = useFAQs();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleButtonUpdate = (text: string, href: string) => {
    onUpdate?.({ buttonText: text, buttonLink: href });
  };

  return (
    <div className="w-full">
      {isLoading && (
        <section className="px-6 py-32">
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Skeleton className="mb-4 h-16 w-3/4 rounded-xl" />
                <Skeleton className="mb-2 h-4 w-full rounded-lg" />
                <Skeleton className="mb-10 h-4 w-5/6 rounded-lg" />
                <Skeleton className="h-14 w-40 rounded-full" />
              </div>
              <div className="space-y-4 lg:col-span-7">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-4xl" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="container mx-auto max-w-6xl py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading FAQs</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load FAQs."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && !error && faqs.length > 0 && (
        <FAQCard12
          faqs={faqs}
          title={title}
          subtitle={subtitle}
          buttonText={buttonText}
          buttonLink={buttonLink}
          isEditable={isEditable}
          onTitleChange={handleTitleChange}
          onSubtitleChange={handleSubtitleChange}
          onButtonUpdate={handleButtonUpdate}
        />
      )}

      {!isLoading && !error && (
        <BuilderEmptyState
          icon={HelpCircle}
          title="No FAQs Available"
          description="Answer common questions from your visitors. Add FAQs from the admin dashboard."
          actionLabel="Add New FAQ"
          actionLink="/admin/faqs"
          isEditable={isEditable}
          isEmpty={faqs.length === 0}
        onRefresh={refetch}
          />
      )}

    </div>
  );
};
