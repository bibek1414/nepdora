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
  isEditable?: boolean;
  onEditLogo?: () => void;
  onAddLink?: () => void;
  siteId: string;

  siteUser?: string;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
}

export const NavbarStyle1: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteId,
  onEditLogo,
  onAddLink,
  onEditLink,
  onDeleteLink,
  siteUser,
  onAddButton,
  onEditButton,
  onDeleteButton,
}) => {
  const { links, buttons, showCart } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Function to generate the correct href for links
  const generateLinkHref = (originalHref: string) => {
    if (isEditable) return originalHref; // Keep original href for editable mode

    // For preview mode, generate the correct route
    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    // Remove leading slash and hash if present
    const cleanHref = originalHref.replace(/^[#/]+/, "");

    return `/preview/${siteUser}/${cleanHref}`;
  };
  return (
    <>
      <nav
        className={`bg-background flex items-center justify-between p-4 ${
          !isEditable ? "sticky top-16 z-40 mx-auto max-w-7xl" : ""
        }`}
      >
        <div className="flex items-center gap-8">
          <div>
            {isEditable && onEditLogo ? (
              <EditableItem onEdit={onEditLogo}>
                <NavbarLogo
                  data={navbarData}
                  isEditable={isEditable}
                  onEdit={onEditLogo}
                />
              </EditableItem>
            ) : (
              <NavbarLogo data={navbarData} />
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
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  {link.text}
                </a>
              )
            )}
            {isEditable && onAddLink && (
              <Button onClick={onAddLink} variant="outline" size="sm">
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
                  className="cursor-pointer"
                >
                  {button.text}
                </Button>
              </EditableItem>
            ) : (
              <Button
                asChild
                key={button.id}
                variant={getButtonVariant(button.variant)}
                size="sm"
              >
                <a href={generateLinkHref(button.href)}>{button.text}</a>
              </Button>
            )
          )}
          {isEditable && onAddButton && (
            <Button onClick={onAddButton} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Button
            </Button>
          )}
          {showCart && <CartIcon onToggleCart={toggleCart} />}
        </div>
      </nav>

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={closeCart} siteId={siteId} />
    </>
  );
};
