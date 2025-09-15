import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";

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

export const NavbarStyle2: React.FC<NavbarStyleProps> = ({
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
  const midIndex = Math.ceil(links.length / 2);
  const leftLinks = links.slice(0, midIndex);
  const rightLinks = links.slice(midIndex);

  // Add state and handlers for the cart
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    if (disableClicks) return;
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Add the same generateLinkHref function
  const generateLinkHref = (originalHref: string) => {
    if (isEditable || !siteUser || disableClicks) return "#";

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  // Handler to prevent clicks when disabled
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
          !isEditable ? "sticky top-16 z-40 border-b" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
      >
        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          {leftLinks.map(link =>
            isEditable && onEditLink && onDeleteLink ? (
              <EditableItem
                key={link.id}
                onEdit={() => onEditLink(link)}
                onDelete={() => onDeleteLink(link.id)}
              >
                <a
                  href={link.href}
                  onClick={e => e.preventDefault()}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                >
                  {link.text}
                </a>
              </EditableItem>
            ) : (
              <a
                key={link.id}
                href={generateLinkHref(link.href)}
                onClick={e => handleLinkClick(e, link.href)}
                className={`text-muted-foreground text-sm font-medium transition-colors ${
                  disableClicks
                    ? "cursor-default opacity-60"
                    : "hover:text-foreground cursor-pointer"
                }`}
                style={disableClicks ? { pointerEvents: "auto" } : {}}
              >
                {link.text}
              </a>
            )
          )}
        </div>

        <div className={`px-8 ${disableClicks ? "pointer-events-auto" : ""}`}>
          {isEditable && onEditLogo ? (
            <EditableItem onEdit={onEditLogo}>
              <NavbarLogo
                data={navbarData}
                isEditable={isEditable}
                onEdit={onEditLogo}
              />
            </EditableItem>
          ) : (
            <div onClick={disableClicks ? e => e.preventDefault() : undefined}>
              <NavbarLogo data={navbarData} siteUser={siteUser} />
            </div>
          )}
        </div>

        <div className="hidden flex-1 items-center justify-start gap-4 md:flex">
          {rightLinks.map(link =>
            isEditable && onEditLink && onDeleteLink ? (
              <EditableItem
                key={link.id}
                onEdit={() => onEditLink(link)}
                onDelete={() => onDeleteLink(link.id)}
              >
                <a
                  href={link.href}
                  onClick={e => e.preventDefault()}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                >
                  {link.text}
                </a>
              </EditableItem>
            ) : (
              <a
                key={link.id}
                href={generateLinkHref(link.href)}
                onClick={e => handleLinkClick(e, link.href)}
                className={`text-muted-foreground text-sm font-medium transition-colors ${
                  disableClicks
                    ? "cursor-default opacity-60"
                    : "hover:text-foreground cursor-pointer"
                }`}
                style={disableClicks ? { pointerEvents: "auto" } : {}}
              >
                {link.text}
              </a>
            )
          )}
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
                  <a href={generateLinkHref(button.href)}>{button.text}</a>
                )}
              </Button>
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
