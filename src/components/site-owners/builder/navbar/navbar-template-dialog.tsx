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
      preview: (
        <Image
          src="/images/site-owners/navbars/navbar1.png"
          alt="Navbar Style 1"
          width={800}
          height={120}
          className="rounded-md"
        />
      ),
    },
    {
      id: "style-2" as const,
      name: "Navbar Style 2",
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
      preview: (
        <Image
          src="/images/site-owners/navbars/navbar2.png"
          alt="Navbar Style 2"
          width={800}
          height={120}
          className="rounded-md"
        />
      ),
    },
    {
      id: "style-3" as const,
      name: "Navbar Style 3",
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
      preview: (
        <Image
          src="/images/site-owners/navbars/navbar2.png"
          alt="Navbar Style 3"
          width={800}
          height={120}
          className="rounded-md"
        />
      ),
    },
    {
      id: "style-4" as const,
      name: "Navbar with Categories",
      description: "Navbar with category dropdown and subcategories",
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
      preview: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="mb-2 text-sm font-semibold text-gray-700">
              Categories Dropdown
            </div>
            <div className="text-xs text-gray-500">
              With subcategories on hover
            </div>
          </div>
        </div>
      ),
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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Choose a Navbar Style</DialogTitle>
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
                <h3 className="mb-2 text-lg font-medium">{template.name}</h3>
                {template.id === "style-4" && (
                  <p className="mb-3 text-center text-xs text-gray-600">
                    Dynamic categories from your store
                  </p>
                )}
                <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
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
