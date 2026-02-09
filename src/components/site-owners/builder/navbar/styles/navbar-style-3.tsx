import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import { SearchBar } from "@/components/site-owners/builder/search-bar/search-bar";
import SideCart from "../../cart/side-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

const EditableItem: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <div className="group relative">{children}</div>;

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
  onEditCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle3: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditButton,
  onDeleteButton,
  onEditCart,
  disableClicks = false,
}) => {
  const { links, buttons, showCart } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
  const pathname = usePathname();

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
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div
            className={`shrink-0 ${disableClicks ? "pointer-events-auto" : ""}`}
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
                onClick={disableClicks ? e => e.preventDefault() : undefined}
              >
                <NavbarLogo data={navbarData} siteUser={siteUser} />
              </div>
            )}
          </div>

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

        <div className="flex shrink-0 items-center gap-2">
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

          <div className="hidden items-center gap-4 lg:flex">
            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem key={link.id}>
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer text-sm font-medium whitespace-nowrap text-black transition-colors hover:text-black/80"
                  >
                    {link.text}
                  </Link>
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
                  onClick={e => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                >
                  {link.text}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            {buttons.map(button =>
              isEditable && onEditButton && onDeleteButton ? (
                <EditableItem key={button.id}>
                  <Button
                    onClick={e => e.preventDefault()}
                    variant={getButtonVariant(button.variant)}
                    size="sm"
                    className="cursor-pointer"
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
                  asChild={!disableClicks}
                >
                  {disableClicks ? (
                    button.text
                  ) : (
                    <Link
                      href={generateLinkHref(
                        button.href,
                        siteUser,
                        pathname,
                        isEditable,
                        disableClicks
                      )}
                    >
                      {button.text}
                    </Link>
                  )}
                </Button>
              )
            )}
          </div>

          {showCart && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              {isEditable && onEditCart ? (
                <EditableItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    onClick={e => e.preventDefault()}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      0
                    </span>
                  </Button>
                </EditableItem>
              ) : (
                <CartIcon onToggleCart={toggleCart} />
              )}
            </div>
          )}
        </div>
      </nav>

      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </>
  );
};
