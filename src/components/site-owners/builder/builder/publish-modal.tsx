import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Check, ArrowRight, Loader2, Globe, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: () => void;
  isPublishing: boolean;
  publishStatus: {
    reviewed: boolean;
    seoSet: boolean;
    ready: boolean;
  };
}

export const PublishModal: React.FC<PublishModalProps> = ({
  open,
  onOpenChange,
  onPublish,
  isPublishing,
  publishStatus,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] p-0 border-0 rounded-builder-radius-lg overflow-hidden gap-0">
        <div className="p-6 pb-0 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-builder-text-primary">Publish to live site</DialogTitle>
              <p className="text-xs text-builder-text-secondary mt-1">Your changes will go live at <strong>yourdomain.com</strong></p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-sm hover:bg-builder-surface-2 text-builder-text-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5 bg-white">
          <div className="flex flex-col gap-2.5">
            <div className={cn(
              "flex items-start gap-3 p-3 rounded-builder-radius-md border transition-colors",
              publishStatus.reviewed ? "bg-green-50 border-green-100" : "bg-builder-surface-2 border-builder-border"
            )}>
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                publishStatus.reviewed ? "bg-green-100 text-green-600" : "bg-builder-border text-builder-text-muted"
              )}>
                {publishStatus.reviewed ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-[13px] font-semibold text-builder-text-primary">Changes reviewed</h4>
                <p className="text-[11px] text-builder-text-secondary">Updates analyzed and optimized</p>
              </div>
            </div>

            <div className={cn(
              "flex items-start gap-3 p-3 rounded-builder-radius-md border transition-colors",
              publishStatus.seoSet ? "bg-green-50 border-green-100" : "bg-builder-surface-2 border-builder-border"
            )}>
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                publishStatus.seoSet ? "bg-green-100 text-green-600" : "bg-builder-border text-builder-text-muted"
              )}>
                {publishStatus.seoSet ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-[13px] font-semibold text-builder-text-primary">SEO metadata set</h4>
                <p className="text-[11px] text-builder-text-secondary">Title and description configured</p>
              </div>
            </div>

            <div className={cn(
              "flex items-start gap-3 p-3 rounded-builder-radius-md border transition-colors",
              publishStatus.ready ? "bg-blue-50 border-blue-100" : "bg-builder-surface-2 border-builder-border"
            )}>
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all",
                publishStatus.ready ? "bg-blue-100 text-blue-600" : "bg-builder-border text-builder-text-muted"
              )}>
                {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-[13px] font-semibold text-builder-text-primary">Ready to publish</h4>
                <p className="text-[11px] text-builder-text-secondary">System is healthy — all checks passed</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50/50 border border-green-100 rounded-builder-radius-md p-3.5 flex items-center gap-3">
             <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />
             <div className="text-[12px] text-green-800 leading-tight">
               Your site is optimized and secure. Ready for public traffic.
             </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-builder-surface border-t border-builder-border flex items-center justify-end gap-2.5">
          <Button variant="ghost" className="h-9 px-4 text-xs font-medium text-builder-text-secondary hover:bg-builder-surface-2" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <button 
            disabled={isPublishing}
            onClick={onPublish}
            className="builder-btn-publish py-2 px-5 text-sm flex items-center gap-2 font-bold shadow-md hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                Publish Now
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
