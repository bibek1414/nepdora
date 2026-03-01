"use client";
import React, { useState } from "react";
import { CheckoutData } from "@/types/owner-site/components/checkout";
import CheckoutStyle1 from "./details-style/checkout-style-1";
import CheckoutStyle2 from "./details-style/checkout-style-2";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUpdateComponentMutation } from "@/hooks/owner-site/components/use-unified";

interface CheckoutComponentProps {
  component: {
    id: string | number;
    component_id: string;
    data: CheckoutData;
  };
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onReplace?: (componentId: string, category?: string) => void;
}

export const CheckoutComponent: React.FC<CheckoutComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onReplace,
}) => {
  const params = useParams();
  const updateMutation = useUpdateComponentMutation(pageSlug, "checkout");

  const handleUpdate = (updatedData: Partial<CheckoutData>) => {
    updateMutation.mutate({
      componentId: component.component_id,
      data: updatedData,
    });
  };

  const style = component.data?.style || "style-1";

  const renderContent = () => {
    switch (style) {
      case "style-2":
        return <CheckoutStyle2 siteUser={siteUser} />;
      case "style-1":
      default:
        return <CheckoutStyle1 siteUser={siteUser} />;
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
              onReplace?.(component.component_id, "checkout-sections")
            }
            className="h-8 w-fit justify-start bg-white px-3"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Replace
          </Button>
          {/* Note: Delete button is omitted because checkout pages should not be deleted. */}
        </div>
      )}
      {renderContent()}
    </div>
  );
};
