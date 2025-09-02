import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Rss } from "lucide-react";
import Image from "next/image";

interface BlogStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "grid-1" | "grid-2" | "list-1") => void;
}

export const BlogStylesDialog: React.FC<BlogStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "grid-1" | "grid-2" | "list-1" | null
  >(null);

  const styles = [
    {
      id: "grid-1" as const,
      name: "Grid Style 1",
      description: "Classic grid layout for blog posts.",
      preview: (
        <Image
          src="/images/site-owners/blogs/blog1.png" // Assuming you'll create these preview images
          alt="Blog grid 1"
          width={120}
          height={120}
        />
      ),
    },
    {
      id: "grid-2" as const,
      name: "Grid Style 2",
      description: "Modern grid layout with featured image.",
      preview: (
        <Image
          src="/images/site-owners/blogs/blog2.png"
          alt="Blog grid 2"
          width={120}
          height={120}
        />
      ),
    },
    {
      id: "list-1" as const,
      name: "List Style",
      description: "Compact list layout for blog posts.",
      preview: (
        <Image
          src="/images/site-owners/blogs/blog3.png"
          alt="Blog list"
          width={120}
          height={120}
        />
      ),
    },
  ];

  const handleStyleClick = (styleId: "grid-1" | "grid-2" | "list-1") => {
    setSelectedStyle(styleId);
    setTimeout(() => {
      onStyleSelect(styleId);
      setSelectedStyle(null);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            Choose Blog Section Style
          </DialogTitle>
          <DialogDescription>
            Click on a style to add it to your page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-2">
          {styles.map(style => (
            <Card
              key={style.id}
              className={`hover: cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                selectedStyle === style.id
                  ? "ring-primary border-primary bg-primary/5 ring-2"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleStyleClick(style.id)}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-foreground text-lg font-semibold">
                      {style.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {style.description}
                    </p>
                  </div>
                  {selectedStyle === style.id && (
                    <Badge variant="default" className="ml-2 animate-pulse">
                      Adding...
                    </Badge>
                  )}
                </div>

                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  {style.preview}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                <div className="text-muted-foreground mt-3 text-center text-xs font-medium">
                  {selectedStyle === style.id
                    ? "Adding to your page..."
                    : "Click to add this style"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
