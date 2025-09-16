import React, { useState } from "react";
import { NewPageDialog } from "@/components/site-owners/builder/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/builder/new-page/delete-page-dialog";
import { ThemeDialog } from "@/components/site-owners/builder/theme/theme-dialog";
import { Button } from "@/components/ui/button";
import { Page } from "@/types/owner-site/components/page";
import { ArrowLeft, Palette, Eye, Upload, ChevronDown } from "lucide-react";
import Link from "next/link";

interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  onPageCreated: (page: Page) => void;
  onPageDeleted: (deletedSlug: string) => void;
  siteUser: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
  onPageCreated,
  onPageDeleted,
  siteUser,
}) => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-2 py-3">
        {/* Left Section - Logo + Page Management */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <img src="/fulllogo.svg" alt="Logo" className="h-8" />

          {/* Page Management */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Page Management</span>
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
                    <DeletePageDialog
                      page={page}
                      onPageDeleted={onPageDeleted}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500">
              {pages.length} page{pages.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          <Link href="/admin" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          {/* Theme Settings Button - Now opens dialog instead of navigating */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsThemeDialogOpen(true)}
            className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
          >
            <Palette className="mr-2 h-4 w-4" />
            Theme Settings
          </Button>

          <Link
            href={`/preview/${siteUser}/${currentPage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Theme Dialog */}
      <ThemeDialog
        open={isThemeDialogOpen}
        onOpenChange={setIsThemeDialogOpen}
      />
    </div>
  );
};
