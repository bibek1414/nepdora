"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarStyle1 } from "./styles/navbar-style-1";
import { NavbarStyle2 } from "./styles/navbar-style-2";

// Define the default data for each template
const templates: { name: string; description: string; data: NavbarData }[] = [
  {
    name: "Style 1 - Default",
    description:
      "Logo on the left, links and buttons on the right. Classic and effective.",
    data: {
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
      style: "style-1",
    },
  },
  {
    name: "Style 2 - Centered",
    description:
      "A modern look with a centered logo and navigation spreading outwards.",
    data: {
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
      style: "style-2",
    },
  },
];

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Choose a Navbar Style</DialogTitle>
          <DialogDescription>
            Select a starting template for your site&apos;s navigation. You can
            customize it fully afterward, including adding logo images and
            configuring the cart.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto p-1">
          {templates.map(template => (
            <div
              key={template.data.style}
              className="hover:border-primary cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              onClick={() => onSelectTemplate(template.data)}
            >
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {template.description}
              </p>

              {/* Live Preview */}
              <div className="pointer-events-none scale-95 transform rounded-md border bg-white shadow-sm">
                {template.data.style === "style-1" && (
                  <NavbarStyle1 navbarData={template.data} />
                )}
                {template.data.style === "style-2" && (
                  <NavbarStyle2 navbarData={template.data} />
                )}
              </div>

              <div className="mt-4 text-center">
                <span className="text-muted-foreground text-sm">
                  Click to select this template
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
