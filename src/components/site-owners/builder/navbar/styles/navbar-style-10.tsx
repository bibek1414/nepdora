"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronDown, ShoppingCart, User, Heart, Package, LogOut } from "lucide-react";
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

  const linkClass = (path: string, isActive: boolean) =>
    `text-sm font-medium transition-colors ${
      isActive ? "font-semibold" : "text-gray-600 hover:opacity-80"
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
      className={`inset-x-0 z-50 flex items-center justify-between px-3 transition-all duration-300 sm:px-4 ${
        !isEditable ? "fixed top-2 sm:top-4" : "relative py-4"
      }`}
    >
      {/* Desktop Header */}
      <div className="relative mx-auto hidden h-16 w-full max-w-7xl items-center justify-between rounded-full border border-gray-100 bg-white/95 px-4 backdrop-blur-md md:px-8 lg:flex xl:h-20">
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
                  className={linkClass(link.href, pathname === link.href)}
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
                  ? "font-semibold"
                  : "text-gray-600 hover:opacity-80"
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
                  className="absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
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
                          className="block px-6 py-3 text-sm text-gray-700 transition-colors duration-200 hover:opacity-80"
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
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pr-2 pl-6 text-gray-900">
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
                className="hover:border-primary-300 group flex items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pr-2 pl-6 text-gray-900 transition-all hover:shadow-md"
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
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all hover:border-gray-300 hover:shadow-md ${disableClicks || isEditable ? "cursor-default opacity-60" : "cursor-pointer"}`}
                    onClick={disableClicks ? e => e.preventDefault() : undefined}
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

      {/* Mobile Logo */}
      <div className="flex cursor-pointer items-center gap-2 lg:hidden">
        <NavbarLogo data={navbarData} siteUser={siteUser} />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="ml-auto rounded-full border border-gray-100 bg-white/90 p-1.5 text-gray-700 shadow-md sm:p-2 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disableClicks}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 flex flex-col gap-4 overflow-y-auto bg-white px-4 pt-16 pb-6 shadow-xl lg:hidden"
          >
            <button
              className="absolute top-4 right-4 rounded-full border border-gray-100 bg-white/90 p-1.5 text-gray-700 shadow-md sm:p-2"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>

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
                className="flex items-center justify-between border-b border-gray-50 py-3 text-base font-medium text-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            ))}

            {/* Mobile Services */}
            <div className="border-b border-gray-50">
              <button
                className="flex w-full items-center justify-between py-3 text-base font-medium text-gray-800"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
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
                    <div className="space-y-1 pb-2 pl-4">
                      {services.map(service => (
                        <Link
                          key={service.id}
                          href={getDetailsUrl(service.slug)}
                          className="block py-2 text-sm text-gray-600 hover:opacity-80"
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

            <div className="mt-auto pt-6">
              {navbarData.enableLogin && (
                <div className="mb-6 space-y-3 border-b border-gray-100 pb-6">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => handleProfileAction("profile")}
                        className="flex w-full items-center gap-3 py-2 text-base font-medium text-gray-800"
                      >
                        <User size={20} className="text-gray-500" /> My Profile
                      </button>
                      {(!user?.website_type || user.website_type === "ecommerce") && (
                        <>
                          <button
                            onClick={() => handleProfileAction("wishlist")}
                            className="flex w-full items-center justify-between py-2 text-base font-medium text-gray-800"
                          >
                            <div className="flex items-center gap-3">
                              <Heart size={20} className="text-gray-500" /> Wishlist
                            </div>
                            {wishlistCount > 0 && (
                              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {wishlistCount}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => handleProfileAction("orders")}
                            className="flex w-full items-center gap-3 py-2 text-base font-medium text-gray-800"
                          >
                            <Package size={20} className="text-gray-500" /> My Orders
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleProfileAction("logout")}
                        className="flex w-full items-center gap-3 py-2 text-base font-medium text-red-600"
                      >
                        <LogOut size={20} /> Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="flex w-full items-center gap-3 py-2 text-base font-medium text-gray-800"
                    >
                      <User size={20} className="text-gray-500" /> Login / Register
                    </button>
                  )}
                </div>
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
                  className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-center text-base font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => setIsOpen(false)}
                >
                  {button.text} <ArrowUpRight size={20} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
