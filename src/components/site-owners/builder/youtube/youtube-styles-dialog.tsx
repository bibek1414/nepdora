import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface YouTubeStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "grid" | "carousel" | "playlist") => void;
}

export const YouTubeStylesDialog: React.FC<YouTubeStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "grid" | "carousel" | "playlist" | null
  >(null);

  const templates = [
    {
      id: "grid" as const,
      name: "Grid Layout",
      description: "Classic grid view with video thumbnails",
    },
    {
      id: "carousel" as const,
      name: "Carousel Layout",
      description: "Horizontal scrolling video carousel",
    },
    {
      id: "playlist" as const,
      name: "Playlist Layout",
      description: "Featured video with playlist sidebar",
    },
  ];

  const handleSelect = (template: { id: "grid" | "carousel" | "playlist" }) => {
    setSelectedStyle(template.id);
    setTimeout(() => {
      onStyleSelect(template.id);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose a YouTube Video Style
          </DialogTitle>
        </DialogHeader>

        <div className="grid-cols grid gap-6 py-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <div key={template.id} className="flex flex-col items-center">
              <div
                className={`group cursor-pointer border transition-all duration-200 hover:shadow-md ${
                  selectedStyle === template.id
                    ? "border-blue-200 ring-2 ring-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleSelect(template)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ")
                    handleSelect(template);
                }}
              >
                <div className="p-3">
                  <div className="relative w-full">
                    <Image
                      src={`/images/site-owners/youtube/youtube-${template.id}.png`}
                      alt={template.name}
                      width={600}
                      height={400}
                      className="h-auto w-full rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="mt text-xs text-gray-500">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
