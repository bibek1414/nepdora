import { useFAQs } from "@/hooks/owner-site/admin/use-faq";
import { EditableText } from "@/components/ui/editable-text";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { FaqCard6 } from "../faq-card/faq-card-6";
import { AlertCircle, HelpCircle } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface FAQStyleProps {
  data: FAQComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<FAQComponentData["data"]>) => void;
}

export const FAQStyle6: React.FC<FAQStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title = "Common Questions", titleItalic = "The Most" } = data || {};

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#C97B63",
    },
  };

  const { data: faqs = [], isLoading, error, refetch } = useFAQs();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleTitleItalicChange = (newTitleItalic: string) => {
    onUpdate?.({ titleItalic: newTitleItalic });
  };

  const accentColor = theme?.colors?.primary || "#C97B63";

  return (
    <section className="overflow-hidden bg-white py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between md:mb-20">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <EditableText
              value={titleItalic || ""}
              onChange={handleTitleItalicChange}
              as="span"
              className="font-serif text-3xl leading-[1.1] font-extralight tracking-tight text-[#1A1A1A] italic md:text-4xl lg:text-5xl"
              isEditable={isEditable}
              placeholder="The Most"
            />
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="font-serif text-3xl leading-[1.1] tracking-tight text-[#1A1A1A] md:text-4xl lg:text-5xl"
              isEditable={isEditable}
              placeholder="Common Questions"
            />
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
            <div className="space-y-4 lg:col-span-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
            <div className="h-[400px] lg:col-span-7">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
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
        {!isLoading && !error && faqs.length > 0 && (
          <FaqCard6 faqs={faqs} accentColor={accentColor} />
        )}
      </div>
    </section>
  );
};
