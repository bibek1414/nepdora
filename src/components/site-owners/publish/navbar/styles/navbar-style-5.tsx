import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { Plus, Edit, Trash2, Menu, Search } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative">
    {children}
    <div className="absolute -top-8 -right-3 z-50 hidden items-center gap-1 rounded-full bg-white p-1 shadow-md group-hover:flex">
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
  siteUser: string;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
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

  const generateLinkHref = (originalHref: string) => {
    if (isEditable || disableClicks) return "#";

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

  const handleBannerChange = (newText: string) => {
    setBannerText(newText);
    if (onUpdateBanner) {
      onUpdateBanner(newText);
    }
  };

  // Group links for mega menu (first 2 links become main categories if we have enough links)
  // If we have fewer links, just show them as regular links
  const mainCategoryLinks = links.length >= 4 ? links.slice(0, 2) : [];
  const remainingLinks = links.length >= 4 ? links.slice(2) : links;

  // Split remaining links into groups for mega menu
  const getLinkGroup = (index: number) => {
    if (remainingLinks.length === 0) return [];
    const groupSize = Math.ceil(remainingLinks.length / 3);
    const start = index * groupSize;
    return remainingLinks.slice(start, start + groupSize);
  };

  return (
    <>
      <div className="bg-white">
        {/* Promo Banner */}
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

        {/* Header */}
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
                {/* Mobile menu button */}
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

                {/* Logo */}
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

                {/* Desktop Flyout menus */}
                <div className="group/popover-group hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {mainCategoryLinks.map((link, index) => (
                      <Popover
                        key={link.id}
                        open={openPopovers[link.id] || false}
                        onOpenChange={open => {
                          if (!disableClicks && !isEditable) {
                            setOpenPopovers(prev => ({
                              ...prev,
                              [link.id]: open,
                            }));
                          }
                        }}
                      >
                        <div className="group/popover flex" key={link.id}>
                          <div className="relative flex">
                            {isEditable && onEditLink && onDeleteLink ? (
                              <EditableItem
                                onEdit={() => onEditLink(link)}
                                onDelete={() => onDeleteLink(link.id)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    className="relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out hover:text-gray-800"
                                    style={{
                                      color: openPopovers[link.id]
                                        ? theme.colors.primary
                                        : theme.colors.text,
                                    }}
                                    onClick={e => {
                                      e.preventDefault();
                                    }}
                                  >
                                    {link.text}
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-x-0 -bottom-px z-30 h-0.5 bg-transparent duration-200 ease-in"
                                      style={{
                                        backgroundColor: openPopovers[link.id]
                                          ? theme.colors.primary
                                          : "transparent",
                                      }}
                                    ></span>
                                  </button>
                                </PopoverTrigger>
                              </EditableItem>
                            ) : (
                              <PopoverTrigger asChild>
                                <button
                                  className="relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out hover:text-gray-800"
                                  style={{
                                    color: openPopovers[link.id]
                                      ? theme.colors.primary
                                      : theme.colors.text,
                                  }}
                                  onClick={e => {
                                    if (disableClicks) {
                                      e.preventDefault();
                                      return;
                                    }
                                  }}
                                >
                                  {link.text}
                                  <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 -bottom-px z-30 h-0.5 bg-transparent duration-200 ease-in"
                                    style={{
                                      backgroundColor: openPopovers[link.id]
                                        ? theme.colors.primary
                                        : "transparent",
                                    }}
                                  ></span>
                                </button>
                              </PopoverTrigger>
                            )}

                            <PopoverContent
                              className="w-screen max-w-7xl p-0"
                              align="start"
                              sideOffset={1}
                            >
                              <div className="bg-white">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                    {/* Link groups in columns */}
                                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                      {[0, 1, 2].map(groupIndex => {
                                        const linkGroup =
                                          getLinkGroup(groupIndex);
                                        if (linkGroup.length === 0) return null;

                                        return (
                                          <div key={groupIndex}>
                                            <p
                                              className="font-medium text-gray-900"
                                              style={{
                                                color: theme.colors.text,
                                              }}
                                            >
                                              {link.text}
                                            </p>
                                            <ul
                                              role="list"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {linkGroup.map(subLink =>
                                                isEditable &&
                                                onEditLink &&
                                                onDeleteLink ? (
                                                  <EditableItem
                                                    key={subLink.id}
                                                    onEdit={() =>
                                                      onEditLink(subLink)
                                                    }
                                                    onDelete={() =>
                                                      onDeleteLink(subLink.id)
                                                    }
                                                  >
                                                    <li className="flex">
                                                      <a
                                                        href={subLink.href}
                                                        onClick={e =>
                                                          e.preventDefault()
                                                        }
                                                        className="cursor-pointer hover:text-gray-800"
                                                        style={{
                                                          color:
                                                            theme.colors.text,
                                                        }}
                                                      >
                                                        {subLink.text}
                                                      </a>
                                                    </li>
                                                  </EditableItem>
                                                ) : (
                                                  <li
                                                    className="flex"
                                                    key={subLink.id}
                                                  >
                                                    <a
                                                      href={generateLinkHref(
                                                        subLink.href
                                                      )}
                                                      onClick={e => {
                                                        handleLinkClick(
                                                          e,
                                                          subLink.href
                                                        );
                                                        setOpenPopovers(
                                                          prev => ({
                                                            ...prev,
                                                            [link.id]: false,
                                                          })
                                                        );
                                                      }}
                                                      className="cursor-pointer hover:text-gray-800"
                                                      style={{
                                                        color:
                                                          theme.colors.text,
                                                      }}
                                                    >
                                                      {subLink.text}
                                                    </a>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </div>
                        </div>
                      </Popover>
                    ))}

                    {/* Regular links without mega menu */}
                    {remainingLinks.map(link =>
                      isEditable && onEditLink && onDeleteLink ? (
                        <EditableItem
                          key={link.id}
                          onEdit={() => onEditLink(link)}
                          onDelete={() => onDeleteLink(link.id)}
                        >
                          <a
                            href={link.href}
                            onClick={e => e.preventDefault()}
                            className="flex cursor-pointer items-center text-sm font-medium hover:text-gray-800"
                            style={{
                              color: theme.colors.text,
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
                          className={`flex items-center text-sm font-medium hover:text-gray-800 ${
                            disableClicks
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          }`}
                          style={{
                            color: theme.colors.text,
                          }}
                        >
                          {link.text}
                        </a>
                      )
                    )}
                  </div>
                </div>

                {/* Right side actions */}
                <div className="ml-auto flex items-center">
                  {/* Desktop auth links */}
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    {buttons.slice(0, 2).map(button =>
                      isEditable && onEditButton && onDeleteButton ? (
                        <EditableItem
                          key={button.id}
                          onEdit={() => onEditButton(button)}
                          onDelete={() => onDeleteButton(button.id)}
                        >
                          <a
                            href={button.href}
                            onClick={e => e.preventDefault()}
                            className="cursor-pointer text-sm font-medium hover:text-gray-800"
                            style={{
                              color: theme.colors.text,
                            }}
                          >
                            {button.text}
                          </a>
                        </EditableItem>
                      ) : (
                        <a
                          key={button.id}
                          href={generateLinkHref(button.href)}
                          onClick={e => handleLinkClick(e, button.href)}
                          className={`text-sm font-medium hover:text-gray-800 ${
                            disableClicks
                              ? "cursor-default opacity-60"
                              : "cursor-pointer"
                          }`}
                          style={{
                            color: theme.colors.text,
                          }}
                        >
                          {button.text}
                        </a>
                      )
                    )}
                    {buttons.length > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-6 w-px bg-gray-200"
                      ></span>
                    )}
                  </div>

                  {/* Search */}
                  <div className="flex lg:ml-6">
                    <a
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
                    </a>
                  </div>

                  {/* Cart */}
                  {showCart && (
                    <div
                      className={`ml-4 flow-root lg:ml-6 ${disableClicks ? "pointer-events-auto" : ""}`}
                    >
                      <CartIcon onToggleCart={toggleCart} />
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
            {/* Mobile menu with tabs (only if we have main category links) */}
            {mainCategoryLinks.length > 0 ? (
              <Tabs
                defaultValue={mainCategoryLinks[0]?.id || "links"}
                className="w-full"
              >
                <div className="border-b border-gray-200">
                  <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0">
                    {mainCategoryLinks.map(link => (
                      <TabsTrigger
                        key={link.id}
                        value={link.id}
                        className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
                        style={{
                          borderColor: theme.colors.primary,
                          color: theme.colors.text,
                        }}
                      >
                        {link.text}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {mainCategoryLinks.map((link, index) => {
                  const linkGroup = getLinkGroup(index);
                  return (
                    <TabsContent
                      key={link.id}
                      value={link.id}
                      className="space-y-10 px-4 pt-10 pb-8"
                    >
                      <div>
                        <p
                          className="font-medium text-gray-900"
                          style={{ color: theme.colors.text }}
                        >
                          {link.text}
                        </p>
                        <ul
                          role="list"
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {linkGroup.map(subLink =>
                            isEditable && onEditLink && onDeleteLink ? (
                              <EditableItem
                                key={subLink.id}
                                onEdit={() => onEditLink(subLink)}
                                onDelete={() => onDeleteLink(subLink.id)}
                              >
                                <li className="flow-root">
                                  <a
                                    href={subLink.href}
                                    onClick={e => e.preventDefault()}
                                    className="-m-2 block cursor-pointer p-2 text-gray-500"
                                  >
                                    {subLink.text}
                                  </a>
                                </li>
                              </EditableItem>
                            ) : (
                              <li className="flow-root" key={subLink.id}>
                                <a
                                  href={generateLinkHref(subLink.href)}
                                  onClick={e =>
                                    handleLinkClick(e, subLink.href)
                                  }
                                  className="-m-2 block cursor-pointer p-2 text-gray-500 hover:text-gray-900"
                                >
                                  {subLink.text}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            ) : (
              /* Simple mobile menu without tabs if no main categories */
              <div className="space-y-6 px-4 py-6">
                {remainingLinks.map(link =>
                  isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem
                      key={link.id}
                      onEdit={() => onEditLink(link)}
                      onDelete={() => onDeleteLink(link.id)}
                    >
                      <div className="flow-root">
                        <a
                          href={link.href}
                          onClick={e => e.preventDefault()}
                          className="-m-2 block cursor-pointer p-2 font-medium text-gray-900"
                        >
                          {link.text}
                        </a>
                      </div>
                    </EditableItem>
                  ) : (
                    <div className="flow-root" key={link.id}>
                      <a
                        href={generateLinkHref(link.href)}
                        onClick={e => handleLinkClick(e, link.href)}
                        className="-m-2 block cursor-pointer p-2 font-medium text-gray-900 hover:text-gray-700"
                      >
                        {link.text}
                      </a>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Additional links (only show if we have main categories and remaining links) */}
            {mainCategoryLinks.length > 0 && remainingLinks.length > 0 && (
              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {remainingLinks.map(link =>
                  isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem
                      key={link.id}
                      onEdit={() => onEditLink(link)}
                      onDelete={() => onDeleteLink(link.id)}
                    >
                      <div className="flow-root">
                        <a
                          href={link.href}
                          onClick={e => e.preventDefault()}
                          className="-m-2 block cursor-pointer p-2 font-medium text-gray-900"
                        >
                          {link.text}
                        </a>
                      </div>
                    </EditableItem>
                  ) : (
                    <div className="flow-root" key={link.id}>
                      <a
                        href={generateLinkHref(link.href)}
                        onClick={e => handleLinkClick(e, link.href)}
                        className="-m-2 block cursor-pointer p-2 font-medium text-gray-900 hover:text-gray-700"
                      >
                        {link.text}
                      </a>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Buttons */}
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
                        <a
                          href={button.href}
                          onClick={e => e.preventDefault()}
                          className="-m-2 block cursor-pointer p-2 font-medium text-gray-900"
                        >
                          {button.text}
                        </a>
                      </div>
                    </EditableItem>
                  ) : (
                    <div className="flow-root" key={button.id}>
                      <a
                        href={generateLinkHref(button.href)}
                        onClick={e => handleLinkClick(e, button.href)}
                        className="-m-2 block cursor-pointer p-2 font-medium text-gray-900 hover:text-gray-700"
                      >
                        {button.text}
                      </a>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
    </>
  );
};
