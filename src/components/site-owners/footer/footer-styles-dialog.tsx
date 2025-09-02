"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FooterData } from "@/types/owner-site/components/footer";

interface FooterStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "style-1" | "style-2") => void;
}

export const FooterStylesDialog: React.FC<FooterStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "style-1" | "style-2" | null
  >(null);

  const templates = [
    {
      id: "style-1" as const,
      name: "Footer Style 1",
      data: { style: "style-1" } as FooterData,
      preview: (
        <Image
          src="/images/site-owners/footers/footer1.png"
          alt="Footer Style 1"
          width={800}
          height={200}
          className="rounded-md"
        />
      ),
    },
    {
      id: "style-2" as const,
      name: "Footer Style 2",
      data: { style: "style-2" } as FooterData,
      preview: (
        <Image
          src="/images/site-owners/footers/footer2.png"
          alt="Footer Style 2"
          width={800}
          height={200}
          className="rounded-md"
        />
      ),
    },
  ];

  const handleSelect = (template: {
    id: "style-1" | "style-2";
    data: FooterData;
  }) => {
    setSelectedStyle(template.id);
    setTimeout(() => {
      onStyleSelect(template.id);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Choose a Footer Style</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-2">
          {templates.map(template => (
            <Card
              key={template.id}
              className={`hover: cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                selectedStyle === template.id
                  ? "ring-primary border-primary bg-primary/5 ring-2"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelect(template)}
            >
              <CardContent className="flex flex-col items-center p-4">
                <h3 className="mb-3 text-lg font-medium">{template.name}</h3>
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {template.preview}
                </div>
                {selectedStyle === template.id && (
                  <Badge variant="default" className="mt-2 animate-pulse">
                    Adding...
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
