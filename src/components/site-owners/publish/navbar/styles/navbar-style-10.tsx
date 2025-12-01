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
import { Menu } from "lucide-react";
import { NavbarLogo } from "../navbar-logo";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/site-owners/builder/appointment/navbar-dialog/appointment-form";
import { defaultAppointmentData } from "@/types/owner-site/components/appointment";

const EditableItem: React.FC<{
  onEdit: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}> = ({ onEdit, onDelete, children }) => (
  <div className="group relative">{children}</div>
);

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
  const { links, buttons } = navbarData;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (disableClicks) return;
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const generateLinkHref = (originalHref: string) => {
    if (isEditable || !siteUser || disableClicks) return "#";

    if (originalHref === "/" || originalHref === "#" || originalHref === "") {
      return `/`;
    }

    const cleanHref = originalHref.replace(/^[#/]+/, "");
    return `/${cleanHref}`;
  };

  const handleLinkClick = (e: React.MouseEvent, originalHref?: string) => {
    if (disableClicks || isEditable) {
      e.preventDefault();
      return;
    }
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
            className={`flex-shrink-0 ${disableClicks ? "pointer-events-auto" : ""}`}
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
                onClick={disableClicks ? e => e.preventDefault() : undefined}
              >
                <NavbarLogo data={navbarData} siteUser={siteUser} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation - Right side */}
        <div className="hidden flex-shrink-0 items-center gap-4 lg:flex">
          {/* Desktop Links */}
          <div className="hidden items-center gap-6 lg:flex">
            {links.map(link =>
              isEditable && onEditLink && onDeleteLink ? (
                <EditableItem
                  key={link.id}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link.id)}
                >
                  <Link
                    href={link.href}
                    onClick={e => e.preventDefault()}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-base font-medium whitespace-nowrap transition-colors"
                  >
                    {link.text}
                  </Link>
                </EditableItem>
              ) : (
                <Link
                  key={link.id}
                  href={generateLinkHref(link.href)}
                  onClick={e => handleLinkClick(e, link.href)}
                  className={`text-base font-medium whitespace-nowrap transition-colors ${
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

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
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
                    size="default"
                    className="cursor-pointer px-6 py-2 text-base"
                  >
                    {button.text}
                  </Button>
                </EditableItem>
              ) : (
                <Button
                  key={button.id}
                  variant={getButtonVariant(button.variant)}
                  size="default"
                  onClick={disableClicks ? e => e.preventDefault() : undefined}
                  className={`px-6 py-2 text-base ${
                    disableClicks
                      ? "pointer-events-auto cursor-default opacity-60"
                      : ""
                  }`}
                  asChild={!disableClicks}
                >
                  {disableClicks ? (
                    button.text
                  ) : (
                    <Link href={generateLinkHref(button.href)}>
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
                  className={`px-6 py-2 text-base ${
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
                  <EditableItem
                    key={link.id}
                    onEdit={() => onEditLink(link)}
                    onDelete={() => onDeleteLink(link.id)}
                  >
                    <Button
                      variant="ghost"
                      className="hover:bg-accent h-12 w-full justify-start px-4 text-lg font-normal"
                      onClick={e => e.preventDefault()}
                    >
                      {link.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild key={link.id}>
                    <Button
                      variant="ghost"
                      className="hover:bg-accent h-12 w-full justify-start px-4 text-lg font-normal"
                      asChild={!disableClicks}
                    >
                      <Link
                        href={generateLinkHref(link.href)}
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
                  <EditableItem
                    key={button.id}
                    onEdit={() => onEditButton(button)}
                    onDelete={() => onDeleteButton(button.id)}
                  >
                    <Button
                      onClick={e => e.preventDefault()}
                      variant={getButtonVariant(button.variant)}
                      size="default"
                      className="w-full cursor-pointer justify-center py-3 text-base font-medium"
                    >
                      {button.text}
                    </Button>
                  </EditableItem>
                ) : (
                  <SheetClose asChild key={button.id}>
                    <Button
                      variant={getButtonVariant(button.variant)}
                      size="default"
                      onClick={
                        disableClicks ? e => e.preventDefault() : undefined
                      }
                      className={`w-full justify-center py-3 text-base font-medium ${
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
                          href={generateLinkHref(button.href)}
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
                    className={`w-full justify-center py-3 text-base font-medium ${
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
