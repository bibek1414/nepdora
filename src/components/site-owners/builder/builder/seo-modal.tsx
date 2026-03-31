import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SEOModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageTitle: string;
  initialData: {
    title: string;
    description: string;
    slug: string;
    isIndexed: boolean;
  };
  onSave: (data: { title: string; description: string; slug: string; isIndexed: boolean }) => void;
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const titleLength = formData.title.length;
  const descLength = formData.description.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0 border-0 rounded-builder-radius-lg overflow-hidden gap-0">
        <div className="p-5 pb-0 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-builder-text-primary">Page SEO & Metadata</DialogTitle>
              <p className="text-xs text-builder-text-secondary mt-1">Editing: {pageTitle} — affects search engine visibility</p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-sm hover:bg-builder-surface-2 text-builder-text-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4 bg-white">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-builder-text-secondary">
              Page title <span className="text-builder-text-muted font-normal">(appears in browser tab & search results)</span>
            </Label>
            <Input 
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="h-10 text-[13px] border-builder-border-strong focus-visible:ring-1 focus-visible:ring-builder-accent focus-visible:border-builder-accent bg-builder-surface-2"
              placeholder="e.g. Home | VisionNepal"
            />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-builder-text-muted">Recommended: 50–60 characters</span>
              <span className={cn(
                "font-medium",
                titleLength > 60 ? "text-red-500" : titleLength > 50 ? "text-amber-500" : "text-builder-text-secondary"
              )}>{titleLength} / 60</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-builder-text-secondary">
              Meta description <span className="text-builder-text-muted font-normal">(shown in Google results)</span>
            </Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="h-24 resize-none text-[13px] border-builder-border-strong focus-visible:ring-1 focus-visible:ring-builder-accent focus-visible:border-builder-accent bg-builder-surface-2"
              placeholder="A brief description of your page for search engines..."
            />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-builder-text-muted">Recommended: 120–160 characters</span>
              <span className={cn(
                "font-medium",
                descLength > 160 ? "text-red-500" : descLength > 120 ? "text-amber-500" : "text-builder-text-secondary"
              )}>{descLength} / 160</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-builder-text-secondary">URL slug</Label>
              <Input 
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="h-10 font-mono text-xs border-builder-border-strong focus-visible:ring-1 focus-visible:ring-builder-accent focus-visible:border-builder-accent bg-builder-surface-2"
                placeholder="e.g. /about"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-builder-text-secondary">Search indexing</Label>
              <Select 
                value={formData.isIndexed ? "index" : "no-index"}
                onValueChange={(val) => handleChange("isIndexed", val === "index")}
              >
                <SelectTrigger className="h-10 text-[13px] border-builder-border-strong focus:ring-1 focus:ring-builder-accent bg-builder-surface-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index">Index this page</SelectItem>
                  <SelectItem value="no-index">No-index (private)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="p-5 pt-3 bg-builder-surface border-t border-builder-border flex items-center justify-between gap-0">
          <div className="flex items-center gap-1.5 text-xs text-builder-text-muted">
            <Info className="h-3.5 w-3.5" />
            <span>Changes save when you publish</span>
          </div>
          <div className="flex gap-2.5">
            <Button variant="ghost" className="h-9 px-4 text-xs font-medium text-builder-text-secondary hover:bg-builder-surface-2" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <button 
              onClick={handleSave}
              className="builder-btn-publish py-1 text-sm flex items-center gap-2 group transition-all"
            >
              <Check className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Save changes
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
