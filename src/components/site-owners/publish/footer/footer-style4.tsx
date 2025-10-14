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
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface FooterStyle4Props {
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

export function FooterStyle4({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle4Props) {
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
      return `/publish/${siteUser}`;
    }

    // Remove leading slash and hash if present
    const cleanHref = originalHref.replace(/^[#/]+/, "");

    return `/publish/${siteUser}/${cleanHref}`;
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

  // Get the first two sections for the grid layout
  const linkSections = footerData.sections.slice(0, 2);

  // Get contact info
  const contactInfo = footerData.contactInfo;

  return (
    <div className="group relative">
      <footer className="bg-[#474A47] px-4 py-16 text-gray-100 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">
              {footerData.newsletter.title || "Stay Connected"}
            </h2>

            {subscriptionStatus === "success" ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-6 w-6" />
                <span>Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit}>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-none border-x-0 border-t-0 border-b border-gray-300 bg-transparent py-2 text-gray-100 placeholder-gray-300 focus:border-white focus:outline-none"
                    disabled={isEditable || createNewsletterMutation.isPending}
                  />
                </div>

                <Button
                  type="submit"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                  className="mt-6 flex w-full items-center justify-center space-x-2 rounded-md px-6 py-3 transition-colors hover:opacity-90 sm:w-auto"
                  disabled={isEditable || createNewsletterMutation.isPending}
                >
                  <span>
                    {createNewsletterMutation.isPending
                      ? "Subscribing..."
                      : "Subscribe Now"}
                  </span>
                  {!createNewsletterMutation.isPending && (
                    <ArrowRight size={20} />
                  )}
                </Button>

                {subscriptionStatus === "error" && errorMessage && (
                  <div className="mt-2 flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errorMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2 md:justify-self-center">
            {linkSections.map(section => (
              <div key={section.id}>
                <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-left hover:text-gray-300"
                          onClick={e => handleLinkClick(link.href, e)}
                        >
                          {link.text}
                        </button>
                      ) : (
                        <a
                          href={generateLinkHref(link.href || "")}
                          className="block hover:text-gray-300"
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

          {/* Contact Info */}
          <div className="md:col-span-1 md:justify-self-end">
            <div className="mb-8">
              <h3 className="mb-2 text-xl font-semibold">
                We&apos;re just a call away.
              </h3>
              <p className="text-lg">
                {contactInfo.phone || "+1 (800) 456-7890"}
              </p>
            </div>
            <div className="mb-8">
              <h3 className="mb-2 text-xl font-semibold">Got a question?</h3>
              <p className="text-lg">
                {contactInfo.email || "contact@company.com"}
              </p>
            </div>
            <div className="flex space-x-4">
              {footerData.socialLinks.map(social => (
                <Button
                  key={social.id}
                  variant="outline"
                  size="icon"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 text-white transition hover:bg-gray-600"
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

        {/* Copyright */}
        <div className="mx-auto mt-12 max-w-7xl border-t border-gray-400 pt-8 text-center">
          <p className="text-sm text-gray-300">
            {footerData.copyright ||
              `© ${new Date().getFullYear()} ${footerData.companyName}. All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  );
}
