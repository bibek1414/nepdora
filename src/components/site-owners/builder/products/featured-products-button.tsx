"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Star } from "lucide-react";
import { ManageFeaturedProductsDialog } from "./manage-featured-products-dialog";
import { ProductsData } from "@/types/owner-site/components/products";

interface FeaturedProductsButtonProps {
  isEditable: boolean;
  productsCount: number;
  data?: ProductsData;
  onUpdate?: (updatedData: Partial<ProductsData>) => void;
}

export const FeaturedProductsButton: React.FC<FeaturedProductsButtonProps> = ({
  isEditable,
  productsCount,
  data,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isEditable || productsCount === 0) return null;

  return (
    <>
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2"
        >
          <Star className="h-4 w-4" />
          Manage Featured & Best Selling
        </Button>
      </div>
      <ManageFeaturedProductsDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        data={data}
        onUpdate={onUpdate}
      />
    </>
  );
};
