import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Link2, Copy, ShieldCheck, Globe } from "lucide-react";
import { toast } from "sonner";

interface LiveSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteUrl: string;
}

export const LiveSiteModal: React.FC<LiveSiteModalProps> = ({
  open,
  onOpenChange,
  siteUrl,
}) => {
  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    toast.success("Link copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0 border-0 rounded-builder-radius-lg overflow-hidden gap-0">
        <div className="p-6 pb-0 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-builder-text-primary">Your live site</DialogTitle>
              <p className="text-xs text-builder-text-secondary mt-1">Last published 2 hours ago — all pages live</p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-sm hover:bg-builder-surface-2 text-builder-text-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 bg-white">
          <div className="flex items-center gap-2.5 p-3 rounded-builder-radius-md border border-builder-border bg-builder-surface-2 group transition-all hover:border-builder-accent-subtle">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-[13px] font-mono text-builder-accent truncate flex-1">{siteUrl}</span>
            <button 
              onClick={copyUrl}
              className="p-1.5 rounded-md border border-builder-border bg-white text-builder-text-secondary hover:text-builder-accent hover:border-builder-accent-subtle transition-all active:scale-95"
              title="Copy URL"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-builder-radius-md border border-builder-border bg-builder-surface-2 flex flex-col gap-1.5 transition-all hover:bg-white hover:border-builder-border-strong">
              <h5 className="text-[11px] font-bold text-builder-text-primary uppercase tracking-tight">Status</h5>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[12px] text-builder-text-secondary">Indexed</span>
              </div>
            </div>
            <div className="p-3.5 rounded-builder-radius-md border border-builder-border bg-builder-surface-2 flex flex-col gap-1.5 transition-all hover:bg-white hover:border-builder-border-strong">
              <h5 className="text-[11px] font-bold text-builder-text-primary uppercase tracking-tight">Security</h5>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[12px] text-builder-text-secondary">SSL Active</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-builder-surface border-t border-builder-border flex items-center justify-between gap-0">
          <span className="text-[11px] text-builder-text-muted flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            Opens in a new tab
          </span>
          <a 
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="builder-btn-publish py-2 px-5 text-sm flex items-center gap-2 font-bold shadow-md hover:-translate-y-px active:translate-y-0 transition-all no-underline"
            onClick={() => onOpenChange(false)}
          >
            <ExternalLink className="h-4 w-4" />
            Open live site
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
