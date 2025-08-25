import React from "react";
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

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative">
    {children}
    <div className="absolute -top-8 -right-3 hidden items-center rounded-full p-1 shadow-lg group-hover:flex">
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
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
}

export const NavbarStyle1: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  onEditLogo,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onAddButton,
  onEditButton,
  onDeleteButton,
}) => {
  const { links, buttons, showCart } = navbarData;

  return (
    <nav
      className={`bg-background flex items-center justify-between p-4 ${
        !isEditable ? "sticky top-16 z-40 border-b shadow-sm" : ""
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
                href={link.href}
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
              <a href={button.href}>{button.text}</a>
            </Button>
          )
        )}
        {isEditable && onAddButton && (
          <Button onClick={onAddButton} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Button
          </Button>
        )}
        {showCart && <CartIcon />}
      </div>
    </nav>
  );
};
