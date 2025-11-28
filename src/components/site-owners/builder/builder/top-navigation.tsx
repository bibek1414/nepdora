import React, { useState } from "react";
import { NewPageDialog } from "@/components/site-owners/builder/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/builder/new-page/delete-page-dialog";
import { ThemeDialog } from "@/components/site-owners/builder/theme/theme-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Page } from "@/types/owner-site/components/page";
import {
  ArrowLeft,
  Palette,
  Eye,
  Upload,
  ExternalLink,
  ChevronDown,
  FileCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePublishSite } from "@/hooks/owner-site/components/use-publish";

interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  onPageCreated: (page: Page) => void;
  onPageDeleted: (deletedSlug: string) => void;
  siteUser: string;
  isSidebarCollapsed?: boolean;
  onOpenOnboarding?: () => void;
  isOnboardingComplete?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
  onPageCreated,
  onPageDeleted,
  siteUser,
  isSidebarCollapsed = false,
  onOpenOnboarding,
  isOnboardingComplete = false,
}) => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const { mutate: publish, isPending } = usePublishSite();

  // Find current page object
  const currentPageObj = pages.find(p => p.slug === currentPage);

  // Reorder pages to show active page in first 3
  const reorderedPages = React.useMemo(() => {
    if (!currentPageObj) return pages;

    // Remove current page from array
    const otherPages = pages.filter(p => p.slug !== currentPage);

    // Put current page first, then other pages
    return [currentPageObj, ...otherPages];
  }, [pages, currentPage, currentPageObj]);

  // Get first 3 pages (including active) and remaining pages
  const visiblePages = reorderedPages.slice(0, 3);
  const remainingPages = reorderedPages.slice(3);

  return (
    <header className="fixed top-0 right-0 left-0 z-45 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Dashboard & Page Management */}
        <div className="flex items-center gap-4">
          {/* Dashboard Button - Far Left */}
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

          {/* Page Management Section */}
          <div className="flex items-center gap-2 border-l pl-4">
            <span className="text-xs font-medium text-gray-600">
              Page Management
            </span>
          </div>

          {/* New Page Dialog */}
          <NewPageDialog onPageCreated={onPageCreated} />

          {/* First 3 Pages */}
          <div className="flex items-center gap-2">
            {visiblePages.map(page => (
              <div
                key={page.slug}
                className={`flex items-center gap-1 rounded-md border text-xs ${
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

            {/* Other Pages Dropdown */}
            {remainingPages.length > 0 && (
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 rounded-md border-gray-200 text-xs hover:bg-gray-50"
                  >
                    Other Pages
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {remainingPages.map(page => (
                    <DropdownMenuItem
                      key={page.slug}
                      onClick={() => {
                        onPageChange(page.slug);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between capitalize ${
                        currentPage === page.slug
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                    >
                      <span>{page.title}</span>
                      {pages.length > 1 && (
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            setPageToDelete(page);
                          }}
                        >
                          <X className="text-muted-foreground hover:text-destructive mr-1 h-4 w-4 cursor-pointer transition-colors" />
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Onboarding Button */}
          {onOpenOnboarding && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenOnboarding}
              className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <FileCheck className="mr-2 h-4 w-4" />
              {isOnboardingComplete ? "Edit Site Info" : "Complete Setup"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setIsThemeDialogOpen(true)}
            className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
          >
            <Palette className="mr-2 h-4 w-4" />
            Theme Settings
          </Button>

          <Link href={`/`} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
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
              className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              Preview
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
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

      {/* Delete Page Dialog (Controlled) */}
      {pageToDelete && (
        <DeletePageDialog
          page={pageToDelete}
          open={true}
          onOpenChange={open => {
            if (!open) setPageToDelete(null);
          }}
          showTrigger={false}
          onPageDeleted={onPageDeleted}
        />
      )}
    </header>
  );
};
