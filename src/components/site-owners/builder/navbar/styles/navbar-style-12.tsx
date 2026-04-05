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
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

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

export const NavbarStyle12: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  siteUser,
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
    navbarData.bannerText || "Get free delivery on orders over Rs. 5000"
  );
  
  const [isScrolled, setIsScrolled] = useState(false);
  
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
    router.push(generateLinkHref(`/collections/?category=${categorySlug}`, siteUser, pathname));
  };

  const handleSubCategoryFilter = (subCategorySlug: string) => {
    if (isEditable || disableClicks) return;
    router.push(generateLinkHref(`/collections/?sub_category=${subCategorySlug}`, siteUser, pathname));
  };

  const handleProfileAction = (action: string) => {
    if (isEditable || disableClicks) return;
    switch (action) {
      case "profile": router.push(generateLinkHref("/profile", siteUser, pathname)); break;
      case "wishlist": router.push(generateLinkHref("/wishlist", siteUser, pathname)); break;
      case "orders": router.push(generateLinkHref("/orders", siteUser, pathname)); break;
      case "logout": logout(); break;
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Appearance Settings
  const navBg = navbarData.backgroundColor || "#ffffff";
  const navText = navbarData.textColor || "#111827";
  const navBorder = navbarData.textColor ? `${navbarData.textColor}15` : "rgba(0,0,0,0.05)";

  return (
    <div 
      className="w-full transition-all -sm sticky top-0 z-50" 
      style={{ 
        backgroundColor: navBg,
        color: navText
      }}
    >
      {/* Row 0: Top Bar Banner */}
      <div 
        className={`flex items-center justify-center px-4 text-xs sm:text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 ease-in-out ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-10 opacity-100'}`}
        style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}
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
            className="text-center truncate"
            style={{ color: theme.colors.primaryForeground }}
            dangerouslySetInnerHTML={{ __html: bannerText }}
          />
        )}
      </div>

      {/* Row 1: Main Header (Logo, Search, Actions) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 py-4 border-b" style={{ borderColor: navBorder }}>
          {/* Logo Section */}
          <div className="flex shrink-0 items-center gap-4">
            <button
               onClick={() => setIsMobileMenuOpen(true)}
               className="lg:hidden p-2 -ml-2 rounded-lg transition-colors"
                style={{ color: navText }}
            >
              <Menu className="h-6 w-6" />
            </button>
            {isEditable && onEditLogo ? (
              <EditableItem>
                <NavbarLogo data={navbarData} isEditable={isEditable} onEdit={onEditLogo} />
              </EditableItem>
            ) : (
              <NavbarLogo data={navbarData} siteUser={siteUser} />
            )}
          </div>

          {/* Search Bar Section */}
          <div className="hidden flex-1 items-center justify-center px-4 md:flex">
             <div className="w-full max-w-xl">
                <SearchBar siteUser={siteUser} isEditable={isEditable} />
             </div>
          </div>

          {/* Action Icons Section */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {enableLogin && (
              <div className="flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 p-2 rounded-full transition-colors group"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) (icon as SVGElement).style.color = theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) (icon as SVGElement).style.color = navText;
                      }}
                    >
                      <User className="h-6 w-6 transition-colors" style={{ color: navText }} />
                      {isAuthenticated && <span className="hidden lg:inline-block text-sm font-bold" style={{ color: navText }}>{user?.first_name}</span>}
                    </button>
                  </DropdownMenuTrigger>
                  {!disableClicks && !isEditable && (
                    <DropdownMenuContent align="end" className="w-56 mt-2" style={{ backgroundColor: navBg, color: navText }}>
                       {isAuthenticated ? (
                        <>
                          <div className="px-2 py-1.5 text-xs font-bold  tracking-widest opacity-50">Account Overview</div>
                          <DropdownMenuItem onClick={() => handleProfileAction("profile")} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" /> My Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProfileAction("wishlist")} className="cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" /> Wishlist ({wishlistCount})
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProfileAction("orders")} className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" /> My Orders
                          </DropdownMenuItem>
                          <DropdownMenuSeparator style={{ backgroundColor: navBorder }} />
                          <DropdownMenuItem onClick={() => handleProfileAction("logout")} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => router.push(generateLinkHref("/login", siteUser, pathname))} className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" /> Login / Register
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
            )}

            {showCart && (
              <div className="relative">
                {isEditable && onEditCart ? (
                  <EditableItem>
                    <Button variant="ghost" size="sm">
                      <ShoppingCart className="h-6 w-6" style={{ color: navText }} />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">0</span>
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

      {/* Row 2: Secondary Nav (Categories + Links + Icons) */}
      <div className="hidden lg:block border-b" style={{ borderColor: navBorder, backgroundColor: navBg }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-12">
          <div className="flex items-center gap-8 h-full">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                   variant="ghost" 
                   className="flex items-center gap-2 text-sm font-bold h-full rounded-none border-b-2 border-transparent transition-all px-4"
                   style={{ color: navText }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.borderBottomColor = theme.colors.primary;
                     e.currentTarget.style.color = theme.colors.primary;
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.borderBottomColor = 'transparent';
                     e.currentTarget.style.color = navText;
                   }}
                >
                  <Menu className="h-4 w-4" />
                  All Categories
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 mt-0 -lg border-gray-100" style={{ backgroundColor: navBg, color: navText }}>
                {categories.length > 0 ? (
                  categories.map(category => {
                    const categorySubCategories = getSubCategoriesForCategory(category.id);
                    if (categorySubCategories.length > 0) {
                      return (
                        <DropdownMenuSub key={category.id}>
                          <DropdownMenuSubTrigger className="cursor-pointer py-2.5 font-medium">
                            <span>{category.name}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent style={{ backgroundColor: navBg, color: navText }}>
                            <DropdownMenuItem onClick={() => handleCategoryFilter(category.slug)} className="font-bold" style={{ color: theme.colors.primary }}>
                              View All {category.name}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {categorySubCategories.map(subCategory => (
                              <DropdownMenuItem key={subCategory.id} onClick={() => handleSubCategoryFilter(subCategory.slug)} className="py-2 cursor-pointer">
                                {subCategory.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    }
                    return (
                      <DropdownMenuItem key={category.id} onClick={() => handleCategoryFilter(category.slug)} className="py-2.5 font-medium cursor-pointer">
                        {category.name}
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400 font-medium">No categories found</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Nav Links */}
            <div className="flex h-full items-center gap-8">
              {links.map(link => (
                <div key={link.id} className="h-full flex items-center">
                  {isEditable && onEditLink ? (
                    <EditableItem>
                      <span className="text-sm font-bold opacity-80 cursor-pointer" style={{ color: navText }}>{link.text}</span>
                    </EditableItem>
                  ) : (
                    <Link
                      href={generateLinkHref(link.href, siteUser, pathname)}
                      className="text-sm font-bold transition-colors relative group"
                      style={{ color: navText }}
                      onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = navText}
                    >
                      {link.text}
                      <span 
                        className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {buttons.map(button => (
              <div key={button.id}>
                <Button
                  variant={getButtonVariant(button.variant)}
                  size="sm"
                  className="h-9 px-5 rounded-full font-bold text-xs  tracking-wider -sm transition-all active:scale-95"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}
                  asChild={!isEditable}
                >
                  {isEditable ? (
                    <span>{button.text}</span>
                  ) : (
                    <Link 
                      href={generateLinkHref(button.href, siteUser, pathname)}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      {button.text}
                    </Link>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-full max-w-[320px] p-0 flex flex-col" style={{ backgroundColor: navBg, color: navText, borderColor: navBorder }}>
          <SheetHeader className="p-6 border-b shrink-0" style={{ borderColor: navBorder }}>
               <NavbarLogo data={navbarData} siteUser={siteUser} />
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {/* Search Bar */}
            <div className="bg-gray-100/50 rounded-2xl p-1">
              <SearchBar siteUser={siteUser} isEditable={isEditable} className="w-full -none border-none bg-transparent" />
            </div>

            {/* Quick Access Links */}
            <div className="space-y-4">
               <p className="text-[10px] font-bold  tracking-[2px] opacity-50" style={{ color: navText }}>Quick Access</p>
               <nav className="flex flex-col gap-1">
                 {links.map((link) => (
                   <Link
                      key={link.id}
                      href={generateLinkHref(link.href, siteUser, pathname)}
                      className="block py-3 px-4 rounded-xl text-base font-bold border border-transparent transition-all"
                      style={{ color: navText }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                        e.currentTarget.style.color = theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = navText;
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {link.text}
                   </Link>
                 ))}
               </nav>
            </div>

            {/* Shop Categories Preview */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold  tracking-[2px] opacity-50" style={{ color: navText }}>Shop Categories</p>
                  <Link 
                    href={generateLinkHref("/collections", siteUser, pathname)} 
                    className="text-[10px] font-bold " 
                    style={{ color: theme.colors.primary }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    See All
                  </Link>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 {categories.slice(0, 4).map(cat => (
                   <Link 
                      key={cat.id} 
                      href={generateLinkHref(`/collections/?category=${cat.slug}`, siteUser, pathname)}
                      className="p-3 rounded-xl text-center text-xs font-bold transition-all"
                      style={{ color: navText, backgroundColor: `${navText}08` }}
                      onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {cat.name}
                   </Link>
                 ))}
               </div>
            </div>
          </div>

          {/* Bottom CTA Actions */}
          <div className="p-6 border-t bg-gray-50/50 space-y-3 shrink-0" style={{ borderColor: navBorder }}>
             {buttons.map(btn => (
                <Button 
                   key={btn.id} 
                   className="w-full h-12 rounded-xl font-bold  text-xs tracking-wider transition-all"
                   style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     router.push(generateLinkHref(btn.href, siteUser, pathname));
                   }}
                >
                  {btn.text}
                </Button>
             ))}
          </div>
        </SheetContent>
      </Sheet>

      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </div>
  );
};
