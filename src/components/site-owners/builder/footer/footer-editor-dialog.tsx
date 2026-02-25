import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Building,
  Phone,
  Mail,
  Link,
  Share2,
  ChevronDown,
  Search,
  ExternalLink,
  Upload,
  X,
  Type,
  ImageIcon,
  Check,
  ChevronsUpDown,
  Shield,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NewPageDialog } from "../new-page/new-page-dialog";
import {
  FooterData,
  FooterSection,
  FooterLink,
  SocialLink,
} from "@/types/owner-site/components/footer";
import { usePages, useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useSiteConfig,
  usePatchSiteConfig,
} from "@/hooks/owner-site/admin/use-site-config";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FooterEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footerData: FooterData;
  onSave: (data: FooterData) => void;
  isLoading?: boolean;
  footerStyle?: string;
  siteUser?: string;
}

const socialPlatforms = [
  {
    name: "Facebook",
    field: "facebook_url" as const,
  },
  {
    name: "Twitter",
    field: "twitter_url" as const,
  },
  {
    name: "Instagram",
    field: "instagram_url" as const,
  },
  {
    name: "LinkedIn",
    field: "linkedin_url" as const,
  },
  {
    name: "YouTube",
    field: "youtube_url" as const,
  },
  {
    name: "Tiktok",
    field: "tiktok_url" as const,
  },
];

// Page Selector Component for Footer Links
interface PageSelectorProps {
  onSelect: (href: string, text?: string) => void;
  currentHref: string;
  currentText?: string;
}

