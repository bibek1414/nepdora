import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";

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

export const NavbarStyle1: React.FC<NavbarStyleProps> = ({
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
      >
        <div className="flex items-center gap-8">
          <div className={disableClicks ? "pointer-events-auto" : ""}>
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

          <div className="hidden items-center gap-4 md:flex">
            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem key={link.id}>
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer text-sm font-medium text-black transition-colors hover:text-black/80"
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          {buttons.map(button =>
            isEditable && onEditButton && onDeleteButton ? (
              <EditableItem key={button.id}>
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

          {/* Cart Icon with Editable Wrapper */}
          {showCart && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              {isEditable && onEditCart ? (
                <EditableItem>
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
