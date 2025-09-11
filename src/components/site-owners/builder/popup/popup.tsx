"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useActivePopup, usePopupSubmit } from "@/hooks/owner-site/use-popup";
import { PopupFormData } from "@/types/owner-site/popup";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PopupProps {
  open: boolean;
  onClose: () => void;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
}

const FORM_FIELD_CONFIG: { [key: string]: FormField } = {
  name: {
    id: "name",
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
  },
  email: {
    id: "email",
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter your email address",
  },
  phone_number: {
    id: "phone_number",
    name: "phone_number",
    label: "Phone Number",
    type: "tel",
    required: true,
    placeholder: "Enter your phone number",
  },
  address: {
    id: "address",
    name: "address",
    label: "Address",
    type: "text",
    required: false,
    placeholder: "Enter your address",
  },
};

const Popup: React.FC<PopupProps> = ({ open, onClose }) => {
  const { data: popupData, isLoading, isError } = useActivePopup();
  const submitMutation = usePopupSubmit();

  const [formData, setFormData] = useState<PopupFormData>({});

  useEffect(() => {
    if (popupData && popupData.enabled_fields) {
      const initialFormData: PopupFormData = {};
      popupData.enabled_fields.forEach(fieldKey => {
        initialFormData[fieldKey] = "";
      });
      setFormData(initialFormData);
    }
  }, [popupData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupData?.id) return;

    try {
      await submitMutation.mutateAsync({
        popupId: popupData.id,
        formData,
      });

      toast.success("Form submitted successfully!");

      onClose();
    } catch (error) {
      console.error("Form submission failed:", error);

      toast.error("Form submission failed. Please try again.");
    }
  };

  // Don't render if loading, error, or no popup data
  if (isLoading || isError || !popupData || !popupData.is_active) {
    return null;
  }

  // Only show fields that are enabled in the popup configuration
  const formFieldsToRender = popupData.enabled_fields
    .map(fieldKey => FORM_FIELD_CONFIG[fieldKey])
    .filter(Boolean); // Remove any undefined fields

  // Don't render popup if no valid fields to show
  if (formFieldsToRender.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-2 grid max-h-[95vh] w-[95vw] max-w-4xl grid-cols-1 gap-0 overflow-hidden p-0 sm:mx-auto sm:w-full md:max-h-[90vh] md:w-[90vw] md:grid-cols-2">
        {/* Image Section - Only show if image exists */}
        {popupData.image && (
          <div className="relative order-1 h-48 w-full md:order-none md:h-full">
            <Image
              src={typeof popupData.image === "string" ? popupData.image : ""}
              alt={popupData.title}
              fill
              priority
              sizes="(max-width: 768px) 95vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Form Section */}
        <div
          className={`order-2 flex flex-col justify-center overflow-y-auto p-4 md:order-none md:p-6 lg:p-8 ${!popupData.image ? "md:col-span-2" : ""}`}
        >
          <DialogHeader className="mb-3 text-left md:mb-4">
            <DialogTitle className="text-xl leading-tight font-bold md:text-2xl lg:text-3xl">
              {popupData.title}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {formFieldsToRender.map(field => (
              <div key={field.id} className="space-y-1 md:space-y-2">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={e => handleInputChange(field.name, e.target.value)}
                  className="text-sm md:text-base"
                />
              </div>
            ))}

            {/* Disclaimer */}
            {popupData.disclaimer && (
              <div className="pt-1 md:pt-2">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {popupData.disclaimer}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="mt-3 h-10 w-full text-sm font-medium text-white md:mt-4 md:h-11 md:text-base"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Now"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
