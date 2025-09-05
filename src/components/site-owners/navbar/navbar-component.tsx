"use client";

import React, { useState } from "react";
import { Navbar, NavbarData } from "@/types/owner-site/components/navbar";
import { useUpdateNavbarMutation } from "@/hooks/owner-site/components/use-navbar";
import { NavbarEditorDialog } from "./navbar-settings";
import { NavbarStyle1 } from "./styles/navbar-style-1";
import { NavbarStyle2 } from "./styles/navbar-style-2";
import { NavbarStyle3 } from "./styles/navbar-style-3";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface NavbarComponentProps {
  navbar: Navbar;
  isEditable?: boolean;
  siteId: string;
  siteUser?: string;
}

const styleMap = {
  "style-1": NavbarStyle1,
  "style-2": NavbarStyle2,
  "style-3": NavbarStyle3,
};

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  navbar,
  isEditable = true,
  siteId,
  siteUser,
}) => {
  const { mutate: updateNavbar, isPending } = useUpdateNavbarMutation();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSaveNavbar = (navbarData: NavbarData) => {
    if (!isEditable) return;

    updateNavbar({
      id: navbar.id,
      navbarData: { ...navbar.data, ...navbarData },
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
        <div className="absolute -top-2 right-10 z-10">
          <Button
            size="sm"
            onClick={() => setIsEditorOpen(true)}
            className="h-8 w-8 rounded-md p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
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
        siteId={siteId}
        siteUser={siteUser}
      />
    </div>
  );
};
