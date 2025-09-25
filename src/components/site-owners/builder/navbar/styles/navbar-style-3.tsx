// navbar-style-3.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import { Plus, Edit, Trash2, Menu, Search } from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import { SearchBar } from "@/components/site-owners/builder/search-bar/search-bar";
import SideCart from "../../cart/side-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative">
    {children}
    <div className="absolute -top-8 -right-3 hidden items-center rounded-full p-1 group-hover:flex">
      <button
        onClick={onEdit}
        className="text-primary hover:bg-primary-foreground/20 rounded-full p-1"
      >
        <Edit className="h-4 w-4" />
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="hover:bg-primary-foreground/20 rounded-full p-1 text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

interface NavbarStyleProps {
  navbarData: NavbarData;
  siteUser: string;
  isEditable?: boolean;
  onEditLogo?: () => void;
  onAddLink?: () => void;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
  disableClicks?: boolean;
}

export const NavbarStyle3: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onAddButton,
  onEditButton,
  onDeleteButton,
  disableClicks = false,
}) => {
  const { links, buttons, showCart } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Get theme data
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

  const toggleCart = () => {
    if (disableClicks) return;
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleMobileSearch = () => {
    if (disableClicks) return;
    setShowMobileSearch(!showMobileSearch);
  };

  const generateLinkHref = (originalHref: string) => {
    if (isEditable || !siteUser || disableClicks) return "#";

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

  return (
    <>
      <nav
        className={`bg-background mx-auto flex max-w-7xl items-center justify-between p-4 ${
          !isEditable ? "sticky top-0 z-40 border-b" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
        style={{ fontFamily: theme.fonts.heading }}
      >
        {/* Left side: Logo and Desktop Search */}
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div
            className={`flex-shrink-0 ${disableClicks ? "pointer-events-auto" : ""}`}
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
                onClick={disableClicks ? e => e.preventDefault() : undefined}
              >
                <NavbarLogo data={navbarData} siteUser={siteUser} />
              </div>
            )}
          </div>

          {/* Desktop Search Bar */}
          <div
            className={`relative hidden max-w-md flex-1 md:block ${disableClicks ? "pointer-events-auto" : ""}`}
          >
            <SearchBar
              siteUser={siteUser}
              isEditable={isEditable}
              className="w-full"
            />
          </div>
        </div>

        {/* Right side: Mobile Search Toggle, Links, Buttons, and Cart */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* Mobile Search Toggle */}
          <div
            className={`md:hidden ${disableClicks ? "pointer-events-auto" : ""}`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={
                disableClicks ? e => e.preventDefault() : toggleMobileSearch
              }
              className={`p-2 ${disableClicks ? "cursor-default opacity-60" : ""}`}
              aria-label="Toggle search"
            >
              <SearchBar
                siteUser={siteUser}
                isEditable={isEditable}
                className="w-full"
              />
            </Button>
          </div>

          {/* Desktop Links */}
          <div className="hidden items-center gap-4 lg:flex">
            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem
                  key={link.id}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link.id)}
                >
                  <a
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium whitespace-nowrap transition-colors"
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.heading,
                    }}
                  >
                    {link.text}
                  </a>
                </EditableItem>
              ) : (
                <a
                  key={link.id}
                  href={generateLinkHref(link.href)}
                  onClick={e => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                >
                  {link.text}
                </a>
              )
            )}
            {isEditable && onAddLink && (
              <Button
                onClick={onAddLink}
                variant="outline"
                size="sm"
                className="pointer-events-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Link
              </Button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {buttons.map(button =>
              isEditable && onEditButton && onDeleteButton ? (
                <EditableItem
                  key={button.id}
                  onEdit={() => onEditButton(button)}
                  onDelete={() => onDeleteButton(button.id)}
                >
                  <Button
                    onClick={e => e.preventDefault()}
                    variant={getButtonVariant(button.variant)}
                    size="sm"
                    className="cursor-pointer"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                      fontFamily: theme.fonts.heading,
                    }}
                  >
                    {button.text}
                  </Button>
                </EditableItem>
              ) : (
                <Button
                  key={button.id}
                  variant={getButtonVariant(button.variant)}
                  size="sm"
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                  className={`${disableClicks ? "pointer-events-auto cursor-default opacity-60" : ""}`}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.heading,
                  }}
                  asChild={!disableClicks}
                >
                  {disableClicks ? (
                    button.text
                  ) : (
                    <a href={generateLinkHref(button.href)}>{button.text}</a>
                  )}
                </Button>
              )
            )}
            {isEditable && onAddButton && (
              <Button
                onClick={onAddButton}
                variant="outline"
                size="sm"
                className="pointer-events-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Button
              </Button>
            )}
          </div>

          {/* Cart */}
          {showCart && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              <CartIcon onToggleCart={toggleCart} />
            </div>
          )}
        </div>
      </nav>

      <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
    </>
  );
};
