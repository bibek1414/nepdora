import React from "react";
import { Info, Edit3, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetaBarProps {
  title: string;
  description: string;
  slug: string;
  isIndexed: boolean;
  onEdit: () => void;
}

export const MetaBar: React.FC<MetaBarProps> = ({
  title,
  description,
  slug,
  isIndexed,
  onEdit,
}) => {
  return (
    <div className="builder-meta-bar">
      <div className="builder-meta-field" onClick={onEdit}>
        <label>Page title</label>
        <span title={title}>{title || <em className="text-builder-text-muted italic">No title set</em>}</span>
      </div>
      <div className="builder-meta-field" onClick={onEdit}>
        <label>Description</label>
        <span title={description}>{description || <em className="text-builder-text-muted italic">No description set</em>}</span>
      </div>
      <div className="builder-meta-field" onClick={onEdit}>
        <label>Slug</label>
        <span className="font-mono text-[11px] text-builder-text-secondary">{slug}</span>
      </div>
      <div className="builder-meta-field" onClick={onEdit}>
        <label>Index</label>
        <div className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
          isIndexed 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-amber-50 text-amber-700 border border-amber-200"
        )}>
          <div className={cn("h-1 w-1 rounded-full", isIndexed ? "bg-green-500" : "bg-amber-500")} />
          {isIndexed ? "Indexed" : "No-index"}
        </div>
      </div>
      <div className="ml-auto flex items-center pr-2">
        <button 
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium text-builder-accent hover:bg-builder-accent-subtle transition-colors"
        >
          <Edit3 className="h-3 w-3" />
          Edit SEO
        </button>
      </div>
    </div>
  );
};
