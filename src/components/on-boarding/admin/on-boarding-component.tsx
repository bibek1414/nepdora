"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Music2,
  Upload,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { siteConfigAPI } from "@/services/api/owner-sites/admin/site-config";
import { onboardingAPI } from "@/services/auth/onboarding";
import { SiteConfig } from "@/types/owner-site/admin/site-config";
import { decodeJwt } from "@/lib/utils";

interface OnboardingModalProps {
  userData: {
    storeName: string;
    email: string;
    phoneNumber: string;
  };
  isOverlay?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

interface OnboardingFormData {
  businessName: string;
  logo?: File;
  favicon?: File;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  socialLinks: string[];
}

// Social media platform configuration
const socialPlatforms = [
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
    field: "instagram_url",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/username",
    field: "facebook_url",
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
    field: "twitter_url",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
    field: "linkedin_url",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@channel",
    field: "youtube_url",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: Music2,
    placeholder: "https://tiktok.com/@username",
    field: "tiktok_url",
  },
];

export default function OnboardingModal({
  userData,
  isOverlay = false,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const router = useRouter();
  const { tokens, user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingConfig, setExistingConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: userData.storeName || "",
    address: "",
    phone: userData.phoneNumber || "",
    email: userData.email || "",
    workingHours: "",
    socialLinks: Array(socialPlatforms.length).fill(""),
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  // Load existing site config on component mount
  useEffect(() => {
    const loadExistingConfig = async () => {
      if (!tokens?.access_token) {
        setIsLoading(false);
        return;
      }

      try {
        const config = await siteConfigAPI.getSiteConfig();
        setExistingConfig(config);

        if (config) {
          setFormData(prev => ({
            ...prev,
            businessName: config.business_name || userData.storeName || "",
            address: config.address || "",
            phone: config.phone || userData.phoneNumber || "",
            email: config.email || userData.email || "",
            workingHours: config.working_hours || "",
            socialLinks: socialPlatforms.map(
              platform =>
                (config[platform.field as keyof SiteConfig] as string) || ""
            ),
          }));

          if (config.logo) setLogoPreview(config.logo);
          if (config.favicon) setFaviconPreview(config.favicon);
        }
      } catch (error) {
        console.error("Error loading existing config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingConfig();
  }, [tokens, userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, favicon: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.businessName;
      case 3:
        return !!formData.email;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // NEW: Handle step click
  const handleStepClick = (stepNumber: number) => {
    // Allow navigation to any step
    setCurrentStep(stepNumber);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (isOverlay && onClose) {
      onClose();
    } else {
      router.push("/admin");
    }
  };

  const updateOnboardingStatus = () => {
    console.log("🔄 Updating onboarding status to complete...");

    if (updateUser) {
      updateUser({ is_onboarding_complete: true });
      console.log("✅ Updated via AuthContext updateUser");
    }

    try {
      const currentUser = localStorage.getItem("authUser");
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        const updatedUser = {
          ...parsedUser,
          is_onboarding_complete: true,
        };
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
        console.log("✅ Updated localStorage with onboarding complete: true");
      }
    } catch (error) {
      console.error("❌ Error updating localStorage:", error);
    }

    try {
      const storedTokens = localStorage.getItem("authTokens");
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        if (tokens.access_token) {
          const payload = decodeJwt(tokens.access_token);
          if (payload) {
            const updatedPayload = {
              ...payload,
              is_onboarding_complete: true,
            };
          }
        }
      }
    } catch (error) {
      console.error("Error updating token data:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.businessName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!tokens?.access_token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const siteConfigFormData = new FormData();
      siteConfigFormData.append("business_name", formData.businessName);
      siteConfigFormData.append("email", formData.email);

      if (formData.address) {
        siteConfigFormData.append("address", formData.address);
      }
      if (formData.phone) {
        siteConfigFormData.append("phone", formData.phone);
      }
      if (formData.workingHours) {
        siteConfigFormData.append("working_hours", formData.workingHours);
      }
      if (formData.logo) {
        siteConfigFormData.append("logo", formData.logo);
      }
      if (formData.favicon) {
        siteConfigFormData.append("favicon", formData.favicon);
      }

      formData.socialLinks.forEach((link, index) => {
        if (link.trim()) {
          const platform = socialPlatforms[index];
          siteConfigFormData.append(platform.field, link);
        }
      });

      let siteConfigResponse;
      if (existingConfig && existingConfig.id) {
        siteConfigResponse = await siteConfigAPI.patchSiteConfig(
          existingConfig.id,
          siteConfigFormData,
          tokens.access_token
        );
        toast.success("Site configuration updated successfully!");
      } else {
        siteConfigResponse = await siteConfigAPI.createSiteConfig(
          siteConfigFormData,
          tokens.access_token
        );
        toast.success("Site configuration created successfully!");
      }

      await onboardingAPI.completeOnboarding(tokens.access_token);
      toast.success("Onboarding completed successfully!");

      updateOnboardingStatus();

      if (onComplete) {
        onComplete();
      }

      handleClose();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Onboarding error:", error);

      if (error?.status === 409) {
        toast.error(
          "Site configuration already exists. Please check your settings."
        );
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to complete onboarding. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: "General" },
    { number: 2, label: "Branding" },
    { number: 3, label: "Contacts" },
    { number: 4, label: "Social links" },
    { number: 5, label: "Summary" },
  ];

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl">
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p>Loading your site configuration...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-3xl p-0">
        <div className="flex h-[80vh] overflow-hidden rounded-lg">
          {/* Left sidebar */}
          <div className="w-80 bg-gray-50 p-8">
            <h2 className="mb-2 text-2xl font-bold">
              {existingConfig ? "Update your site" : "Set up your site"}
            </h2>
            <p className="mb-8 text-sm text-gray-600">
              {existingConfig
                ? "Update your site configuration"
                : "in 5 simple steps"}
            </p>

            <div className="space-y-4">
              {steps.map(step => (
                <button
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  className="flex w-full cursor-pointer items-center space-x-3 text-left transition-all hover:translate-x-1"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                      currentStep === step.number
                        ? "border-2 border-blue-600 bg-white text-blue-600 shadow-sm"
                        : currentStep > step.number
                          ? "bg-blue-600 text-white"
                          : "border-2 border-gray-300 bg-white text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <span
                    className={`transition-colors ${
                      currentStep >= step.number
                        ? "font-medium text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-8">
              {/* Step 1: General */}
              {currentStep === 1 && (
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    {existingConfig
                      ? "Business Information"
                      : "Tell us about your business"}
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {existingConfig
                      ? "Update your business information"
                      : "Basic information about your store"}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">
                        Business name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="mt-1"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Branding */}
              {currentStep === 2 && (
                <div>
                  <h3 className="mb-2 text-2xl font-bold">Branding Assets</h3>
                  <p className="mb-6 text-gray-600">
                    Your logo and favicon will automatically populate across
                    relevant areas of the site
                  </p>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Logo Section */}
                    <div>
                      <Label>Logo</Label>
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("logo")?.click()}
                        className="mt-2 flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-full max-w-full object-contain p-4"
                          />
                        ) : (
                          <div className="flex flex-col items-center space-y-2 text-gray-400">
                            <Upload className="h-8 w-8" />
                            <span className="text-sm">
                              {existingConfig?.logo
                                ? "Click to change logo"
                                : "Click to upload logo"}
                            </span>
                          </div>
                        )}
                      </button>
                      <p className="mt-2 text-sm text-gray-500">
                        Recommended: PNG or SVG format
                      </p>
                    </div>

                    {/* Favicon Section */}
                    <div>
                      <Label>Favicon</Label>
                      <input
                        type="file"
                        id="favicon"
                        accept="image/*"
                        onChange={handleFaviconChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("favicon")?.click()
                        }
                        className="mt-2 flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
                      >
                        {faviconPreview ? (
                          <img
                            src={faviconPreview}
                            alt="Favicon preview"
                            className="max-h-16 max-w-16 object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center space-y-2 text-gray-400">
                            <Upload className="h-8 w-8" />
                            <span className="text-sm">
                              {existingConfig?.favicon
                                ? "Click to change favicon"
                                : "Click to upload favicon"}
                            </span>
                          </div>
                        )}
                      </button>
                      <p className="mt-2 text-sm text-gray-500">
                        Recommended size: 16x16 or 32x32 pixels
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contacts */}
              {currentStep === 3 && (
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Contact Information
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Help your visitors to contact you
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. 1st Example st., Example City, Example Country"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +1 234 567 8910"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="workingHours">Working hours</Label>
                      <Input
                        id="workingHours"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleInputChange}
                        placeholder="e.g. Sun: Closed, Mon-Fri: 8 am-6 pm, Sat: 10 am-4 pm"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Social links */}
              {currentStep === 4 && (
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Social Media Links
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Connect with your visitors on social networks
                  </p>

                  <div className="space-y-4">
                    {socialPlatforms.map((platform, index) => {
                      const IconComponent = platform.icon;

                      return (
                        <div
                          key={platform.key}
                          className="flex items-center space-x-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`social-${platform.key}`}>
                              {platform.label}
                            </Label>
                            <Input
                              id={`social-${platform.key}`}
                              value={formData.socialLinks[index]}
                              onChange={e =>
                                handleSocialLinkChange(index, e.target.value)
                              }
                              placeholder={platform.placeholder}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Summary */}
              {currentStep === 5 && (
                <div>
                  <h3 className="mb-2 text-2xl font-bold">Summary</h3>
                  <p className="mb-6 text-gray-600">
                    Please review your website information
                  </p>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="font-medium">{formData.businessName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Logo</p>
                        <p className="font-medium">
                          {logoPreview
                            ? "New logo uploaded"
                            : existingConfig?.logo
                              ? "Keep current logo"
                              : "No logo"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Favicon</p>
                        <p className="font-medium">
                          {faviconPreview
                            ? "New favicon uploaded"
                            : existingConfig?.favicon
                              ? "Keep current favicon"
                              : "No favicon"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Contacts</p>
                      <p className="font-medium">{formData.email}</p>
                      {formData.phone && (
                        <p className="text-sm text-gray-600">
                          {formData.phone}
                        </p>
                      )}
                      {formData.address && (
                        <p className="text-sm text-gray-600">
                          {formData.address}
                        </p>
                      )}
                      {formData.workingHours && (
                        <p className="text-sm text-gray-600">
                          {formData.workingHours}
                        </p>
                      )}
                    </div>

                    {formData.socialLinks.some(link => link.trim()) && (
                      <div>
                        <p className="text-sm text-gray-500">Social Links</p>
                        <div className="mt-2 space-y-2">
                          {formData.socialLinks.map((link, index) => {
                            if (!link.trim()) return null;
                            const platform = socialPlatforms[index];
                            const IconComponent = platform.icon;
                            return (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <IconComponent className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {link}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer navigation */}
            <div className="flex items-center justify-between border-t p-6">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="flex space-x-2">
                {currentStep < 5 && currentStep > 1 && (
                  <Button variant="ghost" onClick={nextStep}>
                    Skip
                  </Button>
                )}

                {currentStep < 5 ? (
                  <Button onClick={nextStep}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting
                      ? "Submitting..."
                      : existingConfig
                        ? "Update Configuration"
                        : "Finish Setup"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
