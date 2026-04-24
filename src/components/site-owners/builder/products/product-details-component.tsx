"use client";
import React from "react";
import { ProductDetailsData } from "@/types/owner-site/components/product-details";
import { ProductDetail as Style1 } from "./details-style/product-details-style-1";
import { ProductDetail as Style2 } from "./details-style/product-details-style-2";
import { ProductDetailStyle3 as Style3 } from "./details-style/product-details-style-3";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
  onReplace?: (componentId: string, category?: string) => void;
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

  const style = component.data?.style || "style-1";

  const renderContent = () => {
    switch (style) {
      case "style-2":
        return <Style2 slug={slug} siteUser={siteUser} />;
      case "style-3":
        return <Style3 slug={slug} siteUser={siteUser} />;
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
              onClick={() =>
                onReplace?.(component.component_id, "product-details-sections")
              }
              className="h-8 w-fit justify-start bg-white px-3"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Replace
            </Button>
          </div>
        </>
      )}
      {renderContent()}
    </div>
  );
};
