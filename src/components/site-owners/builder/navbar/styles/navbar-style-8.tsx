import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { NavbarLogo } from "../navbar-logo";
import { EditableLink } from "@/components/ui/navbar/editable-link";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { cn } from "@/lib/utils";

const EditableItem: React.FC<{
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

  const pathname = usePathname();

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
      <div className="bg-background shadow-md font-body">
        <header className="relative bg-background">
          <nav
            aria-label="Top"
            className={cn(
              "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
              disableClicks && "pointer-events-none"
            )}
          >
            <div className="flex h-20 items-center justify-between">
              {/* Left: Logo */}
              <div
                className={`flex ${disableClicks ? "pointer-events-auto" : ""}`}
              >
                {isEditable && onEditLogo ? (
                  <EditableItem>
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
                      <EditableItem key={link.id}>
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
                          className="flex cursor-pointer items-center gap-1.5 font-medium text-foreground transition-colors hover:text-foreground/80"
                          textPlaceholder="Link text..."
                          hrefPlaceholder="Enter URL..."
                        />
                      </EditableItem>
                    ) : (
                      <Link
                        href={generateLinkHref(
                          link.href,
                          siteUser,
                          pathname,
                          isEditable,
                          disableClicks
                        )}
                        onClick={e => handleLinkClick(e, link.href)}
                        className={cn(
                          "font-medium text-foreground transition-colors hover:text-foreground/80",
                          disableClicks
                            ? "cursor-default opacity-60"
                            : "cursor-pointer"
                        )}
                      >
                        {link.text}
                      </Link>
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
                    Link
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
                        <Link
                          key={social.key}
                          href={disableClicks ? "#" : url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => disableClicks && e.preventDefault()}
                          className={cn(
                            "rounded-full p-2 transition-colors hover:bg-muted",
                            disableClicks
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          )}
                          aria-label={social.label}
                        >
                          <Icon className="h-5 w-5 text-foreground hover:text-foreground/80" />
                        </Link>
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
