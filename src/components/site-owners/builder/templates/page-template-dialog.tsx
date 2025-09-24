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
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Page Template</DialogTitle>
          <DialogDescription>
            Select a template to quickly create a page with pre-configured
            components
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pageTemplates.map(template => {
            const Icon = template.icon;
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
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
                  Components: {template.components.map(c => c.type).join(", ")}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
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
