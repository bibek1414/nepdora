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
import { useAuth } from "@/hooks/use-auth";
import { NavbarEditorDialog } from "./navbar-settings";
import { NavbarStyle1 } from "./styles/navbar-style-1";
import { NavbarStyle2 } from "./styles/navbar-style-2";
import { NavbarStyle3 } from "./styles/navbar-style-3";
import { NavbarStyle4 } from "./styles/navbar-style-4";
import { NavbarStyle5 } from "./styles/navbar-style-5";
import { NavbarStyle6 } from "./styles/navbar-style-6";
import { NavbarStyle7 } from "./styles/navbar-style-7";
import { NavbarStyle8 } from "./styles/navbar-style-8";
import { NavbarStyle9 } from "./styles/navbar-style-9";
import { NavbarStyle10 } from "./styles/navbar-style-10";
import { NavbarStyle11 } from "./styles/navbar-style-11";
import { NavbarStyle12 } from "./styles/navbar-style-12";
import { Button } from "@/components/ui/button";
import { Edit, Edit2, RefreshCw, Settings, Trash2 } from "lucide-react";
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
  onReplace?: (category: string) => void;
}

const styleMap = {
  "style-1": NavbarStyle1,
  "style-2": NavbarStyle2,
  "style-3": NavbarStyle3,
  "style-4": NavbarStyle4,
  "style-5": NavbarStyle5,
  "style-6": NavbarStyle6,
  "style-7": NavbarStyle7,
  "style-8": NavbarStyle8,
  "style-9": NavbarStyle9,
  "style-10": NavbarStyle10,
  "style-11": NavbarStyle11,
  "style-12": NavbarStyle12,
};

const defaultNavbarData: NavbarData = {
  logoText: "Brand",
  logoType: "text",
  links: [
    { id: "1", text: "Home", href: "#" },
    { id: "2", text: "About", href: "#" },
    { id: "3", text: "Contact", href: "#" },
  ],
  buttons: [],
  style: "style-1",
  showCart: true,
};

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  navbar,
  isEditable = true,
  siteUser,
  disableClicks = false,
  onReplace,
}) => {
  const { user } = useAuth();
  const { mutate: updateNavbar, isPending: isUpdating } =
    useUpdateNavbarMutation();
  const { mutate: deleteNavbar, isPending: isDeleting } =
    useDeleteNavbarMutation();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const navbarData = navbar.data || defaultNavbarData;

  const handleSaveNavbar = (data: NavbarData) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      data: { ...navbarData, ...data },
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
      data: {
        ...navbarData,
        bannerText: bannerText,
      },
    });
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateTopBar = (topBarItems: any[]) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      data: {
        ...navbarData,
        topBarItems: topBarItems,
      },
    });
  };

  const handleEditLink = (link: NavbarLink) => {
    if (!isEditable) return;

    const updatedLinks = navbarData.links.map(l =>
      l.id === link.id ? link : l
    );

    updateNavbar({
      id: navbar.id,
      data: {
        ...navbarData,
        links: updatedLinks,
      },
    });
  };

  const handleDeleteLink = (linkId: string) => {
    if (!isEditable) return;

    const updatedLinks = navbarData.links.filter(l => l.id !== linkId);

    updateNavbar({
      id: navbar.id,
      data: {
        ...navbarData,
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
      data: {
        ...navbarData,
        links: [...navbarData.links, newLink],
      },
    });
  };

  const StyleComponent =
    styleMap[navbarData.style as keyof typeof styleMap] || NavbarStyle1;

  return (
    <div
      className={
        isEditable
          ? "ring-primary/20 relative rounded-md ring-2 ring-offset-2"
          : ""
      }
    >
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditorOpen(true)}
            className="w-full justify-start"
          >
            Edit Navbar
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onReplace?.("navbar-sections")}
            className="w-full justify-start bg-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Replace
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-fit justify-start px-3"
                disabled={isDeleting}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
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
          initialData={navbarData}
          user={user!}
        />
      )}

      <StyleComponent
        navbarData={navbarData}
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
