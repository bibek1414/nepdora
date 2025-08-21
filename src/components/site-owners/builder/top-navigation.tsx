import React from "react";
import { NewPageDialog } from "@/components/site-owners/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/new-page/delete-page-dialog";
import { Page } from "@/types/owner-site/components/page";

interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
}) => {
  const canDeletePages = pages.length > 1;

  const handlePageCreated = (page: Page) => {
    // Automatically switch to the newly created page
    onPageChange(page.slug);
    console.log("New page created:", page);
  };

  const handlePageDeleted = (deletedSlug: string) => {
    // If the deleted page was the current page, switch to the first remaining page
    if (currentPage === deletedSlug && pages.length > 1) {
      const remainingPages = pages.filter(page => page.slug !== deletedSlug);
      if (remainingPages.length > 0) {
        onPageChange(remainingPages[0].slug);
      }
    }
    console.log("Page deleted:", deletedSlug);
  };

  return (
    <div className="bg-card border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col items-center gap-3">
          <img src="/fulllogo.svg" alt="Logo" className="h-8" />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm font-medium">
            Pages
          </span>

          {/* New Page Dialog */}
          <NewPageDialog onPageCreated={handlePageCreated} />

          {/* Existing Pages */}
          <div className="flex items-center gap-2">
            {pages.map(page => (
              <div
                key={page.slug}
                className={`flex items-center gap-1 rounded-md border px-1 ${
                  currentPage === page.slug
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "bg-background border-border hover:bg-gray-50"
                }`}
              >
                <button
                  onClick={() => onPageChange(page.slug)}
                  className="px-3 py-1 text-sm capitalize"
                >
                  {page.title}
                </button>

                {/* Delete button - only show if not current page and more than 1 page exists */}
                {canDeletePages && currentPage !== page.slug && (
                  <DeletePageDialog
                    page={page}
                    onPageDeleted={handlePageDeleted}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-muted-foreground text-xs">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Right Section - Empty for now */}
        <div className="flex items-center">
          {/* This space can be used for other actions if needed */}
        </div>
      </div>
    </div>
  );
};
