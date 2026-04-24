import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Package,
  Heart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useAuth } from "@/hooks/customer/use-auth";
import { useProfile } from "@/hooks/customer/use-customer-profile";
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

export const NavbarStyle15: React.FC<NavbarStyleProps> = ({
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
        <div
          className="py-4 md:py-6"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => {
                    if (!disableClicks && !isEditable) {
                      setIsMenuOpen(true);
                    }
                  }}
                  className={`relative rounded-md bg-transparent p-2 opacity-60 ${
                    disableClicks || isEditable
                      ? "cursor-default opacity-40"
                      : "hover:opacity-100"
                  }`}
                  disabled={disableClicks || isEditable}
                >
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" />
                </button>
              </div>

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
              <div className="pointer-events-auto hidden max-w-2xl flex-1 lg:flex">
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
                        style={{
                          backgroundColor: data.backgroundColor || "white",
                          color: data.textColor || "inherit",
                        }}
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

                {/* Desktop Buttons */}
                <div className="hidden items-center gap-3 lg:flex">
                  {buttons.map((button: NavbarButton) =>
                    isEditable && onEditButton ? (
                      <EditableItem key={button.id}>
                        <button
                          className="cursor-default rounded-full bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200"
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.primaryForeground,
                          }}
                        >
                          {button.text}
                        </button>
                      </EditableItem>
                    ) : (
                      <Link
                        key={button.id}
                        href={generateLinkHref(
                          button.href,
                          siteUser,
                          pathname,
                          isEditable,
                          disableClicks
                        )}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 ${
                          disableClicks
                            ? "cursor-default opacity-60"
                            : "cursor-pointer"
                        }`}
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground,
                        }}
                        onClick={e => handleLinkClick(e, button.href)}
                      >
                        {button.text}
                      </Link>
                    )
                  )}
                </div>

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
                            {totalPrice > 0 && (
                              <span className="text-xs font-bold">
                                Rs.
                                {Number(totalPrice.toFixed(2)).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}
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
                          {totalPrice > 0 && (
                            <span className="text-xs font-bold">
                              Rs.
                              {Number(totalPrice.toFixed(2)).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search */}
            <div
              className={`mt-4 lg:hidden ${disableClicks ? "pointer-events-auto" : ""}`}
            >
              <SearchBar
                siteUser={siteUser}
                isEditable={isEditable}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Builder Links Navigation Bar (No Categories) */}
        <div
          className="hidden border-t border-gray-100 lg:block"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto">
              <nav className="no-scrollbar flex items-center gap-8 overflow-x-auto py-3">
                {links.map(link =>
                  isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem key={link.id}>
                      <span className="cursor-default text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80">
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

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetContent
            side="left"
            className="w-full max-w-xs overflow-y-auto"
            style={{
              backgroundColor: data.backgroundColor || "white",
              color: data.textColor || "inherit",
            }}
          >
            <SheetHeader>
              <SheetTitle style={{ color: data.textColor || "inherit" }}>
                Menu
              </SheetTitle>
            </SheetHeader>

            <div className="mt-2 text-left">
              <div className="px-4 py-4">
                <SearchBar
                  siteUser={siteUser}
                  isEditable={isEditable}
                  className="w-full"
                />
              </div>

              {/* Mobile Links */}
              <div className="space-y-6 px-4 py-6">
                <div className="mb-2 text-xs font-bold tracking-wider uppercase opacity-40">
                  Builder Links
                </div>
                {links.map((link: NavbarLink) =>
                  isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem key={link.id}>
                      <div className="flow-root">
                        <span className="-m-2 block cursor-default p-2 font-medium transition-colors hover:opacity-80">
                          {link.text}
                        </span>
                      </div>
                    </EditableItem>
                  ) : (
                    <div className="flow-root" key={link.id}>
                      <Link
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
                        className="-m-2 block cursor-pointer p-2 font-medium opacity-80 hover:opacity-100"
                      >
                        {link.text}
                      </Link>
                    </div>
                  )
                )}

                {/* Mobile Buttons */}
                {buttons.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <div className="mb-2 text-xs font-bold tracking-wider uppercase opacity-40">
                      Actions
                    </div>
                    {buttons.map((button: NavbarButton) =>
                      isEditable && onEditButton ? (
                        <EditableItem key={button.id}>
                          <div className="flow-root">
                            <span className="-m-2 block cursor-default p-2 font-medium transition-colors hover:opacity-80">
                              {button.text}
                            </span>
                          </div>
                        </EditableItem>
                      ) : (
                        <div className="flow-root" key={button.id}>
                          <Link
                            href={generateLinkHref(
                              button.href,
                              siteUser,
                              pathname,
                              isEditable,
                              disableClicks
                            )}
                            onClick={e => {
                              handleLinkClick(e, button.href);
                              setIsMenuOpen(false);
                            }}
                            className="-m-2 block cursor-pointer p-2 font-medium transition-colors hover:opacity-100"
                          >
                            {button.text}
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                <div
                  onClick={() => handleProfileAction("profile")}
                  className="block cursor-pointer text-sm font-medium opacity-70 hover:opacity-100"
                >
                  My Profile
                </div>
                <div
                  onClick={() => handleProfileAction("orders")}
                  className="block cursor-pointer text-sm font-medium opacity-70 hover:opacity-100"
                >
                  My Orders
                </div>
                <div
                  onClick={() => handleProfileAction("wishlist")}
                  className="block cursor-pointer text-sm font-medium opacity-70 hover:opacity-100"
                >
                  Wishlist
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Only show SideCart in preview mode, not in editable mode */}
      {!isEditable && (
        <SideCart
          isOpen={isCartOpen}
          onClose={closeCart}
          siteUser={siteUser}
          hidePrices={totalPrice === 0}
        />
      )}
    </>
  );
};
