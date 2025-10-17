"use client";

import React, { useState } from "react";
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
import {
  Plus,
  Trash2,
  Upload,
  X,
  Settings,
  LinkIcon,
  SquareMousePointer,
  ShoppingCart,
  Type,
  ImageIcon,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { usePages, useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  onCancel: () => void;
  currentHref: string;
  currentText?: string;
}

const PageSelector: React.FC<PageSelectorProps> = ({
  onSelect,
  onCancel,
  currentHref,
  currentText,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: pages = [], isLoading } = usePages();
  const createPageMutation = useCreatePage();

  // Filter pages based on search term
  const filteredPages = pages.filter(
    (page: Page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page selection
  const handlePageSelect = (page: Page) => {
    onSelect(`/${page.slug}`, page.title);
  };

  // Handle external URL selection
  const handleExternalUrl = () => {
    const url = prompt("Enter external URL (including https://):");
    if (url) {
      onSelect(url, url);
    }
  };

  // Handle new page creation
  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return;

    setIsCreating(true);
    try {
      const pageData = {
        title: newPageTitle.trim(),
      };

      const newPage = await createPageMutation.mutateAsync(pageData);
      onSelect(`/${newPage.slug}`, `${newPage.title}-draft`);

      // Reset form
      setNewPageTitle("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Failed to create page. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="absolute top-full right-0 z-50 mt-1 w-80 gap-0 bg-white py-0 shadow-xl">
      <CardContent className="p-0">
        {/* Search Input */}

        {/* Existing Pages - Scrollable Area */}
        <ScrollArea className="max-h-60">
          {isLoading ? (
            <div className="text-muted-foreground p-4 text-center">
              Loading pages...
            </div>
          ) : filteredPages.length > 0 ? (
            <div className="p-1">
              {filteredPages.map((page: Page) => (
                <Button
                  key={page.id}
                  onClick={() => handlePageSelect(page)}
                  variant={
                    currentHref === `/${page.slug}` ? "secondary" : "ghost"
                  }
                  className="h-auto w-full justify-start p-2 text-left"
                >
                  <div className="flex-1">
                    <div className="font-medium capitalize">{page.title}</div>
                    <div className="text-muted-foreground text-xs">
                      /{page.slug}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : searchTerm && !isLoading ? (
            <div className="text-muted-foreground p-4 text-center">
              No pages found matching &quot;{searchTerm}&quot;
            </div>
          ) : null}
        </ScrollArea>

        <Separator />

        {/* Create New Page Section */}
        <div className="bg-white p-2">
          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="ghost"
              className="w-full justify-start text-green-700 hover:bg-green-50 hover:text-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New Page</span>
            </Button>
          ) : (
            <div className="space-y-2 rounded bg-white p-2">
              <div className="text-sm font-medium">Create New Page</div>
              <Input
                type="text"
                placeholder="Page title..."
                value={newPageTitle}
                onChange={e => setNewPageTitle(e.target.value)}
                className="bg-white"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePage}
                  variant="default"
                  disabled={!newPageTitle.trim() || isCreating}
                  className="flex-1"
                  size="sm"
                >
                  {isCreating ? "Creating..." : "Create & Link"}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPageTitle("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <Separator />

        {/* Footer */}
        <div className="bg-muted/30 p-2">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
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
  const [showPageSelectorFor, setShowPageSelectorFor] = useState<{
    type: "link" | "button";
    id: string;
  } | null>(null);

  // Handle input changes
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof NavbarData, value: any) => {
    setNavbarData(prev => ({ ...prev, [field]: value }));
  };

  // Handle logo image upload
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
      const imageUrl = await uploadToCloudinary(file, {
        folder: "logos",
        resourceType: "image",
      });
      setNavbarData(prev => ({ ...prev, logoImage: imageUrl }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
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
    setNavbarData(prev => ({
      ...prev,
      links: prev.links.map(link =>
        link.id === id ? { ...link, [field]: value } : link
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
    setNavbarData(prev => ({
      ...prev,
      buttons: prev.buttons.map(button =>
        button.id === id ? { ...button, [field]: value } : button
      ),
    }));
  };

  const handleDeleteButton = (id: string) => {
    setNavbarData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(button => button.id !== id),
    }));
  };

  // Handle page selection for links and buttons
  const handlePageSelect = (href: string, text?: string) => {
    if (showPageSelectorFor) {
      const { type, id } = showPageSelectorFor;

      if (type === "link") {
        handleUpdateLink(id, "href", href);
        if (text) {
          handleUpdateLink(id, "text", text);
        }
      } else if (type === "button") {
        handleUpdateButton(id, "href", href);
        if (text) {
          handleUpdateButton(id, "text", text);
        }
      }

      setShowPageSelectorFor(null);
    }
  };

  // Handle save
  const handleSave = () => {
    onSave(navbarData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Navbar Editor</DialogTitle>
          <DialogDescription>
            Customize your navbar with logo, links, buttons, and settings
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-48 border-r pr-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("logo")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "logo"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <Type className="mr-2 h-4 w-4" />
                Logo
              </button>
              <button
                onClick={() => setActiveTab("links")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "links"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Links
              </button>
              <button
                onClick={() => setActiveTab("buttons")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "buttons"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <SquareMousePointer className="mr-2 h-4 w-4" />
                Buttons
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "logo" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Logo Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="logo-text">Logo Text</Label>
                  <Input
                    id="logo-text"
                    value={navbarData.logoText}
                    onChange={e =>
                      handleInputChange("logoText", e.target.value)
                    }
                    placeholder="Enter your brand name"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Logo Image</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                      disabled={isUploading}
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
                        onClick={() => handleInputChange("logoImage", "")}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
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
                          Ready to use
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground text-xs">
                    Recommended: Square image, max 2MB (JPG, PNG, WebP)
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Logo Display</Label>
                  <RadioGroup
                    value={navbarData.logoType || "text"}
                    onValueChange={(value: "text" | "image" | "both") =>
                      handleInputChange("logoType", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text-only" />
                      <Label htmlFor="text-only">Text Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="image"
                        id="image-only"
                        disabled={!navbarData.logoImage}
                      />
                      <Label
                        htmlFor="image-only"
                        className={!navbarData.logoImage ? "opacity-50" : ""}
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
                        className={!navbarData.logoImage ? "opacity-50" : ""}
                      >
                        Text & Image
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {activeTab === "links" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Navigation Links</h3>
                  <Button onClick={handleAddLink} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </div>

                <div className="space-y-4">
                  {navbarData.links.map(link => (
                    <div
                      key={link.id}
                      className="relative flex items-center gap-3 rounded-md border p-3"
                    >
                      <div className="grid flex-1 grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`link-text-${link.id}`}>Text</Label>
                          <Input
                            id={`link-text-${link.id}`}
                            value={link.text}
                            onChange={e =>
                              handleUpdateLink(link.id, "text", e.target.value)
                            }
                            placeholder="Link text"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`link-url-${link.id}`}>URL</Label>
                          <div className="relative">
                            <Input
                              id={`link-url-${link.id}`}
                              value={link.href}
                              onChange={e =>
                                handleUpdateLink(
                                  link.id,
                                  "href",
                                  e.target.value
                                )
                              }
                              placeholder="Select or enter URL"
                              className="pr-8"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 h-full px-2"
                              onClick={() =>
                                setShowPageSelectorFor({
                                  type: "link",
                                  id: link.id,
                                })
                              }
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Page Selector Dropdown */}
                      {showPageSelectorFor?.type === "link" &&
                        showPageSelectorFor?.id === link.id && (
                          <PageSelector
                            onSelect={handlePageSelect}
                            onCancel={() => setShowPageSelectorFor(null)}
                            currentHref={link.href}
                            currentText={link.text}
                          />
                        )}
                    </div>
                  ))}

                  {navbarData.links.length === 0 && (
                    <div className="text-muted-foreground py-6 text-center">
                      <LinkIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No links added yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "buttons" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Action Buttons</h3>
                  <Button onClick={handleAddButton} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Button
                  </Button>
                </div>

                <div className="space-y-4">
                  {navbarData.buttons.map(button => (
                    <div
                      key={button.id}
                      className="relative flex items-center gap-3 rounded-md border p-3"
                    >
                      <div className="grid flex-1 grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`button-text-${button.id}`}>
                            Text
                          </Label>
                          <Input
                            id={`button-text-${button.id}`}
                            value={button.text}
                            onChange={e =>
                              handleUpdateButton(
                                button.id,
                                "text",
                                e.target.value
                              )
                            }
                            placeholder="Button text"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`button-url-${button.id}`}>URL</Label>
                          <div className="relative">
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
                              className="pr-8"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 h-full px-2"
                              onClick={() =>
                                setShowPageSelectorFor({
                                  type: "button",
                                  id: button.id,
                                })
                              }
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`button-variant-${button.id}`}>
                            Style
                          </Label>
                          <Select
                            value={button.variant}
                            onValueChange={value =>
                              handleUpdateButton(button.id, "variant", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">
                                Secondary
                              </SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="ghost">Ghost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteButton(button.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Page Selector Dropdown */}
                      {showPageSelectorFor?.type === "button" &&
                        showPageSelectorFor?.id === button.id && (
                          <PageSelector
                            onSelect={handlePageSelect}
                            onCancel={() => setShowPageSelectorFor(null)}
                            currentHref={button.href}
                            currentText={button.text}
                          />
                        )}
                    </div>
                  ))}

                  {navbarData.buttons.length === 0 && (
                    <div className="text-muted-foreground py-6 text-center">
                      <SquareMousePointer className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No buttons added yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Navbar Settings</h3>

                <div className="space-y-4">
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
                </div>
              </div>
            )}
          </div>
        </div>

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
