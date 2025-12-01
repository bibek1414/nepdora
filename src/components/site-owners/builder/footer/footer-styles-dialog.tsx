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
  onStyleSelect: (
    style:
      | "style-1"
      | "style-2"
      | "style-3"
      | "style-4"
      | "style-5"
      | "style-6"
      | "style-7"
      | "style-8"
      | "style-9"
  ) => void;
}

export const FooterStylesDialog: React.FC<FooterStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    | "style-1"
    | "style-2"
    | "style-3"
    | "style-4"
    | "style-5"
    | "style-6"
    | "style-7"
    | "style-8"
    | "style-9"
    | null
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
    {
      id: "style-3" as const,
      name: "Footer Style 3",
      data: { style: "style-3" } as FooterData,
    },
    {
      id: "style-4" as const,
      name: "Footer Style 4",
      data: { style: "style-4" } as FooterData,
    },
    {
      id: "style-5" as const,
      name: "Footer Style 5",
      data: { style: "style-5" } as FooterData,
    },
    {
      id: "style-6" as const,
      name: "Footer Style 6",
      data: { style: "style-6" } as FooterData,
    },
    {
      id: "style-7" as const,
      name: "Footer Style 7",
      data: { style: "style-7" } as FooterData,
    },
    {
      id: "style-8" as const,
      name: "Footer Style 8",
      data: { style: "style-8" } as FooterData,
    },
    {
      id: "style-9" as const,
      name: "Footer Style 9",
      data: { style: "style-9" } as FooterData,
    },
  ];

  const handleSelect = (t: {
    id:
      | "style-1"
      | "style-2"
      | "style-3"
      | "style-4"
      | "style-5"
      | "style-6"
      | "style-7"
      | "style-8"
      | "style-9";
    data: FooterData;
  }) => {
    setSelectedStyle(t.id);
    setTimeout(() => {
      onStyleSelect(t.id);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-l bg-white p-2 shadow-xl transition-all duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose a Footer Style
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          {templates.map(t => (
            <div
              key={t.id}
              className="flex flex-col items-center justify-center"
            >
              <div
                className={`group w-full cursor-pointer border transition-all duration-200 hover:shadow-md ${
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
