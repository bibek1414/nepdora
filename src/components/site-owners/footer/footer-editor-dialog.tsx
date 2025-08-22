import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  FooterData,
  FooterSection,
  FooterLink,
  SocialLink,
} from "@/types/owner-site/components/footer";

interface FooterEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footerData: FooterData;
  onSave: (data: FooterData) => void;
  isLoading?: boolean; // Add this prop
}

const socialPlatforms = [
  { name: "Facebook", icon: Facebook },
  { name: "Twitter", icon: Twitter },
  { name: "Instagram", icon: Instagram },
  { name: "LinkedIn", icon: Linkedin },
];

export function FooterEditorDialog({
  open,
  onOpenChange,
  footerData,
  onSave,
  isLoading = false, // Default to false
}: FooterEditorDialogProps) {
  const [editingData, setEditingData] = useState<FooterData>(footerData);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Footer Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Basic Information */}
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
                  onChange={e => updateBasicInfo("companyName", e.target.value)}
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
                  onChange={e => updateBasicInfo("description", e.target.value)}
                  placeholder="Company description"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Copyright Text
                </label>
                <Input
                  value={editingData.copyright}
                  onChange={e => updateBasicInfo("copyright", e.target.value)}
                  placeholder="© 2025 Your Company. All rights reserved."
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                  value={editingData.contactInfo.email || ""}
                  onChange={e => updateContactInfo("email", e.target.value)}
                  placeholder="hello@company.com"
                  type="email"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Phone</label>
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
                <Input
                  value={editingData.contactInfo.address || ""}
                  onChange={e => updateContactInfo("address", e.target.value)}
                  placeholder="Sankhapur, Kathmandu, Nepal"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Newsletter Settings
                <Badge
                  variant={
                    editingData.newsletter.enabled ? "default" : "secondary"
                  }
                >
                  {editingData.newsletter.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingData.newsletter.enabled}
                  onChange={e => updateNewsletter("enabled", e.target.checked)}
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
                      onChange={e => updateNewsletter("title", e.target.value)}
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
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Footer Sections */}
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
                      <div key={link.id} className="flex gap-2">
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
                          placeholder="URL"
                          className="flex-1"
                          disabled={isLoading}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(section.id, link.id)}
                          className="text-destructive hover:text-destructive"
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

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                Social Links
                <Button onClick={addSocialLink} size="sm" disabled={isLoading}>
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
                      updateSocialLink(social.id, "platform", e.target.value)
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
