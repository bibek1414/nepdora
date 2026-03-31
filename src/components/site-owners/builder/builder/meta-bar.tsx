import React from "react";
import { Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/site-owners/button";

interface MetaBarProps {
  meta_title: string;
  meta_description: string;
  slug: string;
  onEdit: () => void;
}

const MetaItem = ({
  label,
  value,
  className,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group flex cursor-pointer items-center gap-2 px-4 py-1.5 transition-colors hover:bg-gray-50",
      className
    )}
  >
    <span className="text-[10px] font-medium tracking-wide text-gray-400">
      {label}
    </span>
    <div className="max-w-[180px] truncate text-[12px] font-medium text-gray-700 group-hover:text-gray-900">
      {value || <em className="font-normal text-gray-400 italic">Not set</em>}
    </div>
  </div>
);

export const MetaBar: React.FC<MetaBarProps> = ({
  meta_title,
  meta_description,
  slug,
  onEdit,
}) => {
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-11 items-center px-4">
        <MetaItem
          label="Title"
          value={meta_title}
          onClick={onEdit}
          className="border-r border-gray-100 pl-0"
        />

        <MetaItem
          label="Description"
          value={meta_description}
          onClick={onEdit}
          className="border-r border-gray-100"
        />

        <MetaItem
          label="Slug"
          value={
            <span className="font-mono text-[11px] text-gray-500">/{slug}</span>
          }
          onClick={onEdit}
          className="border-r border-gray-100"
        />

        {/* Right Side */}
        <div className="ml-auto">
          <Button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition hover:bg-blue-50"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit SEO
          </Button>
        </div>
      </div>
    </div>
  );
};
