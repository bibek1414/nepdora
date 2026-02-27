import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { Search, ChevronRight, Heart } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useProductsWithParams } from "@/hooks/owner-site/admin/use-product";
import { useWishlist } from "@/hooks/customer/use-wishlist";

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
  onUpdateBanner?: (text: string) => void;
}

export const NavbarStyle12: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditCart,
  disableClicks = false,
  onUpdateBanner,
}) => {
  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    navbarData,
    undefined
  );
  const { links, showCart, bannerText, topBarItems } = data;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading: isSearchLoading } =
    useProductsWithParams({
      search: debouncedSearch,
      page_size: 5,
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !disableClicks && !isEditable) {
      router.push(
        generateLinkHref(
          `/collections?search=${encodeURIComponent(searchQuery)}`,
          siteUser,
          pathname,
          isEditable,
          disableClicks
        )
      );
      setIsSearchFocused(false);
    }
  };

  const productsData = searchResults?.results || [];

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

  // Ensure topBarItems exists or use defaults for the EditableLink
  const topBarLink = topBarItems?.[0] || {
    id: "1",
    text: "Shop Now",
    href: "#shop",
  };

  return (
    <>
      <nav
        className={`w-full ${
          !isEditable ? "sticky top-0 z-40" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
      >
        {/* Top Dark Bar */}
        <div
          className="bg-cover bg-center bg-no-repeat py-4 text-xs text-white sm:text-sm"
          style={{ backgroundImage: "url('/images/icons/top-bar.webp')" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center justify-start gap-2">
              <span className="text-gray-300">
                <EditableText
                  value={
                    bannerText ||
                    "Free Delivery on orders over $80. Don't miss discount."
                  }
                  onChange={newText => {
                    handleTextUpdate("bannerText")(newText);
                    if (onUpdateBanner) onUpdateBanner(newText);
                  }}
                  as="span"
                  isEditable={isEditable}
                  className="text-inherit"
                />
              </span>
              <EditableLink
                text={topBarLink.text}
                href={topBarLink.href || "#shop"}
                onChange={(text, href) => {
                  const newItems = topBarItems
                    ? [...topBarItems]
                    : [{ id: "1", text: "Shop Now", href: "#shop" }];
                  newItems[0] = { ...newItems[0], text, href };
                  handleArrayItemUpdate(
                    "topBarItems",
                    topBarLink.id
                  )(newItems[0]);
                }}
                isEditable={isEditable}
                siteUser={siteUser}
                dropdownPosition="bottom"
                className={`inline-flex h-auto items-center gap-1 rounded-full border border-zinc-700/50 px-3 py-1 transition-colors ${disableClicks ? "pointer-events-auto" : "hover:bg-zinc-800"}`}
              >
                <>
                  {topBarLink.text} <ChevronRight className="h-3 w-3" />
                </>
              </EditableLink>
            </div>
            <div className="hidden items-center gap-4 text-gray-300 sm:flex">
              <div className="hidden items-center gap-6 md:flex">
                {links.slice(0, 3).map((link: NavbarLink) =>
                  isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem key={link.id}>
                      <Link
                        href={link.href}
                        onClick={e => e.preventDefault()}
                        className="cursor-pointer text-sm font-medium text-white transition-colors hover:text-white/80"
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
          </div>
        </div>

        {/* Main White Navbar */}
        <div className="border-b border-gray-100 bg-white py-5 sm:py-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
            {/* Logo */}
            <div
              className={
                disableClicks ? "pointer-events-auto shrink-0" : "shrink-0"
              }
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

            {/* Centered Search */}
            <div
              className="ml-4 hidden max-w-md flex-1 md:flex lg:ml-8"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full rounded-full border border-gray-100 bg-gray-50/50 py-3 pr-4 pl-11 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                  disabled={disableClicks || isEditable}
                />

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                    {isSearchLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : productsData.length > 0 ? (
                      <div className="max-h-[60vh] overflow-y-auto py-2">
                        {productsData.map((product: any) => (
                          <Link
                            key={product.id}
                            href={generateLinkHref(
                              `${pathname?.includes("/preview/") ? "/product-details-draft" : "/product-details"}/${product.slug}`,
                              siteUser,
                              pathname,
                              isEditable,
                              disableClicks
                            )}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                            onClick={() => setIsSearchFocused(false)}
                          >
                            {product.thumbnail_image ? (
                              <Image
                                src={product.thumbnail_image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                                <Search className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Rs.
                                {parseFloat(
                                  product.price || "0"
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            <div className="hidden flex-1 md:block"></div>

            {/* Right Side: Links & Cart */}
            <div className="flex items-center gap-6">
              {/* Extra Links (Index 3+) */}
              {links.length > 3 && (
                <div className="hidden items-center gap-6 lg:flex">
                  {links.slice(3).map((link: NavbarLink) =>
                    isEditable && onEditLink && onDeleteLink ? (
                      <EditableItem key={link.id}>
                        <Link
                          href={link.href}
                          onClick={e => e.preventDefault()}
                          className="cursor-pointer text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
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
                        className={`text-sm font-medium text-gray-900 transition-colors ${
                          disableClicks
                            ? "cursor-default opacity-60"
                            : "cursor-pointer hover:text-gray-600"
                        }`}
                      >
                        {link.text}
                      </Link>
                    )
                  )}
                </div>
              )}

              {/* Wishlist Icon */}
              {!isEditable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    !disableClicks &&
                    router.push(
                      generateLinkHref("/wishlist", siteUser, pathname)
                    )
                  }
                  className={`relative flex items-center gap-1 hover:bg-transparent ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
                  }`}
                >
                  <Heart className="h-6 w-6 stroke-[1.5]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              )}

              {/* Cart Icon */}
              {showCart && (
                <div className={disableClicks ? "pointer-events-auto" : ""}>
                  {isEditable && onEditCart ? (
                    <EditableItem>
                      <CartIcon
                        onToggleCart={() => {}}
                        customIcon={
                          <Image
                            src="/images/site-owners/bag.webp"
                            alt="Cart"
                            width={24}
                            height={24}
                            className="h-6 w-6 object-contain"
                          />
                        }
                      />
                    </EditableItem>
                  ) : (
                    <CartIcon
                      onToggleCart={toggleCart}
                      customIcon={
                        <Image
                          src="/images/site-owners/bag.webp"
                          alt="Cart"
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Only show SideCart in preview mode, not in editable mode */}
      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </>
  );
};
