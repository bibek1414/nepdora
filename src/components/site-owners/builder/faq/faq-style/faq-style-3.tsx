"use client";
import React from "react";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { FaqCard7 } from "../faq-card/faq-card-7";
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

export const FAQStyle3: React.FC<FAQStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const {
    title = "Frequently Asked Questions",
    contactTitle,
    contactDescription,
    buttonText,
  } = data || {};
  const { data: faqs = [], isLoading, error, refetch } = useFAQs();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleContactTitleChange = (newTitle: string) => {
    onUpdate?.({ contactTitle: newTitle });
  };

  const handleContactDescriptionChange = (newDescription: string) => {
    onUpdate?.({ contactDescription: newDescription });
  };

  const handleButtonTextChange = (newText: string) => {
    onUpdate?.({ buttonText: newText });
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
          <FaqCard7
            faqs={faqs}
            title={title}
            contactTitle={contactTitle}
            contactDescription={contactDescription}
            buttonText={buttonText}
            isEditable={isEditable}
            onTitleChange={handleTitleChange}
            onContactTitleChange={handleContactTitleChange}
            onContactDescriptionChange={handleContactDescriptionChange}
            onButtonTextChange={handleButtonTextChange}
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
    </section>
  );
};
