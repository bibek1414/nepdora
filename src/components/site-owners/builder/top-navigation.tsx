import React from "react";
import { NewPageDialog } from "@/components/site-owners/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/new-page/delete-page-dialog";
import { Button } from "@/components/ui/button";
import { Page } from "@/types/owner-site/components/page";
import { ArrowLeft, Palette, Eye, Upload, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  siteUser: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
  siteUser,
}) => {
  const router = useRouter();

  const handlePageCreated = (page: Page) => {
    onPageChange(page.slug);
    console.log("New page created:", page);
  };

  const handlePageDeleted = (deletedSlug: string) => {
    if (currentPage === deletedSlug && pages.length > 1) {
      const remainingPages = pages.filter(page => page.slug !== deletedSlug);
      if (remainingPages.length > 0) {
        onPageChange(remainingPages[0].slug);
      }
    }
    console.log("Page deleted:", deletedSlug);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <img src="/fulllogo.svg" alt="Logo" className="h-8" />
        </div>

        {/* Center Section - Page Management */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Page Management</span>
          </div>

          {/* New Page Dialog */}
          <NewPageDialog onPageCreated={handlePageCreated} />

          {/* Existing Pages */}
          <div className="flex items-center gap-2">
            {pages.map(page => (
              <div
                key={page.slug}
                className={`flex items-center gap-1 rounded-md border text-sm ${
                  currentPage === page.slug
                    ? "border-gray-600 bg-gray-600 text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <button
                  onClick={() => onPageChange(page.slug)}
                  className="px-3 py-1.5 capitalize"
                >
                  {page.title}
                </button>

                {/* Delete button */}
                {pages.length > 1 && currentPage !== page.slug && (
                  <DeletePageDialog
                    page={page}
                    onPageDeleted={handlePageDeleted}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          <Link href="/admin" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link
            href={`/theme-settings/${siteUser}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <Palette className="mr-2 h-4 w-4" />
              Theme Settings
            </Button>
          </Link>

          <Link
            href={`/preview/${siteUser}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>

          <Link
            href={`/publish/${siteUser}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#074685] text-white hover:bg-[#053567]"
            >
              <Upload className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
