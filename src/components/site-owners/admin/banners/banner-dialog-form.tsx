"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Image, X } from "lucide-react";
import {
  useCreateBannerWithImages,
  useUpdateBannerWithImages,
} from "@/hooks/owner-site/use-banner";
import { Banner, BannerImage } from "@/types/owner-site/banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ImageUploader } from "@/components/ui/image-uploader";

interface BannerFormData {
  banner_type: "Slider" | "Sidebar" | "Banner";
  is_active: boolean;
  images: BannerImage[];
}

interface BannerDialogFormProps {
  banner?: Banner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function BannerDialogForm({
  banner,
  open,
  onOpenChange,
  onSuccess,
}: BannerDialogFormProps) {
  const [formData, setFormData] = useState<BannerFormData>({
    banner_type: "Sidebar",
    is_active: true,
    images: [],
  });

  const createBannerMutation = useCreateBannerWithImages();
  const updateBannerMutation = useUpdateBannerWithImages();

  const isEditing = Boolean(banner);
  const isLoading =
    createBannerMutation.isPending || updateBannerMutation.isPending;

  useEffect(() => {
    if (banner) {
      setFormData({
        banner_type: banner.banner_type,
        is_active: banner.is_active,
        images: banner.images.map(img => ({
          id: img.id,
          image: typeof img.image === "string" ? img.image : "",
          image_alt_description: img.image_alt_description,
          link: img.link,
          is_active: img.is_active,
        })),
      });
    } else {
      // Reset form when not editing
      setFormData({
        banner_type: "Sidebar",
        is_active: true,
        images: [],
      });
    }
  }, [banner, open]);

  const addImage = () => {
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        {
          image: "",
          image_alt_description: "",
          link: "",
          is_active: true,
        },
      ],
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateImage = (index: number, field: keyof BannerImage, value: any) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const handleImageFileSelect = (index: number, file: File | File[] | null) => {
    // Handle the case where ImageUploader might return File[] even with multiple={false}
    let selectedFile: File | null = null;

    if (file) {
      selectedFile = Array.isArray(file) ? file[0] : file;
    }

    updateImage(index, "image", selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        banner_type: formData.banner_type,
        is_active: formData.is_active,
        images: formData.images,
      };

      if (isEditing && banner) {
        await updateBannerMutation.mutateAsync({
          id: banner.id,
          data: submitData,
        });
      } else {
        await createBannerMutation.mutateAsync(submitData);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save banner:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your banner details and images below."
              : "Create a new banner by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Banner Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="banner-type" className="text-sm font-medium">
                  Banner Type
                </Label>
                <Select
                  value={formData.banner_type}
                  onValueChange={(value: "Slider" | "Sidebar" | "Banner") =>
                    setFormData({ ...formData, banner_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slider">Slider</SelectItem>
                    <SelectItem value="Sidebar">Sidebar</SelectItem>
                    <SelectItem value="Banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={checked =>
                    setFormData({ ...formData, is_active: !!checked })
                  }
                />
                <Label htmlFor="is-active" className="text-sm font-medium">
                  Active
                </Label>
              </div>
            </div>
          </div>

          {/* Banner Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Banner Images
              </h3>
              <Button type="button" onClick={addImage} size="sm">
                <Plus size={16} className="mr-2" />
                Add Image
              </Button>
            </div>

            {formData.images.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Image className="mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-center text-gray-500">
                    No images added yet
                  </p>
                  <Button type="button" variant="ghost" onClick={addImage}>
                    Click &apos;Add Image&apos; to get started
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          Image {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Upload Image
                          </Label>
                          <ImageUploader
                            value={image.image as File | string | null}
                            onChange={file =>
                              handleImageFileSelect(index, file)
                            }
                            multiple={false}
                            maxFileSize={10 * 1024 * 1024} // 10MB
                          />
                        </div>

                        {/* Image Details */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Alt Description
                            </Label>
                            <Textarea
                              value={image.image_alt_description}
                              onChange={e =>
                                updateImage(
                                  index,
                                  "image_alt_description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe the image for accessibility"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Link URL
                            </Label>
                            <Input
                              type="url"
                              value={image.link}
                              onChange={e =>
                                updateImage(index, "link", e.target.value)
                              }
                              placeholder="https://example.com"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`image-active-${index}`}
                              checked={image.is_active}
                              onCheckedChange={checked =>
                                updateImage(index, "is_active", !!checked)
                              }
                            />
                            <Label
                              htmlFor={`image-active-${index}`}
                              className="text-sm font-medium"
                            >
                              Image Active
                            </Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEditing
                  ? "Update Banner"
                  : "Create Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
