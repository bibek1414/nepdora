import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
  TopBarItem,
} from "@/types/owner-site/components/navbar";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  User,
  Heart,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableText } from "@/components/ui/navbar/editable-text";
import { SearchBar } from "@/components/site-owners/builder/search-bar/search-bar";
import { EditableLink } from "@/components/ui/navbar/editable-link";
import { useAuth } from "@/hooks/customer/use-auth";
import { useWishlist } from "@/hooks/customer/use-wishlist";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative flex items-center">{children}</div>
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
  onUpdateTopBar?: (items: TopBarItem[]) => void;
}

export const NavbarStyle6: React.FC<NavbarStyleProps> = ({
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
  onUpdateTopBar,
}) => {
  const {
    links,
    buttons,
    showCart,
    topBarItems: initialTopBarItems,
  } = navbarData;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  // Get wishlist data
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;

  // Initialize top bar items from navbarData or use defaults
  const [topBarItems, setTopBarItems] = useState<TopBarItem[]>(
    initialTopBarItems || [
      {
        id: "1",
        text: "Customer Service:+977-9801100037",
        href: "tel:+9779801100037",
      },
    ]
  );

  // Sync with navbarData when it changes
  useEffect(() => {
    if (initialTopBarItems) {
      setTopBarItems(initialTopBarItems);
    }
  }, [initialTopBarItems]);

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

  const handleTopBarItemTextChange = (id: string, newText: string) => {
    const updatedItems = topBarItems.map(item =>
      item.id === id ? { ...item, text: newText } : item
    );
    setTopBarItems(updatedItems);
    if (onUpdateTopBar) {
      onUpdateTopBar(updatedItems);
    }
  };

  const handleTopBarItemHrefChange = (id: string, newHref: string) => {
    const updatedItems = topBarItems.map(item =>
      item.id === id ? { ...item, href: newHref } : item
    );
    setTopBarItems(updatedItems);
    if (onUpdateTopBar) {
      onUpdateTopBar(updatedItems);
    }
  };

  const handleAddTopBarItem = () => {
    const newItem: TopBarItem = {
      id: Date.now().toString(),
      text: "New Item",
      href: "#",
    };
    const updatedItems = [...topBarItems, newItem];
    setTopBarItems(updatedItems);
    if (onUpdateTopBar) {
      onUpdateTopBar(updatedItems);
    }
  };

  const handleDeleteTopBarItem = (id: string) => {
    const updatedItems = topBarItems.filter(item => item.id !== id);
    setTopBarItems(updatedItems);
    if (onUpdateTopBar) {
      onUpdateTopBar(updatedItems);
    }
  };

  const handleLoginClick = () => {
    if (isEditable || disableClicks) return;
    router.push(`/preview/${siteUser}/login`);
  };

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

  return (
    <>
      <div className="bg-white">
        {/* Top Bar */}
        <div style={{ backgroundColor: theme.colors.primary }}>
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
            {/* Left side - Links with separators */}
            <div className="flex items-center gap-4">
              {links.slice(0, 3).map((link, index) => (
                <React.Fragment key={link.id}>
                  {isEditable ? (
                    <EditableItem
                      onEdit={() => onEditLink && onEditLink(link)}
                      onDelete={() => onDeleteLink && onDeleteLink(link.id)}
                    >
                      <EditableLink
                        text={link.text}
                        href={link.href}
                        onChange={(text, href) => {
                          if (onEditLink) {
                            onEditLink({ ...link, text, href });
                          }
                        }}
                        isEditable={isEditable}
                        siteUser={siteUser}
                        className="flex cursor-pointer items-center gap-1.5 text-white hover:text-white/80"
                        textPlaceholder="Link text..."
                        hrefPlaceholder="Enter URL..."
                      />
                    </EditableItem>
                  ) : (
                    <a
                      href={generateLinkHref(link.href)}
                      onClick={e => handleLinkClick(e, link.href)}
                      className={`flex items-center gap-1.5 text-white hover:text-white/80 ${
                        disableClicks
                          ? "cursor-default opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      {link.text}
                    </a>
                  )}

                  {/* Add separator between links except after the last one */}
                  {index < Math.min(3, links.length) - 1 && (
                    <span className="h-4 w-px bg-white/30"></span>
                  )}
                </React.Fragment>
              ))}

              {/* Add new link button */}
              {isEditable && onAddLink && links.length < 3 && (
                <Button
                  onClick={onAddLink}
                  variant="ghost"
                  size="sm"
                  className="pointer-events-auto h-7 px-2 text-white hover:bg-white/20 hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Right side - Top bar items with icons and separators */}
            <div className="flex items-center gap-4">
              {topBarItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {isEditable ? (
                    <div className="group relative flex h-full items-center justify-center gap-1.5">
                      <EditableText
                        value={item.text}
                        onChange={newText =>
                          handleTopBarItemTextChange(item.id, newText)
                        }
                        isEditable={isEditable}
                        className="text-center text-white hover:text-white/90"
                        placeholder="Enter text..."
                      />
                      <Button
                        onClick={() => handleDeleteTopBarItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="pointer-events-auto ml-1 flex h-6 w-6 items-center justify-center p-0 text-white transition-opacity group-hover:opacity-100 hover:bg-white/20 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <a
                      href={
                        item.href && !disableClicks
                          ? item.href.startsWith("tel:") ||
                            item.href.startsWith("mailto:")
                            ? item.href
                            : generateLinkHref(item.href)
                          : "#"
                      }
                      onClick={e =>
                        disableClicks ? e.preventDefault() : undefined
                      }
                      className={`flex items-center gap-1.5 text-white hover:text-white/80 ${
                        disableClicks
                          ? "cursor-default opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      <span
                        className="mx-auto max-w-3xl text-xl"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      ></span>
                    </a>
                  )}

                  {/* Add separator between items except after the last one */}
                  {index < topBarItems.length - 1 && (
                    <span className="h-4 w-px bg-white/30"></span>
                  )}
                </React.Fragment>
              ))}

              {isEditable && (
                <Button
                  onClick={handleAddTopBarItem}
                  variant="ghost"
                  size="sm"
                  className="pointer-events-auto h-7 px-2 text-white hover:bg-white/20 hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header className="relative bg-white shadow-sm">
          <nav
            aria-label="Top"
            className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
              disableClicks ? "pointer-events-none" : ""
            }`}
            style={{ fontFamily: theme.fonts.heading }}
          >
            <div className="flex h-20 items-center justify-between">
              {/* Logo */}
              <div
                className={`flex ${disableClicks ? "pointer-events-auto" : ""}`}
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

              {/* Search Bar */}
              <div
                className={`mx-8 flex-1 ${disableClicks ? "pointer-events-auto" : ""}`}
              >
                <SearchBar
                  siteUser={siteUser}
                  isEditable={isEditable}
                  className="mx-auto max-w-2xl"
                />
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-4">
                {/* Wishlist Icon */}
                {!isEditable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      !disableClicks &&
                      router.push(`/preview/${siteUser}/wishlist`)
                    }
                    className={`relative flex items-center gap-1 ${
                      disableClicks
                        ? "pointer-events-auto cursor-default opacity-60"
                        : ""
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Button>
                )}

                {/* Cart Icon */}
                {showCart && (
                  <div
                    className={`${disableClicks ? "pointer-events-auto" : ""}`}
                  >
                    <CartIcon onToggleCart={toggleCart} />
                  </div>
                )}

                {/* User Account Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex items-center gap-2 ${
                        disableClicks
                          ? "pointer-events-auto cursor-default opacity-60"
                          : ""
                      }`}
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                    >
                      <User className="h-5 w-5" />
                      {isAuthenticated ? (
                        <>
                          {user?.first_name || "My Account"}
                          <ChevronDown className="h-4 w-4" />
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  {!disableClicks && !isEditable && (
                    <DropdownMenuContent className="w-48" align="end">
                      {isAuthenticated ? (
                        <>
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
                        </>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={handleLoginClick}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Login / Register
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
    </>
  );
};
