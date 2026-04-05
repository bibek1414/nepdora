"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FolderOpen } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { SubCategory } from "@/types/owner-site/admin/product";

interface SubCategoryStyleProps {
  data: SubCategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<SubCategoryComponentData["data"]>) => void;
  onSubCategoryClick?: (subcategoryId: number) => void;
}

export const SubCategoryStyle3: React.FC<SubCategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onSubCategoryClick,
}) => {
  const { title = "CubeX Collection", subtitle } = data || {};
  const { data: subcategoriesData, isLoading, error } = useSubCategories();
  const subcategories = (subcategoriesData?.results || []) as SubCategory[];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [maxIndex, setMaxIndex] = useState(0);

  const pathname = usePathname();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const getStride = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild as HTMLElement | null;
      if (firstChild) {
        const style = window.getComputedStyle(container);
        const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
        return firstChild.offsetWidth + gap;
      }
    }
    return 0;
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const stride = getStride();
      if (stride > 0) {
        const newIndex = Math.round(scrollLeft / stride);
        setActiveIndex(newIndex);
      }
    }
  };

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollableWidth = scrollWidth - clientWidth;
      const stride = getStride();

      setIsScrollable(scrollableWidth > 0);

      if (stride > 0) {
        setMaxIndex(Math.max(0, Math.ceil(scrollableWidth / stride)));
      } else {
        setMaxIndex(0);
      }
    }
  };

  useEffect(() => {
    checkScrollable();
  }, [subcategories.length]);

  useEffect(() => {
    const handleResize = () => {
      checkScrollable();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [subcategories.length]);

  const scrollTo = (index: number) => {
    if (scrollContainerRef.current) {
      const stride = getStride();
      scrollContainerRef.current.scrollTo({
        left: index * stride,
        behavior: "smooth",
      });
    }
  };

  const getSubCategoryUrl = (subcategory: SubCategory): string => {
    return generateLinkHref(
      `/collections?sub_category=${subcategory.slug}`,
      siteUser,
      pathname
    );
  };

  const renderSubCategoryCard = (subcategory: SubCategory) => {
    const subcategoryImage = subcategory.image || "/fallback/image-not-found.png";
    const subcategoryUrl = getSubCategoryUrl(subcategory);

    const handleCardClick = () => {
      if (!isEditable) {
        if (onSubCategoryClick) {
          onSubCategoryClick(subcategory.id);
        } else {
          window.location.href = subcategoryUrl;
        }
      }
    };

    const CardWrapper = siteUser
      ? ({ children }: { children: React.ReactNode }) => (
          <a href={subcategoryUrl} className="block">
            {children}
          </a>
        )
      : ({ children }: { children: React.ReactNode }) => (
          <div onClick={handleCardClick} className="cursor-pointer">
            {children}
          </div>
        );

    return (
      <CardWrapper>
        <div className="relative h-[340px] w-[260px] overflow-hidden bg-gray-100 sm:h-[400px] sm:w-[300px]">
          <Image
            src={subcategoryImage}
            alt={subcategory.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            sizes="(min-width: 1024px) 300px, 260px"
          />
        </div>
        <div className="mt-4 text-center sm:mt-6">
          <h3 className="text-sm font-medium tracking-widest text-gray-900 uppercase">
            {subcategory.name}
          </h3>
        </div>
      </CardWrapper>
    );
  };

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-2xl font-medium tracking-wide sm:text-3xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-base sm:text-lg"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="flex gap-4 overflow-hidden pb-8 sm:gap-8 sm:pb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0">
                <div className="relative h-[340px] w-[260px] sm:h-[400px] sm:w-[300px]">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
                <Skeleton className="mt-4 h-5 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading SubCategories</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load subcategories."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && subcategories.length > 0 && (
          <>
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide mx-auto flex w-fit max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-8 sm:gap-8 sm:pb-12"
              style={{ scrollBehavior: "smooth" }}
              onScroll={handleScroll}
            >
              {subcategories.map(subcategory => (
                <div
                  key={subcategory.id}
                  className="relative shrink-0 snap-start"
                  onClick={() => !isEditable && onSubCategoryClick?.(subcategory.id)}
                >
                  {isEditable && <div className="absolute inset-0 z-10" />}
                  {renderSubCategoryCard(subcategory)}
                </div>
              ))}
            </div>

            {isScrollable && (
              <div className="flex justify-center space-x-3">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                      activeIndex === idx
                        ? "bg-gray-800"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to subcategory group ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && !error && subcategories.length === 0 && (
          <div className="bg-muted/50 rounded-lg py-12 text-center">
            <FolderOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No SubCategories Found
            </h3>
            <p className="text-muted-foreground">
              Add some subcategories to display them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
