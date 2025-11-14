"use client";
import React, { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { FooterStyle1 } from "./footer-style1";
import { FooterStyle2 } from "./footer-style2";
import { FooterStyle3 } from "./footer-style3";
import { FooterStyle4 } from "./footer-style4";
import { FooterStyle5 } from "./footer-style5";
import { FooterStyle6 } from "./footer-style6";
import { FooterEditorDialog } from "./footer-editor-dialog";
import {
  FooterData,
  Footer as FooterType,
} from "@/types/owner-site/components/footer";
import {
  useUpdateFooterMutation,
  useCreateFooterMutation,
  useFooterQuery,
  useDeleteFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";

// Social platform mapping with icons
const socialPlatforms = [
  {
    name: "Facebook",
    icon: Facebook,
    field: "facebook_url" as const,
  },
  {
    name: "Twitter",
    icon: Twitter,
    field: "twitter_url" as const,
  },
  {
    name: "Instagram",
    icon: Instagram,
    field: "instagram_url" as const,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    field: "linkedin_url" as const,
  },
  {
    name: "YouTube",
    icon: Youtube,
    field: "youtube_url" as const,
  },
  {
    name: "Tiktok",
    icon: Music2,
    field: "tiktok_url" as const,
  },
];

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

interface FooterProps {
  footerData?: FooterData;
  style?: string;
  isEditable?: boolean;
  siteUser?: string;
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
  siteUser,
}: FooterProps) {
  const [currentFooterData, setCurrentFooterData] = useState(footerData);
  const [showEditor, setShowEditor] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [existingFooterId, setExistingFooterId] = useState<string | null>(
    footerId || null
  );

  // Use site config for logo and social links
  const { data: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();

  const updateFooterMutation = useUpdateFooterMutation();
  const createFooterMutation = useCreateFooterMutation();
  const deleteFooterMutation = useDeleteFooterMutation();
  const { data: existingFooter } = useFooterQuery();

  // Update local state when footerData prop changes
  useEffect(() => {
    setCurrentFooterData(footerData);
  }, [footerData]);

  // Sync with site config for logo and social links
  useEffect(() => {
    if (siteConfig) {
      const updatedFooterData = { ...currentFooterData };

      // Sync logo from site config
      if (siteConfig.logo && siteConfig.logo !== updatedFooterData.logoImage) {
        updatedFooterData.logoImage = siteConfig.logo;
      }

      // Sync social links from site config
      const updatedSocialLinks = [];

      for (const platform of socialPlatforms) {
        const url = siteConfig[platform.field];
        if (url) {
          updatedSocialLinks.push({
            id: platform.field,
            platform: platform.name,
            href: url,
            icon: platform.icon,
          });
        }
      }

      // Only update if there are changes
      if (
        updatedSocialLinks.length > 0 &&
        JSON.stringify(updatedSocialLinks) !==
          JSON.stringify(updatedFooterData.socialLinks)
      ) {
        updatedFooterData.socialLinks = updatedSocialLinks;
      }

      // Update state if there were changes
      if (
        JSON.stringify(updatedFooterData) !== JSON.stringify(currentFooterData)
      ) {
        setCurrentFooterData(updatedFooterData);
      }
    }
  }, [siteConfig, currentFooterData]);

  // Set existing footer ID from query if available
  useEffect(() => {
    if (existingFooter?.data?.id && !existingFooterId) {
      setExistingFooterId(existingFooter.data.id);
    }
  }, [existingFooter, existingFooterId]);

  // Get social icon based on platform name
  const getSocialIcon = (platformName: string) => {
    const platform = socialPlatforms.find(p => p.name === platformName);
    return platform ? platform.icon : Facebook; // Default to Facebook if not found
  };

  // Process footer data to ensure correct icons are used
  const getProcessedFooterData = (): FooterData => {
    const processedData = { ...currentFooterData };

    // Ensure social links have correct icons
    processedData.socialLinks = processedData.socialLinks.map(link => ({
      ...link,
      icon: getSocialIcon(link.platform),
    }));

    return processedData;
  };

  const handleSaveFooter = async (newData: FooterData) => {
    try {
      // Process the data to ensure correct icons
      const processedData = getProcessedFooterData();

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
          footerData: processedData,
        };

        const result = await updateFooterMutation.mutateAsync(updateData);
        console.log("Update result:", result);

        // Update local state with the returned data
        if (result?.data?.data) {
          setCurrentFooterData(result.data.data);
        }
      } else {
        // Create new footer
        const createData = {
          component_id: componentId,
          content: "", // Add empty content if required by API
          footerData: processedData,
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
      onUpdate?.(componentId, { footerData: processedData });

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Check if we have a footer to delete
    if (!existingFooter?.data?.id && !existingFooterId && !footerId) {
      console.error("No footer found to delete");
      return;
    }

    deleteFooterMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  const FooterComponent =
    style === "style-2"
      ? FooterStyle2
      : style === "style-3"
        ? FooterStyle3
        : style === "style-4"
          ? FooterStyle4
          : style === "style-5"
            ? FooterStyle5
            : style === "style-6"
              ? FooterStyle6
              : FooterStyle1;

  const isLoading =
    updateFooterMutation.isPending ||
    createFooterMutation.isPending ||
    deleteFooterMutation.isPending ||
    isSiteConfigLoading;

  // Get processed footer data with correct icons
  const processedFooterData = getProcessedFooterData();

  return (
    <div className="group relative">
      {/* Centralized Edit/Delete Controls */}
      {isEditable && (
        <div className="bg-background/80 absolute top-4 right-4 z-20 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEditClick}
            disabled={isLoading}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Footer
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDeleteClick}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            {deleteFooterMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}

      {/* Footer Component - Pass isEditable as false to prevent individual delete buttons */}
      <FooterComponent
        footerData={processedFooterData}
        isEditable={false} // Always false since we handle editing centrally
        onEditClick={handleEditClick}
        siteUser={siteUser}
      />

      {/* Editor Dialog */}
      {isEditable && (
        <FooterEditorDialog
          open={showEditor}
          onOpenChange={setShowEditor}
          footerData={processedFooterData}
          onSave={handleSaveFooter}
          isLoading={isLoading}
          footerStyle={style === "style-5" ? "FooterStyle5" : undefined}
          siteUser={siteUser}
        />
      )}

      {/* Centralized Delete Dialog */}
      {isEditable && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="text-destructive h-5 w-5" />
                Delete Footer Component
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this footer? This action cannot
                be undone and will permanently remove the footer from your site.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteFooterMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteFooterMutation.isPending}
              >
                {deleteFooterMutation.isPending
                  ? "Deleting..."
                  : "Delete Footer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
