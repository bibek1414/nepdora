"use client";
import React from "react";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { FaqCard8 } from "../faq-card/faq-card-8";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { FAQComponentData } from "@/types/owner-site/components/faq";

interface FAQStyleProps {
  data: FAQComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQComponentData["data"]>) => void;
}

export const FAQStyle8: React.FC<FAQStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title = "Frequently Asked Questions", subtitle } = data || {};
  const { data: faqs = [], isLoading, error } = useFAQs();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-6xl">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading FAQs</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load FAQs."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && faqs.length > 0 && (
          <FaqCard8
            faqs={faqs}
            title={title}
            subtitle={subtitle}
            isEditable={isEditable}
            onTitleChange={handleTitleChange}
            onSubtitleChange={handleSubtitleChange}
          />
        )}

        {!isLoading && !error && faqs.length === 0 && (
          <div className="py-16 text-center">
            <HelpCircle className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No FAQs Available
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};
