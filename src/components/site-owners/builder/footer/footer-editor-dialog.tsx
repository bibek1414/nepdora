import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
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
} from "lucide-react";
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
  { name: "Facebook", icon: Facebook },
  { name: "Twitter", icon: Twitter },
  { name: "Instagram", icon: Instagram },
  { name: "LinkedIn", icon: Linkedin },
];

// Page Selector Component for Footer Links
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
    <Card className="absolute top-full right-0 z-50 mt-1 w-80 bg-white py-0 shadow-xl">
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

        {/* External URL Option */}

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
  const [showPageSelectorFor, setShowPageSelectorFor] = useState<{
    sectionId: string;
    linkId: string;
  } | null>(null);

  // Check if newsletter should be shown (not for FooterStyle5)
  const showNewsletter = footerStyle !== "FooterStyle5";

  // Determine grid columns based on whether newsletter is shown
  const tabsGridCols = showNewsletter ? "grid-cols-5" : "grid-cols-4";

  // Update editing data when footerData prop changes
  useEffect(() => {
    setEditingData(footerData);
  }, [footerData]);

  const handleSave = () => {
    onSave(editingData);
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
    setEditingData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map(link =>
                link.id === linkId ? { ...link, [field]: value } : link
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
    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      platform: "Facebook",
      href: "#",
      icon: Facebook,
    };
    setEditingData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocialLink],
    }));
  };

  const updateSocialLink = (linkId: string, field: string, value: string) => {
    setEditingData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => {
        if (link.id === linkId) {
          const updatedLink = { ...link, [field]: value };
          if (field === "platform") {
            const platform = socialPlatforms.find(p => p.name === value);
            if (platform) {
              updatedLink.icon = platform.icon;
            }
          }
          return updatedLink;
        }
        return link;
      }),
    }));
  };

  const removeSocialLink = (linkId: string) => {
    setEditingData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== linkId),
    }));
  };

  // Handle page selection for footer links
  const handlePageSelect = (href: string, text?: string) => {
    if (showPageSelectorFor) {
      const { sectionId, linkId } = showPageSelectorFor;

      updateLink(sectionId, linkId, "href", href);
      if (text) {
        updateLink(sectionId, linkId, "text", text);
      }

      setShowPageSelectorFor(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Footer Content
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className={`grid w-full ${tabsGridCols}`}>
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
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[60vh] overflow-y-auto">
            {/* Company Information Tab */}
            <TabsContent value="company" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Company Name
                    </label>
                    <Input
                      value={editingData.companyName}
                      onChange={e =>
                        updateBasicInfo("companyName", e.target.value)
                      }
                      placeholder="Your Company"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      value={editingData.description}
                      onChange={e =>
                        updateBasicInfo("description", e.target.value)
                      }
                      placeholder="Company description"
                      rows={4}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Copyright Text
                    </label>
                    <Input
                      value={editingData.copyright}
                      onChange={e =>
                        updateBasicInfo("copyright", e.target.value)
                      }
                      placeholder="© 2025 Your Company. All rights reserved."
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      value={editingData.contactInfo.email || ""}
                      onChange={e => updateContactInfo("email", e.target.value)}
                      placeholder="hello@company.com"
                      type="email"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      value={editingData.contactInfo.phone || ""}
                      onChange={e => updateContactInfo("phone", e.target.value)}
                      placeholder="+977 1234567890"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Address
                    </label>
                    <Textarea
                      value={editingData.contactInfo.address || ""}
                      onChange={e =>
                        updateContactInfo("address", e.target.value)
                      }
                      placeholder="Sankhapur, Kathmandu, Nepal"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab - Only show if not FooterStyle5 */}
            {showNewsletter && (
              <TabsContent value="newsletter" className="space-y-4">
                <Card>
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
                          <label className="mb-2 block text-sm font-medium">
                            Newsletter Title
                          </label>
                          <Input
                            value={editingData.newsletter.title}
                            onChange={e =>
                              updateNewsletter("title", e.target.value)
                            }
                            placeholder="Stay Updated"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Newsletter Description
                          </label>
                          <Textarea
                            value={editingData.newsletter.description}
                            onChange={e =>
                              updateNewsletter("description", e.target.value)
                            }
                            placeholder="Subscribe to our newsletter for the latest updates and news."
                            rows={3}
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
              <Card>
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
                          className="font-medium"
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
                      <div className="space-y-2">
                        {section.links.map(link => (
                          <div key={link.id} className="relative flex gap-2">
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
                              className="flex-1"
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
                                className="pr-8"
                                disabled={isLoading}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 h-full px-2"
                                onClick={() =>
                                  setShowPageSelectorFor({
                                    sectionId: section.id,
                                    linkId: link.id,
                                  })
                                }
                                disabled={isLoading}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLink(section.id, link.id)}
                              className="text-destructive hover:text-destructive"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            {/* Page Selector Dropdown */}
                            {showPageSelectorFor?.sectionId === section.id &&
                              showPageSelectorFor?.linkId === link.id && (
                                <PageSelector
                                  onSelect={handlePageSelect}
                                  onCancel={() => setShowPageSelectorFor(null)}
                                  currentHref={link.href || ""}
                                  currentText={link.text}
                                />
                              )}
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

            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Social Links
                    <Button
                      onClick={addSocialLink}
                      size="sm"
                      disabled={isLoading}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Social Link
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {editingData.socialLinks.map(social => (
                    <div key={social.id} className="flex items-center gap-2">
                      <select
                        value={social.platform}
                        onChange={e =>
                          updateSocialLink(
                            social.id,
                            "platform",
                            e.target.value
                          )
                        }
                        className="border-border bg-background rounded-md border px-3 py-2"
                        disabled={isLoading}
                      >
                        {socialPlatforms.map(platform => (
                          <option key={platform.name} value={platform.name}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={social.href || ""}
                        onChange={e =>
                          updateSocialLink(social.id, "href", e.target.value)
                        }
                        placeholder="Social media URL"
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(social.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-t pt-4">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
