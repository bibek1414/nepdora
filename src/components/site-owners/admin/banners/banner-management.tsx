"use client";
import React, { useState } from "react";
import { Banner } from "@/types/owner-site/banner";
import BannerList from "./banner-list";
import BannerDialogForm from "./banner-dialog-form";

export default function BannerManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const handleAddBanner = () => {
    setEditingBanner(null);
    setDialogOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setEditingBanner(null);
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerList
        onAddBanner={handleAddBanner}
        onEditBanner={handleEditBanner}
      />

      <BannerDialogForm
        banner={editingBanner}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
