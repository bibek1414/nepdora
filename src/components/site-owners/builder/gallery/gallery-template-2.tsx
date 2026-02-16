import React, { useState } from "react";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, ZoomIn } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface GalleryTemplateProps {
  galleryData: GalleryData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryData>) => void;
}

export const GalleryTemplate2: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, setData, handleTextUpdate, handleArrayItemUpdate } =
    useBuilderLogic(galleryData, onUpdate);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const componentId = React.useId();

  const handleImageUpdateLocal = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const imgId = data.images[index].id;
    handleArrayItemUpdate(
      "images",
      imgId
    )({
      image: imageUrl,
      image_alt_description: altText,
    });
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "gallery-images",
        resourceType: "image",
      });

      if (index !== undefined) {
        handleImageUpdateLocal(index, imageUrl, `Gallery image: ${file.name}`);
      } else {
        handleAddImage(imageUrl);
      }

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleAddImage = (imageUrl?: string) => {
    const newImage: GalleryImage = {
      id: Date.now(),
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      image_alt_description: "New gallery image",
      title: "New Image",
      description: "Add description here",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = data.images.filter((_, idx) => idx !== index);
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  const activeImages = data.images.filter(img => img.is_active);

  return (
    <div className="w-full space-y-8 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            className="mb-4 text-4xl font-bold"
          />
          {data.subtitle && (
            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              className="text-lg text-gray-600"
            />
          )}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {activeImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-lg bg-gray-100 transition-all hover:shadow-xl"
            >
              <div className="relative">
                <EditableImage
                  src={getImageUrl(image.image)}
                  alt={image.image_alt_description}
                  onImageChange={(imageUrl, altText) =>
                    handleImageUpdateLocal(index, imageUrl, altText)
                  }
                  isEditable={isEditable}
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                  cloudinaryOptions={{
                    folder: "gallery-images",
                    resourceType: "image",
                  }}
                  disableImageChange={true}
                  showAltEditor={isEditable}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-full items-center justify-center">
                    {!isEditable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={() => setSelectedImage(image)}
                      >
                        <ZoomIn className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Edit Controls */}
                {isEditable && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <label
                      htmlFor={`gallery-upload-${componentId}-${index}`}
                      className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                    >
                      Change
                    </label>
                    <input
                      id={`gallery-upload-${componentId}-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileChange(e, index)}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(index)}
                      className="h-6 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Image Info */}
              {image.title && (
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900">{image.title}</h3>
                  {image.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {image.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Button */}
        {isEditable && (
          <div className="mt-8 text-center">
            <label
              htmlFor={`gallery-add-${componentId}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-2 hover:bg-gray-100"
            >
              <Plus className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Add Image</span>
              <input
                id={`gallery-add-${componentId}`}
                type="file"
                accept="image/*"
                onChange={e => handleImageFileChange(e)}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl">
            <img
              src={getImageUrl(selectedImage.image)}
              alt={selectedImage.image_alt_description}
              className="h-auto w-full rounded-lg"
            />
            {selectedImage.title && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="mt-2 text-gray-600">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
            <DialogClose className="absolute top-2 right-2" />
          </DialogContent>
        </Dialog>
      )}

      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading image...</p>
          </div>
        </div>
      )}
    </div>
  );
};
