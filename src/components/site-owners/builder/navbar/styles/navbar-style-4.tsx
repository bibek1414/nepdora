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
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import { useAuth } from "@/hooks/customer/use-auth";
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

  // Function to generate the correct href for links
  const generateLinkHref = (originalHref: string) => {
    if (isEditable || disableClicks) return "#";

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/preview/${siteUser}`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/preview/${siteUser}/${cleanHref}`;
  };

  // Function to handle category filtering
  const handleCategoryFilter = (categorySlug: string, categoryName: string) => {
    if (isEditable || disableClicks) return;

    const filterUrl = `/preview/${siteUser}/products?category=${categorySlug}`;
    router.push(filterUrl);
  };

  // Function to handle subcategory filtering
  const handleSubCategoryFilter = (
    subCategorySlug: string,
    subCategoryName: string
  ) => {
    if (isEditable || disableClicks) return;

    const filterUrl = `/preview/${siteUser}/products?sub_category=${subCategorySlug}`;
    router.push(filterUrl);
  };

  // Function to handle both category and subcategory filtering
  const handleCombinedFilter = (
    categorySlug: string,
    subCategorySlug: string
  ) => {
    if (isEditable || disableClicks) return;

    const filterUrl = `/preview/${siteUser}/products?category=${categorySlug}&sub_category=${subCategorySlug}`;
    router.push(filterUrl);
  };

  // Function to generate category/subcategory hrefs (legacy support)
  const generateCategoryHref = (categorySlug: string) => {
    if (isEditable || disableClicks) return "#";
    return `/preview/${siteUser}/category/${categorySlug}`;
  };

  const generateSubCategoryHref = (subCategorySlug: string) => {
    if (isEditable || disableClicks) return "#";
    return `/preview/${siteUser}/subcategory/${subCategorySlug}`;
  };

  // Handler to prevent clicks when disabled
  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  // Handle login button click
  const handleLoginClick = () => {
    if (isEditable || disableClicks) return;
    router.push(`/preview/${siteUser}/login`);
  };

  // Handle profile dropdown actions
  const handleProfileAction = (action: string) => {
    if (isEditable || disableClicks) return;

    switch (action) {
      case "profile":
        router.push(`/preview/${siteUser}/profile`);
        break;
      case "wishlist":
        router.push(`/preview/${siteUser}/wishlist`);
        break;
      case "orders":
        router.push(`/preview/${siteUser}/orders`);
        break;
      case "logout":
        logout();
        router.push(`/preview/${siteUser}`);
        break;
    }
  };

  // Group subcategories by category
  const getSubCategoriesForCategory = (categoryId: number) => {
    return subCategories.filter(subCat => {
      // Handle both string and object category references
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

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
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
                            {/* View All Category Items */}
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
                            {/* Subcategory Items */}
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
                      // Category without subcategories
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
                    Wishlist
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
