import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import { Plus } from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative">{children}</div>
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
  onToggleCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle1: React.FC<NavbarStyleProps> = ({
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
  onEditCart,
  onToggleCart,
  disableClicks = false,
}) => {
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

  const { data } = useBuilderLogic(navbarData, undefined);
  const { links, buttons, showCart } = data;
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    if (disableClicks) return;
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
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
        className={`bg-background flex items-center justify-between p-4 ${
          !isEditable ? "sticky top-16 z-40 mx-auto max-w-7xl" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
        style={{ fontFamily: theme.fonts.heading }}
      >
        <div className="flex items-center gap-8">
          <div className={disableClicks ? "pointer-events-auto" : ""}>
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

          <div className="hidden items-center gap-4 md:flex">
            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem
                  key={link.id}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link.id)}
                >
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.heading,
                    }}
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
                  className={`text-sm font-medium transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                >
                  {link.text}
                </Link>
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
        </div>

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

          {/* Cart Icon with Editable Wrapper */}
          {showCart && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              {isEditable && onEditCart ? (
                <EditableItem onEdit={onEditCart}>
                  <CartIcon onToggleCart={() => {}} />
                </EditableItem>
              ) : (
                <CartIcon onToggleCart={toggleCart} />
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Only show SideCart in preview mode, not in editable mode */}
      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </>
  );
};
