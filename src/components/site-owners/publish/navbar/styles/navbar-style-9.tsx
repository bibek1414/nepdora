import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  Menu,
  X,
  Search,
  ShoppingCart,
} from "lucide-react";
import { NavbarLogo } from "../navbar-logo";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative">{children}</div>
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
  onEditCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle9: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditButton,
  onDeleteButton,
  disableClicks = false,
}) => {
  const { links, buttons, showCart } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (disableClicks) return;
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`bg-background mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6 ${
          !isEditable ? "sticky top-0 z-40 border-b" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
      >
        {/* Logo - Left side */}
        <div className="flex min-w-0 flex-1 items-center lg:gap-6">
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
        </div>

        {/* Desktop Navigation - Right side */}
        <div className="hidden flex-shrink-0 items-center gap-4 lg:flex">
          {/* Desktop Links */}
          <div className="hidden items-center gap-6 lg:flex">
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
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-base font-medium whitespace-nowrap transition-colors"
                  >
                    {link.text}
                  </a>
                </EditableItem>
              ) : (
                <a
                  key={link.id}
                  href={generateLinkHref(link.href)}
                  onClick={e => handleLinkClick(e, link.href)}
                  className={`text-base font-medium whitespace-nowrap transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                >
                  {link.text}
                </a>
              )
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
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
                    size="default"
                    className="cursor-pointer px-6 py-2 text-base"
                  >
                    {button.text}
                  </Button>
                </EditableItem>
              ) : (
                <Button
                  key={button.id}
                  variant={getButtonVariant(button.variant)}
                  size="default"
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                  className={`px-6 py-2 text-base ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
                  }`}
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
          </div>
        </div>

        {/* Mobile Header Right Side - Menu Button & Cart */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Cart Icon - Mobile */}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-1/2 sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
            <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex h-[calc(100vh-100px)] flex-col">
            {/* Mobile Links */}
            <div className="mb-6 space-y-2">
              {links.map(link =>
                isEditable && onEditLink && onDeleteLink ? (
                  <EditableItem
                    key={link.id}
                    onEdit={() => onEditLink(link)}
                    onDelete={() => onDeleteLink(link.id)}
                  >
                    <Button
                      variant="ghost"
                      className="hover:bg-accent h-12 w-full justify-start px-4 text-lg font-normal"
                      onClick={e => e.preventDefault()}
                    >
                      {link.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild key={link.id}>
                    <Button
                      variant="ghost"
                      className="hover:bg-accent h-12 w-full justify-start px-4 text-lg font-normal"
                      asChild={!disableClicks}
                    >
                      <a
                        href={generateLinkHref(link.href)}
                        onClick={e => handleLinkClick(e, link.href)}
                        className={`w-full text-left ${
                          disableClicks ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        {link.text}
                      </a>
                    </Button>
                  </SheetClose>
                )
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="mb-6 space-y-3">
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
                      size="default"
                      className="w-full cursor-pointer justify-center py-3 text-base font-medium"
                    >
                      {button.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild key={button.id}>
                    <Button
                      variant={getButtonVariant(button.variant)}
                      size="default"
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                      className={`w-full justify-center py-3 text-base font-medium ${
                        disableClicks
                          ? "pointer-events-auto cursor-default opacity-60"
                          : ""
                      }`}
                      asChild={!disableClicks}
                    >
                      {disableClicks ? (
                        <span>{button.text}</span>
                      ) : (
                        <a
                          href={generateLinkHref(button.href)}
                          className="w-full text-center"
                        >
                          {button.text}
                        </a>
                      )}
                    </Button>
                  </SheetClose>
                )
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
