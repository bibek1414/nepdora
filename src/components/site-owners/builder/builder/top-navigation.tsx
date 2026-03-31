import React from "react";
import { Button } from "@/components/ui/button";
import { Page } from "@/types/owner-site/components/page";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Settings, 
  Globe, 
  Eye, 
  RotateCcw, 
  Upload, 
  ChevronDown,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import "./builder.css";

interface TopNavigationProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  siteUser: string;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  hasChanges: boolean;
  onUndo: () => void;
  onPublish: () => void;
  onOpenTheme: () => void;
  onOpenLiveSite: () => void;
  onOpenPreview: () => void;
  liveSiteUrl: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pages,
  currentPage,
  onPageChange,
  siteUser,
  deviceMode,
  setDeviceMode,
  hasChanges,
  onUndo,
  onPublish,
  onOpenTheme,
  onOpenLiveSite,
  onOpenPreview,
  liveSiteUrl,
}) => {
  const currentPageTitle = pages.find(p => p.slug === currentPage)?.title || "Home";

  return (
    <header className="builder-topbar">
      {/* Brand */}
      <div className="flex items-center gap-2 pr-4 mr-1 border-r border-builder-border min-w-max">
        <div className="h-7 w-7 rounded-md bg-builder-accent flex items-center justify-center text-white">
          <Layout className="h-4 w-4" />
        </div>
        <span className="text-[15px] font-bold text-builder-text-primary tracking-tight">BuilderPro</span>
      </div>

      {/* Page Selector */}
      <div className="builder-page-selector group" onClick={() => {}}>
        <div className="dot" />
        <span className="truncate max-w-[120px]">{currentPageTitle}</span>
        <ChevronDown className="h-3 w-3 text-builder-text-muted group-hover:text-builder-text-secondary transition-colors" />
      </div>

      {/* Device Toggle */}
      <div className="builder-device-toggle ml-1">
        <button 
          className={cn("builder-device-btn", deviceMode === 'desktop' && "active")}
          onClick={() => setDeviceMode('desktop')}
          title="Desktop view"
        >
          <Monitor className="h-[15px] w-[15px]" />
        </button>
        <button 
          className={cn("builder-device-btn", deviceMode === 'tablet' && "active")}
          onClick={() => setDeviceMode('tablet')}
          title="Tablet view"
        >
          <Tablet className="h-[15px] w-[15px]" />
        </button>
        <button 
          className={cn("builder-device-btn", deviceMode === 'mobile' && "active")}
          onClick={() => setDeviceMode('mobile')}
          title="Mobile view"
        >
          <Smartphone className="h-[14px] w-[14px]" />
        </button>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5 pl-2 border-l border-builder-border">
        <button 
          className="builder-btn-ghost p-2"
          onClick={onOpenTheme}
          title="Theme settings"
        >
          <Settings className="h-[15px] w-[15px]" />
        </button>

        <div className="h-4 w-px bg-builder-border mx-1" />

        <button className="builder-btn-outline" onClick={onOpenLiveSite}>
          <Globe className="h-3.5 w-3.5" />
          Live site
          <ExternalLinkIcon className="h-2.5 w-2.5 text-builder-text-muted ml-1" />
        </button>

        <button className="builder-btn-ghost" onClick={onOpenPreview}>
          <Eye className="h-3.5 w-3.5" />
          Preview
          {hasChanges && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">edits</span>}
        </button>

        <button 
          className={cn("builder-btn-undo", hasChanges && "has-changes")}
          onClick={onUndo}
          title="Undo unsaved changes"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {hasChanges ? "Undo changes" : "Undo"}
        </button>

        <button className="builder-btn-publish group" onClick={onPublish}>
          <div className={cn("pulse", hasChanges && "animate-pulse")} />
          <Upload className="h-3.5 w-3.5 group-hover:-translate-y-px transition-transform" />
          Publish changes
        </button>
      </div>
    </header>
  );
};

const ExternalLinkIcon = ({className}: {className?: string}) => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
);
