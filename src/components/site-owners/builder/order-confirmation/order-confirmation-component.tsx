"use client";
import React, { useState } from "react";
import { OrderConfirmationData } from "@/types/owner-site/components/order-confirmation";
import OrderConfirmationStyle1 from "./details-style/order-confirmation-style-1";
import OrderConfirmationStyle2 from "./details-style/order-confirmation-style-2";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUpdateComponentMutation } from "@/hooks/owner-site/components/use-unified";

interface OrderConfirmationComponentProps {
  component: {
    id: string | number;
    component_id: string;
    data: OrderConfirmationData;
  };
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onReplace?: (componentId: string, category?: string) => void;
}

export const OrderConfirmationComponent: React.FC<
  OrderConfirmationComponentProps
> = ({ component, isEditable = false, pageSlug, siteUser, onReplace }) => {
  const params = useParams();
  const updateMutation = useUpdateComponentMutation(
    pageSlug,
    "order_confirmation"
  );

  // orderId may come from dynamic routing like /[...pageSlug]/page.tsx handling slug[1] as orderId. Example: /order-confirmation/1234
  // In builder edit mode, we can use a mock/sample if needed, but usually we just test visual rendering.
  const orderId =
    Array.isArray(params?.pageSlug) && params.pageSlug.length > 1
      ? params.pageSlug[1]
      : undefined;

  const handleUpdate = (updatedData: Partial<OrderConfirmationData>) => {
    updateMutation.mutate({
      componentId: component.component_id,
      data: updatedData,
    });
  };

  const style = component.data?.style || "style-1";

  const renderContent = () => {
    switch (style) {
      case "style-2":
        return (
          <OrderConfirmationStyle2 siteUser={siteUser} orderId={orderId} />
        );
      case "style-1":
      default:
        return (
          <OrderConfirmationStyle1 siteUser={siteUser} orderId={orderId} />
        );
    }
  };

  return (
    <div className="group relative w-full">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onReplace?.(component.component_id, "order-confirmation-sections")
            }
            className="h-8 w-fit justify-start bg-white px-3"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Replace
          </Button>
        </div>
      )}
      {renderContent()}
    </div>
  );
};
