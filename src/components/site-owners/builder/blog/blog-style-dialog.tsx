import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface BlogStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    style:
      | "blog-1"
      | "blog-2"
      | "blog-3"
      | "blog-4"
      | "blog-5"
      | "blog-6"
      | "blog-7"
  ) => void;
}

export const BlogStylesDialog: React.FC<BlogStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    | "blog-1"
    | "blog-2"
    | "blog-3"
    | "blog-4"
    | "blog-5"
    | "blog-6"
    | "blog-7"
    | null
  >(null);

  const templates = [
    {
      id: "blog-1" as const,
      name: "Blog Style 1",
    },
    {
      id: "blog-2" as const,
      name: "Blog Style 2",
    },
    {
      id: "blog-3" as const,
      name: "Blog Style 3",
    },
    {
      id: "blog-4" as const,
      name: "Blog Style 4",
    },
    {
      id: "blog-5" as const,
      name: "Blog Style 5",
    },
    {
      id: "blog-6" as const,
      name: "Blog Style 6",
    },
    {
      id: "blog-7" as const,
      name: "Blog Style 7",
    },
  ];

  const handleSelect = (template: {
    id:
      | "blog-1"
      | "blog-2"
      | "blog-3"
      | "blog-4"
      | "blog-5"
      | "blog-6"
      | "blog-7";
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
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-l bg-white p-6 shadow-xl transition-all duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Blog Section Style
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
                      src={`/images/site-owners/blogs/blog${
                        template.id.split("-")[1]
                      }.png`}
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
