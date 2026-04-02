import React, { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  Phone,
  User,
  LogOut,
  Package,
  Heart,
} from "lucide-react";

import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useAuth } from "@/hooks/customer/use-auth";
import { useProfile } from "@/hooks/customer/use-customer-profile";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { SearchBar } from "@/components/site-owners/builder/search-bar/search-bar";

import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const EditableItem: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <div className="group relative">{children}</div>;

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
  onToggleCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle9: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditButton,
  onDeleteButton,
  onEditCart,
  onToggleCart,
  disableClicks = false,
}) => {
  const { data } = useBuilderLogic(navbarData, undefined);
  const { links, buttons, showCart, enableLogin } = data;

  const { itemCount, totalPrice } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { data: profile } = useProfile();
  const { data: categoriesData } = useCategories();
  const { data: siteConfig } = useSiteConfig();
  const categories: any[] = categoriesData?.results || [];

  const compareItems: any[] = []; // Mock compare items

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
    },
  };

  const toggleCart = () => {
    if (disableClicks) return;
    setIsCartOpen(!isCartOpen);
    if (onToggleCart) onToggleCart();
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const formatCategoryUrl = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-");
  };

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  const handleProfileAction = (action: string) => {
    if (disableClicks || isEditable) return;
    setIsAccountOpen(false);

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

  const handleAccountClick = () => {
    if (disableClicks || isEditable) return;
    isAuthenticated ? setIsAccountOpen(!isAccountOpen) : handleLoginClick();
  };

  return (
    <>
      <header
        className={`border-b border-gray-100 ${!isEditable ? "sticky top-0 z-50" : "relative"} ${disableClicks ? "pointer-events-none" : ""}`}
        style={{
          backgroundColor: data.backgroundColor || "white",
          color: data.textColor || "inherit",
        }}
      >
        {/* Main Header */}
        <div className="py-4 md:py-6" style={{ backgroundColor: "transparent" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button
                className="pointer-events-auto -ml-2 p-2 opacity-70 transition-opacity hover:opacity-100 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                disabled={disableClicks}
                style={{ color: data.textColor || "inherit" }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <div
                className={`flex shrink-0 items-center gap-2 ${disableClicks ? "pointer-events-auto" : ""}`}
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

              {/* Search Bar */}
              <div className="pointer-events-auto hidden max-w-2xl flex-1 md:flex">
                <SearchBar
                  siteUser={siteUser}
                  isEditable={isEditable}
                  className="w-full"
                />
              </div>

              {/* Actions */}
              <div className="pointer-events-auto flex items-center gap-2 sm:gap-6">
                {/* Account Link */}
                {enableLogin && (
                  <div className="group relative">
                    <div
                      className={`hidden flex-col items-end leading-tight md:flex ${disableClicks || isEditable ? "cursor-default opacity-60" : "cursor-pointer hover:opacity-80"}`}
                      onClick={handleAccountClick}
                    >
                      <span className="text-[10px] font-medium opacity-60">
                        {isAuthenticated
                          ? `Hello, ${(profile as any)?.first_name || user?.first_name || "User"}`
                          : "Hello, Sign In"}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium">
                        My Account{" "}
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </div>

                    {/* Account Dropdown */}
                    {isAuthenticated && !disableClicks && !isEditable && (
                      <div
                        className={`absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl border border-gray-100 py-2 transition-all duration-200 ${isAccountOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"}`}
                        style={{ backgroundColor: data.backgroundColor || "white", color: data.textColor || "inherit" }}
                      >
                        <div
                          onClick={() => handleProfileAction("profile")}
                          className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-70"
                        >
                          <User size={18} /> My Profile
                        </div>
                        <div
                          onClick={() => handleProfileAction("orders")}
                          className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-70"
                        >
                          <Package size={18} /> My Orders
                        </div>
                        <div
                          onClick={() => handleProfileAction("wishlist")}
                          className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-70"
                        >
                          <Heart size={18} /> Wishlist
                        </div>
                        <div className="my-2 h-px bg-gray-100"></div>
                        <button
                          onClick={() => handleProfileAction("logout")}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {enableLogin && (
                  <div className="hidden h-8 w-px bg-gray-200 md:block"></div>
                )}

                {/* Cart Icon */}
                {showCart && (
                  <div className={disableClicks ? "pointer-events-auto" : ""}>
                    {isEditable && onEditCart ? (
                      <EditableItem>
                        <button
                          onClick={onEditCart}
                          className="group relative flex cursor-pointer items-center gap-2 rounded-full p-2 transition-colors hover:opacity-80"
                        >
                          <div className="relative">
                            <ShoppingCart className="h-6 w-6 transition-colors" />
                            {itemCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] leading-none font-bold text-white ring-2 ring-white">
                                {itemCount}
                              </span>
                            )}
                          </div>
                          <div className="hidden flex-col items-start leading-none lg:flex">
                            <span className="text-[10px] font-medium opacity-60">
                              My Cart
                            </span>
                            <span className="text-xs font-bold">
                              Rs.
                              {Number(totalPrice.toFixed(2)).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </button>
                      </EditableItem>
                    ) : (
                      <button
                        onClick={
                          disableClicks ? e => e.preventDefault() : toggleCart
                        }
                        className={`group relative flex items-center gap-2 rounded-full p-2 transition-colors hover:opacity-80 ${disableClicks ? "pointer-events-none cursor-default opacity-60" : "cursor-pointer"}`}
                        aria-label={`Shopping cart with ${itemCount} items`}
                      >
                        <div className="relative">
                          <ShoppingCart className="h-6 w-6 transition-colors" />
                          {itemCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] leading-none font-bold text-white ring-2 ring-white">
                              {itemCount}
                            </span>
                          )}
                        </div>
                        <div className="hidden flex-col items-start leading-none lg:flex">
                          <span className="text-[10px] font-medium opacity-60">
                            My Cart
                          </span>
                          <span className="text-xs font-bold">
                            Rs.
                            {Number(totalPrice.toFixed(2)).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search */}
            <div
              className={`mt-4 md:hidden ${disableClicks ? "pointer-events-auto" : ""}`}
            >
              <SearchBar
                siteUser={siteUser}
                isEditable={isEditable}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Category & Builder Links Navigation Bar */}
        <div
          className="hidden border-t border-gray-100 md:block"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto flex items-center gap-8">
              {/* All Categories Dropdown Trigger */}
              <div className="group relative cursor-pointer py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Menu size={18} />
                  All Categories
                  <ChevronDown
                    size={14}
                    className="text-gray-400 transition-transform group-hover:rotate-180"
                  />
                </div>
                {/* Dropdown Menu */}
                <div 
                  className="invisible absolute top-full left-0 z-40 w-64 translate-y-2 transform rounded-b-lg border border-gray-100 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                  style={{ backgroundColor: data.backgroundColor || "white", color: data.textColor || "inherit" }}
                >
                  <div className="px-5 py-2">
                    {categories.map(category => (
                      <Link
                        key={category.id}
                        href={generateLinkHref(
                          `/collections?category=${category.slug}`,
                          siteUser,
                          pathname,
                          isEditable,
                          disableClicks
                        )}
                        className="block border-b border-gray-50 py-2 text-sm font-medium hover:opacity-80"
                        onClick={e => {
                          handleLinkClick(e);
                          setIsMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Horizontal Builder Links */}
              <nav className="no-scrollbar flex items-center gap-6 overflow-x-auto py-3">
                {links.map(link =>
                  isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem key={link.id}>
                      <span className="cursor-pointer text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80">
                        {link.text}
                      </span>
                    </EditableItem>
                  ) : (
                    <Link
                      key={link.id}
                      href={generateLinkHref(
                        link.href,
                        siteUser,
                        pathname,
                        isEditable,
                        disableClicks
                      )}
                      target={
                        link.href?.startsWith("http") ||
                        link.href?.startsWith("mailto:")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        link.href?.startsWith("http") ||
                        link.href?.startsWith("mailto:")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={e => handleLinkClick(e, link.href)}
                      className={`text-sm font-medium whitespace-nowrap transition-colors ${
                        pathname.includes(link.href)
                          ? "text-brand-600 font-semibold"
                          : "hover:opacity-80"
                      } ${disableClicks ? "pointer-events-none cursor-default opacity-60" : "cursor-pointer"}`}
                    >
                      {link.text}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && !disableClicks && !isEditable && (
          <div 
            className="pointer-events-auto fixed inset-0 z-40 overflow-y-auto md:hidden"
            style={{ backgroundColor: data.backgroundColor || "white", color: data.textColor || "inherit" }}
          >
            <div 
              className="flex items-center justify-between border-b border-gray-100 p-4"
              style={{ backgroundColor: data.backgroundColor || "white" }}
            >
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                style={{ color: data.textColor || "inherit" }}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="mb-2 text-xs font-bold tracking-wider opacity-40 uppercase">
                Builder Links
              </div>
              {links.map(link => (
                <Link
                  key={link.id}
                  href={generateLinkHref(
                    link.href,
                    siteUser,
                    pathname,
                    isEditable,
                    disableClicks
                  )}
                  target={
                    link.href?.startsWith("http") ||
                    link.href?.startsWith("mailto:")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    link.href?.startsWith("http") ||
                    link.href?.startsWith("mailto:")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={e => {
                    handleLinkClick(e, link.href);
                    setIsMenuOpen(false);
                  }}
                  className="block border-b border-gray-50 py-2 text-sm font-medium transition-colors hover:opacity-70"
                >
                  {link.text}
                </Link>
              ))}

              <div className="mt-4 mb-2 text-xs font-bold tracking-wider opacity-40 uppercase">
                Categories
              </div>
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={generateLinkHref(
                    `/category/${formatCategoryUrl(category.slug)}`,
                    siteUser,
                    pathname,
                    isEditable,
                    disableClicks
                  )}
                  className="block border-b border-gray-50 py-2 text-sm font-medium text-gray-900"
                  onClick={e => {
                    handleLinkClick(e);
                    setIsMenuOpen(false);
                  }}
                >
                  {category.name}
                </Link>
              ))}

              <div className="space-y-3 pt-4">
                <div
                  onClick={() => {
                    handleProfileAction("profile");
                    setIsMenuOpen(false);
                  }}
                  className="block cursor-pointer text-sm opacity-70 hover:opacity-100"
                >
                  My Account
                </div>
                <div
                  onClick={() => {
                    handleProfileAction("orders");
                    setIsMenuOpen(false);
                  }}
                  className="block cursor-pointer text-sm opacity-70 hover:opacity-100"
                >
                  Orders
                </div>
                <Link
                  href={generateLinkHref(
                    "/compare",
                    siteUser,
                    pathname,
                    isEditable,
                    disableClicks
                  )}
                  onClick={e => {
                    handleLinkClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm opacity-70 hover:opacity-100"
                >
                  Compare Products
                </Link>
                <Link
                  href={generateLinkHref(
                    "/faq",
                    siteUser,
                    pathname,
                    isEditable,
                    disableClicks
                  )}
                  onClick={e => {
                    handleLinkClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm opacity-70 hover:opacity-100"
                >
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Only show SideCart in preview mode, not in editable mode */}
      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </>
  );
};
