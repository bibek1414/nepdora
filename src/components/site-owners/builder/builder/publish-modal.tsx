import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Globe, Layout } from "lucide-react";
import { usePublishSite } from "@/hooks/owner-site/components/use-publish";

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onUndo: () => void;
  domainName: string;
  pageCount: number;
  componentCount: number;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  domainName,
  pageCount,
  componentCount,
}) => {
  const { mutate: publish, isPending: isPublishing } = usePublishSite();

  const handlePublish = () => {
    publish(undefined, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-builder-radius-lg max-w-[440px] overflow-hidden border-0 bg-white p-0 shadow-2xl outline-none">
        {/* Header */}
        <div className="bg-white p-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-builder-text-primary text-xl font-bold">
                Publish changes to live site
              </DialogTitle>
              <div className="text-builder-text-secondary mt-2 flex items-center gap-1.5 text-[13px]">
                <Globe className="h-3.5 w-3.5 text-blue-600" />
                <span>
                  Your site will be live at{" "}
                  <strong className="font-bold text-blue-700">
                    {domainName || "your live site"}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Changes Detected Banner */}
        <div className="border-y border-blue-100/30 bg-blue-50/20 px-6 py-4">
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-3.5 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                <p className="text-builder-text-primary text-[13px] leading-tight font-bold">
                  Site updates detected
                </p>
                <p className="text-builder-text-secondary mt-0.5 text-[11px]">
                  All changes are ready to be published.
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                {pageCount} Page{pageCount !== 1 ? "s" : ""}
              </span>
              <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                {componentCount} Sections
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-builder-surface-2/50 flex flex-row items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button
            variant="ghost"
            className="text-builder-text-secondary hover:text-builder-text-primary h-10 px-4 text-xs font-bold transition-all hover:bg-white"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <button
            disabled={isPublishing}
            onClick={handlePublish}
            className="builder-btn-publish flex h-10 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
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
