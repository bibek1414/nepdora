"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarLink,
  NavbarButton,
  NavbarData,
} from "@/types/owner-site/components/navbar";
import { useUpdateNavbarMutation } from "@/hooks/owner-site/components/use-navbar";
import { LinkEditorDialog } from "./link-editor-dialog";
import { ButtonEditorDialog } from "./button-editor-dialog";
import { TextEditorDialog } from "./text-editor-dialog";

import { NavbarStyle1 } from "./styles/navbar-style-1";
import { NavbarStyle2 } from "./styles/navbar-style-2";

interface NavbarComponentProps {
  navbar: Navbar;
  isEditable?: boolean;
}

const styleMap = {
  "style-1": NavbarStyle1,
  "style-2": NavbarStyle2,
};

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  navbar,
  isEditable = true,
}) => {
  const { mutate: updateNavbar, isPending } = useUpdateNavbarMutation();

  // State for dialogs - only needed if editable
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isButtonDialogOpen, setIsButtonDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<NavbarLink | null>(null);
  const [editingButton, setEditingButton] = useState<NavbarButton | null>(null);

  // Helper to update parts of navbar data - only needed if editable
  const updateNavbarData = (updatedData: Partial<NavbarData>) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      navbarData: { ...navbar.data, ...updatedData },
    });
  };

  // --- Handlers for Logo --- (only needed if editable)
  const handleEditLogo = () => {
    if (!isEditable) return;
    setIsLogoDialogOpen(true);
  };

  const handleSaveLogo = (newLogoText: string) => {
    if (!isEditable) return;
    updateNavbarData({ logoText: newLogoText });
  };

  // --- Handlers for Links --- (only needed if editable)
  const handleAddLink = () => {
    if (!isEditable) return;
    setEditingLink(null);
    setIsLinkDialogOpen(true);
  };

  const handleEditLink = (link: NavbarLink) => {
    if (!isEditable) return;
    setEditingLink(link);
    setIsLinkDialogOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    if (!isEditable) return;
    const updatedLinks = navbar.data.links.filter(link => link.id !== linkId);
    updateNavbarData({ links: updatedLinks });
  };

  const handleSaveLink = (linkData: Omit<NavbarLink, "id">) => {
    if (!isEditable) return;
    let updatedLinks: NavbarLink[];
    if (editingLink) {
      updatedLinks = navbar.data.links.map(link =>
        link.id === editingLink.id ? { ...link, ...linkData } : link
      );
    } else {
      const newLink = { ...linkData, id: Date.now().toString() };
      updatedLinks = [...navbar.data.links, newLink];
    }
    updateNavbarData({ links: updatedLinks });
  };

  // --- Handlers for Buttons --- (only needed if editable)
  const handleAddButton = () => {
    if (!isEditable) return;
    setEditingButton(null);
    setIsButtonDialogOpen(true);
  };

  const handleEditButton = (button: NavbarButton) => {
    if (!isEditable) return;
    setEditingButton(button);
    setIsButtonDialogOpen(true);
  };

  const handleDeleteButton = (buttonId: string) => {
    if (!isEditable) return;
    const updatedButtons = navbar.data.buttons.filter(
      btn => btn.id !== buttonId
    );
    updateNavbarData({ buttons: updatedButtons });
  };

  const handleSaveButton = (buttonData: Omit<NavbarButton, "id">) => {
    if (!isEditable) return;
    let updatedButtons: NavbarButton[];
    if (editingButton) {
      updatedButtons = navbar.data.buttons.map(btn =>
        btn.id === editingButton.id ? { ...btn, ...buttonData } : btn
      );
    } else {
      const newButton = { ...buttonData, id: Date.now().toString() };
      updatedButtons = [...navbar.data.buttons, newButton];
    }
    updateNavbarData({ buttons: updatedButtons });
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
      {/* Only show dialogs if editable */}
      {isEditable && (
        <>
          <TextEditorDialog
            isOpen={isLogoDialogOpen}
            onClose={() => setIsLogoDialogOpen(false)}
            onSave={handleSaveLogo}
            initialText={navbar.data.logoText}
            title="Edit Logo Text"
            label="Logo Text"
          />
          <LinkEditorDialog
            isOpen={isLinkDialogOpen}
            onClose={() => setIsLinkDialogOpen(false)}
            onSave={handleSaveLink}
            link={editingLink}
          />
          <ButtonEditorDialog
            isOpen={isButtonDialogOpen}
            onClose={() => setIsButtonDialogOpen(false)}
            onSave={handleSaveButton}
            button={editingButton}
          />
        </>
      )}

      <StyleComponent
        navbarData={navbar.data}
        isEditable={isEditable}
        onEditLogo={isEditable ? handleEditLogo : undefined}
        onAddLink={isEditable ? handleAddLink : undefined}
        onEditLink={isEditable ? handleEditLink : undefined}
        onDeleteLink={isEditable ? handleDeleteLink : undefined}
        onAddButton={isEditable ? handleAddButton : undefined}
        onEditButton={isEditable ? handleEditButton : undefined}
        onDeleteButton={isEditable ? handleDeleteButton : undefined}
      />
    </div>
  );
};
