import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import {
  ChevronDown,
  User,
  Heart,
  Package,
  LogOut,
  ShoppingCart,
  Menu,
  Search,
} from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { useAuth } from "@/hooks/customer/use-auth";
import { useWishlist } from "@/hooks/customer/use-wishlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/site-owners/builder/search-bar/search-bar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/navbar/editable-text";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  disableClicks?: boolean;
  onUpdateBanner?: (text: string) => void;
}

export const NavbarStyle13: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  onEditLogo,
  onAddLink,
  onEditLink,
  onDeleteLink,
  siteUser,
  onAddButton,
  onEditButton,
  onDeleteButton,
  onEditCart,
  disableClicks = false,
  onUpdateBanner,
}) => {
  const { links, buttons, showCart, enableLogin } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerText, setBannerText] = useState(
    navbarData.bannerText ||
      "Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!"
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
    },
  };

  const { data: categoriesData } = useCategories();
  const { data: subCategoriesData } = useSubCategories();

  const categories = categoriesData?.results || [];
  const subCategories = subCategoriesData?.results || [];

  const toggleCart = () => {
    if (disableClicks) return;
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => setIsCartOpen(false);

  const handleCategoryFilter = (categorySlug: string) => {
    if (isEditable || disableClicks) return;
    router.push(
      generateLinkHref(
        `/collections/?category=${categorySlug}`,
        siteUser,
        pathname
      )
    );
  };

  const handleSubCategoryFilter = (subCategorySlug: string) => {
    if (isEditable || disableClicks) return;
    router.push(
      generateLinkHref(
        `/collections/?sub_category=${subCategorySlug}`,
        siteUser,
        pathname
      )
    );
  };

  const handleProfileAction = (action: string) => {
    if (isEditable || disableClicks) return;
    switch (action) {
      case "profile":
        router.push(generateLinkHref("/profile", siteUser, pathname));
        break;
      case "wishlist":
        router.push(generateLinkHref("/wishlist", siteUser, pathname));
        break;
      case "orders":
        router.push(generateLinkHref("/orders", siteUser, pathname));
        break;
      case "logout":
        logout();
        break;
    }
  };

  const getSubCategoriesForCategory = (categoryId: number) => {
    return subCategories.filter(subCat => {
      if (typeof subCat.category === "object" && subCat.category) {
        return subCat.category.id === categoryId;
      }
      return parseInt(subCat.category as string) === categoryId;
    });
  };

  const handleBannerChange = (newText: string) => {
    setBannerText(newText);
    if (onUpdateBanner) onUpdateBanner(newText);
  };

  // Appearance Settings
  const navBg = navbarData.backgroundColor || "#ffffff";
  const navText = navbarData.textColor || "#111827";
  const navBorder = navbarData.textColor
    ? `${navbarData.textColor}15`
    : "rgba(0,0,0,0.05)";

  return (
    <div
      className="-sm sticky top-0 z-50 w-full transition-all"
      style={{
        backgroundColor: navBg,
        color: navText,
      }}
    >
      {/* Row 0: Simple Top Bar Banner (Collapsible) */}
      <div
        className={`-wide flex items-center justify-center overflow-hidden px-4 text-xs font-semibold transition-all duration-300 ease-in-out sm:text-sm ${
          isScrolled ? "pointer-events-none h-0 opacity-0" : "h-10 opacity-100"
        }`}
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryForeground,
        }}
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
            className="truncate text-center"
            style={{ color: theme.colors.primaryForeground }}
            dangerouslySetInnerHTML={{ __html: bannerText }}
          />
        )}
      </div>

      {/* Row 1: Simple Single-Line Content Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-2 py-3 lg:gap-8">
          {/* Brand Logo & Mobile Trigger */}
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="-ml-2 rounded-lg p-2 transition-colors"
              style={{ color: navText }}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex shrink-0 items-center justify-center lg:justify-start">
            {isEditable && onEditLogo ? (
              <EditableItem>
                <NavbarLogo
                  data={navbarData}
                  isEditable={isEditable}
                  onEdit={onEditLogo}
                />
              </EditableItem>
            ) : (
              <NavbarLogo data={navbarData} siteUser={siteUser} />
            )}
          </div>

          {/* Desktop Single-Line Flow */}
          <div className="hidden flex-1 items-center justify-between gap-6 lg:flex">
            {/* Search Input (Integrated) */}
            <div className="relative w-full max-w-md flex-1">
              <SearchBar
                siteUser={siteUser}
                isEditable={isEditable}
                className="w-full"
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6 whitespace-nowrap">
              {links.map(link => (
                <div key={link.id}>
                  {isEditable && onEditLink ? (
                    <EditableItem>
                      <span
                        className="text-sm font-bold opacity-80"
                        style={{ color: navText }}
                      >
                        {link.text}
                      </span>
                    </EditableItem>
                  ) : (
                    <Link
                      href={generateLinkHref(link.href, siteUser, pathname)}
                      className="text-sm font-bold transition-all hover:scale-105"
                      style={{ color: navText }}
                      onMouseLeave={e =>
                        (e.currentTarget.style.color = navText)
                      }
                    >
                      {link.text}
                    </Link>
                  )}
                </div>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex shrink-0 items-center gap-1.5 text-sm font-bold transition-all hover:bg-transparent"
                    style={{ color: navText }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = theme.colors.primary)
                    }
                    onMouseLeave={e => (e.currentTarget.style.color = navText)}
                  >
                    Categories
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="mt-2 w-56"
                  style={{ backgroundColor: navBg, color: navText }}
                >
                  {categories.map(category => {
                    const categorySubCategories = getSubCategoriesForCategory(
                      category.id
                    );

                    if (categorySubCategories.length > 0) {
                      return (
                        <DropdownMenuSub key={category.id}>
                          <DropdownMenuSubTrigger className="cursor-pointer py-2.5 font-medium">
                            <span>{category.name}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent
                            className="w-48"
                            style={{ backgroundColor: navBg, color: navText }}
                          >
                            <DropdownMenuItem
                              className="cursor-pointer font-medium"
                              onClick={() =>
                                handleCategoryFilter(category.slug)
                              }
                            >
                              View All {category.name}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {categorySubCategories.map(subCategory => (
                              <DropdownMenuItem
                                key={subCategory.id}
                                className="cursor-pointer"
                                onClick={() =>
                                  handleSubCategoryFilter(subCategory.slug)
                                }
                              >
                                {subCategory.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    }

                    return (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => handleCategoryFilter(category.slug)}
                        className="cursor-pointer py-2.5 font-medium"
                      >
                        {category.name}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Categories Dropdown (Nested like Style 2) */}

            {/* Actions: Buttons + Cart */}
            <div className="flex shrink-0 items-center gap-3">
              {/* Auth/Profile Actions */}
              {enableLogin && (
                <>
                  {!isAuthenticated ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-10 rounded-xl px-6 text-xs font-bold whitespace-nowrap transition-all active:scale-95"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                      }}
                      asChild={!isEditable}
                    >
                      {isEditable ? (
                        <span>Login</span>
                      ) : (
                        <Link
                          href={generateLinkHref("/login", siteUser, pathname)}
                        >
                          Login
                        </Link>
                      )}
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all"
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.primaryForeground,
                          }}
                        >
                          <User
                            className="h-4 w-4"
                            style={{ color: theme.colors.primaryForeground }}
                          />
                          <span className="max-w-[80px] truncate">
                            {user?.first_name || "Profile"}
                          </span>
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="mt-2 w-52"
                        style={{ backgroundColor: navBg, color: navText }}
                      >
                        <DropdownMenuItem
                          className="cursor-pointer py-2.5 font-medium"
                          onClick={() => handleProfileAction("profile")}
                        >
                          <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer py-2.5 font-medium"
                          onClick={() => handleProfileAction("wishlist")}
                        >
                          <Heart className="mr-2 h-4 w-4" /> Wishlist
                          {wishlistCount > 0 && (
                            <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                              {wishlistCount}
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer py-2.5 font-medium"
                          onClick={() => handleProfileAction("orders")}
                        >
                          <Package className="mr-2 h-4 w-4" /> My Orders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer py-2.5 font-medium text-red-500"
                          onClick={() => handleProfileAction("logout")}
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}

              {showCart && (
                <div className="relative mr-2 ml-2">
                  {isEditable && onEditCart ? (
                    <ShoppingCart
                      className="h-5 w-5"
                      style={{ color: navText }}
                    />
                  ) : (
                    <CartIcon onToggleCart={toggleCart} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Actions (User icon toggle/Cart) */}
          <div className="flex items-center gap-2 lg:hidden">
            {showCart && <CartIcon onToggleCart={toggleCart} />}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-xs overflow-y-auto"
          style={{
            backgroundColor: navBg,
            color: navText,
          }}
        >
          <SheetHeader>
            <SheetTitle style={{ color: navText }}>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-2 text-left">
            {/* Search Bar */}
            <div className="px-4 py-4">
              <SearchBar siteUser={siteUser} isEditable={isEditable} />
            </div>

            {/* Mobile Links */}
            <div className="space-y-6 px-4 py-6">
              <p
                className="text-[10px] font-bold tracking-[2px] uppercase opacity-50"
                style={{ color: navText }}
              >
                Navigation
              </p>
              {links.map(link => (
                <div key={link.id} className="flow-root">
                  {isEditable && onEditLink && onDeleteLink ? (
                    <EditableItem>
                      <Link
                        href={link.href}
                        onClick={e => e.preventDefault()}
                        className="-m-2 block cursor-pointer p-2 text-base font-bold transition-all hover:opacity-80"
                        style={{ color: navText }}
                      >
                        {link.text}
                      </Link>
                    </EditableItem>
                  ) : (
                    <Link
                      key={link.id}
                      href={generateLinkHref(link.href, siteUser, pathname)}
                      className="-m-2 block rounded-xl p-2 text-base font-bold transition-all hover:opacity-80"
                      style={{ color: navText }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.text}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-gray-100 px-4 py-6">
              <p
                className="text-[10px] font-bold tracking-[2px] uppercase opacity-50"
                style={{ color: navText }}
              >
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 8).map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryFilter(category.slug);
                      setIsMobileMenuOpen(false);
                    }}
                    className="rounded-xl border border-gray-100 px-4 py-3 text-left text-xs font-semibold transition-all hover:opacity-80"
                    style={{ color: navText }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Account & Logout */}
            <div className="space-y-6 border-t border-gray-100 px-4 py-6">
              {enableLogin && (
                <>
                  <div
                    onClick={() => {
                      handleProfileAction("profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block cursor-pointer text-sm font-bold opacity-70 hover:opacity-100"
                  >
                    My Profile
                  </div>
                  <div
                    onClick={() => {
                      handleProfileAction("orders");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block cursor-pointer text-sm font-bold opacity-70 hover:opacity-100"
                  >
                    My Orders
                  </div>
                  <div
                    onClick={() => {
                      handleProfileAction("wishlist");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block cursor-pointer text-sm font-bold opacity-70 hover:opacity-100"
                  >
                    Wishlist
                  </div>
                </>
              )}

              {buttons.map(btn => (
                <div key={btn.id}>
                  {isEditable && onEditButton && onDeleteButton ? (
                    <EditableItem>
                      <Link
                        href={btn.href}
                        onClick={e => e.preventDefault()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-xs font-bold transition-all hover:opacity-80"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground,
                        }}
                      >
                        {btn.text}
                      </Link>
                    </EditableItem>
                  ) : (
                    <Button
                      className="h-12 w-full rounded-xl text-xs font-bold tracking-wider transition-all"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                      }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push(
                          generateLinkHref(btn.href, siteUser, pathname)
                        );
                      }}
                    >
                      {btn.text}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </div>
  );
};
