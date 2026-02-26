"use client";
import React, { useState } from "react";
import { ProductDetailsData } from "@/types/owner-site/components/product-details";
import { ProductDetail as Style1 } from "./details-style/product-details-style-1";
import { ProductDetail as Style2 } from "./details-style/product-details-style-2";
import { ProductDetail3 as Style3 } from "./details-style/product-details-style-3";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
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
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useProducts } from "@/hooks/owner-site/admin/use-product";

interface ProductDetailsComponentProps {
  component: {
    id: string | number;
    component_id: string;
    data: ProductDetailsData;
  };
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  productSlug?: string;
  onReplace?: (componentId: string) => void;
}

export const ProductDetailsComponent: React.FC<
  ProductDetailsComponentProps
> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  productSlug,
  onReplace,
}) => {
  const params = useParams();

  // Fetch a sample product if we are in the builder/template editor
  const { data: productsData } = useProducts({ page_size: 1 });
  const sampleSlug = productsData?.results?.[0]?.slug || "sample-product";

  // Priority:
  // 1. Explicit productSlug prop (passed by ProductDetail component in Preview/Publish)
  // 2. Explicit slug from URL params (matches [slug] in product routes)
  // 3. Sample slug (used in builder template editor or fallback)
  const slug = React.useMemo(() => {
    if (productSlug) return productSlug;

    const paramsSlug = params?.slug as string;
    if (paramsSlug) return paramsSlug;

    return sampleSlug;
  }, [productSlug, params, sampleSlug]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useDeleteComponentMutation(
    pageSlug,
    "product_details"
  );
  const updateMutation = useUpdateComponentMutation(
    pageSlug,
    "product_details"
  );

  const handleUpdate = (updatedData: Partial<ProductDetailsData>) => {
    updateMutation.mutate({
      componentId: component.component_id,
      data: updatedData,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(component.component_id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const style = component.data?.style || "style-1";

  const renderContent = () => {
    switch (style) {
      case "style-3":
        return <Style3 slug={slug} siteUser={siteUser} />;
      case "style-2":
        return <Style2 slug={slug} siteUser={siteUser} />;
      case "style-1":
      default:
        return <Style1 slug={slug} siteUser={siteUser} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <>
          <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReplace?.(component.component_id)}
              className="h-8 w-fit justify-start bg-white px-3"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Replace
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 w-fit justify-start px-3"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Product Details Section
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this section? Most ecommerce
                  sites need at least one product details section per product
                  page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      {renderContent()}
    </div>
  );
};
