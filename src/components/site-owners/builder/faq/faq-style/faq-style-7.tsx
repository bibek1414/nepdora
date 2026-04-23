"use client";
import React from "react";
import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { EditableText } from "@/components/ui/editable-text";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { AlertCircle, HelpCircle, ChevronRight } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { cn } from "@/lib/utils";

interface FAQStyleProps {
  data: FAQComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQComponentData["data"]>) => void;
}

export const FAQStyle7: React.FC<FAQStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const {
    title = "Honest answers to the questions we hear most.",
    subtitle = "Common questions",
    description = "Don’t see what you’re looking for? Send a note — we reply to everything.",
  } = data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data: faqs = [], isLoading, error, refetch } = useFAQs();

  const handleTextUpdate =
    (field: keyof FAQComponentData["data"]) => (val: string) => {
      onUpdate?.({ [field]: val });
    };

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-2">
              <EditableText
                value={subtitle}
                onChange={handleTextUpdate("subtitle")}
                as="p"
                className="block px-1 text-sm font-semibold tracking-wide"
                isEditable={isEditable}
                style={{ fontFamily: theme?.fonts?.body }}
              />
            </div>
            <EditableText
              value={title}
              onChange={handleTextUpdate("title")}
              as="label"
              className="text-3xl leading-tight tracking-tight text-balance md:text-5xl"
              isEditable={isEditable}
              style={{ fontFamily: theme?.fonts?.heading }}
              multiline
            />
            <EditableText
              value={description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-muted-foreground mt-6 max-w-md text-pretty"
              isEditable={isEditable}
              style={{ fontFamily: theme?.fonts?.body }}
              multiline
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 lg:col-start-7">
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
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

            {!isLoading && !error && faqs.length === 0 && (
              <BuilderEmptyState
                icon={HelpCircle}
                title="No FAQs Available"
                description="Answer common questions from your visitors. Add FAQs from the admin dashboard."
                actionLabel="Add New FAQ"
                actionLink="/admin/faq"
                isEditable={isEditable}
                isEmpty={faqs.length === 0}
                onRefresh={refetch}
              />
            )}

            {!isLoading && !error && faqs.length > 0 && (
              <div className="divide-border border-border divide-y border-y">
                {faqs.map((f, index) => (
                  <details key={index} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between outline-none">
                      <h3
                        className="font-display pr-6 text-lg"
                        style={{ fontFamily: theme?.fonts?.heading }}
                      >
                        {f.question}
                      </h3>
                      <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <div
                      className="text-muted-foreground mt-4 text-pretty"
                      style={{ fontFamily: theme?.fonts?.body }}
                    >
                      {f.answer}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
