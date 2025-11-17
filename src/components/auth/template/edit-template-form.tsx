"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { useUpdateTemplate } from "@/hooks/super-admin/components/use-templates";
import { toast } from "sonner";
import { Template } from "@/types/super-admin/components/template";

interface EditTemplateFormProps {
  template: Template;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditTemplateForm({
  template,
  onSuccess,
  onCancel,
}: EditTemplateFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    template.template_image || ""
  );

  const updateTemplateMutation = useUpdateTemplate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(template.template_image || "");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      await updateTemplateMutation.mutateAsync({
        ownerId: template.owner_id,
        payload: {
          template_image: selectedImage,
        },
      });

      toast.success("Template image updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update template:", error);

      // More specific error message
      if (error instanceof Error) {
        if (error.message.includes("Unexpected response format")) {
          toast.error(
            "Server returned an unexpected response. The image might be too large or in an invalid format."
          );
        } else {
          toast.error(error.message || "Failed to update template image");
        }
      } else {
        toast.error("Failed to update template image");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="template-image">Template Image</Label>
          <p className="mb-3 text-sm text-gray-500">
            Upload a new image for this template
          </p>

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative mb-4 inline-block">
              <div className="group relative">
                <img
                  src={previewUrl}
                  alt={`${template.name} preview`}
                  className="h-32 w-32 rounded-lg border-2 border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* File Input */}
          <div className="flex items-center gap-4">
            <Label
              htmlFor="template-image"
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400"
            >
              <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {selectedImage ? "Change Image" : "Upload Image"}
              </span>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, JPEG up to 5MB
              </p>
            </Label>
            <Input
              id="template-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {selectedImage && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {selectedImage.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={updateTemplateMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateTemplateMutation.isPending || !selectedImage}
        >
          {updateTemplateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Template Image"
          )}
        </Button>
      </div>
    </form>
  );
}
