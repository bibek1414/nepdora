import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
  User,
  Heart,
  Package,
  LogOut,
} from "lucide-react";
import { CartIcon } from "@/components/site-owners/builder/cart/cart-icon";
import SideCart from "@/components/site-owners/publish/cart/side-cart";
import { NavbarLogo } from "../navbar-logo";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { useAuth } from "@/hooks/customer/publish/use-auth";
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
import { SearchBar } from "@/components/site-owners/publish/search-bar/search-bar";
import { useRouter } from "next/navigation";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
  siteUser: string;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
  disableClicks?: boolean;
}

export const NavbarStyle4: React.FC<NavbarStyleProps> = ({
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
  disableClicks = false,
}) => {
  const { links, buttons, showCart } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  // Get wishlist data
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;

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

  // Fetch categories and subcategories
  const { data: categoriesData } = useCategories();
  const { data: subCategoriesData } = useSubCategories();

  const categories = categoriesData?.results || [];
  const subCategories = subCategoriesData?.results || [];

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
      return `/publish/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/publish/${siteUser}/${cleanHref}`;
  };

  const handleCategoryFilter = (categorySlug: string, categoryName: string) => {
    if (isEditable || disableClicks) return;

    const filterUrl = `/publish/${siteUser}/products?category=${categorySlug}`;
    router.push(filterUrl);
  };

  const handleSubCategoryFilter = (
    subCategorySlug: string,
    subCategoryName: string
  ) => {
    if (isEditable || disableClicks) return;

    const filterUrl = `/publish/${siteUser}/products?sub_category=${subCategorySlug}`;
    router.push(filterUrl);
  };

  const handleCombinedFilter = (
    categorySlug: string,
    subCategorySlug: string
  ) => {
    if (isEditable || disableClicks) return;

    const filterUrl = `/publish/${siteUser}/products?category=${categorySlug}&sub_category=${subCategorySlug}`;
    router.push(filterUrl);
  };

  const generateCategoryHref = (categorySlug: string) => {
    if (isEditable || disableClicks) return "#";
    return `/publish/${siteUser}/category/${categorySlug}`;
  };

  const generateSubCategoryHref = (subCategorySlug: string) => {
    if (isEditable || disableClicks) return "#";
    return `/publish/${siteUser}/subcategory/${subCategorySlug}`;
  };

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  const handleLoginClick = () => {
    if (isEditable || disableClicks) return;
    router.push(`/publish/${siteUser}/login`);
  };

  const handleProfileAction = (action: string) => {
    if (isEditable || disableClicks) return;

    switch (action) {
      case "profile":
        router.push(`/publish/${siteUser}/profile`);
        break;
      case "wishlist":
        router.push(`/publish/${siteUser}/wishlist`);
        break;
      case "orders":
        router.push(`/publish/${siteUser}/orders`);
        break;
      case "logout":
        logout();
        router.push(`/publish/${siteUser}`);
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

  return (
    <>
      <nav
        className={`bg-background flex items-center justify-between border-b p-4 ${
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

          <div className="hidden items-center gap-6 md:flex">
            {/* Desktop Search Bar */}
            <div
              className={`relative hidden max-w-md flex-1 md:block ${disableClicks ? "pointer-events-auto" : ""}`}
            >
              <SearchBar
                siteUser={siteUser}
                isEditable={isEditable}
                className="w-full"
              />
            </div>

            {/* Regular Navigation Links */}
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
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.heading,
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
                  className={`text-sm font-medium transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                >
                  {link.text}
                </a>
              )
            )}

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                >
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              {!disableClicks && (
                <DropdownMenuContent className="w-56" align="start">
                  {categories.map(category => {
                    const categorySubCategories = getSubCategoriesForCategory(
                      category.id
                    );

                    if (categorySubCategories.length > 0) {
                      return (
                        <DropdownMenuSub key={category.id}>
                          <DropdownMenuSubTrigger className="cursor-pointer">
                            <span>{category.name}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-48">
                            <DropdownMenuItem
                              className="cursor-pointer font-medium"
                              onClick={() =>
                                handleCategoryFilter(
                                  category.slug,
                                  category.name
                                )
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
                                  handleSubCategoryFilter(
                                    subCategory.slug,
                                    subCategory.name
                                  )
                                }
                              >
                                {subCategory.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    } else {
                      return (
                        <DropdownMenuItem
                          key={category.id}
                          className="cursor-pointer"
                          onClick={() =>
                            handleCategoryFilter(category.slug, category.name)
                          }
                        >
                          {category.name}
                        </DropdownMenuItem>
                      );
                    }
                  })}
                  {categories.length === 0 && (
                    <DropdownMenuItem disabled>
                      No categories available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              )}
            </DropdownMenu>

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
          {/* Regular buttons (editable ones) */}
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
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.heading,
                  }}
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
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                  fontFamily: theme.fonts.heading,
                }}
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

          {/* Fixed Login/Profile Button - Always present, not editable */}
          {!isAuthenticated ? (
            <Button
              variant="default"
              size="sm"
              onClick={isEditable ? undefined : handleLoginClick}
              className={`${
                isEditable
                  ? "pointer-events-none opacity-60"
                  : disableClicks
                    ? "pointer-events-auto cursor-default opacity-60"
                    : "pointer-events-auto"
              }`}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                fontFamily: theme.fonts.heading,
              }}
            >
              {isEditable ? "Login (Preview Only)" : "Login"}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className={`flex items-center gap-1 ${
                    isEditable || disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
                  }`}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                    fontFamily: theme.fonts.heading,
                  }}
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                >
                  <User className="h-4 w-4" />
                  {user?.first_name || "Profile"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              {!disableClicks && !isEditable && (
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleProfileAction("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleProfileAction("wishlist")}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <div className="flex w-full items-center justify-between">
                      <span>Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleProfileAction("orders")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleProfileAction("logout")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
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

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
    </>
  );
};
