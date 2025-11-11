import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Edit,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Music2,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface FooterStyle5Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

// Complete icon mapping to resolve serialized icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  LinkedIn: Linkedin,
  Youtube,
  YouTube: Youtube,
  Music2,
  Tiktok: Music2,
  Globe,
};

// Helper function to render social icons with proper fallback
const renderSocialIcon = (social: SocialLink) => {
  // First, try to get the icon from the mapping based on platform name
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-5 w-5" />;
  }

  // If the icon is a proper React component (function), use it directly
  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-5 w-5" />;
  }

  // Fallback to a default icon if nothing else works
  return <Globe className="h-5 w-5" />;
};

// Logo component
const FooterLogo = ({ footerData }: { footerData: FooterData }) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  if (logoType === "text") {
    return (
      <div className="flex items-center">
        <span className="text-heading-light dark:text-heading-dark text-xl font-bold">
          {logoText || companyName}
        </span>
      </div>
    );
  }

  if (logoType === "image") {
    return logoImage ? (
      <div className="flex items-center">
        <img
          src={logoImage}
          alt={companyName}
          className="h-8 w-auto object-contain"
        />
      </div>
    ) : (
      <div className="flex items-center">
        <span className="text-heading-light dark:text-heading-dark text-xl font-bold">
          {companyName}
        </span>
      </div>
    );
  }

  // logoType === "both"
  return (
    <div className="flex items-center gap-3">
      {logoImage && (
        <img
          src={logoImage}
          alt={companyName}
          className="h-8 w-auto object-contain"
        />
      )}
      <span className="text-heading-light dark:text-heading-dark text-xl font-bold">
        {logoText || companyName}
      </span>
    </div>
  );
};

export function FooterStyle5({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle5Props) {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const deleteFooterMutation = useDeleteFooterMutation();
  const createNewsletterMutation = useCreateNewsletter();

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Function to generate the correct href for links
  const generateLinkHref = (originalHref: string) => {
    if (isEditable) return originalHref;

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  const handleLinkClick = (href: string | undefined, e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      return;
    }

    if (isEditable) {
      e.preventDefault();
      return;
    }

    if (
      href.includes("/preview?") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    e.preventDefault();
    const generatedHref = generateLinkHref(href);
    window.location.href = generatedHref;
  };

  const handleDelete = () => {
    deleteFooterMutation.mutate();
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    try {
      await createNewsletterMutation.mutateAsync({
        email: email.trim(),
        is_subscribed: true,
      });

      setSubscriptionStatus("success");
      setEmail("");
      setErrorMessage("");

      setTimeout(() => {
        setSubscriptionStatus("idle");
      }, 3000);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setErrorMessage(
        error?.message || "Failed to subscribe. Please try again."
      );
      setSubscriptionStatus("error");
    }
  };

  // Get available sections, fallback to creating sections if none exist
  const availableSections =
    footerData.sections.length > 0
      ? footerData.sections
      : [{ id: "default", title: "Quick Links", links: [] }];

  const sectionsToShow = availableSections.slice(0, 3);

  return (
    <div className="group relative">
      <footer className="bg-background-light dark:bg-background-dark font-display border-t px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-4">
                <FooterLogo footerData={footerData} />
              </div>

              <p className="text-text-light dark:text-text-dark mb-6 max-w-md">
                {footerData.description}
              </p>

              {/* Contact Info */}
              <div className="mb-6 space-y-2">
                {footerData.contactInfo.email && (
                  <div className="text-text-light dark:text-text-dark flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {footerData.contactInfo.email}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.phone && (
                  <div className="text-text-light dark:text-text-dark flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {footerData.contactInfo.phone}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.address && (
                  <div className="text-text-light dark:text-text-dark flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {footerData.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links - Horizontal Layout */}
              <div>
                <h4 className="text-heading-light dark:text-heading-dark mb-3 font-semibold">
                  Follow Us
                </h4>
                {footerData.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {footerData.socialLinks.map(social => (
                      <Button
                        key={social.id}
                        variant="ghost"
                        size="sm"
                        className="text-text-light dark:text-text-dark hover:text-primary h-10 w-10 p-0 dark:hover:text-white"
                        onClick={e => handleLinkClick(social.href, e)}
                        {...(!isEditable &&
                          social.href && {
                            as: "a",
                            href: social.href.startsWith("http")
                              ? social.href
                              : generateLinkHref(social.href),
                          })}
                      >
                        {renderSocialIcon(social)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-light dark:text-text-dark text-sm opacity-60">
                    No social links available
                  </p>
                )}
              </div>
            </div>

            {/* Render the first 3 sections */}
            {sectionsToShow
              .filter(section => section.links.length > 0)
              .map(section => (
                <div key={section.id} className="col-span-1">
                  <h3 className="text-heading-light dark:text-heading-dark mb-4 font-bold">
                    {section.title}
                  </h3>

                  <ul className="space-y-3">
                    {section.links.map(link => (
                      <li key={link.id}>
                        {isEditable ? (
                          <button
                            className="text-text-light dark:text-text-dark hover:text-primary text-left transition-colors dark:hover:text-white"
                            onClick={e => handleLinkClick(link.href, e)}
                          >
                            {link.text}
                          </button>
                        ) : (
                          <a
                            href={generateLinkHref(link.href || "")}
                            className="text-text-light dark:text-text-dark hover:text-primary block text-left transition-colors dark:hover:text-white"
                          >
                            {link.text}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {/* Copyright */}
          <div className="mx-auto mt-12 border-t border-gray-300 pt-8 text-center dark:border-gray-700">
            <p className="text-text-light dark:text-text-dark flex items-center justify-center gap-1 text-sm">
              {footerData.copyright ||
                `© ${new Date().getFullYear()} ${footerData.companyName}. All rights reserved.`}
              <Heart className="inline h-3 w-3 text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
