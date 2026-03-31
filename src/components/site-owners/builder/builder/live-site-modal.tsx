import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
      <DialogContent className="rounded-builder-radius-lg max-w-[420px] gap-0 overflow-hidden border-0 p-0">
        <div className="bg-white p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-builder-text-primary text-lg font-semibold">
                Your live site
              </DialogTitle>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-6">
          <div className="rounded-builder-radius-md border-builder-border bg-builder-surface-2 group hover:border-builder-accent-subtle flex items-center gap-2.5 border p-3 transition-all">
            <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
            <span className="text-builder-accent flex-1 truncate font-mono text-[13px]">
              {siteUrl}
            </span>
            <button
              onClick={copyUrl}
              className="border-builder-border text-builder-text-secondary hover:text-builder-accent hover:border-builder-accent-subtle rounded-md border bg-white p-1.5 transition-all active:scale-95"
              title="Copy URL"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <DialogFooter className="bg-builder-surface border-builder-border flex items-center justify-between gap-0 border-t p-6 pt-2">
          <span className="text-builder-text-muted mr-2 flex items-center gap-1.5 text-[11px]">
            <Globe className="h-3 w-3" />
            Opens in a new tab
          </span>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="builder-btn-publish flex items-center gap-2 px-5 py-2 text-sm font-bold no-underline shadow-md transition-all hover:-translate-y-px active:translate-y-0"
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
