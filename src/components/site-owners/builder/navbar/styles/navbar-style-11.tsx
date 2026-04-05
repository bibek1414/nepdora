import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavbarData,
  NavbarLink,
  NavbarButton,
} from "@/types/owner-site/components/navbar";
import {
  Menu,
  User,
  Heart,
  Package,
  LogOut,
  ChevronDown,
  Languages,
} from "lucide-react";
import { NavbarLogo } from "../navbar-logo";
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
import { useRouter } from "next/navigation";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const EditableItem: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <div className="group relative">{children}</div>;

interface NavbarStyleProps {
  navbarData: NavbarData;
  siteUser: string;
  isEditable?: boolean;
  onEditLogo?: () => void;
  onAddLink?: () => void;
  onEditLink?: (link: NavbarLink) => void;
  onDeleteLink?: (linkId: string) => void;
  onAddButton?: () => void;
  onEditButton?: (button: NavbarButton) => void;
  onDeleteButton?: (buttonId: string) => void;
  onEditCart?: () => void;
  disableClicks?: boolean;
}

export const NavbarStyle11: React.FC<NavbarStyleProps> = ({
  navbarData,
  isEditable,
  siteUser,
  onEditLogo,
  onEditLink,
  onDeleteLink,
  onEditButton,
  onDeleteButton,
  disableClicks = false,
}) => {
  const { links, buttons, enableLogin } = navbarData;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.length || 0;
  const router = useRouter();
  const pathname = usePathname();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#000000",
      primaryForeground: "#FFFFFF",
    },
  };

  const toggleMobileMenu = () => {
    if (disableClicks) return;
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (disableClicks || isEditable) return;
    router.push(generateLinkHref("/login", siteUser, pathname));
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`w-full border-b backdrop-blur-md ${!isEditable ? "sticky top-0 z-50" : "relative"} ${disableClicks ? "pointer-events-none" : ""}`}
      style={{
        backgroundColor:
          navbarData.backgroundColor || "rgba(255, 255, 255, 0.8)",
        color: navbarData.textColor || "inherit",
      }}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Left Side */}
        <div className="flex shrink-0 items-center">
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
        </div>

        {/* Desktop Navigation - Right Aligned */}
        <div className="hidden flex-1 items-center justify-end gap-x-8 pr-8 lg:flex">
          {links.map(link => (
            <div key={link.id}>
              {isEditable && onEditLink && onDeleteLink ? (
                <EditableItem>
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="group relative cursor-pointer py-2 text-sm font-medium transition-colors hover:opacity-80"
                  >
                    {link.text}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 scale-x-0 bg-current transition-transform group-hover:scale-x-100" />
                  </Link>
                </EditableItem>
              ) : (
                <Link
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
                  onClick={handleLinkClick}
                  className={`group relative py-2 text-sm font-medium transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                >
                  {link.text}
                  {!disableClicks && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 scale-x-0 bg-current transition-transform group-hover:scale-x-100" />
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Actions - Right Side */}
        <div className="flex items-center gap-x-4">
          {/* Desktop Search Placeholder or other tools can go here */}

          {/* User Auth */}
          {enableLogin && (
            <div className={disableClicks ? "pointer-events-auto" : ""}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 hover:opacity-80 ${
                      disableClicks || isEditable
                        ? "cursor-default opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                {!disableClicks && !isEditable && (
                  <DropdownMenuContent
                    className="w-56"
                    align="end"
                    sideOffset={8}
                  >
                    {isAuthenticated ? (
                      <>
                        <div
                          className="px-2 py-1.5 text-sm font-semibold"
                          style={{ color: navbarData.textColor || "inherit" }}
                        >
                          {user?.first_name
                            ? `${user.first_name}'s Account`
                            : "My Account"}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleProfileAction("profile")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleProfileAction("wishlist")}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Wishlist
                          {wishlistCount > 0 && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                              {wishlistCount}
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleProfileAction("orders")}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Orders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                          onClick={() => handleProfileAction("logout")}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
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

          {/* Language Switcher */}

          {/* Desktop Custom Buttons */}
          <div className="hidden items-center gap-x-3 lg:flex">
            {buttons.map(button => (
              <div key={button.id}>
                {isEditable && onEditButton && onDeleteButton ? (
                  <EditableItem>
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground,
                      }}
                      className="rounded-full px-6 transition-colors hover:opacity-90"
                    >
                      {button.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                    }}
                    className={`rounded-full px-6 transition-colors hover:opacity-90 ${
                      disableClicks
                        ? "pointer-events-auto cursor-default opacity-60"
                        : "cursor-pointer"
                    }`}
                    asChild={!disableClicks}
                  >
                    {!disableClicks ? (
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
                    ) : (
                      <span>{button.text}</span>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-10 w-10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xs">
          <SheetHeader className="border-b pb-6">
            <SheetTitle
              className="text-left text-xl font-bold"
              style={{ color: navbarData.textColor || "inherit" }}
            >
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-col gap-y-4">
            {links.map(link => (
              <div key={link.id}>
                {isEditable && onEditLink ? (
                  <EditableItem>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg font-medium"
                      onClick={e => e.preventDefault()}
                    >
                      {link.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href={generateLinkHref(
                        link.href,
                        siteUser,
                        pathname,
                        isEditable,
                        disableClicks
                      )}
                      onClick={handleLinkClick}
                      className="block cursor-pointer px-2 py-3 text-lg font-medium hover:opacity-80"
                    >
                      {link.text}
                    </Link>
                  </SheetClose>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="flex flex-col gap-y-4">
              {buttons.map(button => (
                <div key={button.id}>
                  {isEditable && onEditButton ? (
                    <EditableItem>
                      <Button
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground,
                        }}
                        className="w-full rounded-full py-6 transition-colors hover:opacity-90"
                      >
                        {button.text}
                      </Button>
                    </EditableItem>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href={generateLinkHref(
                          button.href,
                          siteUser,
                          pathname,
                          isEditable,
                          disableClicks
                        )}
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground,
                        }}
                        className="flex h-12 w-full items-center justify-center rounded-full text-base font-semibold transition-colors hover:opacity-90"
                      >
                        {button.text}
                      </Link>
                    </SheetClose>
                  )}
                </div>
              ))}

              {!isAuthenticated && (
                <Button
                  variant="outline"
                  className="w-full rounded-full py-6"
                  onClick={handleLoginClick}
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
