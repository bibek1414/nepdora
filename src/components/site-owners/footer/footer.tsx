"use client";
import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FooterStyle1 } from "./footer-style1";
import { FooterStyle2 } from "./footer-style2";
import { FooterEditorDialog } from "./footer-editor-dialog";
import {
  FooterData,
  Footer as FooterType,
} from "@/types/owner-site/components/footer";
import {
  useUpdateFooterMutation,
  useCreateFooterMutation,
  useFooterQuery,
} from "@/hooks/owner-site/components/footer";

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
    { id: "1", platform: "Facebook", href: "#", icon: Facebook },
    { id: "2", platform: "Twitter", href: "#", icon: Twitter },
    { id: "3", platform: "Instagram", href: "#", icon: Instagram },
    { id: "4", platform: "LinkedIn", href: "#", icon: Linkedin },
  ],
  contactInfo: {
    email: "hello@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
  },
  newsletter: {
    enabled: true,
    title: "Stay Updated",
    description: "Subscribe to our newsletter for the latest updates and news.",
  },
  copyright: "© 2025 Your Company. All rights reserved.",
};

interface FooterProps {
  footerData?: FooterData;
  style?: string;
  isEditable?: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate?: (componentId: string, data: any) => void;
  componentId?: string;
  footerId?: string;
}

export function Footer({
  footerData = defaultFooterData,
  style = "style-1",
  isEditable = false,
  onUpdate,
  componentId = "footer",
  footerId,
}: FooterProps) {
  const [currentFooterData, setCurrentFooterData] = useState(footerData);
  const [showEditor, setShowEditor] = useState(false);
  const [existingFooterId, setExistingFooterId] = useState<string | null>(
    footerId || null
  );

  const updateFooterMutation = useUpdateFooterMutation();
  const createFooterMutation = useCreateFooterMutation();
  const { data: existingFooter } = useFooterQuery();

  // Update local state when footerData prop changes
  useEffect(() => {
    setCurrentFooterData(footerData);
  }, [footerData]);

  // Set existing footer ID from query if available
  useEffect(() => {
    if (existingFooter?.data?.id && !existingFooterId) {
      setExistingFooterId(existingFooter.data.id);
    }
  }, [existingFooter, existingFooterId]);

  const handleSaveFooter = async (newData: FooterData) => {
    try {
      console.log("Saving footer data:", newData);
      console.log("Existing Footer ID:", existingFooterId);
      console.log("Passed Footer ID:", footerId);
      console.log("Component ID:", componentId);

      // Determine if we should update or create
      const shouldUpdate =
        existingFooterId || footerId || existingFooter?.data?.id;
      const footerIdToUse =
        existingFooterId || footerId || existingFooter?.data?.id;

      if (shouldUpdate && footerIdToUse) {
        // Update existing footer
        console.log("Updating existing footer with ID:", footerIdToUse);
        const updateData = {
          id: footerIdToUse,
          footerData: newData, // Changed from 'data' to 'footerData' to match your API type
        };

        const result = await updateFooterMutation.mutateAsync(updateData);
        console.log("Update result:", result);

        // Update local state with the returned data
        if (result?.data?.data) {
          setCurrentFooterData(result.data.data);
        }
      } else {
        // Create new footer
        console.log("Creating new footer...");
        const createData = {
          component_id: componentId,
          content: "", // Add empty content if required by API
          footerData: newData,
        };

        const result = await createFooterMutation.mutateAsync(createData);
        console.log("Create result:", result);

        // Update local state and store the new footer ID
        if (result?.data) {
          setCurrentFooterData(result.data.data);
          setExistingFooterId(result.data.id);
        }
      }

      // Call parent update if provided
      onUpdate?.(componentId, { footerData: newData });

      // Close dialog
      setShowEditor(false);
    } catch (error) {
      console.error("Failed to save footer:", error);
      // You might want to show an error toast here
    }
  };

  const handleEditClick = () => {
    setShowEditor(true);
  };

  const FooterComponent = style === "style-2" ? FooterStyle2 : FooterStyle1;

  const isLoading =
    updateFooterMutation.isPending || createFooterMutation.isPending;

  return (
    <>
      <FooterComponent
        footerData={currentFooterData}
        isEditable={isEditable}
        onEditClick={handleEditClick}
      />
      {isEditable && (
        <FooterEditorDialog
          open={showEditor}
          onOpenChange={setShowEditor}
          footerData={currentFooterData}
          onSave={handleSaveFooter}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
