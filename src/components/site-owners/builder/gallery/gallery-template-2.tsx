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

  const [isAddingImage, setIsAddingImage] = useState(false);
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsAddingImage(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "gallery-images",
        resourceType: "image",
      });

      handleAddImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsAddingImage(false);
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
    <div className="w-full space-y-8 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-left">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
          />
          {data.subtitle && (
            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              className="text-muted-foreground max-w-3xl text-lg leading-relaxed"
            />
          )}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3 lg:columns-4">
          {activeImages.map((image, index) => (
            <div
              key={image.id}
              className="bg-muted relative mb-6 break-inside-avoid overflow-hidden rounded-xl transition-all hover:shadow-lg"
            >
              <div
                className="group relative cursor-pointer"
                onClick={() => !isEditable && setSelectedImage(image)}
              >
                <EditableImage
                  src={getImageUrl(image.image)}
                  alt={image.image_alt_description}
                  onImageChange={(imageUrl, altText) =>
                    handleImageUpdateLocal(index, imageUrl, altText)
                  }
                  isEditable={isEditable}
                  cloudinaryOptions={{
                    folder: "gallery-images",
                    resourceType: "image",
                  }}
                  disableImageChange={true}
                  showAltEditor={isEditable}
                  inputId={`gallery-upload-${componentId}-${index}`}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {!isEditable && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                )}

                {isEditable && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <label
                      htmlFor={`gallery-upload-${componentId}-${index}`}
                      className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                    >
                      Change
                    </label>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="h-6 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Image Info */}
              {(image.title || image.description) && (
                <div className="bg-card p-4">
                  {image.title && (
                    <h3 className="text-foreground font-semibold">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-3 transition-colors hover:bg-gray-100"
            >
              {isAddingImage ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Add New Image
                  </span>
                  <input
                    id={`gallery-add-${componentId}`}
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageFileChange(e)}
                    className="hidden"
                  />
                </>
              )}
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
          <DialogContent className="max-w-5xl overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-fit">
            <div className="group relative">
              <img
                src={getImageUrl(selectedImage.image)}
                alt={selectedImage.image_alt_description}
                className="mx-auto max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
              <DialogClose className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>

            {(selectedImage.title || selectedImage.description) && (
              <div className="bg-background/90 mx-auto mt-4 max-w-2xl rounded-xl border p-6 shadow-lg backdrop-blur-md">
                {selectedImage.title && (
                  <h3 className="text-foreground mb-2 text-xl font-bold">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
