import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SEOModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
  initialData: {
    meta_title: string;
    meta_description: string;
    slug: string;
  };
  onSave: (data: {
    meta_title: string;
    meta_description: string;
    slug: string;
  }) => void;
}

export const SEOModal: React.FC<SEOModalProps> = ({
  open,
  onOpenChange,
  pageTitle,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const titleLength = (formData.meta_title || "").length;
  const descLength = (formData.meta_description || "").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-builder-radius-lg max-w-[560px] gap-0 overflow-hidden border-0 p-0">
        <div className="bg-white p-5 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-builder-text-primary text-lg font-semibold">
                Page SEO & Metadata
              </DialogTitle>
              <p className="text-builder-text-secondary mt-1 text-xs">
                Editing: {pageTitle} — affects search engine visibility
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-5">
          <div className="space-y-1.5">
            <Label className="text-builder-text-secondary text-xs font-semibold">
              Page title{" "}
              <span className="text-builder-text-muted font-normal">
                (appears in browser tab & search results)
              </span>
            </Label>
            <Input
              value={formData.meta_title || ""}
              onChange={e => handleChange("meta_title", e.target.value)}
              className="border-builder-border-strong focus-visible:ring-builder-accent focus-visible:border-builder-accent bg-builder-surface-2 h-10 text-[13px] focus-visible:ring-1"
              placeholder="e.g. Home | VisionNepal"
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-builder-text-muted">
                Recommended: 50–60 characters
              </span>
              <span
                className={cn(
                  "font-medium",
                  titleLength > 60
                    ? "text-red-500"
                    : titleLength > 50
                      ? "text-amber-500"
                      : "text-builder-text-secondary"
                )}
              >
                {titleLength} / 60
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-builder-text-secondary text-xs font-semibold">
              Meta description{" "}
              <span className="text-builder-text-muted font-normal">
                (shown in Google results)
              </span>
            </Label>
            <Textarea
              value={formData.meta_description || ""}
              onChange={e => handleChange("meta_description", e.target.value)}
              className="border-builder-border-strong focus-visible:ring-builder-accent focus-visible:border-builder-accent bg-builder-surface-2 h-24 resize-none text-[13px] focus-visible:ring-1"
              placeholder="A brief description of your page for search engines..."
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-builder-text-muted">
                Recommended: 120–160 characters
              </span>
              <span
                className={cn(
                  "font-medium",
                  descLength > 160
                    ? "text-red-500"
                    : descLength > 120
                      ? "text-amber-500"
                      : "text-builder-text-secondary"
                )}
              >
                {descLength} / 160
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-builder-text-secondary text-xs font-semibold">
              URL slug
            </Label>
            <Input
              value={formData.slug}
              onChange={e => handleChange("slug", e.target.value)}
              className="border-builder-border-strong focus-visible:ring-builder-accent focus-visible:border-builder-accent bg-builder-surface-2 h-10 font-mono text-xs focus-visible:ring-1"
              placeholder="e.g. /about"
              disabled
            />
          </div>
        </div>

        <DialogFooter className="bg-builder-surface border-builder-border flex items-center justify-between gap-0 border-t p-5 pt-3">
          <div className="text-builder-text-muted flex items-center gap-1.5 text-xs">
            <Info className="h-3.5 w-3.5" />
            <span>Changes save when you publish</span>
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="ghost"
              className="text-builder-text-secondary hover:bg-builder-surface-2 h-9 px-4 text-xs font-medium"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <button
              onClick={handleSave}
              className="builder-btn-publish group flex items-center gap-2 py-1 text-sm transition-all"
            >
              <Check className="h-4 w-4 transition-transform group-hover:scale-110" />
              Save changes
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
