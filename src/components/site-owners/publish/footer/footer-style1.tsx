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
  Youtube,
  Music2,
  Globe,
  Instagram,
  Linkedin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface FooterStyle1Props {
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
  LinkedIn: Linkedin, // Alternative spelling
  Youtube,
  YouTube: Youtube, // Alternative spelling
  Music2,
  Tiktok: Music2, // Map Tiktok to Music2 icon
  Globe,
};

// Helper function to render social icons with proper fallback
const renderSocialIcon = (social: SocialLink) => {
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-4 w-4" />;
  }

  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-4 w-4" />;
  }

  return <Facebook className="h-4 w-4" />;
};

// Logo component
const FooterLogo = ({ footerData }: { footerData: FooterData }) => {
  const { logoType, logoImage, logoText, companyName } = footerData;

  if (logoType === "text") {
    return (
      <div className="flex items-center">
        <span className="text-foreground text-xl font-bold">
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
        <span className="text-foreground text-xl font-bold">{companyName}</span>
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
      <span className="text-foreground text-xl font-bold">
        {logoText || companyName}
      </span>
    </div>
  );
};

export function FooterStyle1({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle1Props) {
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
      return `/publish/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/publish/${siteUser}/${cleanHref}`;
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

  return (
    <div className="group relative">
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="mb-4">
                <FooterLogo footerData={footerData} />
              </div>

              <p className="text-muted-foreground mb-6 max-w-md">
                {footerData.description}
              </p>

              {/* Contact Info */}
              <div className="mb-6 space-y-2">
                {footerData.contactInfo.email && (
                  <div className="text-muted-foreground flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {footerData.contactInfo.email}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.phone && (
                  <div className="text-muted-foreground flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {footerData.contactInfo.phone}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.address && (
                  <div className="text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {footerData.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {footerData.socialLinks.map(social => (
                  <Button
                    key={social.id}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
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

            {/* Link Sections */}
            {footerData.sections.map(section => (
              <div key={section.id}>
                <h4 className="text-foreground mb-4 font-semibold">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.id}>
                      {isEditable ? (
                        <button
                          className="text-muted-foreground hover:text-foreground text-left text-sm transition-colors"
                          onClick={e => handleLinkClick(link.href, e)}
                        >
                          {link.text}
                        </button>
                      ) : (
                        <a
                          href={generateLinkHref(link.href || "")}
                          className="text-muted-foreground hover:text-foreground block text-left text-sm transition-colors"
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

          {/* Newsletter */}
          {footerData.newsletter.enabled && (
            <div className="border-border mt-12 border-t pt-8">
              <div className="mx-auto max-w-md text-center">
                <h4 className="text-foreground mb-2 font-semibold">
                  {footerData.newsletter.title}
                </h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  {footerData.newsletter.description}
                </p>

                {subscriptionStatus === "success" ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Successfully subscribed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit}>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="flex-1"
                          disabled={
                            isEditable || createNewsletterMutation.isPending
                          }
                        />
                        <Button
                          type="submit"
                          style={{
                            backgroundColor: theme.colors.primary,
                          }}
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
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errorMessage}</span>
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="border-border mt-8 border-t pt-8 text-center">
            <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
              {footerData.copyright}
              <Heart className="inline h-3 w-3 text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
