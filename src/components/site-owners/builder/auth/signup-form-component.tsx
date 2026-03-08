"use client";

import React from "react";
import { AuthFormData } from "@/types/owner-site/components/auth-form-map";
import { useUpdateComponentMutation } from "@/hooks/owner-site/components/use-unified";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignupStyle1 } from "./styles/signup-style-1";
import { SignupStyle2 } from "./styles/signup-style-2";
import { SignupStyle3 } from "./styles/signup-style-3";

interface SignupFormProps {
  component: {
    component_id: string;
    data: AuthFormData;
  };
  isEditable?: boolean;
  pageSlug?: string;
  siteUser?: string;
  onUpdate?: (componentId: string, newData: any) => void;
  onReplace?: (componentId: string, category?: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onUpdate,
  onReplace,
}) => {
  const updateComponent = useUpdateComponentMutation(
    pageSlug || "",
    "signup_form"
  );

  const handleUpdate = (updatedData: Partial<AuthFormData>) => {
    if (!pageSlug) return;
    const componentId = component.component_id;

    const newData = {
      ...component.data,
      ...updatedData,
    };

    updateComponent.mutate({
      componentId,
      data: newData,
    });

    if (onUpdate) {
      onUpdate(componentId, newData);
    }
  };

  const renderStyle = () => {
    const style = component.data?.style || "style-1";
    const commonProps = {
      data: component.data,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (style) {
      case "style-3":
        return <SignupStyle3 {...commonProps} />;
      case "style-2":
        return <SignupStyle2 {...commonProps} />;
      case "style-1":
      default:
        return <SignupStyle1 {...commonProps} />;
    }
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="absolute -right-5 z-30 flex translate-x-full flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onReplace?.(component.component_id, "signup-sections")
            }
            className="h-8 w-fit justify-start bg-white px-3"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Replace
          </Button>
        </div>
      )}

      {renderStyle()}
    </div>
  );
};
