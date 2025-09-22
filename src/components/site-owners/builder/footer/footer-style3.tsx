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
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface FooterStyle3Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
  siteUser?: string;
}

// Icon mapping to resolve serialized icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
};

// Helper function to render social icons with proper fallback
const renderSocialIcon = (social: SocialLink) => {
  // First, try to get the icon from the mapping based on platform name
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-4 w-4" />;
  }

  // If the icon is a proper React component (function), use it directly
  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-4 w-4" />;
  }

  // Fallback to a default icon if nothing else works
  return <Facebook className="h-4 w-4" />;
};

export function FooterStyle3({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle3Props) {
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
    if (isEditable) return originalHref; // Keep original href for editable mode

    // For preview mode, generate the correct route
    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    // Remove leading slash and hash if present
    const cleanHref = originalHref.replace(/^[#/]+/, "");

    return `/preview/${siteUser}/${cleanHref}`;
  };

  const handleLinkClick = (href: string | undefined, e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      return;
    }

    if (isEditable) {
      // In editable mode, prevent navigation
      e.preventDefault();
      return;
    }

    // For external links or special cases
    if (
      href.includes("/preview?") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      // Allow these to navigate normally
      return;
    }

    // For internal links, use our generated href
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

    // Basic email validation
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

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus("idle");
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to subscribe. Please try again."
      );
      setSubscriptionStatus("error");
    }
  };

  // Get the first three sections for the grid layout
  const mainSections = footerData.sections.slice(0, 3);

  return (
    <div className="group relative">
      {isEditable && (
        <div className="bg-background/80 absolute top-4 right-4 z-20 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={onEditClick}
            className=""
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Footer
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteFooterMutation.isPending}
            className=""
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <footer
        style={{
          background: theme.colors.primary,
          fontFamily: theme.fonts.heading,
        }}
        className="px-4 py-16 text-gray-100 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Footer links grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Info Section */}
            {mainSections.map((section, index) => (
              <div key={section.id} className="col-span-1">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-left text-white/80 transition-colors hover:text-white"
                          onClick={e => handleLinkClick(link.href, e)}
                        >
                          {link.text}
                        </button>
                      ) : (
                        <a
                          href={generateLinkHref(link.href || "")}
                          className="block text-white/80 transition-colors hover:text-white"
                        >
                          {link.text}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            {footerData.newsletter.enabled && (
              <div className="col-span-2 lg:col-span-2">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {footerData.newsletter.title}
                </h3>
                <p className="mb-4 text-sm text-white/80">
                  {footerData.newsletter.description}
                </p>

                {subscriptionStatus === "success" ? (
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Successfully subscribed!</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-full border-none bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-300"
                        disabled={
                          isEditable || createNewsletterMutation.isPending
                        }
                      />
                      <Button
                        type="submit"
                        style={{
                          backgroundColor: theme.colors.secondary,
                        }}
                        className="w-full rounded-full px-8 py-3 font-semibold text-white transition-colors hover:opacity-90 sm:w-auto"
                        disabled={
                          isEditable || createNewsletterMutation.isPending
                        }
                      >
                        {createNewsletterMutation.isPending
                          ? "Subscribing..."
                          : "Subscribe"}
                      </Button>
                    </div>

                    {subscriptionStatus === "error" && errorMessage && (
                      <div className="flex items-center gap-2 text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errorMessage}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="mt-16 flex flex-col items-center justify-between border-t border-white/20 pt-8 text-sm text-gray-200 md:flex-row">
            {/* Logo and Company Name */}
            <div className="mb-4 flex items-center md:mb-0">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white p-1">
                <span className="text-lg font-bold text-[#106313]">
                  {footerData.companyName.charAt(0)}
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                {footerData.companyName}
              </span>
            </div>

            {/* Copyright */}
            <div className="mb-4 text-center md:mb-0 md:text-left">
              <p>{footerData.copyright}</p>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {footerData.socialLinks.map(social => (
                <Button
                  key={social.id}
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
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
          </div>
        </div>
      </footer>
    </div>
  );
}
