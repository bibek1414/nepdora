import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Check,
  ArrowRight,
  Loader2,
  Globe,
  ShieldCheck,
  Layout,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: () => void;
  isPublishing: boolean;
  previewUrl: string;
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
  previewUrl,
  publishStatus,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-builder-radius-lg max-w-[440px] overflow-hidden border-0 bg-white p-0 shadow-2xl outline-none">
        {/* Header */}
        <div className="bg-white p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-builder-text-primary text-lg font-bold">
                Publish to live site
              </DialogTitle>
              <p className="text-builder-text-secondary mt-1 text-[13px]">
                Your changes will go live at <strong>yourdomain.com</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Changes Detected Banner */}
        <div className="border-y border-blue-100/50 bg-blue-50/50 px-6 py-4">
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                <p className="text-builder-text-primary text-[13px] leading-tight font-bold">
                  Changes detected
                </p>
                <p className="text-builder-text-secondary mt-0.5 text-[11px]">
                  Last edited just now
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                1 Page
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                Content
              </span>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2.5">
            <div
              className={cn(
                "rounded-builder-radius-md flex items-start gap-3 border p-3.5 transition-all duration-200",
                publishStatus.reviewed
                  ? "border-green-100 bg-green-50/50"
                  : "border-builder-border bg-builder-surface-2"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  publishStatus.reviewed
                    ? "bg-green-100 text-green-600"
                    : "bg-builder-border text-builder-text-muted"
                )}
              >
                {publishStatus.reviewed ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-builder-text-primary text-[13px] font-bold">
                  Changes reviewed
                </h4>
                <p className="text-builder-text-secondary text-[11px] leading-normal">
                  Updates analyzed and optimized for performance.
                </p>
              </div>
            </div>

            <div
              className={cn(
                "rounded-builder-radius-md flex items-start gap-3 border p-3.5 transition-all duration-200",
                publishStatus.seoSet
                  ? "border-green-100 bg-green-50/50"
                  : "border-builder-border bg-builder-surface-2"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  publishStatus.seoSet
                    ? "bg-green-100 text-green-600"
                    : "bg-builder-border text-builder-text-muted"
                )}
              >
                {publishStatus.seoSet ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-builder-text-primary text-[13px] font-bold">
                  SEO metadata set
                </h4>
                <p className="text-builder-text-secondary text-[11px] leading-normal">
                  Title, description and meta tags are configured correctly.
                </p>
              </div>
            </div>

            <div
              className={cn(
                "rounded-builder-radius-md flex items-start gap-3 border p-3.5 transition-all duration-200",
                publishStatus.ready
                  ? "border-blue-100 bg-blue-50/50"
                  : "border-builder-border bg-builder-surface-2"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all transition-colors",
                  publishStatus.ready
                    ? "bg-blue-100 text-blue-600"
                    : "bg-builder-border text-builder-text-muted"
                )}
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-builder-text-primary text-[13px] font-bold">
                  Ready to publish
                </h4>
                <p className="text-builder-text-secondary text-[11px] leading-normal">
                  System health check passed. Ready for deployment.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-builder-radius-md flex items-center gap-3 border border-green-100 bg-green-50/30 p-3.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-green-500" />
            <div className="text-[12px] leading-tight text-green-800">
              Your site is optimized and secure. Ready for public traffic.
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-builder-border bg-builder-surface-2/50 flex items-center justify-between border-t px-6 py-4">
          <Button
            variant="ghost"
            className="text-builder-text-secondary hover:text-builder-text-primary h-10 px-4 text-xs font-bold hover:bg-white"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-10 border-blue-200 bg-white px-5 text-[13px] font-bold text-blue-600 shadow-sm hover:bg-blue-50"
              onClick={() => {
                onOpenChange(false);
                window.open(previewUrl, "_blank");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Button>
            <button
              disabled={isPublishing}
              onClick={onPublish}
              className="builder-btn-publish flex h-10 items-center gap-2 px-6 text-[13px] font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
