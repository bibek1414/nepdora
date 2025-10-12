import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { pageTemplates } from "@/lib/page-templates";
import { PageTemplate } from "@/types/owner-site/components/page-template";

interface PageTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PageTemplate) => void;
}

export const PageTemplateDialog: React.FC<PageTemplateDialogProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(
    null
  );

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Make the entire dialog height limited and inner content scrollable */}
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-l bg-white p-2 shadow-xl transition-all duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
        {/* 🔹 Sticky header */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <DialogHeader>
            <DialogTitle>Choose a Page Template</DialogTitle>
            <DialogDescription>
              Select a template to quickly create a page with pre-configured
              components
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 🔹 Scrollable middle section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-6">
            {pageTemplates.map(template => {
              const Icon = template.icon;
              const isSelected = selectedTemplate?.id === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {template.name}
                    </h3>
                  </div>

                  <p className="mb-3 text-sm text-gray-600">
                    {template.description}
                  </p>

                  <div className="text-xs text-gray-500">
                    Components:{" "}
                    {template.components.map(c => c.type).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔹 Sticky footer */}
        <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t bg-white px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedTemplate}>
            Create Page with Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
