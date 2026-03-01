import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import { getButtonVariant } from "@/lib/utils";
import { Edit, Trash2, ShoppingCart, User } from "lucide-react";
import { CartIcon } from "../../cart/cart-icon";
import { NavbarLogo } from "../navbar-logo";
import SideCart from "../../cart/side-cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/customer/use-auth";
import { useWishlist } from "@/hooks/customer/use-wishlist";
import { Heart, Package, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const EditableItem: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <div className="group relative">{children}</div>;

interface NavbarStyleProps {
  navbarData: NavbarData;
  siteUser: string;
  isEditable?: boolean;
  onEditLogo?: () => void;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
  onEditCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle2: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditButton,
  onDeleteButton,
  onEditCart,
  disableClicks = false,
}) => {
  const { links, buttons, showCart, enableLogin } = navbarData;
  const midIndex = Math.ceil(links.length / 2);
  const leftLinks = links.slice(0, midIndex);
  const rightLinks = links.slice(midIndex);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;
  const router = useRouter();

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

  const handleProfileAction = (action: string) => {
    if (disableClicks || isEditable) return;

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

  const handleLoginClick = () => {
    if (disableClicks || isEditable) return;
    router.push(generateLinkHref("/login", siteUser, pathname));
  };

  return (
    <>
      <nav
        className={`bg-background flex items-center justify-between p-4 ${
          !isEditable ? "sticky top-16 z-40 border-b" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
      >
        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          {leftLinks.map(link =>
            isEditable && onEditLink && onDeleteLink ? (
              <EditableItem key={link.id}>
                <Link
                  href={link.href}
                  onClick={e => e.preventDefault()}
                  className="cursor-pointer text-sm font-medium text-black transition-colors hover:text-black/80"
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

        <div className={`px-8 ${disableClicks ? "pointer-events-auto" : ""}`}>
          {isEditable && onEditLogo ? (
            <EditableItem>
              <NavbarLogo
                data={navbarData}
                isEditable={isEditable}
                onEdit={onEditLogo}
              />
            </EditableItem>
          ) : (
            <div onClick={disableClicks ? e => e.preventDefault() : undefined}>
              <NavbarLogo data={navbarData} siteUser={siteUser} />
            </div>
          )}
        </div>

        <div className="hidden flex-1 items-center justify-start gap-4 md:flex">
          {rightLinks.map(link =>
            isEditable && onEditLink && onDeleteLink ? (
              <EditableItem key={link.id}>
                <Link
                  href={link.href}
                  onClick={e => e.preventDefault()}
                  className="cursor-pointer text-sm font-medium text-black transition-colors hover:text-black/80"
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
                style={{
                  pointerEvents: disableClicks ? "auto" : undefined,
                }}
              >
                {link.text}
              </Link>
            )
          )}
          {buttons.map(button =>
            isEditable && onEditButton && onDeleteButton ? (
              <EditableItem key={button.id}>
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
                  <Link
                    href={generateLinkHref(
                      button.href,
                      siteUser,
                      pathname,
                      isEditable,
                      disableClicks
                    )}
                  >
                    {button.text}
                  </Link>
                )}
              </Button>
            )
          )}

          {enableLogin && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 p-2 text-black ${
                      disableClicks || isEditable
                        ? "cursor-default opacity-60"
                        : "cursor-pointer hover:opacity-80"
                    }`}
                    onClick={
                      disableClicks ? e => e.preventDefault() : undefined
                    }
                  >
                    <User className="h-5 w-5" />
                    {isAuthenticated ? (
                      <>
                        <span className="hidden text-sm font-medium sm:inline-block">
                          {user?.first_name || "Account"}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    ) : null}
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
                <CartIcon
                  onToggleCart={toggleCart}
                  href={generateLinkHref(
                    "/checkout",
                    siteUser,
                    pathname,
                    isEditable,
                    disableClicks
                  )}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      {!isEditable && (
        <SideCart isOpen={isCartOpen} onClose={closeCart} siteUser={siteUser} />
      )}
    </>
  );
};
