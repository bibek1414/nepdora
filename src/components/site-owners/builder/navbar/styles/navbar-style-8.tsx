import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ShoppingCart,
  User,
} from "lucide-react";
import { NavbarLogo } from "../navbar-logo";
import { EditableLink } from "@/components/ui/navbar/editable-link";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/customer/use-auth";
import { useWishlist } from "@/hooks/customer/use-wishlist";
import { Heart, Package, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const { links, buttons, showCart, enableLogin } = navbarData;

  // Fetch site config for social media links
  const { data: siteConfig } = useSiteConfig();
  const { isAuthenticated, user, logout } = useAuth();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;
  const router = useRouter();

  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  const handleProfileAction = (action: string) => {
    if (disableClicks || isEditable) return;

    switch (action) {
      case "profile":
        router.push(generateLinkHref("/profile", siteUser, pathname));
        break;
      case "wishlist":
        router.push(generateLinkHref("/wishlist", siteUser, pathname));
        break;
      case "orders":
        router.push(generateLinkHref("/orders", siteUser, pathname));
        break;
      case "logout":
        logout();
        break;
    }
  };

  const handleLoginClick = () => {
    if (disableClicks || isEditable) return;
    router.push(generateLinkHref("/login", siteUser, pathname));
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
                          className="flex cursor-pointer items-center gap-1.5 font-medium text-black transition-colors hover:text-black/80"
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
                        className={`font-medium text-black transition-colors hover:text-black/80 ${
                          disableClicks
                            ? "cursor-default opacity-60"
                            : "cursor-pointer"
                        }`}
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
                          className={`rounded-full p-2 transition-colors hover:bg-gray-100 ${
                            disableClicks
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          }`}
                          aria-label={social.label}
                        >
                          <Icon className="h-5 w-5 text-black hover:text-black/80" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {enableLogin && (
                  <div className={disableClicks ? "pointer-events-auto" : ""}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-1 p-2 text-black transition-colors hover:text-black/80 ${
                            disableClicks || isEditable
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          }`}
                          onClick={
                            disableClicks ? e => e.preventDefault() : undefined
                          }
                        >
                          <User className="h-5 w-5" />
                          {isAuthenticated ? (
                            <>
                              <span className="hidden text-sm font-medium sm:inline-block">
                                {user?.first_name || "Account"}
                              </span>
                              <ChevronDown className="h-4 w-4" />
                            </>
                          ) : null}
                        </Button>
                      </DropdownMenuTrigger>
                      {!disableClicks && !isEditable && (
                        <DropdownMenuContent className="w-48" align="end">
                          {isAuthenticated ? (
                            <>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleProfileAction("profile")}
                              >
                                <User className="mr-2 h-4 w-4" />
                                My Profile
                              </DropdownMenuItem>
                              {(!user?.website_type ||
                                user.website_type === "ecommerce") && (
                                <>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleProfileAction("wishlist")
                                    }
                                  >
                                    <Heart className="mr-2 h-4 w-4" />
                                    <div className="flex w-full items-center justify-between">
                                      <span>Wishlist</span>
                                      {wishlistCount > 0 && (
                                        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                          {wishlistCount}
                                        </span>
                                      )}
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleProfileAction("orders")
                                    }
                                  >
                                    <Package className="mr-2 h-4 w-4" />
                                    My Orders
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => handleProfileAction("logout")}
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={handleLoginClick}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Login / Register
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
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
