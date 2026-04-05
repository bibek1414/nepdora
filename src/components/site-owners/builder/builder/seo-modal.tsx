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
      <DialogContent className="max-w-[560px] gap-0 overflow-hidden rounded-xl border-0 p-0">
        <div className="bg-white p-5 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Page SEO & Metadata
              </DialogTitle>
              <p className="mt-1 text-xs text-slate-600">
                Editing: {pageTitle} - affects search engine visibility
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              Page title{" "}
              <span className="font-normal text-slate-400">
                (appears in browser tab & search results)
              </span>
            </Label>
            <Input
              value={formData.meta_title || ""}
              onChange={e => handleChange("meta_title", e.target.value)}
              className="h-10 border-slate-300 bg-slate-50 text-[13px] focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600"
              placeholder="e.g. Home | VisionNepal"
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Recommended: 50–60 characters
              </span>
              <span
                className={cn(
                  "font-medium",
                  titleLength > 60
                    ? "text-red-500"
                    : titleLength > 50
                      ? "text-amber-500"
                      : "text-slate-600"
                )}
              >
                {titleLength} / 60
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              Meta description{" "}
              <span className="font-normal text-slate-400">
                (shown in Google results)
              </span>
            </Label>
            <Textarea
              value={formData.meta_description || ""}
              onChange={e => handleChange("meta_description", e.target.value)}
              className="h-24 resize-none border-slate-300 bg-slate-50 text-[13px] focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600"
              placeholder="A brief description of your page for search engines..."
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Recommended: 120–160 characters
              </span>
              <span
                className={cn(
                  "font-medium",
                  descLength > 160
                    ? "text-red-500"
                    : descLength > 120
                      ? "text-amber-500"
                      : "text-slate-600"
                )}
              >
                {descLength} / 160
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              URL slug
            </Label>
            <Input
              value={formData.slug}
              onChange={e => handleChange("slug", e.target.value)}
              className="h-10 border-slate-300 bg-slate-50 font-mono text-xs focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600"
              placeholder="e.g. /about"
              disabled
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-0 border-t border-slate-200 bg-white p-5 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5" />
            <span>Changes save when you publish</span>
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="ghost"
              className="h-9 px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <button
              onClick={handleSave}
              className="group flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1 text-sm font-bold text-white transition-all hover:bg-blue-700"
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
