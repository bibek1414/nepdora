"use client";
import React from "react";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { FAQCard10 } from "../faq-card/faq-card-10";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { FAQComponentData } from "@/types/owner-site/components/faq";

interface FAQStyleProps {
  data: FAQComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQComponentData["data"]>) => void;
}

export const FAQStyle10: React.FC<FAQStyleProps> = () => {
  const { data: faqs = [], isLoading, error } = useFAQs();

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mx-auto w-full">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading FAQs</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load FAQs."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && faqs.length > 0 && <FAQCard10 faqs={faqs} />}

          {!isLoading && !error && faqs.length === 0 && (
            <div className="py-16 text-center">
              <HelpCircle className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
              <h3 className="text-foreground mb-4 text-2xl font-semibold">
                No FAQs Available
              </h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
