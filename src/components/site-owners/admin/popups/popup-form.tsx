"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Save, AlertCircle } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  useCreatePopup,
  useUpdatePopup,
} from "@/hooks/owner-site/admin/use-popup";
import { PopUp } from "@/types/owner-site/admin/popup";

interface PopupFormProps {
  initialData?: PopUp | null;
  onSubmitSuccess: () => void;
}

type FormState = Omit<PopUp, "id" | "image"> & {
  image: File | null;
};

const PopupForm: React.FC<PopupFormProps> = ({
  initialData,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    image: null,
    disclaimer: "",
    enabled_fields: [],
    is_active: true,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const createPopupMutation = useCreatePopup();
  const updatePopupMutation = useUpdatePopup();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        disclaimer: initialData.disclaimer || "",
        enabled_fields: initialData.enabled_fields || [],
        is_active: initialData.is_active,
        image: null,
      });
      setImageFiles([]);
    } else {
      setFormData({
        title: "",
        image: null,
        disclaimer: "",
        enabled_fields: [],
        is_active: true,
      });
      setImageFiles([]);
    }
  }, [initialData]);

  const availableFields = [
    {
      id: "name",
      label: "Name",
      description: "Collect user's full name",
    },
    {
      id: "phone_number",
      label: "Phone Number",
      description: "Collect contact number",
    },
    {
      id: "email",
      label: "Email",
      description: "Collect email address",
    },
    {
      id: "address",
      label: "Address",
      description: "Collect physical address",
    },
  ];

  const handleInputChange = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (files: File[] | File | null) => {
    if (files) {
      const fileArray = Array.isArray(files) ? files : [files];
      setImageFiles(fileArray);
      setFormData(prev => ({ ...prev, image: fileArray[0] || null }));
    } else {
      setImageFiles([]);
      setFormData(prev => ({ ...prev, image: null }));
    }
  };

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      enabled_fields: checked
        ? [...prev.enabled_fields, fieldId]
        : prev.enabled_fields.filter(id => id !== fieldId),
    }));
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("disclaimer", formData.disclaimer);
    submitData.append(
      "enabled_fields",
      JSON.stringify(formData.enabled_fields)
    );
    submitData.append("is_active", String(formData.is_active));

    if (formData.image instanceof File) {
      submitData.append("image", formData.image);
    } else if (initialData && imageFiles.length === 0) {
      submitData.append("image", "");
    }

    if (initialData?.id) {
      updatePopupMutation.mutate(
        { id: initialData.id, data: submitData },
        { onSuccess: onSubmitSuccess }
      );
    } else {
      createPopupMutation.mutate(submitData, { onSuccess: onSubmitSuccess });
    }
  };

  const isSubmitting =
    createPopupMutation.isPending || updatePopupMutation.isPending;
  const submissionError =
    createPopupMutation.error || updatePopupMutation.error;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {submissionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submissionError.message}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Popup Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleInputChange("title", e.target.value)}
              placeholder="e.g., 'Join our Newsletter for Exclusive Updates!'"
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Popup Image
            </Label>
            <div className="mt-1">
              <ImageUploader
                value={
                  imageFiles.length > 0
                    ? imageFiles
                    : initialData?.image
                      ? [initialData.image as string]
                      : []
                }
                onChange={handleImageChange}
                disabled={isSubmitting}
                multiple={false}
                maxFileSize={10 * 1024 * 1024}
                maxFiles={1}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="disclaimer"
              className="text-sm font-medium text-gray-700"
            >
              Disclaimer Text
            </Label>
            <Textarea
              id="disclaimer"
              value={formData.disclaimer}
              onChange={e => handleInputChange("disclaimer", e.target.value)}
              placeholder="e.g., 'We respect your privacy and will never share your information with third parties.'"
              className="mt-1 min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Form Fields</h2>

        <div className="space-y-4">
          {availableFields.map(field => (
            <div
              key={field.id}
              className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
            >
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-900">
                  {field.label}
                </Label>
                <p className="mt-1 text-sm text-gray-500">
                  {field.description}
                </p>
              </div>
              <Switch
                checked={formData.enabled_fields.includes(field.id)}
                onCheckedChange={checked =>
                  handleFieldToggle(field.id, checked)
                }
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        {formData.enabled_fields.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-gray-500">Selected:</span>
            {formData.enabled_fields.map(fieldId => {
              const field = availableFields.find(f => f.id === fieldId);
              return (
                <Badge key={fieldId} variant="secondary" className="text-xs">
                  {field?.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Status</h2>

        <div className="flex items-center justify-between py-3">
          <div>
            <Label className="text-sm font-medium text-gray-900">
              Popup Active
            </Label>
            <p className="mt-1 text-sm text-gray-500">
              Toggle to activate or deactivate the popup
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={formData.is_active ? "default" : "secondary"}>
              {formData.is_active ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={formData.is_active}
              onCheckedChange={checked =>
                handleInputChange("is_active", checked)
              }
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim()}
            size="lg"
            className="min-w-[140px] bg-gray-500 hover:bg-gray-600"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialData ? "Save Changes" : "Create Popup"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
