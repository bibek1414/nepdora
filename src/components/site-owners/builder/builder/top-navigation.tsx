import React, { useState } from "react";
import { NewPageDialog } from "@/components/site-owners/builder/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/builder/new-page/delete-page-dialog";
import { ThemeDialog } from "@/components/site-owners/builder/theme/theme-dialog";
import { Button } from "@/components/ui/button";
import { Page } from "@/types/owner-site/components/page";
import { ArrowLeft, Palette, Eye, Upload, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePublishSite } from "@/hooks/owner-site/components/use-publish";

interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  onPageCreated: (page: Page) => void;
  onPageDeleted: (deletedSlug: string) => void;
  siteUser: string;
  isSidebarCollapsed?: boolean; // Add this prop
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
  onPageCreated,
  onPageDeleted,
  siteUser,
  isSidebarCollapsed = false, // Default to false
}) => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const { mutate: publish, isPending } = usePublishSite();

  return (
    <header className="fixed top-0 right-0 left-0 z-45 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Page Management */}
        <div
          className={`flex items-center gap-4 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Page Management</span>
          </div>

          {/* New Page Dialog */}
          <NewPageDialog onPageCreated={onPageCreated} />

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
                {pages.length > 1 && (
                  <DeletePageDialog page={page} onPageDeleted={onPageDeleted} />
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsThemeDialogOpen(true)}
            className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
          >
            <Palette className="mr-2 h-4 w-4" />
            Theme Settings
          </Button>

          <Link
            href={`/publish/${siteUser}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              Live Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link
            href={`/preview/${siteUser}/${currentPage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              Preview
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            onClick={() => publish()}
            disabled={isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Theme Dialog */}
      <ThemeDialog
        open={isThemeDialogOpen}
        onOpenChange={setIsThemeDialogOpen}
      />
    </header>
  );
};
