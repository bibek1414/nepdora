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
import { getButtonVariant } from "@/lib/utils";
import { Menu, User } from "lucide-react";
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
import { Heart, Package, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/site-owners/builder/appointment/navbar-dialog/appointment-form";
import { defaultAppointmentData } from "@/types/owner-site/components/appointment";

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

export const NavbarStyle10: React.FC<NavbarStyleProps> = ({
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

  const toggleMobileMenu = () => {
    if (disableClicks) return;
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
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
    <>
      <nav
        className={`bg-background mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6 ${
          !isEditable ? "sticky top-0 z-40 border-b" : ""
        } ${disableClicks ? "pointer-events-none" : ""}`}
      >
        {/* Logo - Left side */}
        <div className="flex min-w-0 flex-1 items-center lg:gap-6">
          <div
            className={`shrink-0 ${disableClicks ? "pointer-events-auto" : ""}`}
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
        </div>

        {/* Desktop Navigation - Right side */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {/* Desktop Links */}
          <div className="hidden items-center gap-6 lg:flex">
            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem key={link.id}>
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer text-base font-medium text-black transition-colors hover:text-black/80"
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
                  className={`text-base font-medium transition-colors ${
                    disableClicks
                      ? "cursor-default opacity-60"
                      : "cursor-pointer text-black hover:text-black/80"
                  }`}
                >
                  {link.text}
                </Link>
              )
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            {buttons.map(button =>
              isEditable && onEditButton && onDeleteButton ? (
                <EditableItem key={button.id}>
                  <Button
                    onClick={e => e.preventDefault()}
                    variant="default"
                    size="default"
                    className="cursor-pointer bg-black px-6 py-2 text-base text-white hover:bg-black/90"
                  >
                    {button.text}
                  </Button>
                </EditableItem>
              ) : (
                <Button
                  key={button.id}
                  variant="default"
                  size="default"
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                  className={`bg-black px-6 py-2 text-base text-white hover:bg-black/90 ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
                  }`}
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

            {/* Book Appointment Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="default"
                  className={`bg-black px-6 py-2 text-base text-white hover:bg-black/90 ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
                  }`}
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                >
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <AppointmentForm
                  data={defaultAppointmentData}
                  siteUser={siteUser}
                  isPreview={isEditable}
                  isEditable={false} // The form itself isn't editable here, just usable
                />
              </DialogContent>
            </Dialog>

            {enableLogin && (
              <div className={disableClicks ? "pointer-events-auto" : ""}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 p-2 text-black transition-colors hover:text-black/80 ${
                        disableClicks || isEditable
                          ? "cursor-default opacity-60"
                          : "cursor-pointer"
                      }`}
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                    >
                      <User className="h-5 w-5" />
                      {isAuthenticated ? (
                        <>
                          <span className="hidden text-sm font-medium lg:inline-block">
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
          </div>
        </div>

        {/* Mobile Header Right Side - Menu Button & Cart */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-1/2 sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
            <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex h-[calc(100vh-100px)] flex-col">
            {/* Mobile Links */}
            <div className="mb-6 space-y-2">
              {links.map(link =>
                isEditable && onEditLink && onDeleteLink ? (
                  <EditableItem key={link.id}>
                    <Button
                      variant="ghost"
                      className="h-12 w-full justify-start px-4 text-lg font-normal text-black hover:bg-gray-100"
                      onClick={e => e.preventDefault()}
                    >
                      {link.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild key={link.id}>
                    <Button
                      variant="ghost"
                      className="h-12 w-full justify-start px-4 text-lg font-normal text-black hover:bg-gray-100"
                      asChild={!disableClicks}
                    >
                      <Link
                        href={generateLinkHref(
                          link.href,
                          siteUser,
                          pathname,
                          isEditable,
                          disableClicks
                        )}
                        onClick={e => handleLinkClick(e, link.href)}
                        className={`w-full text-left ${
                          disableClicks ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        {link.text}
                      </Link>
                    </Button>
                  </SheetClose>
                )
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="mb-6 space-y-3">
              {buttons.map(button =>
                isEditable && onEditButton && onDeleteButton ? (
                  <EditableItem key={button.id}>
                    <Button
                      onClick={e => e.preventDefault()}
                      variant="default"
                      size="default"
                      className="w-full cursor-pointer justify-center bg-black py-3 text-base font-medium text-white hover:bg-black/90"
                    >
                      {button.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild key={button.id}>
                    <Button
                      variant="default"
                      size="default"
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                      className={`w-full justify-center bg-black py-3 text-base font-medium text-white hover:bg-black/90 ${
                        disableClicks
                          ? "pointer-events-auto cursor-default opacity-60"
                          : ""
                      }`}
                      asChild={!disableClicks}
                    >
                      {disableClicks ? (
                        <span>{button.text}</span>
                      ) : (
                        <Link
                          href={generateLinkHref(
                            button.href,
                            siteUser,
                            pathname,
                            isEditable,
                            disableClicks
                          )}
                          className="w-full text-center"
                        >
                          {button.text}
                        </Link>
                      )}
                    </Button>
                  </SheetClose>
                )
              )}

              {/* Mobile Book Appointment Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="default"
                    className={`w-full justify-center bg-black py-3 text-base font-medium text-white hover:bg-black/90 ${
                      disableClicks
                        ? "pointer-events-auto cursor-default opacity-60"
                        : ""
                    }`}
                    onClick={
                      disableClicks ? e => e.preventDefault() : undefined
                    }
                  >
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                  <AppointmentForm
                    data={defaultAppointmentData}
                    siteUser={siteUser}
                    isPreview={isEditable}
                    isEditable={false}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
