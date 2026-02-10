"use client";
import React, { useState, useEffect } from "react";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";
import { PortfolioCard3 } from "../portfolio-card/portfolio-card-3";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { PortfolioData } from "@/types/owner-site/components/portfolio";
import { Button } from "@/components/ui/button";

interface PortfolioStyleProps {
  data: PortfolioData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioData>) => void;
  onPortfolioClick?: (portfolioSlug: string) => void;
}

export const PortfolioStyle3: React.FC<PortfolioStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onPortfolioClick,
}) => {
  const { title = "Our Portfolio", subtitle } = data || {};
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    data: portfoliosData,
    isLoading,
    error,
  } = usePortfolios({
    page: 1,
    page_size: 6,
  });
  const portfolios = portfoliosData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const goToNextProject = () => {
    if (isAnimating || portfolios.length === 0) return;
    setIsAnimating(true);
    setCurrentProjectIndex(prev =>
      prev === portfolios.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToPrevProject = () => {
    if (isAnimating || portfolios.length === 0) return;
    setIsAnimating(true);
    setCurrentProjectIndex(prev =>
      prev === 0 ? portfolios.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  useEffect(() => {
    setCurrentProjectIndex(0);
  }, [portfolios.length]);

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-xl"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center">
            <Skeleton className="h-[400px] w-full max-w-4xl rounded-lg" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Portfolio</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load portfolio."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && portfolios.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl">
              <div
                className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
              >
                <div className="relative">
                  {isEditable && (
                    <div className="absolute inset-0 z-10 bg-transparent" />
                  )}
                  <PortfolioCard3
                    portfolio={portfolios[currentProjectIndex]}
                    siteUser={isEditable ? undefined : siteUser}
                    onClick={() =>
                      onPortfolioClick?.(portfolios[currentProjectIndex].slug)
                    }
                  />
                </div>
              </div>
            </div>

            {portfolios.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevProject}
                  disabled={isAnimating}
                  className="h-12 w-12 rounded-full border-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="text-muted-foreground mx-4 text-sm">
                  <span className="font-medium">{currentProjectIndex + 1}</span>{" "}
                  of {portfolios.length}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextProject}
                  disabled={isAnimating}
                  className="h-12 w-12 rounded-full border-2"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && portfolios.length === 0 && (
          <div className="py-16 text-center">
            <Briefcase className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Portfolio Items Available
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};
