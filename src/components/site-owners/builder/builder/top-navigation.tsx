import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeDialog } from "@/components/site-owners/builder/theme/theme-dialog";
import {
  ArrowLeft,
  Palette,
  RotateCcw,
  Upload,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { Globe, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/components/site-owners/builder/builder/builder.css";

interface TopNavigationProps {
  hasChanges: boolean;
  onUndo: () => void;
  isUndoPending?: boolean;
  onPublish: () => void;
  onOpenTheme: () => void;
  onOpenLiveSite: () => void;
  onOpenPreview: () => void;
  liveSiteUrl: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  hasChanges,
  onUndo,
  onPublish,
  onOpenLiveSite,
  onOpenPreview,
}) => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-45 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left Section - Dashboard & Page Management */}
        <div className="flex items-center gap-4">
          <img src="/nepdora-logooo.svg" className="mr-3" />
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
          <Button
            variant="outline"
            onClick={() => setIsThemeDialogOpen(true)}
            className="rounded-full bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
          >
            <Palette className="mr-2 h-4 w-4" />
            Theme Settings
          </Button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <button className="builder-btn-outline" onClick={onOpenLiveSite}>
            <Globe className="h-3.5 w-3.5" />
            Live site
            <ExternalLinkIcon className="text-builder-text-muted ml-1 h-2.5 w-2.5" />
          </button>
          <button className="builder-btn-ghost" onClick={onOpenPreview}>
            <Eye className="h-3.5 w-3.5" />
            Preview
            {hasChanges && (
              <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                edits
              </span>
            )}
          </button>
          <button
            className={cn("builder-btn-undo", hasChanges && "has-changes")}
            onClick={onUndo}
            title="Undo unsaved changes"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Undo changes
          </button>


          <button className="builder-btn-publish group" onClick={onPublish}>
            <Upload className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px" />
            Publish changes
          </button>
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

