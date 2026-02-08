"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Upload,
  X,
  Settings,
  LinkIcon,
  SquareMousePointer,
  Type,
  ImageIcon,
  ChevronDown,
  Check,
  ChevronsUpDown,
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
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { usePages, useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useSiteConfig,
  usePatchSiteConfig,
} from "@/hooks/owner-site/admin/use-site-config";

interface NavbarEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (navbarData: NavbarData) => void;
  initialData: NavbarData;
  siteUser?: string;
}

// Page Selector Component for Links and Buttons
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

export const NavbarEditorDialog: React.FC<NavbarEditorDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  siteUser,
}) => {
  const [navbarData, setNavbarData] = useState<NavbarData>(initialData);
  const [activeTab, setActiveTab] = useState("logo");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // We don't need showPageSelectorFor anymore as the Popover is local to each PageSelector instance

  // Use site config hooks
  const { data: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();
  const patchSiteConfigMutation = usePatchSiteConfig();

  // Sync logo from site config when component mounts or site config changes
  useEffect(() => {
    if (siteConfig?.logo && siteConfig.logo !== navbarData.logoImage) {
      setNavbarData(prev => ({
        ...prev,
        logoImage: siteConfig.logo || "",
      }));
    }
  }, [siteConfig?.logo]);

  // Handle input changes
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof NavbarData, value: any) => {
    setNavbarData(prev => ({ ...prev, [field]: value }));
  };

  // Handle logo image upload and update site config
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload to Cloudinary first
      const imageUrl = await uploadToCloudinary(file, {
        folder: "logos",
        resourceType: "image",
      });

      // Update local state immediately for better UX
      setNavbarData(prev => ({ ...prev, logoImage: imageUrl }));

      // Update site config in database - Send the actual FILE, not the URL
      if (siteConfig?.id) {
        // Create FormData and append the file directly
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
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      // Revert local state on error
      setNavbarData(prev => ({
        ...prev,
        logoImage: siteConfig?.logo || "",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle logo removal
  const handleRemoveLogo = async () => {
    try {
      // Update local state immediately
      setNavbarData(prev => ({ ...prev, logoImage: "" }));

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
      setNavbarData(prev => ({
        ...prev,
        logoImage: siteConfig?.logo || "",
      }));
      alert("Failed to remove logo. Please try again.");
    }
  };

  // Handle logo type change and update site config if needed
  const handleLogoTypeChange = async (value: "text" | "image" | "both") => {
    setNavbarData(prev => ({ ...prev, logoType: value }));

    // If switching to image-only or both but no logo exists in site config,
    // we might want to handle this case, but for now just update local state
  };

  // Handle link operations
  const handleAddLink = () => {
    const newLink: NavbarLink = {
      id: Date.now().toString(),
      text: "New Link",
      href: "#",
    };
    setNavbarData(prev => ({
      ...prev,
      links: [...prev.links, newLink],
    }));
  };

  const handleUpdateLink = (
    id: string,
    field: keyof NavbarLink,
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

    setNavbarData(prev => ({
      ...prev,
      links: prev.links.map(link =>
        link.id === id ? { ...link, [field]: finalValue } : link
      ),
    }));
  };

  const handleDeleteLink = (id: string) => {
    setNavbarData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id),
    }));
  };

  // Handle button operations
  const handleAddButton = () => {
    const newButton: NavbarButton = {
      id: Date.now().toString(),
      text: "New Button",
      href: "#",
      variant: "primary",
    };
    setNavbarData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton],
    }));
  };

  const handleUpdateButton = (
    id: string,
    field: keyof NavbarButton,
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

    setNavbarData(prev => ({
      ...prev,
      buttons: prev.buttons.map(button =>
        button.id === id ? { ...button, [field]: finalValue } : button
      ),
    }));
  };

  const handleDeleteButton = (id: string) => {
    setNavbarData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(button => button.id !== id),
    }));
  };

  // Handle save
  const handleSave = () => {
    // Process links and buttons to ensure internal links have -draft suffix
    const processedLinks = navbarData.links.map(link => {
      if (
        link.href.startsWith("/") &&
        !link.href.endsWith("-draft") &&
        link.href !== "/"
      ) {
        return { ...link, href: `${link.href}-draft` };
      }
      return link;
    });

    const processedButtons = navbarData.buttons.map(button => {
      if (
        button.href.startsWith("/") &&
        !button.href.endsWith("-draft") &&
        button.href !== "/"
      ) {
        return { ...button, href: `${button.href}-draft` };
      }
      return button;
    });

    onSave({
      ...navbarData,
      links: processedLinks,
      buttons: processedButtons,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Navbar Editor</DialogTitle>
          <DialogDescription>
            Customize your navbar with logo, links, buttons, and settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="logo" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logo" className="flex items-center gap-1">
              <Type className="h-4 w-4" />
              Logo
              {siteConfig?.logo && (
                <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="buttons" className="flex items-center gap-1">
              <SquareMousePointer className="h-4 w-4" />
              Buttons
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <TabsContent value="logo" className="space-y-6">
              <Card className="border-none shadow-none">
                <CardContent className="space-y-6 px-0">
                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="logo-text">
                      Logo Text
                    </Label>
                    <Input
                      id="logo-text"
                      value={navbarData.logoText}
                      onChange={e =>
                        handleInputChange("logoText", e.target.value)
                      }
                      className="h-9 text-sm"
                      placeholder="Enter your brand name"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs">Logo Image</Label>

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
                          document.getElementById("logo-upload")?.click()
                        }
                        disabled={isUploading || isSiteConfigLoading}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>

                      {navbarData.logoImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                          disabled={patchSiteConfigMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          {patchSiteConfigMutation.isPending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {navbarData.logoImage && (
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full border">
                          <img
                            src={navbarData.logoImage}
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

                    {uploadError && (
                      <p className="text-destructive text-sm">{uploadError}</p>
                    )}

                    <p className="text-muted-foreground text-xs">
                      Recommended: Square image, max 2MB (JPG, PNG, WebP)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs">Logo Display</Label>
                    <RadioGroup
                      value={navbarData.logoType || "text"}
                      onValueChange={handleLogoTypeChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="text-only" />
                        <Label
                          className="text-sm font-normal"
                          htmlFor="text-only"
                        >
                          Text Only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="image"
                          id="image-only"
                          disabled={!navbarData.logoImage}
                        />
                        <Label
                          htmlFor="image-only"
                          className={cn(
                            "text-sm font-normal",
                            !navbarData.logoImage ? "opacity-50" : ""
                          )}
                        >
                          Image Only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="both"
                          id="both"
                          disabled={!navbarData.logoImage}
                        />
                        <Label
                          htmlFor="both"
                          className={cn(
                            "text-sm font-normal",
                            !navbarData.logoImage ? "opacity-50" : ""
                          )}
                        >
                          Text & Image
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between px-0 py-4">
                  <CardTitle className="text-lg font-medium">
                    Navigation Links
                  </CardTitle>
                  <Button onClick={handleAddLink} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  {navbarData.links.map(link => (
                    <div
                      key={link.id}
                      className="relative flex items-center gap-1.5"
                    >
                      <Input
                        id={`link-text-${link.id}`}
                        value={link.text}
                        onChange={e =>
                          handleUpdateLink(link.id, "text", e.target.value)
                        }
                        className="h-9 flex-1 text-sm"
                        placeholder="Link text"
                      />
                      <div className="relative flex-1">
                        <Input
                          id={`link-url-${link.id}`}
                          value={link.href}
                          onChange={e =>
                            handleUpdateLink(link.id, "href", e.target.value)
                          }
                          placeholder="Select or enter URL"
                          className="h-9 pr-8 text-sm"
                        />
                        <PageSelector
                          onSelect={(href, text) => {
                            let shouldUpdateText = false;
                            const linkToUpdate = navbarData.links.find(
                              l => l.id === link.id
                            );

                            if (
                              linkToUpdate &&
                              (!linkToUpdate.text ||
                                linkToUpdate.text === "New Link")
                            ) {
                              shouldUpdateText = true;
                            }

                            handleUpdateLink(link.id, "href", href);
                            if (text && shouldUpdateText) {
                              handleUpdateLink(link.id, "text", text);
                            }
                          }}
                          currentHref={link.href}
                          currentText={link.text}
                        />
                      </div>
                    </div>
                  ))}

                  {navbarData.links.length === 0 && (
                    <div className="text-muted-foreground py-6 text-center">
                      <LinkIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No links added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buttons" className="space-y-6">
              <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between px-0 py-4">
                  <CardTitle className="text-lg font-medium">
                    Action Buttons
                  </CardTitle>
                  <Button onClick={handleAddButton} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Button
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  {navbarData.buttons.map(button => (
                    <div
                      key={button.id}
                      className="relative flex items-center gap-1.5"
                    >
                      <Input
                        id={`button-text-${button.id}`}
                        value={button.text}
                        onChange={e =>
                          handleUpdateButton(button.id, "text", e.target.value)
                        }
                        className="h-9 flex-1 text-sm"
                        placeholder="Button text"
                      />
                      <div className="relative flex-1">
                        <Input
                          id={`button-url-${button.id}`}
                          value={button.href}
                          onChange={e =>
                            handleUpdateButton(
                              button.id,
                              "href",
                              e.target.value
                            )
                          }
                          placeholder="Select or enter URL"
                          className="h-9 pr-8 text-sm"
                        />
                        <PageSelector
                          onSelect={(href, text) => {
                            let shouldUpdateText = false;
                            const buttonToUpdate = navbarData.buttons.find(
                              b => b.id === button.id
                            );

                            if (
                              buttonToUpdate &&
                              (!buttonToUpdate.text ||
                                buttonToUpdate.text === "New Button")
                            ) {
                              shouldUpdateText = true;
                            }

                            handleUpdateButton(button.id, "href", href);
                            if (text && shouldUpdateText) {
                              handleUpdateButton(button.id, "text", text);
                            }
                          }}
                          currentHref={button.href}
                          currentText={button.text}
                        />
                      </div>
                    </div>
                  ))}

                  {navbarData.buttons.length === 0 && (
                    <div className="text-muted-foreground py-6 text-center">
                      <SquareMousePointer className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No buttons added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 py-4">
                  <CardTitle className="text-lg font-medium">
                    Navbar Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Show Cart Icon
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Display shopping cart in navigation
                      </p>
                    </div>
                    <Switch
                      checked={navbarData.showCart ?? true}
                      onCheckedChange={checked =>
                        handleInputChange("showCart", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
