import React from "react";
import { EditableLink } from "@/components/ui/editable-link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerItemControlsProps {
  link: string;
  onLinkUpdate: (text: string, href: string) => void;
  onRemove: () => void;
  isEditable?: boolean;
  siteUser?: string;
  className?: string;
}

export const BannerItemControls: React.FC<BannerItemControlsProps> = ({
  link,
  onLinkUpdate,
  onRemove,
  isEditable = false,
  siteUser,
  className,
}) => {
  if (!isEditable) return null;

  return (
    <div className={cn("absolute top-2 left-2 z-30 flex gap-2", className)}>
      <EditableLink
        text="Edit Link"
        href={link || ""}
        onChange={onLinkUpdate}
        isEditable={isEditable}
        siteUser={siteUser}
        className="rounded bg-white px-2 py-1.5 text-xs font-medium text-black shadow-md ring-1 ring-black/10 hover:bg-white! sm:px-3 sm:py-2"
        dropdownPosition="bottom"
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="h-7 w-7 bg-white p-0 text-black shadow-md ring-1 ring-black/10 hover:bg-gray-100 sm:h-9 sm:w-9"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};
