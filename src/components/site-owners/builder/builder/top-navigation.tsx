import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Page } from "@/types/owner-site/components/page";
import { ThemeDialog } from "@/components/site-owners/builder/theme/theme-dialog";
import {
  ArrowLeft,
  Palette,
  ExternalLink,
  RotateCcw,
  Loader2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePublishSite } from "@/hooks/owner-site/components/use-publish";
import { useResetUi } from "@/hooks/owner-site/components/use-reset-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  siteUser: string;
  isSidebarCollapsed?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
  siteUser,
  isSidebarCollapsed = false,
}) => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const { mutate: publish, isPending } = usePublishSite();
  const { mutate: resetUi, isPending: isResetUiPending } = useResetUi();

  return (
    <header className="fixed top-0 right-0 left-0 z-45 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Dashboard & Page Management */}
        <div className="flex items-center gap-4">
          {/* Dashboard Button */}
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
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
                disabled={isResetUiPending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {isResetUiPending ? "Resetting..." : "Reset UI"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will reset all your changes to the published
                  version. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => resetUi()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
      {/* Reset UI Loading Overlay */}
      {isResetUiPending && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Resetting your site...
              </h3>
              <p className="text-sm text-gray-500">
                Reverting changes and fetching the latest data.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
