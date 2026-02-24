"use client";
import React, { useState } from "react";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductsStyle1 } from "./products-style/products-style-1";
import { ProductsStyle2 } from "./products-style/products-style-2";
import { ProductsStyle3 } from "./products-style/products-style-3";
import { ProductsStyle4 } from "./products-style/products-style-4";
import { ProductsStyle5 } from "./products-style/products-style-5";
import { ProductsStyle6 } from "./products-style/products-style-6";
import { ProductsStyle7 } from "./products-style/products-style-7";
import { ProductsStyle8 } from "./products-style/products-style-8";
import { ProductsStyle9 } from "./products-style/products-style-9";
import { ProductsStyle10 } from "./products-style/products-style-10";
import { ProductsStyle11 } from "./products-style/products-style-11";

interface ProductsComponentProps {
  component: ProductsComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: ProductsComponentData) => void;
  onProductClick?: (productSlug: string, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const ProductsComponent: React.FC<ProductsComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onProductClick,
  onReplace,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteProductsComponent = useDeleteComponentMutation(
    pageSlug || "",
    "products"
  );
  const updateProductsComponent = useUpdateComponentMutation(
    pageSlug || "",
    "products"
  );

  const handleUpdate = (
    updatedData: Partial<ProductsComponentData["data"]>
  ) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateProductsComponent.mutate({
      componentId,
      data: newData,
    });

    if (onUpdate) {
      onUpdate(componentId, {
        ...component,
        data: newData,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) return;
    deleteProductsComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const renderProductsStyle = () => {
    const style = component.data?.style || "product-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
      onProductClick: (productSlug: string) => {
        if (onProductClick && component.order !== undefined) {
          onProductClick(productSlug, component.order);
        }
      },
    };

    switch (style) {
      case "product-2":
        return <ProductsStyle2 {...commonProps} />;
      case "product-3":
        return <ProductsStyle3 {...commonProps} />;
      case "product-4":
        return <ProductsStyle4 {...commonProps} />;
      case "product-5":
        return <ProductsStyle5 {...commonProps} />;
      case "product-6":
        return <ProductsStyle6 {...commonProps} />;
      case "product-7":
        return <ProductsStyle7 {...commonProps} />;
      case "product-8":
        return <ProductsStyle8 {...commonProps} />;
      case "product-9":
        return <ProductsStyle9 {...commonProps} />;
      case "product-10":
        return <ProductsStyle10 {...commonProps} />;
      case "product-11":
        return <ProductsStyle11 {...commonProps} />;
      case "product-1":
      default:
        return <ProductsStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href="/admin/products/" target="_blank" rel="noopener">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
            >
              Manage Products
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onReplace?.(component.component_id)}
            className="h-8 w-fit justify-start bg-white px-3"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Replace
          </Button>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              size="sm"
              className="h-8 w-fit justify-start px-3"
              disabled={deleteProductsComponent.isPending}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleteProductsComponent.isPending ? "Deleting..." : "Delete"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Products Component</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this products component? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteProductsComponent.isPending}
                >
                  {deleteProductsComponent.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {renderProductsStyle()}
    </div>
  );
};
