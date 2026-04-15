import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import {
  Edit,
  Trash2,
  ChevronDown,
  User,
  Heart,
  Package,
  LogOut,
  ShoppingCart,
  Menu,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
}

export const NavbarStyle2: React.FC<NavbarStyleProps> = ({
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
}) => {
  const { links, buttons, showCart, enableLogin } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

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

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const pathname = usePathname();

  const handleCategoryFilter = (categorySlug: string, categoryName: string) => {
    if (isEditable || disableClicks) return;

    const filterUrl = generateLinkHref(
      `/collections/?category=${categorySlug}`,
      siteUser,
      pathname
    );
    router.push(filterUrl);
  };

  const handleSubCategoryFilter = (
    subCategorySlug: string,
    subCategoryName: string
  ) => {
    if (isEditable || disableClicks) return;

    const filterUrl = generateLinkHref(
      `/collections/?sub_category=${subCategorySlug}`,
      siteUser,
      pathname
    );
    router.push(filterUrl);
  };

  const handleCombinedFilter = (
    categorySlug: string,
    subCategorySlug: string
  ) => {
    if (isEditable || disableClicks) return;

    const filterUrl = generateLinkHref(
      `/collections/?category=${categorySlug}&sub_category=${subCategorySlug}`,
      siteUser,
      pathname
    );
    router.push(filterUrl);
  };

  const generateCategoryHref = (categorySlug: string) => {
    if (isEditable || disableClicks) return "#";
    return generateLinkHref(`/category/${categorySlug}`, siteUser, pathname);
  };

  const generateSubCategoryHref = (subCategorySlug: string) => {
    if (isEditable || disableClicks) return "#";
    return generateLinkHref(
      `/subcategory/${subCategorySlug}`,
      siteUser,
      pathname
    );
  };

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
  };

  const handleLoginClick = () => {
    if (isEditable || disableClicks) return;
    router.push(generateLinkHref("/login", siteUser, pathname));
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
        router.push(generateLinkHref("/", siteUser, pathname));
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
    <div
      className="bg-white"
      style={{ backgroundColor: navbarData.backgroundColor || "white" }}
    >
      <nav
        className={`flex items-center justify-between p-4 ${
          !isEditable ? "sticky top-16 z-40 mx-auto max-w-7xl" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
        style={{ color: navbarData.textColor || "inherit" }}
      >
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => !disableClicks && setIsMobileMenuOpen(true)}
                  style={{ color: navbarData.textColor || "inherit" }}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] overflow-y-auto sm:w-[400px]"
                style={{
                  backgroundColor: navbarData.backgroundColor || "white",
                  color: navbarData.textColor || "inherit",
                }}
              >
                <SheetHeader>
                  <SheetTitle
                    style={{ color: navbarData.textColor || "inherit" }}
                  >
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="px-2 pb-4">
                    <SearchBar
                      siteUser={siteUser}
                      isEditable={isEditable}
                      className="w-full"
                    />
                  </div>

                  {links.map(link => (
                    <Link
                      key={link.id}
                      href={generateLinkHref(
                        link.href,
                        siteUser,
                        pathname,
                        isEditable,
                        disableClicks
                      )}
                      className="px-2 text-lg font-medium hover:opacity-80"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.text}
                    </Link>
                  ))}

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories" className="border-none">
                      <AccordionTrigger className="px-2 py-0 text-lg font-medium hover:no-underline">
                        Categories
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2 pt-2 pb-0">
                        {categories.map(category => {
                          const categorySubCategories =
                            getSubCategoriesForCategory(category.id);

                          if (categorySubCategories.length > 0) {
                            return (
                              <Accordion
                                type="single"
                                collapsible
                                key={category.id}
                                className="w-full"
                              >
                                <AccordionItem
                                  value={`cat-${category.id}`}
                                  className="border-none"
                                >
                                  <AccordionTrigger className="px-4 py-2 text-base font-medium hover:no-underline">
                                    {category.name}
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-2 pt-1 pb-0 pl-4">
                                    <button
                                      className="py-1 text-left text-sm opacity-70 hover:opacity-100"
                                      onClick={() => {
                                        handleCategoryFilter(
                                          category.slug,
                                          category.name
                                        );
                                        setIsMobileMenuOpen(false);
                                      }}
                                    >
                                      View All {category.name}
                                    </button>
                                    {categorySubCategories.map(subCategory => (
                                      <button
                                        key={subCategory.id}
                                        className="py-1 text-left text-sm opacity-70 hover:opacity-100"
                                        onClick={() => {
                                          handleSubCategoryFilter(
                                            subCategory.slug,
                                            subCategory.name
                                          );
                                          setIsMobileMenuOpen(false);
                                        }}
                                      >
                                        {subCategory.name}
                                      </button>
                                    ))}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          }
                          return (
                            <button
                              key={category.id}
                              className="px-4 py-2 text-left text-base font-medium opacity-80 hover:opacity-100"
                              onClick={() => {
                                handleCategoryFilter(
                                  category.slug,
                                  category.name
                                );
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {category.name}
                            </button>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="border-t px-2 pt-4">
                    {buttons.map(button => (
                      <Button
                        key={button.id}
                        variant={getButtonVariant(button.variant)}
                        size="sm"
                        className="mb-2 w-full"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground,
                        }}
                        asChild
                      >
                        <Link
                          href={generateLinkHref(
                            button.href,
                            siteUser,
                            pathname,
                            isEditable,
                            disableClicks
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {button.text}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className={disableClicks ? "pointer-events-auto" : ""}>
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

          <div
            className="hidden items-center gap-6 md:flex"
            style={{ backgroundColor: navbarData.backgroundColor || "white" }}
          >
            <div
              className={`relative hidden max-w-md flex-1 md:block ${disableClicks ? "pointer-events-auto" : ""}`}
            >
              <SearchBar
                siteUser={siteUser}
                isEditable={isEditable}
                className="w-full"
              />
            </div>

            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem key={link.id}>
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer text-sm font-medium transition-colors hover:opacity-80"
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
                  target={
                    link.href?.startsWith("http") ||
                    link.href?.startsWith("mailto:")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    link.href?.startsWith("http") ||
                    link.href?.startsWith("mailto:")
                      ? "noopener noreferrer"
                      : undefined
                  }
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
                  style={{ color: navbarData.textColor || "inherit" }}
                >
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              {!disableClicks && (
                <DropdownMenuContent
                  className="w-56"
                  align="start"
                  style={{
                    backgroundColor: navbarData.backgroundColor || "white",
                    color: navbarData.textColor || "inherit",
                  }}
                >
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
                          <DropdownMenuSubContent
                            className="w-48"
                            style={{
                              backgroundColor:
                                navbarData.backgroundColor || "white",
                              color: navbarData.textColor || "inherit",
                            }}
                          >
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          {buttons.map(button =>
            isEditable && onEditButton && onDeleteButton ? (
              <EditableItem key={button.id}>
                <Button
                  onClick={e => e.preventDefault()}
                  variant={getButtonVariant(button.variant)}
                  size="sm"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                  className="cursor-pointer transition-colors hover:opacity-90"
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
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
                className={`transition-colors hover:opacity-90 ${disableClicks ? "pointer-events-auto cursor-default opacity-60" : ""}`}
                asChild={!disableClicks}
              >
                {disableClicks ? (
                  button.text
                ) : (
                  <Link
                    href={generateLinkHref(
                      button.href,
                      siteUser,
                      pathname,
                      isEditable,
                      disableClicks
                    )}
                    target={
                      button.href?.startsWith("http") ||
                      button.href?.startsWith("mailto:")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      button.href?.startsWith("http") ||
                      button.href?.startsWith("mailto:")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {button.text}
                  </Link>
                )}
              </Button>
            )
          )}

          {enableLogin && (
            <>
              {!isAuthenticated ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={isEditable ? undefined : handleLoginClick}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                  className={`transition-colors hover:opacity-90 ${
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
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                      }}
                      className={`flex items-center gap-1 transition-colors hover:opacity-90 ${
                        isEditable || disableClicks
                          ? "pointer-events-auto cursor-default opacity-60"
                          : ""
                      }`}
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                    >
                      <User
                        className="h-4 w-4"
                        style={{ color: theme.colors.primaryForeground }}
                      />
                      {user?.first_name || "Profile"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  {!disableClicks && !isEditable && (
                    <DropdownMenuContent
                      className="w-48"
                      align="end"
                      style={{
                        backgroundColor: navbarData.backgroundColor || "white",
                        color: navbarData.textColor || "inherit",
                      }}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleProfileAction("profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      {(!user?.website_type ||
                        user.website_type === "ecommerce") && (
                        <>
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
                        </>
                      )}
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
            </>
          )}

          {showCart && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              {isEditable && onEditCart ? (
                <EditableItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    onClick={e => e.preventDefault()}
                  >
                    <ShoppingCart className="h-5 w-5" />
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
      </nav>

      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </div>
  );
};
