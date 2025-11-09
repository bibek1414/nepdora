"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Shield, Truck, Scale } from "lucide-react";

interface PoliciesStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (
    template: "return-exchange" | "shipping" | "privacy" | "terms"
  ) => void;
}

export const PoliciesStylesDialog: React.FC<PoliciesStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "return-exchange" | "shipping" | "privacy" | "terms" | null
  >(null);

  const templates = [
    {
      id: "return-exchange" as const,
      name: "Return & Exchange Policy",
      description:
        "Pre-filled policy for returns, exchanges, refunds, and eligibility",
      icon: Truck,
      color: "bg-blue-500",
    },
    {
      id: "shipping" as const,
      name: "Shipping Policy",
      description:
        "Shipping methods, costs, delivery times, and international shipping",
      icon: Truck,
      color: "bg-green-500",
    },
    {
      id: "privacy" as const,
      name: "Privacy Policy",
      description: "Data collection, usage, sharing, cookies, and user rights",
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      id: "terms" as const,
      name: "Terms & Conditions",
      description:
        "Terms of use, intellectual property, liability, and legal agreements",
      icon: Scale,
      color: "bg-orange-500",
    },
  ];

  const handleSelect = (template: {
    id: "return-exchange" | "shipping" | "privacy" | "terms";
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
      <DialogContent className="fixed right-0 !left-auto h-full w-full max-w-2xl transform overflow-y-auto rounded-none border-r bg-white p-6 shadow-xl transition-all duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Policy Template
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Select a pre-filled policy template. All content is fully editable
            with rich text formatting.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {templates.map(template => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className={`group cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                  selectedStyle === template.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSelect(template)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ")
                    handleSelect(template);
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${template.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <FileText className="h-3 w-3" />
                      <span>Fully customizable with rich text editor</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-semibold text-blue-900">
                Customize Your Policies
              </h4>
              <p className="text-xs text-blue-700">
                Each template comes with comprehensive, legally-aware content
                that you can edit to match your business needs. Use the rich
                text editor to format text, add links, create lists, and more.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
