import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { CartIcon } from "@/components/site-owners/builder/cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/editable-text";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
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
  disableClicks?: boolean;
  onUpdateBanner?: (text: string) => void;
}

export const NavbarStyle5: React.FC<NavbarStyleProps> = ({
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
  disableClicks = false,
  onUpdateBanner,
}) => {
  const { links, buttons, showCart } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});
  const [bannerText, setBannerText] = useState(
    navbarData.bannerText || "Get free delivery on orders over $100"
  );

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

  const generateLinkHref = (originalHref: string) => {
    if (isEditable || disableClicks) return "#";

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return ``;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/${cleanHref}`;
  };

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  const handleBannerChange = (newText: string) => {
    setBannerText(newText);
    if (onUpdateBanner) {
      onUpdateBanner(newText);
    }
  };

  return (
    <>
      <div className="bg-white">
        <div
          className="flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8"
          style={{ backgroundColor: theme.colors.primary }}
        >
          {isEditable ? (
            <EditableText
              value={bannerText}
              onChange={handleBannerChange}
              className="mx-auto w-full text-center"
              isEditable={true}
              placeholder="Enter banner text..."
            />
          ) : (
            <div
              className="prose prose-sm max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bannerText }}
            />
          )}
        </div>

        <header className="relative bg-white">
          <nav
            aria-label="Top"
            className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
              disableClicks ? "pointer-events-none" : ""
            }`}
            style={{ fontFamily: theme.fonts.heading }}
          >
            <div className="border-b border-gray-200">
              <div className="flex h-16 items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (!disableClicks && !isEditable) {
                      setIsMobileMenuOpen(true);
                    }
                  }}
                  className={`relative rounded-md bg-white p-2 text-gray-400 lg:hidden ${
                    disableClicks || isEditable
                      ? "cursor-default opacity-60"
                      : "hover:bg-gray-100 hover:text-gray-500"
                  }`}
                  disabled={disableClicks || isEditable}
                >
                  <span className="absolute -inset-0.5"></span>
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" />
                </button>

                <div
                  className={`ml-4 flex lg:ml-0 ${disableClicks ? "pointer-events-auto" : ""}`}
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
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                    >
                      <NavbarLogo data={navbarData} siteUser={siteUser} />
                    </div>
                  )}
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {links.map(link => (
                      <div key={link.id} className="flex">
                        {isEditable && onEditLink && onDeleteLink ? (
                          <EditableItem
                            onEdit={() => onEditLink(link)}
                            onDelete={() => onDeleteLink(link.id)}
                          >
                            <Link
                              href={link.href}
                              onClick={e => e.preventDefault()}
                              className="mt-6 flex items-center text-sm font-medium hover:text-gray-800"
                            >
                              {link.text}
                            </Link>
                          </EditableItem>
                        ) : (
                          <Link
                            href={generateLinkHref(link.href)}
                            onClick={e => handleLinkClick(e, link.href)}
                            className={`flex items-center text-sm font-medium hover:text-gray-800 ${
                              disableClicks
                                ? "cursor-default opacity-60"
                                : "cursor-pointer"
                            }`}
                          >
                            {link.text}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ml-auto flex items-center">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    {buttons.slice(0, 2).map(button =>
                      isEditable && onEditButton && onDeleteButton ? (
                        <EditableItem
                          key={button.id}
                          onEdit={() => onEditButton(button)}
                          onDelete={() => onDeleteButton(button.id)}
                        >
                          <Link
                            href={button.href}
                            onClick={e => e.preventDefault()}
                            className="cursor-pointer text-sm font-medium hover:text-gray-800"
                          >
                            {button.text}
                          </Link>
                        </EditableItem>
                      ) : (
                        <Link
                          key={button.id}
                          href={generateLinkHref(button.href)}
                          onClick={e => handleLinkClick(e, button.href)}
                          className={`text-sm font-medium hover:text-gray-800 ${
                            disableClicks
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          }`}
                        >
                          {button.text}
                        </Link>
                      )
                    )}
                    {buttons.length > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-6 w-px bg-gray-200"
                      ></span>
                    )}
                  </div>

                  <div className="flex lg:ml-6">
                    <Link
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        if (disableClicks || isEditable) return;
                      }}
                      className={`p-2 text-gray-400 ${
                        disableClicks || isEditable
                          ? "cursor-default opacity-60"
                          : "cursor-pointer hover:text-gray-500"
                      }`}
                    >
                      <span className="sr-only">Search</span>
                      <Search className="h-6 w-6" />
                    </Link>
                  </div>

                  {showCart && (
                    <div
                      className={`ml-4 flow-root lg:ml-6 ${disableClicks ? "pointer-events-auto" : ""}`}
                    >
                      {isEditable && onEditCart ? (
                        <EditableItem onEdit={onEditCart}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="relative"
                            onClick={e => e.preventDefault()}
                          >
                            <ShoppingCart className="h-6 w-6" />
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
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-full max-w-xs overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-2">
            {/* Mobile Links */}
            <div className="space-y-6 px-4 py-6">
              {links.map(link =>
                isEditable && onEditLink && onDeleteLink ? (
                  <EditableItem
                    key={link.id}
                    onEdit={() => onEditLink(link)}
                    onDelete={() => onDeleteLink(link.id)}
                  >
                    <div className="flow-root">
                      <Link
                        href={link.href}
                        onClick={e => e.preventDefault()}
                        className="-m-2 block cursor-pointer p-2 font-medium text-gray-900"
                      >
                        {link.text}
                      </Link>
                    </div>
                  </EditableItem>
                ) : (
                  <div className="flow-root" key={link.id}>
                    <Link
                      href={generateLinkHref(link.href)}
                      onClick={e => handleLinkClick(e, link.href)}
                      className="-m-2 block cursor-pointer p-2 font-medium text-gray-900 hover:text-gray-700"
                    >
                      {link.text}
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Mobile Buttons */}
            {buttons.length > 0 && (
              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {buttons.map(button =>
                  isEditable && onEditButton && onDeleteButton ? (
                    <EditableItem
                      key={button.id}
                      onEdit={() => onEditButton(button)}
                      onDelete={() => onDeleteButton(button.id)}
                    >
                      <div className="flow-root">
                        <Link
                          href={button.href}
                          onClick={e => e.preventDefault()}
                          className="-m-2 block cursor-pointer p-2 font-medium text-gray-900"
                        >
                          {button.text}
                        </Link>
                      </div>
                    </EditableItem>
                  ) : (
                    <div className="flow-root" key={button.id}>
                      <Link
                        href={generateLinkHref(button.href)}
                        onClick={e => handleLinkClick(e, button.href)}
                        className="-m-2 block cursor-pointer p-2 font-medium text-gray-900 hover:text-gray-700"
                      >
                        {button.text}
                      </Link>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </>
  );
};
