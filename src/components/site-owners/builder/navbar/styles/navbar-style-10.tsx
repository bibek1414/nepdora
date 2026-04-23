"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  ShoppingCart,
  User,
  Heart,
  Package,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { useCart } from "@/hooks/owner-site/admin/use-cart";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useAuth } from "@/hooks/customer/use-auth";
import { useWishlist } from "@/hooks/customer/use-wishlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarLogo } from "../navbar-logo";
import { generateLinkHref } from "@/lib/link-utils";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";

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
  onToggleCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle10: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable = false,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditButton,
  onDeleteButton,
  onToggleCart,
  disableClicks = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const { isAuthenticated, user, logout } = useAuth();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;
  const pathname = usePathname();
  const router = useRouter();
  const servicesRef = useRef<HTMLDivElement>(null);

  const { data: servicesData } = useServices();
  const services = servicesData?.results ?? [];

  const { data } = useBuilderLogic(navbarData, undefined);
  const { links, buttons } = data;
  const { itemCount } = useCart();
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      text: "#0F172A",
    },
  };

  const primaryColor = theme.colors.primary;

  // Set navbar height CSS variable for non-editable mode
  useEffect(() => {
    if (navbarRef.current && !isEditable) {
      const updateNavbarHeight = () => {
        const height = navbarRef.current?.getBoundingClientRect().height;
        if (height) {
          document.documentElement.style.setProperty(
            "--navbar-height",
            `${height}px`
          );
        }
      };

      updateNavbarHeight();

      // Use ResizeObserver to handle height changes
      const resizeObserver = new ResizeObserver(updateNavbarHeight);
      resizeObserver.observe(navbarRef.current);

      return () => {
        resizeObserver.disconnect();
        if (!isEditable) {
          document.documentElement.style.removeProperty("--navbar-height");
        }
      };
    }
  }, [isEditable]);

  const linkClass = (path: string, isActive: boolean) =>
    `text-sm font-medium transition-colors ${
      isActive ? "font-semibold opacity-100" : "opacity-70 hover:opacity-100"
    }`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };

    if (isServicesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServicesOpen]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  const getDetailsUrl = (slug: string): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${slug}`, siteUser, pathname);
  };

  const toggleCart = () => {
    if (disableClicks) return;
    if (onToggleCart) onToggleCart();
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
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    if (disableClicks || isEditable) return;
    router.push(generateLinkHref("/login", siteUser, pathname));
    setIsOpen(false);
  };

  return (
    <header
      ref={navbarRef}
      className={`inset-x-0 z-50 flex items-center justify-between px-3 transition-all duration-300 sm:px-4 ${
        !isEditable ? "fixed top-2 sm:top-4" : "relative py-4"
      }`}
    >
      <div className="flex items-center gap-4 lg:hidden">
        <button
          type="button"
          onClick={() => {
            if (!disableClicks && !isEditable) {
              setIsOpen(true);
            }
          }}
          className={`relative rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-md transition-all ${
            disableClicks || isEditable
              ? "cursor-default opacity-40 shadow-none"
              : "hover:scale-110 active:scale-95"
          }`}
          disabled={disableClicks || isEditable}
          style={{ color: data.textColor || "inherit" }}
        >
          <span className="sr-only">Open menu</span>
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {/* Desktop Header */}
      <div
        className="relative mx-auto hidden h-16 w-full max-w-7xl items-center justify-between rounded-full border border-gray-100 px-4 backdrop-blur-md md:px-8 lg:flex xl:h-20"
        style={{
          backgroundColor: data.backgroundColor || "rgba(255, 255, 255, 0.95)",
          color: data.textColor || "inherit",
        }}
      >
        {/* Logo - Left aligned */}
        <div className="z-20 flex cursor-pointer items-center gap-2">
          {isEditable && onEditLogo ? (
            <EditableItem>
              <NavbarLogo
                data={navbarData}
                isEditable={isEditable}
                onEdit={onEditLogo}
              />
            </EditableItem>
          ) : (
            <NavbarLogo data={navbarData} siteUser={siteUser} />
          )}
        </div>

        {/* Desktop Nav - Absolutely Centered */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(link =>
            isEditable && onEditLink ? (
              <EditableItem key={link.id}>
                <span
                  className={
                    linkClass(link.href, pathname === link.href) +
                    " cursor-default"
                  }
                  style={pathname === link.href ? { color: primaryColor } : {}}
                >
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
                className={linkClass(link.href, pathname === link.href)}
                style={pathname === link.href ? { color: primaryColor } : {}}
                onClick={e => handleLinkClick(e, link.href)}
              >
                {link.text}
              </Link>
            )
          )}

          {/* Services with Dropdown */}
          <div
            ref={servicesRef}
            className="group relative flex h-full cursor-pointer items-center gap-1 py-6"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <div
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                pathname.includes("/services")
                  ? "font-semibold opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
              style={
                pathname.includes("/services") ? { color: primaryColor } : {}
              }
            >
              Services
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            <AnimatePresence>
              {isServicesOpen && services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 shadow-xl"
                  style={{
                    backgroundColor: data.backgroundColor || "white",
                    color: data.textColor || "inherit",
                  }}
                >
                  <div className="py-2">
                    {services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.03,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={getDetailsUrl(service.slug)}
                          className="block px-6 py-3 text-sm transition-colors duration-200 hover:opacity-80"
                          style={{
                            color:
                              pathname === getDetailsUrl(service.slug)
                                ? primaryColor
                                : undefined,
                          }}
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {service.title}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Actions - Right aligned */}
        <div className="z-20 hidden items-center gap-4 lg:flex">
          {buttons.map(button =>
            isEditable && onEditButton ? (
              <EditableItem key={button.id}>
                <div className="flex cursor-default items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pr-2 pl-6">
                  <span className="text-sm font-semibold">{button.text}</span>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
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
                className="hover:border-primary-300 group flex items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pr-2 pl-6 transition-all hover:shadow-md"
                onClick={e => handleLinkClick(e, button.href)}
              >
                <span className="text-sm font-semibold">{button.text}</span>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform group-hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </Link>
            )
          )}

          {navbarData.enableLogin && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-gray-300 hover:shadow-md ${disableClicks || isEditable ? "cursor-default opacity-60" : "cursor-pointer"}`}
                    style={{ backgroundColor: data.backgroundColor || "white" }}
                  >
                    <User size={18} />
                  </button>
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
                              onClick={() => handleProfileAction("wishlist")}
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
                              onClick={() => handleProfileAction("orders")}
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

      {/* Mobile Logo - Center aligned */}
      <div className="flex cursor-pointer items-center justify-center lg:hidden">
        <NavbarLogo data={navbarData} siteUser={siteUser} />
      </div>

      {/* Placeholder for right side to keep logo centered */}
      <div className="w-10 lg:hidden" />

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
            {/* Mobile Links */}
            <div className="space-y-6 px-4 py-6">
              {links.map((link: NavbarLink) =>
                isEditable && onEditLink ? (
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
                        setIsOpen(false);
                      }}
                      className="-m-2 block cursor-pointer p-2 font-medium opacity-80 hover:opacity-100"
                    >
                      {link.text}
                    </Link>
                  </div>
                )
              )}

              {/* Mobile Services */}
              <div className="flow-root">
                <button
                  className="-m-2 flex w-full items-center justify-between p-2 font-medium opacity-80 hover:opacity-100"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  Services
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isServicesOpen && services.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pt-2 pl-4">
                        {services.map(service => (
                          <Link
                            key={service.id}
                            href={getDetailsUrl(service.slug)}
                            className="block py-2 text-sm opacity-70 hover:opacity-100"
                            style={{
                              color:
                                pathname === getDetailsUrl(service.slug)
                                  ? primaryColor
                                  : undefined,
                            }}
                            onClick={() => {
                              setIsServicesOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navbarData.enableLogin && (
                <>
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
                </>
              )}

              {buttons.map(button => (
                <Link
                  key={button.id}
                  href={generateLinkHref(
                    button.href,
                    siteUser,
                    pathname,
                    isEditable,
                    disableClicks
                  )}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-center text-base font-bold text-white shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => setIsOpen(false)}
                >
                  {button.text} <ArrowUpRight size={20} />
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
