"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    },
    {
      id: "style-2" as const,
      name: "Footer Style 2",
      data: { style: "style-2" } as FooterData,
    },
  ];

  const handleSelect = (t: { id: "style-1" | "style-2"; data: FooterData }) => {
    setSelectedStyle(t.id);
    setTimeout(() => {
      onStyleSelect(t.id);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose a Footer Style
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
          {templates.map(t => (
            <div key={t.id} className="flex flex-col items-center">
              <div
                className={`group cursor-pointer border transition-all duration-200 hover:shadow-md ${
                  selectedStyle === t.id
                    ? "border-blue-200 ring-2 ring-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleSelect(t)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(t);
                }}
              >
                <div className="p-3">
                  <div className="relative w-full">
                    <Image
                      src={`/images/site-owners/footers/footer${t.id.split("-")[1]}.png`}
                      alt={t.name}
                      width={800}
                      height={200}
                      className="h-auto w-full rounded"
                    />
                  </div>
                </div>
              </div>

              <h3 className="mt-2 text-center text-sm font-medium text-gray-600">
                {t.name}
              </h3>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
