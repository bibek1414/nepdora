"use client";
import React from "react";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { FaqCard9 } from "../faq-card/faq-card-9";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { FAQComponentData } from "@/types/owner-site/components/faq";

interface FAQStyleProps {
  data: FAQComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQComponentData["data"]>) => void;
}

export const FAQStyle9: React.FC<FAQStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const {
    title = "Frequently Asked Questions",
    subtitle,
    leftImage1,
    leftImage2,
    leftImage3,
    contactTitle,
    contactDescription,
  } = data || {};
  const { data: faqs = [], isLoading, error } = useFAQs();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleContactTitleChange = (newTitle: string) => {
    onUpdate?.({ contactTitle: newTitle });
  };

  const handleContactDescriptionChange = (newDescription: string) => {
    onUpdate?.({ contactDescription: newDescription });
  };

  const handleLeftImage1Change = (url: string) => {
    onUpdate?.({ leftImage1: url });
  };
  const handleLeftImage2Change = (url: string) => {
    onUpdate?.({ leftImage2: url });
  };
  const handleLeftImage3Change = (url: string) => {
    onUpdate?.({ leftImage3: url });
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
          <FaqCard9
            faqs={faqs}
            title={title}
            subtitle={subtitle}
            leftImage1={leftImage1}
            leftImage2={leftImage2}
            leftImage3={leftImage3}
            contactTitle={contactTitle}
            contactDescription={contactDescription}
            isEditable={isEditable}
            onTitleChange={handleTitleChange}
            onSubtitleChange={handleSubtitleChange}
            onLeftImage1Change={handleLeftImage1Change}
            onLeftImage2Change={handleLeftImage2Change}
            onLeftImage3Change={handleLeftImage3Change}
            onContactTitleChange={handleContactTitleChange}
            onContactDescriptionChange={handleContactDescriptionChange}
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
