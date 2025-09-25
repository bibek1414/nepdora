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

interface FooterStyle5Props {
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
  Youtube,
  Globe,
  Music2,
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
  return <Globe className="h-4 w-4" />;
};

export function FooterStyle5({
  footerData,
  isEditable,
  onEditClick,
  siteUser,
}: FooterStyle5Props) {
  const [email, setEmail] = useState("");
  const deleteFooterMutation = useDeleteFooterMutation();
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

  // Get available sections, fallback to creating sections if none exist
  const availableSections =
    footerData.sections.length > 0
      ? footerData.sections
      : [{ id: "default", title: "Quick Links", links: [] }];

  const sectionsToShow = availableSections.slice(0, 4);
  return (
    <div className="group relative">
      <footer className="bg-background-light dark:bg-background-dark font-display px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Render the first 4 sections */}
          {sectionsToShow
            .filter(section => section.links.length > 0) // only keep sections that have links
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
                          className="text-text-light dark:text-text-dark hover:text-primary text-left dark:hover:text-white"
                          onClick={e => handleLinkClick(link.href, e)}
                        >
                          {link.text}
                        </button>
                      ) : (
                        <a
                          href={generateLinkHref(link.href || "")}
                          className="text-text-light dark:text-text-dark hover:text-primary block dark:hover:text-white"
                        >
                          {link.text}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          {/* Social Links Section */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h3 className="text-heading-light dark:text-heading-dark mb-4 font-bold">
              Social
            </h3>
            {footerData.socialLinks.length > 0 ? (
              <div className="flex flex-col space-y-6">
                {footerData.socialLinks.map(social => (
                  <Button
                    key={social.id}
                    variant="ghost"
                    size="icon"
                    className="text-text-light dark:text-text-dark hover:text-primary h-6 w-6 justify-start p-0 dark:hover:text-white"
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

        {/* Copyright */}
        <div className="mx-auto mt-12 max-w-7xl border-t border-gray-300 pt-8 text-center dark:border-gray-700">
          <p className="text-text-light dark:text-text-dark text-sm">
            {footerData.copyright ||
              `© ${new Date().getFullYear()} ${footerData.companyName}. All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  );
}
