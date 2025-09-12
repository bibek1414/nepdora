"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { NavbarData } from "@/types/owner-site/components/navbar";

interface NavbarTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: NavbarData) => void;
}

export const NavbarTemplateDialog: React.FC<NavbarTemplateDialogProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "style-1" | "style-2" | "style-3" | "style-4" | null
  >(null);

  const templates = [
    {
      id: "style-1" as const,
      name: "Navbar Style 1",
      data: {
        style: "style-1",
        logoText: "Brand",
        logoType: "text",
        showCart: true,
        links: [
          { id: "1", text: "Home", href: "#" },
          { id: "2", text: "Features", href: "#" },
          { id: "3", text: "Pricing", href: "#" },
        ],
        buttons: [
          { id: "1", text: "Get Started", variant: "primary", href: "#" },
        ],
      } as NavbarData,
    },
    {
      id: "style-2" as const,
      name: "Navbar Centerd Logo",
      data: {
        style: "style-2",
        logoText: "Centered",
        logoType: "text",
        showCart: true,
        links: [
          { id: "1", text: "Home", href: "#" },
          { id: "2", text: "About", href: "#" },
          { id: "3", text: "Services", href: "#" },
          { id: "4", text: "Contact", href: "#" },
        ],
        buttons: [{ id: "1", text: "Book Now", variant: "primary", href: "#" }],
      } as NavbarData,
    },
    {
      id: "style-3" as const,
      name: "Navbar with Search ",
      data: {
        style: "style-3",
        logoText: "Centered",
        logoType: "text",
        showCart: true,
        links: [
          { id: "1", text: "Home", href: "#" },
          { id: "2", text: "About", href: "#" },
          { id: "3", text: "Services", href: "#" },
          { id: "4", text: "Contact", href: "#" },
        ],
        buttons: [{ id: "1", text: "Book Now", variant: "primary", href: "#" }],
      } as NavbarData,
    },
    {
      id: "style-4" as const,
      name: "Navbar with Categories",
      data: {
        style: "style-4",
        logoText: "Store",
        logoType: "text",
        showCart: true,
        links: [
          { id: "1", text: "Home", href: "#" },
          { id: "2", text: "About", href: "#" },
          { id: "3", text: "Contact", href: "#" },
        ],
        buttons: [{ id: "1", text: "Shop Now", variant: "primary", href: "#" }],
      } as NavbarData,
    },
  ];

  const handleSelect = (template: {
    id: "style-1" | "style-2" | "style-3" | "style-4";
    data: NavbarData;
  }) => {
    setSelectedStyle(template.id);
    setTimeout(() => {
      onSelectTemplate(template.data);
      setSelectedStyle(null);
      onClose();
    }, 150);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose a Navbar Style
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4 md:grid-cols-3 lg:grid-cols-2">
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
                      src={`/images/site-owners/navbars/navbar${
                        template.id.split("-")[1]
                      }.png`}
                      alt={template.name}
                      width={600}
                      height={400}
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
