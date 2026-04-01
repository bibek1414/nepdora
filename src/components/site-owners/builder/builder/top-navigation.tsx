import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeDialog } from "@/components/site-owners/builder/theme/theme-dialog";
import {
  ArrowLeft,
  Palette,
  RotateCcw,
  Upload,
  ExternalLinkIcon,
  Globe,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  hasChanges: boolean;
  onUndo: () => void;
  isUndoPending?: boolean;
  onPublish: () => void;
  onOpenTheme: () => void;
  onOpenLiveSite: () => void;
  onOpenPreview: () => void;
  liveSiteUrl: string;
  previewUrl: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  hasChanges,
  onUndo,
  onPublish,
  liveSiteUrl,
  previewUrl,
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
          <Link
            href={liveSiteUrl}
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <Globe className="h-3.5 w-3.5" />
            Live site
            <ExternalLinkIcon className="ml-1 h-2.5 w-2.5 text-slate-400" />
          </Link>
          <Link
            href={previewUrl}
            target="_blank"
            className="flex items-center gap-1.25 rounded-lg bg-transparent px-2.5 py-1.5 text-[13px] font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Link>
          <button
            className={cn(
              "flex cursor-pointer items-center gap-1.25 rounded-lg border border-dashed border-slate-200 bg-transparent px-2.5 py-1.5 text-[13px] font-medium text-slate-600 transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600",
              hasChanges &&
                "cursor-pointer border-amber-500 bg-amber-100 text-amber-700"
            )}
            onClick={onUndo}
            title="Undo unsaved changes"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Undo changes
          </button>

          <button
            className="group flex cursor-pointer items-center gap-1.75 rounded-lg bg-blue-600 px-[18px] py-[7px] text-[13px] font-bold text-white shadow-sm shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/35 active:translate-y-0"
            onClick={onPublish}
          >
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
