import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import {
  Plus,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { NavbarLogo } from "../navbar-logo";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableLink } from "@/components/ui/navbar/editable-link";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="group relative flex items-center">{children}</div>
);

interface NavbarStyleProps {
  navbarData: NavbarData;
  isEditable?: boolean;
  onEditLogo?: () => void;
  onAddLink?: () => void;
  siteUser: string;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
  onEditCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle8: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onAddLink,
  onEditLink,
  onDeleteLink,
  disableClicks = false,
}) => {
  const { links } = navbarData;

  // Fetch site config for social media links
  const { data: siteConfig } = useSiteConfig();

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

  const generateLinkHref = (originalHref: string) => {
    if (isEditable || disableClicks) return "#";

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  // Social media icon mapping
  const socialIcons = [
    { key: "facebook_url", icon: Facebook, label: "Facebook" },
    { key: "instagram_url", icon: Instagram, label: "Instagram" },
    { key: "twitter_url", icon: Twitter, label: "Twitter" },
    { key: "linkedin_url", icon: Linkedin, label: "LinkedIn" },
    { key: "youtube_url", icon: Youtube, label: "YouTube" },
  ];

  // Filter available social links
  const availableSocialLinks = socialIcons.filter(social => {
    const url = siteConfig?.[social.key as keyof typeof siteConfig];
    return url && url !== "";
  });

  return (
    <>
      <div className="bg-white shadow-md">
        <header className="relative bg-white">
          <nav
            aria-label="Top"
            className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
              disableClicks ? "pointer-events-none" : ""
            }`}
            style={{ fontFamily: theme.fonts.heading }}
          >
            <div className="flex h-20 items-center justify-between">
              {/* Left: Logo */}
              <div
                className={`flex ${disableClicks ? "pointer-events-auto" : ""}`}
              >
                {isEditable && onEditLogo ? (
                  <EditableItem onEdit={onEditLogo}>
                    <NavbarLogo
                      data={navbarData}
                      isEditable={isEditable}
                      onEdit={onEditLogo}
                    />
                  </EditableItem>
                ) : (
                  <div
                    onClick={
                      disableClicks ? e => e.preventDefault() : undefined
                    }
                  >
                    <NavbarLogo data={navbarData} siteUser={siteUser} />
                  </div>
                )}
              </div>

              {/* Center: Navigation Links */}
              <div className="flex items-center gap-8">
                {links.map((link, index) => (
                  <React.Fragment key={link.id}>
                    {isEditable ? (
                      <EditableItem
                        onEdit={() => onEditLink && onEditLink(link)}
                        onDelete={() => onDeleteLink && onDeleteLink(link.id)}
                      >
                        <EditableLink
                          text={link.text}
                          href={link.href}
                          onChange={(text, href) => {
                            if (onEditLink) {
                              onEditLink({ ...link, text, href });
                            }
                          }}
                          isEditable={isEditable}
                          siteUser={siteUser}
                          className="hover:text-primary flex cursor-pointer items-center gap-1.5 font-medium text-gray-700"
                          textPlaceholder="Link text..."
                          hrefPlaceholder="Enter URL..."
                        />
                      </EditableItem>
                    ) : (
                      <a
                        href={generateLinkHref(link.href)}
                        onClick={e => handleLinkClick(e, link.href)}
                        className={`hover:text-primary font-medium text-gray-700 ${
                          disableClicks
                            ? "cursor-default opacity-60"
                            : "cursor-pointer"
                        }`}
                      >
                        {link.text}
                      </a>
                    )}
                  </React.Fragment>
                ))}

                {isEditable && onAddLink && (
                  <Button
                    onClick={onAddLink}
                    variant="ghost"
                    size="sm"
                    className="pointer-events-auto h-7 px-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Right: Social Icons & User Actions */}
              <div className="flex items-center gap-3">
                {/* Social Media Icons */}
                {availableSocialLinks.length > 0 && (
                  <div className="flex items-center gap-2 pr-3">
                    {availableSocialLinks.map(social => {
                      const Icon = social.icon;
                      const url = siteConfig?.[
                        social.key as keyof typeof siteConfig
                      ] as string;

                      return (
                        <a
                          key={social.key}
                          href={disableClicks ? "#" : url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => disableClicks && e.preventDefault()}
                          className={`rounded-full p-2 transition-colors hover:bg-gray-100 ${
                            disableClicks
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          }`}
                          aria-label={social.label}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{ color: theme.colors.primary }}
                          />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
};