const PageSelector: React.FC<PageSelectorProps> = ({
  onSelect,
  currentHref,
  currentText,
}) => {
  const [open, setOpen] = useState(false);
  const [showNewPageDialog, setShowNewPageDialog] = useState(false);
  const { data: pages = [], isLoading } = usePages();

  // Handle page selection
  const handlePageSelect = (page: Page) => {
    onSelect(`/${page.slug}`, page.title);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            role="combobox"
            aria-expanded={open}
            className="chevron-toggle-button absolute top-0 right-0 h-full px-2"
          >
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search pages..." />
            <CommandList>
              <CommandEmpty>No page found.</CommandEmpty>
              <CommandGroup heading="Pages">
                {isLoading ? (
                  <CommandItem disabled>Loading...</CommandItem>
                ) : (
                  pages.map((page: Page) => (
                    <CommandItem
                      key={page.id}
                      value={page.title}
                      onSelect={() => handlePageSelect(page)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentHref === `/${page.slug}`
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {page.title}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
              <Separator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowNewPageDialog(true);
                  }}
                  className="text-green-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Page
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <NewPageDialog
        open={showNewPageDialog}
        onOpenChange={setShowNewPageDialog}
        onPageCreated={page => {
          onSelect(`/${page.slug}`, `${page.title}-draft`);
        }}
      />
    </>
  );
};

export function FooterEditorDialog({
  open,
  onOpenChange,
  footerData,
  onSave,
  isLoading = false,
  footerStyle,
  siteUser,
}: FooterEditorDialogProps) {
  const [editingData, setEditingData] = useState<FooterData>(footerData);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadLogoError, setUploadLogoError] = useState<string | null>(null);

  // Use site config hooks for logo and social links
  const { data: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();
  const patchSiteConfigMutation = usePatchSiteConfig();

  // Check if newsletter should be shown (not for FooterStyle5)
  const showNewsletter = footerStyle !== "FooterStyle5";

  // Determine grid columns based on whether newsletter is shown
  const tabsGridCols = showNewsletter ? "grid-cols-7" : "grid-cols-6";

  // Update editing data when footerData prop changes
  useEffect(() => {
    setEditingData(footerData);
  }, [footerData]);

  // Sync logo and social links from site config when component mounts or site config changes
  useEffect(() => {
    if (siteConfig) {
      // Sync logo
      if (siteConfig.logo && siteConfig.logo !== editingData.logoImage) {
        setEditingData(prev => ({
          ...prev,
          logoImage: siteConfig.logo || "",
        }));
      }

      // Sync social links
      const updatedSocialLinks: SocialLink[] = [];

      socialPlatforms.forEach(platform => {
        const url = siteConfig[platform.field];
        if (url) {
          updatedSocialLinks.push({
            id: platform.field,
            platform: platform.name,
            href: url,
          });
        }
      });

      // Only update if there are changes
      if (
        updatedSocialLinks.length > 0 &&
        JSON.stringify(updatedSocialLinks) !==
          JSON.stringify(editingData.socialLinks)
      ) {
        setEditingData(prev => ({
          ...prev,
          socialLinks: updatedSocialLinks,
        }));
      }
    }
  }, [siteConfig]);

  const handleSave = () => {
    // Process sections and links to ensure internal links have -draft suffix
    const processedSections = editingData.sections.map(section => ({
      ...section,
      links: section.links.map(link => {
        if (
          link.href &&
          link.href.startsWith("/") &&
          !link.href.endsWith("-draft") &&
          link.href !== "/"
        ) {
          return { ...link, href: `${link.href}-draft` };
        }
        return link;
      }),
    }));

    onSave({
      ...editingData,
      sections: processedSections,
    });
  };

  // Handle logo image upload and update site config
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadLogoError("Please select a valid image file");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setUploadLogoError("Image size must be less than 2MB");
      return;
    }

    setIsUploadingLogo(true);
    setUploadLogoError(null);

    try {
      // Upload to Cloudinary first for immediate preview
      const imageUrl = await uploadToCloudinary(file, {
        folder: "logos",
        resourceType: "image",
      });

      // Update local state immediately for better UX
      setEditingData(prev => ({ ...prev, logoImage: imageUrl }));

      // Update site config in database if site config exists - Send the actual FILE
      if (siteConfig?.id) {
        const formData = new FormData();
        formData.append("logo", file); // Send the file object, not the URL

        // If your API expects the Cloudinary URL as well, you can send both:
        formData.append("logoUrl", imageUrl);

        await patchSiteConfigMutation.mutateAsync({
          id: siteConfig.id,
          data: formData,
        });
      } else {
        console.warn("No site config found. Logo saved locally only.");
      }
    } catch (error) {
      setUploadLogoError(
        error instanceof Error ? error.message : "Upload failed"
      );
      // Revert local state on error
      setEditingData(prev => ({
        ...prev,
        logoImage: siteConfig?.logo || "",
      }));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Handle logo removal
  const handleRemoveLogo = async () => {
    try {
      // Update local state immediately
      setEditingData(prev => ({ ...prev, logoImage: "" }));

      // Update site config in database if site config exists
      if (siteConfig?.id) {
        const formData = new FormData();
        formData.append("logo", "");

        await patchSiteConfigMutation.mutateAsync({
          id: siteConfig.id,
          data: formData,
        });
      }
    } catch (error) {
      console.error("Failed to remove logo:", error);
      // Revert local state on error
      setEditingData(prev => ({
        ...prev,
        logoImage: siteConfig?.logo || "",
      }));
      alert("Failed to remove logo. Please try again.");
    }
  };

  // Handle logo type change
  const handleLogoTypeChange = (value: "text" | "image" | "both") => {
    setEditingData(prev => ({ ...prev, logoType: value }));
  };

  // Update site config when social links change
  const updateSiteConfigSocialLinks = async (socialLinks: SocialLink[]) => {
    if (!siteConfig?.id) return;

    try {
      const formData = new FormData();

      // Reset all social URLs first
      socialPlatforms.forEach(platform => {
        formData.append(platform.field, "");
      });

      // Set URLs from social links
      socialLinks.forEach(link => {
        const platform = socialPlatforms.find(p => p.name === link.platform);
        if (platform && link.href) {
          formData.append(platform.field, link.href);
        }
      });

      await patchSiteConfigMutation.mutateAsync({
        id: siteConfig.id,
        data: formData,
      });
    } catch (error) {
      console.error("Failed to update social links in site config:", error);
      throw error;
    }
  };

  const updateBasicInfo = <K extends keyof FooterData>(
    field: K,
    value: FooterData[K]
  ) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = <K extends keyof FooterData["contactInfo"]>(
    field: K,
    value: FooterData["contactInfo"][K]
  ) => {
    setEditingData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  };

  const updateNewsletter = <K extends keyof FooterData["newsletter"]>(
    field: K,
    value: FooterData["newsletter"][K]
  ) => {
    setEditingData(prev => ({
      ...prev,
      newsletter: { ...prev.newsletter, [field]: value },
    }));
  };

  const addSection = () => {
    const newSection: FooterSection = {
      id: Date.now().toString(),
      title: "New Section",
      links: [],
    };
    setEditingData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    }));
  };

  const removeSection = (sectionId: string) => {
    setEditingData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
  };

  const addLink = (sectionId: string) => {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      text: "New Link",
      href: "#",
    };
    setEditingData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, links: [...section.links, newLink] }
          : section
      ),
    }));
  };

  const updateLink = (
    sectionId: string,
    linkId: string,
    field: string,
    value: string
  ) => {
    let finalValue = value;

    // Ensure internal links start with /
    if (
      field === "href" &&
      value.length > 0 &&
      !value.startsWith("/") &&
      !value.startsWith("http") &&
      !value.startsWith("mailto:") &&
      !value.startsWith("tel:") &&
      !value.startsWith("#")
    ) {
      finalValue = `/${value}`;
    }

    setEditingData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map(link =>
                link.id === linkId ? { ...link, [field]: finalValue } : link
              ),
            }
          : section
      ),
    }));
  };

  const removeLink = (sectionId: string, linkId: string) => {
    setEditingData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.filter(link => link.id !== linkId),
            }
          : section
      ),
    }));
  };

  const addSocialLink = () => {
    // Find first available platform that's not already used
    const availablePlatform = socialPlatforms.find(
      platform =>
        !editingData.socialLinks.some(link => link.platform === platform.name)
    );

    if (!availablePlatform) {
      alert("All social platforms are already added.");
      return;
    }

    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      platform: availablePlatform.name,
      href: "",
    };

    setEditingData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocialLink],
    }));
  };

  const updateSocialLink = async (
    linkId: string,
    field: string,
    value: string
  ) => {
    const updatedSocialLinks = editingData.socialLinks.map(link => {
      if (link.id === linkId) {
        const updatedLink = { ...link, [field]: value };
        if (field === "platform") {
          const platform = socialPlatforms.find(p => p.name === value);
          // Platform name is enough as SocialIcon resolves the icon
        }
        return updatedLink;
      }
      return link;
    });

    setEditingData(prev => ({
      ...prev,
      socialLinks: updatedSocialLinks,
    }));

    // Update site config when social links change
    if (field === "href" || field === "platform") {
      try {
        await updateSiteConfigSocialLinks(updatedSocialLinks);
      } catch (error) {
        console.error("Failed to update site config:", error);
        // Optionally show error message to user
      }
    }
  };

  const removeSocialLink = async (linkId: string) => {
    const updatedSocialLinks = editingData.socialLinks.filter(
      link => link.id !== linkId
    );

    setEditingData(prev => ({
      ...prev,
      socialLinks: updatedSocialLinks,
    }));

    // Update site config when social link is removed
    try {
      await updateSiteConfigSocialLinks(updatedSocialLinks);
    } catch (error) {
      console.error("Failed to update site config:", error);
      // Optionally show error message to user
    }
  };

  const addPolicyLink = () => {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      text: "Legal & Privacy",
      href: "#",
    };
    setEditingData(prev => ({
      ...prev,
      policyLinks: [...(prev.policyLinks || []), newLink],
    }));
  };

  const updatePolicyLink = (linkId: string, field: string, value: string) => {
    let finalValue = value;
    if (
      field === "href" &&
      value.length > 0 &&
      !value.startsWith("/") &&
      !value.startsWith("http") &&
      !value.startsWith("mailto:") &&
      !value.startsWith("tel:") &&
      !value.startsWith("#")
    ) {
      finalValue = `/${value}`;
    }

    setEditingData(prev => ({
      ...prev,
      policyLinks: (prev.policyLinks || []).map(link =>
        link.id === linkId ? { ...link, [field]: finalValue } : link
      ),
    }));
  };

  const removePolicyLink = (linkId: string) => {
    setEditingData(prev => ({
      ...prev,
      policyLinks: (prev.policyLinks || []).filter(link => link.id !== linkId),
    }));
  };

  // Get available platforms for dropdown (platforms not already used)
  const getAvailablePlatforms = () => {
    const usedPlatforms = new Set(
      editingData.socialLinks.map(link => link.platform)
    );
    return socialPlatforms.filter(
      platform => !usedPlatforms.has(platform.name)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Footer Content
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="logo" className="w-full">
          <TabsList className={`grid w-full ${tabsGridCols}`}>
            <TabsTrigger value="logo" className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />
              Logo
              {siteConfig?.logo && (
                <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            {showNewsletter && (
              <TabsTrigger
                value="newsletter"
                className="flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                Newsletter
              </TabsTrigger>
            )}
            <TabsTrigger value="sections" className="flex items-center gap-1">
              <Link className="h-4 w-4" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Social
              {siteConfig && (
                <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {/* Logo Tab */}
            <TabsContent value="logo" className="space-y-6">
              <Card className="border-none">
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="footer-logo-text">
                      Logo Text
                    </Label>
                    <Input
                      id="footer-logo-text"
                      value={editingData.logoText}
                      onChange={e =>
                        updateBasicInfo("logoText", e.target.value)
                      }
                      className="h-9 text-sm"
                      placeholder="Enter your brand name"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Logo Image</Label>

                    {/* Site Config Status */}
                    {isSiteConfigLoading && (
                      <div className="text-sm text-blue-600">
                        Loading site configuration...
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("footer-logo-upload")?.click()
                        }
                        disabled={isUploadingLogo || isSiteConfigLoading}
                        className="flex items-center gap-2"
                      >
                        {isUploadingLogo ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>

                      {editingData.logoImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                          disabled={patchSiteConfigMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          {patchSiteConfigMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    <input
                      id="footer-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    {editingData.logoImage && (
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="overflow-hidden rounded border">
                          <img
                            src={editingData.logoImage}
                            alt="Logo preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Logo uploaded</p>
                          <p className="text-muted-foreground text-xs">
                            {siteConfig?.logo
                              ? "Saved to site configuration"
                              : "Ready to use"}
                          </p>
                        </div>
                      </div>
                    )}

                    {uploadLogoError && (
                      <p className="text-destructive text-sm">
                        {uploadLogoError}
                      </p>
                    )}

                    <p className="text-muted-foreground text-xs">
                      Recommended: Square image, max 2MB (JPG, PNG, WebP)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs">Logo Display</Label>
                    <RadioGroup
                      value={editingData.logoType || "text"}
                      onValueChange={handleLogoTypeChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="footer-text-only" />
                        <Label
                          className="text-sm font-normal"
                          htmlFor="footer-text-only"
                        >
                          Text
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="image"
                          id="footer-image-only"
                          disabled={!editingData.logoImage}
                        />
                        <Label
                          htmlFor="footer-image-only"
                          className={cn(
                            "text-sm font-normal",
                            !editingData.logoImage ? "opacity-50" : ""
                          )}
                        >
                          Image
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="both"
                          id="footer-both"
                          disabled={!editingData.logoImage}
                        />
                        <Label
                          htmlFor="footer-both"
                          className={cn(
                            "text-sm font-normal",
                            !editingData.logoImage ? "opacity-50" : ""
                          )}
                        >
                          Both
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Information Tab */}
            <TabsContent value="company" className="space-y-4">
              <Card className="border-none shadow-none">
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Company Name
                    </label>
                    <Input
                      value={editingData.companyName}
                      onChange={e =>
                        updateBasicInfo("companyName", e.target.value)
                      }
                      className="h-9 text-sm"
                      placeholder="Your Company"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Description
                    </label>
                    <Textarea
                      value={editingData.description}
                      onChange={e =>
                        updateBasicInfo("description", e.target.value)
                      }
                      className="text-sm"
                      placeholder="Company description"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Copyright Text
                    </label>
                    <Input
                      value={editingData.copyright}
                      onChange={e =>
                        updateBasicInfo("copyright", e.target.value)
                      }
                      className="h-9 text-sm"
                      placeholder="© 2025 Your Company. All rights reserved."
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-4">
              <Card className="border-none shadow-none">
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Email
                    </label>
                    <Input
                      value={editingData.contactInfo.email || ""}
                      onChange={e => updateContactInfo("email", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="hello@company.com"
                      type="email"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Phone
                    </label>
                    <Input
                      value={editingData.contactInfo.phone || ""}
                      onChange={e => updateContactInfo("phone", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="+977 1234567890"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Address
                    </label>
                    <Textarea
                      value={editingData.contactInfo.address || ""}
                      onChange={e =>
                        updateContactInfo("address", e.target.value)
                      }
                      className="text-sm"
                      placeholder="Sankhapur, Kathmandu, Nepal"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab - Only show if not FooterStyle5 */}
            {showNewsletter && (
              <TabsContent value="newsletter" className="space-y-4">
                <Card className="border-none shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      Newsletter Settings
                      <Badge
                        variant={
                          editingData.newsletter.enabled
                            ? "default"
                            : "secondary"
                        }
                      >
                        {editingData.newsletter.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingData.newsletter.enabled}
                        onChange={e =>
                          updateNewsletter("enabled", e.target.checked)
                        }
                        className="border-border rounded"
                        disabled={isLoading}
                      />
                      <label className="text-sm">
                        Enable newsletter subscription
                      </label>
                    </div>
                    {editingData.newsletter.enabled && (
                      <>
                        <div>
                          <label className="mb-1 block text-xs font-medium">
                            Newsletter Title
                          </label>
                          <Input
                            value={editingData.newsletter.title}
                            onChange={e =>
                              updateNewsletter("title", e.target.value)
                            }
                            className="h-9 text-sm"
                            placeholder="Stay Updated"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium">
                            Newsletter Description
                          </label>
                          <Textarea
                            value={editingData.newsletter.description}
                            onChange={e =>
                              updateNewsletter("description", e.target.value)
                            }
                            className="text-sm"
                            placeholder="Subscribe to our newsletter for the latest updates and news."
                            rows={2}
                            disabled={isLoading}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Footer Sections Tab */}
            <TabsContent value="sections" className="space-y-4">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Footer Sections
                    <Button onClick={addSection} size="sm" disabled={isLoading}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Section
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingData.sections.map(section => (
                    <Card key={section.id} className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <Input
                          value={section.title}
                          onChange={e =>
                            updateSection(section.id, "title", e.target.value)
                          }
                          className="h-9 text-sm font-medium"
                          placeholder="Section Title"
                          disabled={isLoading}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1.5">
                        {section.links.map(link => (
                          <div key={link.id} className="relative flex gap-1.5">
                            <Input
                              value={link.text}
                              onChange={e =>
                                updateLink(
                                  section.id,
                                  link.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder="Link Text"
                              className="h-9 flex-1 text-sm"
                              disabled={isLoading}
                            />
                            <div className="relative flex-1">
                              <Input
                                value={link.href || ""}
                                onChange={e =>
                                  updateLink(
                                    section.id,
                                    link.id,
                                    "href",
                                    e.target.value
                                  )
                                }
                                placeholder="Select or enter URL"
                                className="h-9 pr-8 text-sm"
                                disabled={isLoading}
                              />
                              <PageSelector
                                onSelect={(href, text) => {
                                  let shouldUpdateText = false;
                                  const linkToUpdate = section.links.find(
                                    l => l.id === link.id
                                  );
                                  if (
                                    linkToUpdate &&
                                    (!linkToUpdate.text ||
                                      linkToUpdate.text === "New Link")
                                  ) {
                                    shouldUpdateText = true;
                                  }

                                  updateLink(section.id, link.id, "href", href);
                                  if (text && shouldUpdateText) {
                                    updateLink(
                                      section.id,
                                      link.id,
                                      "text",
                                      text
                                    );
                                  }
                                }}
                                currentHref={link.href || ""}
                                currentText={link.text}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLink(section.id, link.id)}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLink(section.id)}
                          className="mt-2"
                          disabled={isLoading}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Link
                        </Button>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Policies Sections Tab */}
            <TabsContent value="policies" className="space-y-4">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Policy Links
                    <Button
                      onClick={addPolicyLink}
                      size="sm"
                      disabled={isLoading}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Policy Link
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(editingData.policyLinks || []).map(link => (
                    <Card key={link.id} className="p-4">
                      <div className="space-y-2">
                        <div className="relative flex gap-1.5">
                          <Input
                            value={link.text}
                            onChange={e =>
                              updatePolicyLink(link.id, "text", e.target.value)
                            }
                            placeholder="Policy Name (e.g. Terms & Conditions)"
                            className="h-9 flex-1 text-sm font-medium"
                            disabled={isLoading}
                          />
                          <div className="relative flex-1">
                            <Input
                              value={link.href || ""}
                              onChange={e =>
                                updatePolicyLink(
                                  link.id,
                                  "href",
                                  e.target.value
                                )
                              }
                              placeholder="Select or enter URL"
                              className="h-9 pr-8 text-sm"
                              disabled={isLoading}
                            />
                            <PageSelector
                              onSelect={(href, text) => {
                                let shouldUpdateText = false;
                                const linkToUpdate = (
                                  editingData.policyLinks || []
                                ).find(l => l.id === link.id);
                                if (
                                  linkToUpdate &&
                                  (!linkToUpdate.text ||
                                    linkToUpdate.text === "Legal & Privacy")
                                ) {
                                  shouldUpdateText = true;
                                }

                                updatePolicyLink(link.id, "href", href);
                                if (text && shouldUpdateText) {
                                  updatePolicyLink(link.id, "text", text);
                                }
                              }}
                              currentHref={link.href || ""}
                              currentText={link.text}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePolicyLink(link.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {(!editingData.policyLinks ||
                    editingData.policyLinks.length === 0) && (
                    <div className="text-muted-foreground py-4 text-center text-sm">
                      No policy links added yet. Add "Terms & Conditions" or
                      "Legal & Privacy" links here.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Social Links
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={addSocialLink}
                        size="sm"
                        disabled={
                          isLoading || getAvailablePlatforms().length === 0
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Social Link
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isSiteConfigLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading site configuration...
                    </div>
                  )}

                  {editingData.socialLinks.map(social => (
                    <div
                      key={social.id}
                      className="flex items-center gap-2 rounded-lg border p-2"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <div className="w-32">
                          <select
                            value={social.platform}
                            onChange={e =>
                              updateSocialLink(
                                social.id,
                                "platform",
                                e.target.value
                              )
                            }
                            className="border-border bg-background w-full rounded-md border px-2 py-1.5 text-sm"
                            disabled={
                              isLoading || patchSiteConfigMutation.isPending
                            }
                          >
                            {socialPlatforms.map(platform => (
                              <option key={platform.name} value={platform.name}>
                                {platform.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Input
                          value={social.href || ""}
                          onChange={e =>
                            updateSocialLink(social.id, "href", e.target.value)
                          }
                          placeholder={`Enter ${social.platform} URL`}
                          className="h-9 flex-1 text-sm"
                          disabled={
                            isLoading || patchSiteConfigMutation.isPending
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(social.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={
                            isLoading || patchSiteConfigMutation.isPending
                          }
                        >
                          {patchSiteConfigMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {editingData.socialLinks.length === 0 &&
                    !isSiteConfigLoading && (
                      <div className="text-muted-foreground py-8 text-center">
                        <Share2 className="mx-auto mb-2 h-12 w-12 opacity-50" />
                        <p>No social links added yet</p>
                        <p className="mt-1 text-sm">
                          {siteConfig
                            ? "Add social links to sync with site configuration"
                            : "Add your social media profiles"}
                        </p>
                      </div>
                    )}

                  {getAvailablePlatforms().length === 0 &&
                    editingData.socialLinks.length > 0 && (
                      <div className="text-muted-foreground py-2 text-center text-sm">
                        All social platforms have been added
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-t pt-4">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading || patchSiteConfigMutation.isPending}
            >
              {(isLoading || patchSiteConfigMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || patchSiteConfigMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
