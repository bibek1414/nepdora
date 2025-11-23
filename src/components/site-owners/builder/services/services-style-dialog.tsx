import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ServicesStyleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    style:
      | "services-1"
      | "services-2"
      | "services-3"
      | "services-4"
      | "services-5"
  ) => void;
}

type ServicesTemplateId =
  | "services-1"
  | "services-2"
  | "services-3"
  | "services-4"
  | "services-5";

export const ServicesStyleDialog: React.FC<ServicesStyleDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<ServicesTemplateId | null>(
    null
  );

  const templates: Array<{ id: ServicesTemplateId; name: string }> = [
    {
      id: "services-1",
      name: "Grid Style 1",
    },
    {
      id: "services-2",
      name: "Grid Style 2",
    },
    {
      id: "services-3",
      name: "List Style",
    },
    {
      id: "services-4",
      name: "Grid Style 4",
    },
    {
      id: "services-5",
      name: "Modern Cards",
    },
  ];

  const handleSelect = (template: { id: ServicesTemplateId }) => {
    setSelectedStyle(template.id);
    setTimeout(() => {
      onStyleSelect(template.id);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-l bg-white p-6 shadow-xl transition-all duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Services Section Style
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="flex flex-col items-center justify-center"
            >
              <div
                className={`group w-full cursor-pointer border transition-all duration-200 hover:shadow-md ${
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
                      src={`/images/site-owners/services/${template.id}.png`}
                      alt={template.name}
                      width={400}
                      height={300}
                      className="h-auto w-full rounded"
                    />
                  </div>
                </div>
              </div>

              <h3 className="mt-2 text-center text-sm font-medium text-gray-600">
                {template.name}
              </h3>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
