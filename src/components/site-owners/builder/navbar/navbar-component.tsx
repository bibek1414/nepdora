"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarData,
  NavbarLink,
} from "@/types/owner-site/components/navbar";
import {
  useUpdateNavbarMutation,
  useDeleteNavbarMutation,
} from "@/hooks/owner-site/components/use-navbar";
import { NavbarEditorDialog } from "./navbar-settings";
import { NavbarStyle1 } from "./styles/navbar-style-1";
import { NavbarStyle2 } from "./styles/navbar-style-2";
import { NavbarStyle3 } from "./styles/navbar-style-3";
import { NavbarStyle4 } from "./styles/navbar-style-4";
import { NavbarStyle5 } from "./styles/navbar-style-5";
import { NavbarStyle6 } from "./styles/navbar-style-6";
import { NavbarStyle7 } from "./styles/navbar-style-7";

import { Button } from "@/components/ui/button";
import { Edit, Edit2, Settings, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NavbarComponentProps {
  navbar: Navbar;
  isEditable?: boolean;
  siteUser: string;
  disableClicks?: boolean;
}

const styleMap = {
  "style-1": NavbarStyle1,
  "style-2": NavbarStyle2,
  "style-3": NavbarStyle3,
  "style-4": NavbarStyle4,
  "style-5": NavbarStyle5,
  "style-6": NavbarStyle6,
  "style-7": NavbarStyle7,
};

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  navbar,
  isEditable = true,
  siteUser,
  disableClicks = false,
}) => {
  const { mutate: updateNavbar, isPending: isUpdating } =
    useUpdateNavbarMutation();
  const { mutate: deleteNavbar, isPending: isDeleting } =
    useDeleteNavbarMutation();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSaveNavbar = (navbarData: NavbarData) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      navbarData: { ...navbar.data, ...navbarData },
    });
  };

  const handleDeleteNavbar = () => {
    if (!isEditable) return;

    deleteNavbar(navbar.id);
  };

  const handleUpdateBanner = (bannerText: string) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      navbarData: {
        ...navbar.data,
        bannerText: bannerText,
      },
    });
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateTopBar = (topBarItems: any[]) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      navbarData: {
        ...navbar.data,
        topBarItems: topBarItems,
      },
    });
  };

  const handleEditLink = (link: NavbarLink) => {
    if (!isEditable) return;

    const updatedLinks = navbar.data.links.map(l =>
      l.id === link.id ? link : l
    );

    updateNavbar({
      id: navbar.id,
      navbarData: {
        ...navbar.data,
        links: updatedLinks,
      },
    });
  };

  const handleDeleteLink = (linkId: string) => {
    if (!isEditable) return;

    const updatedLinks = navbar.data.links.filter(l => l.id !== linkId);

    updateNavbar({
      id: navbar.id,
      navbarData: {
        ...navbar.data,
        links: updatedLinks,
      },
    });
  };

  const handleAddLink = () => {
    if (!isEditable) return;

    const newLink: NavbarLink = {
      id: Date.now().toString(),
      text: "New Link",
      href: "#",
    };

    updateNavbar({
      id: navbar.id,
      navbarData: {
        ...navbar.data,
        links: [...navbar.data.links, newLink],
      },
    });
  };

  const StyleComponent =
    styleMap[navbar.data.style as keyof typeof styleMap] || NavbarStyle1;

  return (
    <div
      className={
        isEditable
          ? "ring-primary/20 relative rounded-md ring-2 ring-offset-2"
          : ""
      }
    >
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditorOpen(true)}
            className=""
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Navbar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-md p-0"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your navbar and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteNavbar}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {isEditable && (
        <NavbarEditorDialog
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveNavbar}
          initialData={navbar.data}
        />
      )}

      <StyleComponent
        navbarData={navbar.data}
        isEditable={isEditable}
        siteUser={siteUser}
        disableClicks={disableClicks}
        onUpdateBanner={handleUpdateBanner}
        onUpdateTopBar={handleUpdateTopBar}
        onEditLink={handleEditLink}
        onDeleteLink={handleDeleteLink}
        onAddLink={handleAddLink}
        onEditLogo={() => setIsEditorOpen(true)}
      />
    </div>
  );
};
