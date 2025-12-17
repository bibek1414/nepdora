"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useSiteConfig,
  useCreateSiteConfig,
  usePatchSiteConfig,
} from "@/hooks/owner-site/admin/use-site-config";
import { toast } from "sonner";
import { validateUrl, ApiError } from "@/utils/api-error";
import {
  Loader2,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

interface FieldErrors {
  [fieldName: string]: string[];
}

export const SiteConfigForm: React.FC = () => {
  const { data: siteConfig, isLoading } = useSiteConfig();
  const createMutation = useCreateSiteConfig();
  const patchMutation = usePatchSiteConfig();

  console.log("siteConfig", siteConfig);

  const [formData, setFormData] = useState({
    instagram_url: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    youtube_url: "",
    tiktok_url: "",
  });

  // Separate state for existing URLs and new uploads
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Track which fields have been modified
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  // Track if we've just created a config to prevent immediate patch mode
  const [hasJustCreated, setHasJustCreated] = useState(false);

  // Determine if we're in create mode (no existing config AND haven't just created one)
  const isCreateMode = !siteConfig && !hasJustCreated;

  useEffect(() => {
    if (siteConfig && !hasJustCreated) {
      setFormData({
        instagram_url: siteConfig.instagram_url || "",
        facebook_url: siteConfig.facebook_url || "",
        twitter_url: siteConfig.twitter_url || "",
        linkedin_url: siteConfig.linkedin_url || "",
        youtube_url: siteConfig.youtube_url || "",
        tiktok_url: siteConfig.tiktok_url || "",
      });

      // Store existing URLs separately
      setFaviconUrl(siteConfig.favicon || null);
      setLogoUrl(siteConfig.logo || null);
      setFaviconFile(null);
      setLogoFile(null);
      setModifiedFields(new Set());
    }
  }, [siteConfig, hasJustCreated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Track modified field (only in patch mode)
    if (!isCreateMode) {
      setModifiedFields(prev => new Set(prev).add(name));
    }
  };

  const handleFaviconChange = (files: File | File[] | null) => {
    const file = Array.isArray(files) ? files[0] : files;
    setFaviconFile(file);

    if (!isCreateMode) {
      setModifiedFields(prev => new Set(prev).add("favicon"));
    }
  };

  const handleLogoChange = (files: File | File[] | null) => {
    const file = Array.isArray(files) ? files[0] : files;
    setLogoFile(file);

    if (!isCreateMode) {
      setModifiedFields(prev => new Set(prev).add("logo"));
    }
  };

  const handleCancel = () => {
    // Reset form to original state
    if (siteConfig) {
      setFormData({
        instagram_url: siteConfig.instagram_url || "",
        facebook_url: siteConfig.facebook_url || "",
        twitter_url: siteConfig.twitter_url || "",
        linkedin_url: siteConfig.linkedin_url || "",
        youtube_url: siteConfig.youtube_url || "",
        tiktok_url: siteConfig.tiktok_url || "",
      });

      // Reset image files to existing URLs
      setFaviconUrl(siteConfig.favicon || null);
      setLogoUrl(siteConfig.logo || null);
      setFaviconFile(null);
      setLogoFile(null);
    }

    // Clear field errors and modified fields
    setFieldErrors({});
    setModifiedFields(new Set());

    toast.info("Changes discarded");
  };

  const validateSocialUrls = (): { valid: boolean; errors: FieldErrors } => {
    const errors: FieldErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (value && !validateUrl(value)) {
        errors[key] = ["Enter a valid URL"];
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});

    // Validate URLs
    const urlValidation = validateSocialUrls();
    if (!urlValidation.valid) {
      setFieldErrors(urlValidation.errors);
      toast.error("Please fix the validation errors");
      return;
    }

    const submitData = new FormData();

    if (isCreateMode) {
      // CREATE: Send all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          submitData.append(key, value);
        }
      });

      if (faviconFile) {
        submitData.append("favicon", faviconFile);
      }

      if (logoFile) {
        submitData.append("logo", logoFile);
      }
    } else {
      // PATCH: Only send modified fields
      modifiedFields.forEach(field => {
        if (field === "favicon" && faviconFile) {
          submitData.append("favicon", faviconFile);
        } else if (field === "logo" && logoFile) {
          submitData.append("logo", logoFile);
        } else if (field in formData) {
          const value = formData[field as keyof typeof formData];
          if (value) {
            submitData.append(field, value);
          }
        }
      });
    }

    try {
      if (isCreateMode) {
        await createMutation.mutateAsync(submitData);
        toast.success("Site configuration created successfully!");
        setHasJustCreated(true);
      } else {
        // Pass ID along with data for PATCH
        if (!siteConfig?.id) {
          toast.error("Configuration ID not found");
          return;
        }
        await patchMutation.mutateAsync({
          id: siteConfig.id,
          data: submitData,
        });
        toast.success("Site configuration updated successfully!");
      }

      setModifiedFields(new Set());

      // Trigger favicon update in the browser
      if (faviconFile) {
        updateBrowserFavicon(URL.createObjectURL(faviconFile));
      }
    } catch (error) {
      console.error("Error saving site config:", error);

      if (error && typeof error === "object" && "fieldErrors" in error) {
        const apiError = error as ApiError;
        if (apiError.fieldErrors) {
          setFieldErrors(apiError.fieldErrors);
          toast.error("Please fix the validation errors");
          return;
        }
      }

      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as ApiError;

        switch (apiError.status) {
          case 413:
            toast.error(
              "File size too large. Please upload a smaller file (max 5MB)"
            );
            return;
          case 415:
            toast.error(
              "Invalid file type. Please upload a JPEG, PNG, or WebP image"
            );
            return;
        }
      }

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          `Failed to ${isCreateMode ? "create" : "update"} site configuration`
        );
      }
    }
  };

  const updateBrowserFavicon = (faviconUrl: string) => {
    const link =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = faviconUrl;
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">
              Loading site configuration...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSaving = createMutation.isPending || patchMutation.isPending;
  const hasModifications = isCreateMode || modifiedFields.size > 0;

  return (
    <div className="space-y-6 pb-24">
      {" "}
      {/* Added padding bottom for sticky button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Site Configuration</h1>
          <p className="text-muted-foreground">
            {isCreateMode
              ? "Create your site's branding and social media links"
              : "Manage your site's branding and social media links"}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Favicon and Logo side by side */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Favicon */}
              <div className="space-y-4">
                <Label>Favicon (16x16 or 32x32 recommended)</Label>

                {/* Show existing favicon if no new file is selected */}
                {!faviconFile && faviconUrl && (
                  <div className="bg-muted/50 mb-2 rounded-lg border p-4">
                    <p className="text-muted-foreground mb-2 text-sm">
                      Current favicon:
                    </p>
                    <img
                      src={faviconUrl}
                      alt="Current favicon"
                      className="h-8 w-8 rounded bg-white object-contain"
                    />
                  </div>
                )}

                <ImageUploader
                  value={faviconFile}
                  onChange={handleFaviconChange}
                  disabled={isSaving}
                  multiple={false}
                  maxFileSize={5 * 1024 * 1024}
                />
                <p className="text-muted-foreground text-sm">
                  The favicon appears in browser tabs and bookmarks
                </p>
              </div>

              {/* Logo */}
              <div className="space-y-4">
                <Label>Logo</Label>

                {/* Show existing logo if no new file is selected */}
                {!logoFile && logoUrl && (
                  <div className="bg-muted/50 mb-2 rounded-lg border p-4">
                    <p className="text-muted-foreground mb-2 text-sm">
                      Current logo:
                    </p>
                    <img
                      src={logoUrl}
                      alt="Current logo"
                      className="max-h-20 rounded bg-white object-contain"
                    />
                  </div>
                )}

                <ImageUploader
                  value={logoFile}
                  onChange={handleLogoChange}
                  disabled={isSaving}
                  multiple={false}
                  maxFileSize={5 * 1024 * 1024}
                />
                <p className="text-muted-foreground text-sm">
                  Your site logo displayed in the header
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                  className={fieldErrors.facebook_url ? "border-red-500" : ""}
                />
                {fieldErrors.facebook_url && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.facebook_url.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourprofile"
                  className={fieldErrors.instagram_url ? "border-red-500" : ""}
                />
                {fieldErrors.instagram_url && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.instagram_url.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter</Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourhandle"
                  className={fieldErrors.twitter_url ? "border-red-500" : ""}
                />
                {fieldErrors.twitter_url && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.twitter_url.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className={fieldErrors.linkedin_url ? "border-red-500" : ""}
                />
                {fieldErrors.linkedin_url && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.linkedin_url.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube</Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/@yourchannel"
                  className={fieldErrors.youtube_url ? "border-red-500" : ""}
                />
                {fieldErrors.youtube_url && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.youtube_url.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok_url">TikTok</Label>
                <Input
                  id="tiktok_url"
                  name="tiktok_url"
                  value={formData.tiktok_url}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@yourusername"
                  className={fieldErrors.tiktok_url ? "border-red-500" : ""}
                />
                {fieldErrors.tiktok_url && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.tiktok_url.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Save Button */}
        {hasModifications && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
            <div className="bg-background/95 border-border rounded-lg border p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">
                    {modifiedFields.size} unsaved change
                    {modifiedFields.size !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    size="lg"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Submit Button (hidden when sticky is shown) */}
        {!hasModifications && (
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isSaving || !hasModifications}
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateMode ? "Create Configuration" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
