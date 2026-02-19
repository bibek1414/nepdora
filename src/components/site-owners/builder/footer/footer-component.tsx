"use client";
import React, { useState } from "react";
import { FooterStyle1 } from "./footer-style1";
import { FooterStyle2 } from "./footer-style2";
import { FooterStyle3 } from "./footer-style3";
import { FooterStyle4 } from "./footer-style4";
import { FooterStyle5 } from "./footer-style5";
import { FooterStyle6 } from "./footer-style6";
import { FooterStyle7 } from "./footer-style7";
import { FooterStyle8 } from "./footer-style8";
import { FooterStyle9 } from "./footer-style9";
import { FooterStyle10 } from "./footer-style10";
import { FooterEditorDialog } from "./footer-editor-dialog";
import {
  Footer as FooterType,
  FooterData,
} from "@/types/owner-site/components/footer";
import {
  useUpdateFooterMutation,
  useDeleteFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
} from "lucide-react";

interface FooterProps {
  footer: FooterType;
  isEditable?: boolean;
  siteUser?: string;
  onReplace?: (category: string) => void;
}

const defaultFooterData: FooterData = {
  companyName: "Your Company",
  style: "style-1",
  description:
    "Building amazing experiences for our customers with innovative solutions and exceptional service.",
  sections: [
    {
      id: "1",
      title: "Company",
      links: [
        { id: "1", text: "About Us", href: "#about" },
        { id: "2", text: "Our Team", href: "#team" },
        { id: "3", text: "Careers", href: "#careers" },
        { id: "4", text: "Contact", href: "#contact" },
      ],
    },
    {
      id: "2",
      title: "Services",
      links: [
        { id: "1", text: "Web Design", href: "#web-design" },
        { id: "2", text: "Development", href: "#development" },
        { id: "3", text: "Consulting", href: "#consulting" },
        { id: "4", text: "Support", href: "#support" },
      ],
    },
    {
      id: "3",
      title: "Resources",
      links: [
        { id: "1", text: "Documentation", href: "#docs" },
        { id: "2", text: "Help Center", href: "#help" },
        { id: "3", text: "Privacy Policy", href: "#privacy" },
        { id: "4", text: "Terms of Service", href: "#terms" },
      ],
    },
  ],
  socialLinks: [
    { id: "1", platform: "Facebook", href: "#" },
    { id: "2", platform: "Twitter", href: "#" },
    { id: "3", platform: "Instagram", href: "#" },
    { id: "4", platform: "LinkedIn", href: "#" },
  ],
  contactInfo: {
    email: "hello@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
  logoImage: "",
  logoType: "text",
  logoText: "Your Company",
  newsletter: {
    enabled: true,
    title: "Stay Updated",
    description: "Subscribe to our newsletter for the latest updates and news.",
  },
  copyright: "© 2025 Your Company. All rights reserved.",
};

export function Footer({
  footer,
  isEditable = false,
  siteUser,
  onReplace,
}: FooterProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: updateFooter, isPending: isUpdating } =
    useUpdateFooterMutation();
  const { mutate: deleteFooter, isPending: isDeleting } =
    useDeleteFooterMutation();

  const { data: siteConfig } = useSiteConfig();

  const footerData = React.useMemo(() => {
    const rawData = footer.data || defaultFooterData;

    // Fallback to site config for logo and company name if they are missing in the footer data
    return {
      ...rawData,
      companyName:
        rawData.companyName || siteConfig?.business_name || "Your Company",
      logoImage: rawData.logoImage || siteConfig?.logo || "",
      logoText:
        rawData.logoText ||
        rawData.companyName ||
        siteConfig?.business_name ||
        "",
    };
  }, [footer.data, siteConfig]);

  const handleSaveFooter = (newData: FooterData) => {
    if (!isEditable) return;

    updateFooter({
      id: footer.id,
      data: newData,
    });
    setShowEditor(false);
  };

  const handleConfirmDelete = () => {
    if (!isEditable) return;
    deleteFooter(footer.id);
    setIsDeleteDialogOpen(false);
  };

  const FooterComponent = (() => {
    const style = footerData.style || "style-1";
    switch (style) {
      case "style-2":
        return FooterStyle2;
      case "style-3":
        return FooterStyle3;
      case "style-4":
        return FooterStyle4;
      case "style-5":
        return FooterStyle5;
      case "style-6":
        return FooterStyle6;
      case "style-7":
        return FooterStyle7;
      case "style-8":
        return FooterStyle8;
      case "style-9":
        return FooterStyle9;
      case "style-10":
        return FooterStyle10;
      default:
        return FooterStyle1;
    }
  })();

  const isLoading = isUpdating || isDeleting;

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-20 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowEditor(true)}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Footer
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReplace?.("footer-sections")}
            disabled={isLoading}
            className="w-full justify-start bg-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Replace
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
            className="h-8 w-fit justify-start px-3"
          >
            <Trash2 className="mr-2 h-4 w-4" />{" "}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}

      <FooterComponent
        footerData={footerData}
        isEditable={isEditable}
        onEditClick={() => setShowEditor(true)}
        siteUser={siteUser}
        onUpdate={newData => {
          if (!isEditable) return;
          updateFooter({
            id: footer.id,
            data: { ...footerData, ...newData },
          });
        }}
      />

      {isEditable && (
        <>
          <FooterEditorDialog
            open={showEditor}
            onOpenChange={setShowEditor}
            footerData={footerData}
            onSave={handleSaveFooter}
            isLoading={isLoading}
            footerStyle={
              footerData.style === "style-5" ? "FooterStyle5" : undefined
            }
            siteUser={siteUser}
          />
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" /> Delete Footer
                  Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this footer? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Footer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
